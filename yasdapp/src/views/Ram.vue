<template>
  <div ref="votePage" class="animated fadeIn">
    <md-toolbar class="animated zoomIn">
      <div class="card-container">
        <div class="card-item">
          <span><!--<md-icon>person</md-icon>-->
            <a :href="'http://yas.plus/search?q='+currentAccount" class="font-account" v-if="currentAccount!=='登录'">
              {{currentAccount}}
            </a>
          </span>
          <span style="color:#1E90FF;" v-if="currentAccount=='登录'" @click="connect"> 登录</span>
          <span style="color:red;" v-if="currentAccount!=='登录'" @click="logout"> 登出</span>
        </div>
        <div class="card-item">
          <span style="float:right;">
            <span class="font-title">余额: </span>
            <span class="font-deepblue">{{currentBalance}}</span>
            <span class="font-deepblue">{{selectedSymbol==''?'EOS':selectedSymbol}}</span>
          </span>
        </div>
      </div>
      <div class="card-container">
        <div class="card-item">
            <span class="font-title">CPU: </span>
            <span class="font-deepblue">{{currentCPU}}</span>
        </div>
        <div class="card-item">
            <span class="font-title">NET: </span>
            <span class="font-deepblue">{{currentNET}}</span>
        </div>
        <div class="card-item-right">
            <span class="font-title">RAM: </span>
            <span class="font-deepblue">{{currentRAM}}</span>
        </div>
      </div> 
      <div class="card-container">
        <div class="card-item">
          <span class="font-title">已抵押: </span>
          <span class="font-deepblue">{{currentStaked}}</span>
        </div>
        <div class="card-item">
          <span style ="float:right;">
            <span class="font-title">已投票节点: </span>
            <span class="font-deepblue">{{voteProducers.length}}个</span>
          </span>
        </div>
      </div>
    </md-toolbar>
    <div class="animated zoomIn">
      <div>
        <md-radio v-model="isBuyRam" :value="true">购买RAM</md-radio>
        <md-radio v-model="isBuyRam" :value="false">卖出RAM</md-radio>
      </div>
      <div style="width:100%;" v-if="isBuyRam">
        <md-field>
          <label class="font-title">购买者</label>
          <md-input class="font-input" v-model="buyRam.payer" disabled></md-input>
        </md-field>
        <md-field>
          <label class="font-title">接收者</label>
          <md-input class="font-input" v-model="buyRam.receiver"></md-input>
        </md-field>
        <md-field>
          <label class="font-title">数量</label>
          <md-input class="font-input" v-model="buyRam.quant"></md-input>
        </md-field>
        <md-field>
          <label class="font-title">单位</label>
          <md-select v-model="buyRam.unit" class="font-deepblue">
            <md-option class="font-deepblue" value="YAS">YAS</md-option>
            <md-option class="font-deepblue" value="bytes">bytes</md-option>
          </md-select>
        </md-field>
        <md-button class="md-raised md-primary" style="width:90%;" @click="buyRamHandle">购买RAM</md-button>
      </div>
      <!-- 卖出rex -->
      <div style="width:100%;" v-if="!isBuyRam">
        <md-field>
          <label class="font-title">出售者</label>
          <md-input class="font-input" v-model="sellRam.seller" disabled></md-input>
        </md-field>
        <md-field>
          <label class="font-title">RAM余额(bytes)</label>
          <md-input class="font-input" v-model="sellRam.cansell_quant" disabled></md-input>
        </md-field>
        <md-field>
          <label class="font-title">出售数量(bytes)</label>
          <md-input class="font-input" v-model="sellRam.bytes"></md-input>
        </md-field>
        <md-button class="md-raised md-primary" style="width:90%;" @click="sellRamHandle">出售RAM</md-button>
      </div>
      <md-dialog-alert 
      :md-active.sync="alertShow"
      :md-content="alertContent"
      md-confirm-text="关闭" />
    </div>
  </div>
</template>
<script>
import Try from '../utils/try'
import { async } from 'q'
import axios from 'axios'
import { 
  apiBuyRam,
  apiSellRam
} from '../api/eosapi'

import ScatterJS from "@scatterjs/core"
import ScatterEOS from "@scatterjs/eosjs2"
import { Api } from "eosjs"
import {eosApi, network, rpc} from "../common/nodes"

// import VConsole from "vconsole";
// var vConsole = new VConsole();
let api = ""

let retryNum = 0
var ContractAccounts = {
  "YAS": "eosio.token",
} 

const TIMESTAMP_EPOCH = 946684800
const calculateEosFromVotes = votes => {
  const date = Date.now() / 1000 - TIMESTAMP_EPOCH
  const weight = (date / (86400 * 7)) / 52 // 86400 = seconds per day 24*3600
  return parseInt(votes) / 2 ** weight / 10000
}

export default {
  data() {
    return {
      currentBalance: "",
      currentAccount: "",
      currentPermission: "",
      currentPublicKey: "",
      currentCPU: "0 ms",
      currentNET: "0 MB",
      currentRAM: "0 KB",
      currentStaked: "",
      voteProducers: [],
      selectedSymbol: "YAS",
      clientHeight:'',
      alertShow: false,
      alertContent: "",
      isBuyRam: true,
      accountInfo: "",
      buyRam: {
        payer: "",
        receiver: "",
        quant: "",
        unit: "YAS"
      },
      sellRam: {
        seller: "",
        quant: "",
      }
    }
  },
  mounted(){
    // 获取浏览器可视区域高度
    this.clientHeight =   `${document.documentElement.clientHeight}`          //document.body.clientWidth;
    //console.log(self.clientHeight);
    window.onresize = function temp() {
      this.clientHeight = `${document.documentElement.clientHeight}`
    }
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },
  async created() {
    await this.connect()
    await this.getAccountBalance(this.selectedSymbol)
    await this.getAccountResourceBalance()

    this.buyRam.payer = this.currentAccount
    this.buyRam.receiver = this.currentAccount
    this.sellRam.seller = this.currentAccount
    this.sellRam.cansell_quant = Number(this.accountInfo.ram_quota-this.accountInfo.ram_usage) 
  },
  methods: {
    changeFixed(clientHeight){                        //动态修改样式
      this.$refs.votePage.style.height = (clientHeight-86)+'px';
    },
    buyRamHandle: function() {
      let quant = Number(this.buyRam.quant)
      if (isNaN(quant)) {
        alert("无效的购买数量")
        return
      }

      let authorization = {
          actor: this.currentAccount,
          permission: this.currentPermission
      }

      var data = {payer: this.buyRam.payer, receiver: this.buyRam.receiver}
      if (this.buyRam.unit === "bytes") {
        data.bytes = quant
      } else {
        data.quant = quant.toFixed(4) + " YAS"
      }

      apiBuyRam(api, authorization, data)
      .then(res=>{
        this.refreshInfo()
        alert("内存购买成功！")
      })
      .catch(err=>{
        this.refreshInfo()
        alert("err="+JSON.stringify(err))
      })
    },
    sellRamHandle: function() {
      let bytes = Number(this.sellRam.bytes)
      if (isNaN(bytes)) {
        alert("无效的出售数量")
        return
      }

      let authorization = {
          actor: this.currentAccount,
          permission: this.currentPermission
      }

      var data = {account: this.currentAccount, bytes: bytes}
      apiSellRam(api, authorization, data)
      .then(res=>{
        this.refreshInfo()
        alert("内存出售成功！")
      })
      .catch(err=>{
        this.refreshInfo()
        alert("err="+JSON.stringify(err))
      })
    },
    refreshInfo: function() {
      this.getAccountBalance(this.selectedSymbol)
      this.getAccountResourceBalance()
    },
    getAccountBalance: async function(symbols) {
      let contractAccount = ContractAccounts[symbols]
      if (!contractAccount) {
        return
      }

      let result = await eosApi.getCurrencyBalance(contractAccount, this.currentAccount)
      if (result.length == 0) {
        this.currentBalance = "0"
        return
      }

      result = result[0].replace(symbols, "")
      this.currentBalance = result
    },
    getAccountResourceBalance: async function() {
        let accountInfo = await eosApi.getAccount(this.currentAccount)
        let currentCPU = Number(accountInfo.cpu_limit.available)/1000
        let currentNET = Number(accountInfo.net_limit.available)/(1024*1024)
        let currentRAM = Number(accountInfo.ram_quota-accountInfo.ram_usage)/1024
        
        let staked = 0
        if (!accountInfo.voter_info || !accountInfo.voter_info.staked) {
          staked = 0
        } else {
          staked = Number(accountInfo.voter_info.staked)/10000
        }

        let producers = []
        if (!accountInfo.voter_info || !producers) {
          producers = []
        } else {
          producers = accountInfo.voter_info.producers
        }

        this.accountInfo = accountInfo
        this.currentStaked = staked.toFixed(2) + " YAS"
        this.voteProducers = producers
        if (currentCPU > 1000) {
          currentCPU = currentCPU/1000 
          this.currentCPU = currentCPU.toFixed(2) + " s"
        } else {
          this.currentCPU = (Number(accountInfo.cpu_limit.available)/1000).toFixed(2) + " ms"
        }

        if (currentNET > 1024) {
          currentNET = currentNET/1024
          this.currentNET = currentNET.toFixed(2) + " GB"
        } else {
          this.currentNET = (Number(accountInfo.net_limit.available)/(1024*1024)).toFixed(2) + " MB"
        }

        if (currentRAM > 1024) {
          currentRAM = currentRAM/1024
          this.currentRAM = currentRAM.toFixed(2) + " MB"
        } else {
          this.currentRAM = (Number(accountInfo.ram_quota-accountInfo.ram_usage)/1024).toFixed(2) + " KB"
        }

        //alert(JSON.stringify(accountInfo))
        
        console.log("account: ", accountInfo)
    },
    connect: async function() {
      if (retryNum > 3) {
          return
      }

      let connected = await ScatterJS.connect('yastools.io', {network})
      if(!connected) {
          this.currentAccount = "登录"
          this.connect()
          retryNum++
          return
      }

      let id = await ScatterJS.login()
      if(!id) {
        this.currentAccount = "登录"
        this.connect()
        retryNum++
        return
      } 

      const account = ScatterJS.account('eos')
      this.currentAccount = account.name
      this.currentPermission = account.authority
      this.currentPublicKey = account.publicKey
      api = ScatterJS.scatter.eos(network, Api, { rpc })
    },
    logout: function() {
      ScatterJS.scatter.logout()
      this.currentAccount = "登录"
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-layout-item {
    &:after {
      width: 100%;
      height: 100%;
      display: block;
      background: md-get-palette-color(green, 200);
      content: " ";
    }
  }
  .card-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .card-item {
        flex-grow: 1;
        align-content: center;
        justify-content: center;
        
    }
  }
  .font-size {
    font-size: 12px;
  }
  .md-layout {
    width: 100%;
  }
  .font-account {
    color: #483D8B;
    font-weight: bold;
  }

  .font-deepblue {
      font-weight: bold;
      color:#fff;
      font-size:12px;
  }
  .font-input {
       font-size:12px;
  }
  .font-gx {
      font-weight: bold;
      color:#FF6A6A;
      font-size:12px;
  }
  .font-title {
      color:#808080;
      font-weight:bold;
      font-size:12px;
  }
  .bottom {
    position: fixed;
    bottom:0px;
    left: 0px;
    border-top:1px solid #000;
    background: #363636;
    width: 100%;
    height: 54px;
    line-height: 54px;
    z-index: 999999;
    text-align: right;
    padding-right: 10px;
  }
  .listtoolbar {
    overflow-y:scroll;
    border: none;
    padding: 1px;
  }
  .notice {
    color:#fff;
    color:yellow;
    font-weight:bold;
    display:block;
    margin-top:5px;
  }
</style>