# bitnodes-fetcher

Fetch the list of Bitcoin Nodes from bitnodes.io by country to reduce traffic across border

## Install

Install Node.js on your computer, hosted script tested with Node.js 12.x and 14.x. LTS version of Node.js is recommended.

```bash
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

If completed, clone the repository using `git clone --depth 1` or download the archive file, locate to the cloned directory using `cd bitnodes-fetcher` and fetch node.js libraries.

```
npm i
```

## Configure & Run

`run.js` script will auto fetch nodes from [Bitnodes API V1](https://bitnodes.io/api), and filter nodes based on the country code defined on the script.

Default country code is set to `JP` so if you need nodes from different country make sure to change this value from .env file.

```js
COUNTRY="JP"
```

Run the following command to start

```bash
npm start
```

Script will log ip addresses of the nodes, and finally give the list of nodes with `addnode=` format sorted by the tested latency so you can copy-paste the results from console to `bitcoin.conf` file.

If you need alternative format for example `-addnode=` to add for command line, make sure to change the last line of the code to the format you want.

```js
console.log('addnode=' + ip + ':' + port);
```
