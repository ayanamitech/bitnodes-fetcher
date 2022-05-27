const ping = require('tcp-ping');
const axios = require('axios');
const {loadConfig} = require('use-config-json');

const defaultConfig = {
  COUNTRY: 'JP'
};

const config = loadConfig(defaultConfig);

const resolveIP = (data) => {
  // eslint-disable-next-line
  if (data.match(/^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)(?:\:(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/g)) {
    if (data.match(/:/g)) {
      const split = data.split(':');
      const ip = split[0];
      const port = parseInt(split[1]);
      return {
        ip,
        port
      };
    }
  }
};

const fetchLatestNodes = async () => {
  try {
    const results = [];
    const getLatestSnapshot = await axios.get('https://bitnodes.io/api/v1/snapshots/');
    const latest = getLatestSnapshot.data.results[0].timestamp;
    const relayerStatus = await axios.get('https://bitnodes.io/api/v1/snapshots/' + latest);
    for (let [key, value] of Object.entries(relayerStatus.data.nodes)) {
      if (value[7] == config.COUNTRY) {
        const parseIpAndPort = resolveIP(key);
        if (parseIpAndPort) {
          results.push(parseIpAndPort);
        }
      }
    }
    return results;
  } catch (e) {
    console.error(e);
    throw new Error('Error while fetching node list from bitnodes.io');
  }
};


const measureLatency = async (node) => {
  try {
    const { address, port, average } = await ping.pingAsync({address: node.ip, port: node.port, attempts: 3});
    if (average) {
      console.log(address + ':' + port, Math.floor(average) + 'ms');
      return {
        ip: address,
        port,
        average: Math.floor(average)
      };
    }
  } catch (e) {
    return;
  }
};

const run = async () => {
  const nodes = await fetchLatestNodes();
  let result = await Promise.all(nodes.map(n => measureLatency(n)));
  // remove failed results from array;
  result = result.filter(r => r);
  // sort servers by latency.
  result = result.sort((a, b) => {
    return parseFloat(a.average) - parseFloat(b.average);
  });
  // return sorted list of addresses by the average latency.
  result.map(({ ip, port }) => {
    console.log('addnode=' + ip + ':' + port);
  });
};
run();
