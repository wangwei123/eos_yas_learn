import { bidnameContract, newBidnameContract } from "@/common/data"

export const apiGetTokenAccountRows = (eosApi) => {
  let params = {
    json: true,
    code: "aidosonecoin",
    table: "accounts",
    lower_bound: "",
    upper_bound: "",
    limit: 100
  }

  return eosApi.getTableRows(params)
}

export const apiGetProfitsRows = (eosApi, account) => {
  let params = {
    json: true,
    code: "huskeyrecord",
    scope: "huskeyrecord",
    table: "profits",
    lower_bound: account,
    upper_bound: account,
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetDelBandwidthRows = (eosApi, account, limit) => {
  let params = {
    json: true,
    code: "eosio",
    scope: account,
    table: "delband",
    limit: limit,
    lower_bound: 0,
    uppper_bound: -1
  }

  return eosApi.getTableRows(params)
}

export const apiGetRexfundsRows = (eosApi, account) => {
  let params = {
    json: true,
    code: "eosio",
    scope: account,
    table: "refunds",
    limit: 10,
    lower_bound: 0,
    uppper_bound: -1
  }

  return eosApi.getTableRows(params)
}

export const apiGetRexOrderRows = (eosApi, account, limit) => {
  let params = {
    json: true,
    code: "eosio",
    scope: "eosio",
    table: "rexbal",
    lower_bound: account,
    upper_bound: null,
    index_position: 1,
    key_type: "i64",
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetRexPoolRows = (eosApi) => {
  let params = {
    json: true,
    code: "eosio",
    scope: "eosio",
    table: "rexpool",
    table_key: "",
    lower_bound: "",
    upper_bound: "",
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetRexfundRows = (eosApi, account) => {
  let params = {
    json: true,
    code: "eosio",
    scope: "eosio",
    table: "rexfund",
    table_key: "",
    lower_bound: account,
    upper_bound: "",
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetNamebidsRows = (eosApi) => {
  let params = {
    json: true,
    code: "eosio",
    scope: "eosio",
    table: "namebids",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 50
  }

  return eosApi.getTableRows(params)
}

export const apiSearchBidRows = (newname, eosApi) => {
  let params = {
    json: true,
    code: "eosio",
    scope: "eosio",
    table: "namebids",
    table_key: null,
    upper_bound: newname,
    lower_bound: newname,
    key_type: "i64",
    index_position: 1,
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetBidSuccessRows = (eosApi) => {
  let params = {
    json: true,
    code: bidnameContract,
    scope: bidnameContract,
    table: "bidsuccess",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 50
  }

  return eosApi.getTableRows(params)
}

export const apiGetBidOrderRows = (scope,eosApi) => {
  let params = {
    json: true,
    code: bidnameContract,
    scope: scope,
    table: "bidorders",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 50
  }

  return eosApi.getTableRows(params)
}

export const apiGetNewBidnameRows = (scope, eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: scope,
    table: "namebids",
    table_key: null,
    upper_bound: null,
    lower_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 100
  }

  return eosApi.getTableRows(params)
}

export const apiSearchNewBidnameRows = (newname, scope, eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: scope,
    table: "namebids",
    table_key: null,
    upper_bound: newname,
    lower_bound: newname,
    key_type: "i64",
    index_position: 1,
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetNewBidRewardsRows = (newname, eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: newname,
    table: "bidrewards",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 200
  }

  return eosApi.getTableRows(params)
}

export const apiGetNewBidSuccessRows = (eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: newBidnameContract,
    table: "bidsuccess",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 50
  }

  return eosApi.getTableRows(params)
}

export const apiGetNewBidOrderRows = (scope, eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: scope,
    table: "bidorders",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 50
  }

  return eosApi.getTableRows(params)
}

export const apiGetNewBidNameInfoRows = (eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: newBidnameContract,
    table: "nameinfos",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    limit: 50
  }

  return eosApi.getTableRows(params)
}

/*export const apiGetYASSalesRows = (eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: newBidnameContract,
    table: "bidname11",
    table_key: null,
    upper_bound: null,
    lower_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 100
  }

  return eosApi.getTableRows(params)
}

export const apiGetIBTSalesRows = (eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: newBidnameContract,
    table: "bidname22",
    table_key: null,
    upper_bound: null,
    lower_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 100
  }

  return eosApi.getTableRows(params)
}

export const apiSearchIBTSalesRows = (newname, eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: newBidnameContract,
    table: "bidname22",
    table_key: null,
    upper_bound: newname,
    lower_bound: newname,
    key_type: "i64",
    index_position: 1,
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiSearchYASSalesRows = (newname, eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: newBidnameContract,
    table: "bidname11",
    table_key: null,
    upper_bound: newname,
    lower_bound: newname,
    key_type: "i64",
    index_position: 1,
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetNamedexRewardsRows = (newname, eosApi) => {
  let params = {
    json: true,
    code: newBidnameContract,
    scope: newname,
    table: "bidrewards",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 200
  }

  return eosApi.getTableRows(params)
}*/

export const apiGetBidsTopRows = (eosApi) => {
  let params = {
    json: true,
    code: bidnameContract,
    scope: bidnameContract,
    table: "namebids1",
    table_key: null,
    upper_bound: null,
    lower_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 100
  }

  return eosApi.getTableRows(params)
}

export const apiSearchBidTopRows = (newname, eosApi) => {
  let params = {
    json: true,
    code: bidnameContract,
    scope: bidnameContract,
    table: "namebids1",
    table_key: null,
    upper_bound: newname,
    lower_bound: newname,
    key_type: "i64",
    index_position: 1,
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetBidsBetRows = (eosApi) => {
  let params = {
    json: true,
    code: bidnameContract,
    scope: bidnameContract,
    table: "namebids2",
    table_key: null,
    upper_bound: null,
    lower_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 500
  }

  return eosApi.getTableRows(params)
}

export const apiSearchBidBetRows = (newname, eosApi) => {
  let params = {
    json: true,
    code: bidnameContract,
    scope: bidnameContract,
    table: "namebids2",
    table_key: null,
    upper_bound: newname,
    lower_bound: newname,
    key_type: "i64",
    index_position: 1,
    limit: 1
  }

  return eosApi.getTableRows(params)
}

export const apiGetBidrewardsRows = (newname, eosApi) => {
  let params = {
    json: true,
    code: bidnameContract,
    scope: newname,
    table: "bidrewards",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 2,
    limit: 200
  }

  return eosApi.getTableRows(params)
}

export const apiGetSalePriceRows = (eosApi) => {
  let params = {
    json: true,
    code: bidnameContract,
    scope: bidnameContract,
    table: "saleprices",
    table_key: null,
    lower_bound: null,
    upper_bound: null,
    key_type: "i64",
    index_position: 1,
    limit: 100
  }

  return eosApi.getTableRows(params)
}

export const apiDelegatebw = (api, authorization, data) => {
  let action = {
    account: "eosio",
    name: "delegatebw",
    authorization: [authorization],
    data: {
      from: data.from,
      receiver: data.receiver,
      stake_cpu_quantity: data.stake_cpu_quantity,
      stake_net_quantity: data.stake_net_quantity,
      transfer: false
    }
  }
  
  return api.transact({ 
    actions: [action] 
  },{
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiUnDelegatebw = (api, authorization, data) => {
  let action = {
    account: "eosio",
    name: "undelegatebw",
    authorization: [authorization],
    data: {
      from: data.from,
      receiver: data.receiver,
      unstake_net_quantity: data.unstake_net_quantity,
      unstake_cpu_quantity: data.unstake_cpu_quantity,
    }
  }

  return api.transact({
    actions: [action]
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiBuyRex = (api, authorization, buyAccount, buyRexNum, voteData) => {
  let actions = []
  if (voteData) {
    actions.push({
      account: "eosio",
      name: "voteproducer",
      authorization: [authorization],
      data: {
        voter: buyAccount,
        proxy: voteData.proxy,
        producers: voteData.producers
      }
    })
  }
  actions.push({
    account: "eosio",
    name: "deposit",
    authorization: [authorization],
    data: {
      owner: buyAccount,
      amount: Number(buyRexNum).toFixed(4) + " YAS"
    }
  })
  actions.push({
    account: "eosio",
    name: "buyrex",
    authorization: [authorization],
    data: {
      from: buyAccount,
      amount: Number(buyRexNum).toFixed(4) + " YAS"
    }
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiSellRex = (api, authorization, sellAccount, sellRex) => {
  let actions = []
  actions.push({
    account: "eosio",
    name: "sellrex",
    authorization: [authorization],
    data: {
      from: sellAccount,
      rex: Number(sellRex).toFixed(4) + " REX"
    }
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiDelegateToRex = (api, authorization, owner, reciveAccount, fromCPU, fromNET, voteData) => {
  let actions = []
  if (voteData) {
    actions.push({
      account: "eosio",
      name: "voteproducer",
      authorization: [authorization],
      data: {
        voter: reciveAccount,
        proxy: voteData.proxy,
        producers: voteData.producers
      }
    })
  }

  actions.push({
    account: "eosio",
    name: "unstaketorex",
    authorization: [authorization],
    data: {
      owner: owner,
      receiver: reciveAccount, 
      from_net: Number(fromNET).toFixed(4) + " YAS", 
      from_cpu: Number(fromCPU).toFixed(4) + " YAS", 
    }
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiRexWithdraw = (api, authorization, account, amount) => {
  let actions = []
  actions.push({
    account: "eosio",
    name: "withdraw",
    authorization: [authorization],
    data: {
      owner: account,
      amount: Number(amount).toFixed(4) + " YAS"
    }
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiBuyRam = (api, authorization, data) => {
  let actions = []
  actions.push({
    account: "eosio",
    name: "buyram",
    authorization: [authorization],
    data: data
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiSellRam = (api, authorization, data) => {
  let actions = []
  actions.push({
    account: "eosio",
    name: "sellram",
    authorization: [authorization],
    data: data
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
} 

export const apiRentCpu = (api, authorization, buyAccount, reciveAccount, buyAmount) => {
  let actions = []
  let amount = Number(buyAmount).toFixed(4) + " YAS"
  actions.push({
    account: "eosio",
    name: "deposit",
    authorization: [authorization],
    data: {
      owner: buyAccount,
      amount: amount
    }
  })
  actions.push({
    account: "eosio",
    name: "rentcpu",
    authorization: [authorization],
    data: { 
      from: buyAccount, 
      receiver: reciveAccount, 
      loan_payment: amount,
      loan_fund: "0.0000 YAS"
    }
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiRentNet = (api, authorization, buyAccount, reciveAccount, buyAmount) => {
  let actions = []
  let amount = Number(buyAmount).toFixed(4) + " YAS"
  actions.push({
    account: "eosio",
    name: "deposit",
    authorization: [authorization],
    data: {
      owner: buyAccount,
      amount: amount
    }
  })
  actions.push({
    account: "eosio",
    name: "rentnet",
    authorization: [authorization],
    data: {
      from: buyAccount,
      receiver: reciveAccount,
      loan_payment: amount,
      loan_fund: "0.0000 YAS"
    }
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiRefund = (api, authorization, account) => {
  let actions = []
  actions.push({
    account: "eosio",
    name: "refund",
    authorization: [authorization],
    data: {
      owner: account
    }
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}

export const apiBidname = (api, authorization, bidder, newname, bid) => {
  let actions = []
  actions.push({
    account: "eosio",
    name: "bidname",
    authorization: [authorization],
    data: { 
      bidder: bidder, 
      newname: newname, 
      bid: Number(bid).toFixed(4) + " YAS" 
    }
  })

  return api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30
  })
}
