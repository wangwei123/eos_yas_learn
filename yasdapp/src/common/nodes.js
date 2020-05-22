import ScatterJS from "@scatterjs/core"
import ScatterEOS from "@scatterjs/eosjs2"
import { JsonRpc } from "eosjs"

const nodeConfigs = {
  math: {
    host: "yas.maiziqianbao.net",
    port: 443,
    protocol: "https",
    chainId: "ed8636abfe625d99fc9a759d49a016fd8dcae9193676a020aae2540c9fffe32f"
  },
  testnet: {
    host: "api-kylin.eosasia.one",
    port: 443,
    protocol: "https",
    chainId: "5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191"
  }
}

const config = nodeConfigs.math

let EosApi = require('eosjs-api')
let options = {
  httpEndpoint: config.protocol + "://" + config.host, // default, null for cold-storage
  verbose: false, // API logging
  fetchConfiguration: {}
}

export const eosApi = EosApi(options)

ScatterJS.plugins(new ScatterEOS())
export const network = ScatterJS.Network.fromJson({
  blockchain: 'eos',
  chainId: config.chainId,
  host: config.host,
  port: config.port,
  protocol: config.protocol
})

export const rpc = new JsonRpc(network.fullhost())