<template>
  <div ref="transferPage" class="animated fadeIn">
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
    </md-toolbar>
    
    <br>
    <div class="animated zoomIn">
      <md-field>
        <label class="font-title">转账代币</label>
        <md-select v-model="selectedSymbol" name="symbol" id="symbol">
          <md-option value="YAS">YAS</md-option>
          <md-option value="IBT">IBT</md-option>
          <md-option value="FOB">FOB</md-option>
        </md-select>
      </md-field>
      <md-field>
        <label class="font-title">转账数量</label>
        <md-input v-model="quantity" class="font-input"></md-input>
      </md-field>
      <md-field>
        <label class="font-title">备注(memo)</label>
        <md-input v-model="memo" class="font-input"></md-input>
      </md-field>
      <md-field>
        <label class="font-title">收款人账号, 批量转账账号间用逗号分隔</label>
        <md-textarea v-model="to" class="font-textarea"></md-textarea>
      </md-field>
      <md-field>
        <label class="font-title">对收款人账号批量转账??次(可用于挖矿)</label>
        <md-input v-model="transferTimes" class="font-input"></md-input>
      </md-field>
      <div style="width:100%;text-align:center;">
        <md-progress-bar v-if="transferState" class="md-accent" md-mode="indeterminate"></md-progress-bar>
        <md-button :disabled="transferState" class="font-button" :class="[transferState ? 'md-raised md-accent' : 'md-raised md-primary']" @click="transferHandle">{{transferButtonText}}</md-button>
      </div>
      <md-dialog-confirm
        :md-active.sync="active"
        md-title="系统提示"
        :md-content="confirmContent"
        md-confirm-text="确认"
        md-cancel-text="取消"
        @md-cancel="onCancel"
        @md-confirm="onConfirm" />
      <md-dialog-alert
      :md-active.sync="alertShow"
      :md-content="alertContent"
      md-confirm-text="关闭" />
    </div>
  </div>
</template>
<script>
import Try from '../utils/try';
import { async } from 'q'
import axios from 'axios'

import ScatterJS from "@scatterjs/core"
import ScatterEOS from "@scatterjs/eosjs2"
import { Api } from "eosjs"
import {eosApi, network, rpc} from "../common/nodes"

// import VConsole from "vconsole";
// var vConsole = new VConsole();
let api = ""
let retryNum = 0;
var ContractAccounts = {
  "YAS": "eosio.token",
  "IBT": "ibt.com",
  "FOB": "fobtokencode",
} 

var CoinDecimals = {
  "YAS": 4,
  "IBT": 8,
  "FOB": 4,
} 

const basePath = "https://www.api.bloks.io"

export default {
  data() {
    return {
      to: "",
      memo: "",
      quantity: "",
      transferTimes: "",
      selectedSymbol: "YAS",
      currentBalance: "",
      currentAccount: "",
      currentPermission: "",
      currentPublicKey: "",
      currentCPU: "0 ms",
      currentNET: "0 MB",
      currentRAM: "0 KB",
      transferState: false,
      transferButtonText: "确认转账",
      active: false,
      alertShow: false,
      alertContent: "",
      confirmContent: "",
      actions: [],
      clientHeight:'',
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
  watch:{
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    },
    selectedSymbol: {
        deep: true,
        handler: function (newVal,oldVal){
          this.getAccountBalance(newVal)
        }
    }
  },
  async created() {
    await this.connect()
    await this.getAccountBalance(this.selectedSymbol)
    await this.getAccountResourceBalance()
  },
  methods: {
    changeFixed(clientHeight){                        //动态修改样式
      this.$refs.transferPage.style.height = (clientHeight-86) + "px"
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
    getTransferActions: function() {
      let contractAccount = ContractAccounts[this.selectedSymbol]
      if (!contractAccount) {
        alert("暂时不支持"+this.selectedSymbol+"代币的转账服务")
        return
      }

      let quantity = Number(this.quantity).toFixed(CoinDecimals[this.selectedSymbol])
      this.to = this.to.replace("，", ",")
      this.to = this.to.replace(" ", "")
      let toAccounts = this.to.split(",")
      let actions = []
      let transferTimes = Number(this.transferTimes)
      if (!transferTimes) {
        transferTimes = 1
      }

      for (let k = 0; k < transferTimes; k++) {
        for(let i = 0; i < toAccounts.length; i++) {
        let toAccount = toAccounts[i]
        let action = {
            account: contractAccount,
            name: "transfer",
            authorization: [{
                actor: this.currentAccount,
                permission: this.currentPermission
            }],
            data: {
              from: this.currentAccount,
              to: toAccount,
              quantity: quantity + " " + this.selectedSymbol,
              memo: this.memo
            }
          }
          actions.push(action)
        }
      }

      return actions
    },
    transferHandle: function() {
      if (!this.currentAccount || this.currentAccount === "登录") {
        this.alertShow = true
        this.alertContent = "账号没有登录，请先登录"
        return
      }

      if (!this.selectedSymbol || this.selectedSymbol === "") {
        this.alertShow = true
        this.alertContent = "请选择转账的代币"
        return
      }

      if (this.quantity === "") {
        this.alertShow = true
        this.alertContent = "请填写转账的数量"
        return
      }

      if (this.to === "") {
        this.alertShow = true
        this.alertContent = "请填写转账收款人"
        return
      }

      this.actions = this.getTransferActions()

      this.confirmContent = "<b>请您确认转账信息:</b>"
      this.confirmContent += "<br><font color='#828282'>转账数量:</font> " + this.quantity + " " + this.selectedSymbol
      this.confirmContent += "<br><font color='#828282'>备注:</font> " + this.memo 
      this.confirmContent +="<br> <font color='#828282'>收款人:</font> " + this.to.substring(0, 20) + "..."
      this.confirmContent +="<br> <font color='#828282'>actions:</font> " + this.actions.length
      this.active = true
    },
    onConfirm () {
      this.transferState = true
      this.transferButtonText = "正在转账中..."
      api.transact(
          {
            actions: this.actions
          },
          {
            blocksBehind: 3,
            expireSeconds: 30
          }
        )
        .then(res => {
          this.transferState = false
          this.transferButtonText = "确认转账"
          this.refreshInfo()
          alert("转账成功！")
          console.log("success: " + JSON.stringify(res))
        })
        .catch(err => {
          this.transferState = false
          this.transferButtonText = "确认转账"
          this.refreshInfo()
          let errmsg = JSON.stringify(err)
          if(errmsg == "{}") {
            return
          }
          
          if(errmsg.indexOf("overdrawn balance") != -1) {
              alert("余额中的"+this.selectedSymbol+"不足，无法完成此次转账操作！")
          } else if (errmsg.indexOf("CPU") != -1 && errmsg.indexOf("limit") != -1) {
              alert("CPU资源不足，无法完成此次操作！")
          } else if (errmsg.indexOf("net") != -1 && errmsg.indexOf("limit") != -1) {
              alert("NET网络资源不足，无法完成此次操作！")
          } else if (errmsg.indexOf("ram") != -1 || errmsg.indexOf("RAM") != -1) {
              alert("RAM内存资源不足，无法完成此次操作！")
          } else if (errmsg.indexOf("expired transaction") != -1) {
              alert("eos网络拥堵，请重试！")
          } else {
            alert(errmsg)
          }
      })
    },
    onCancel () {
      
    },
    logout: function() {
      ScatterJS.scatter.logout()
      this.currentAccount = "登录"
    }
  }
}
</script>

<style lang="scss" scoped>
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

  .font-deepblue {
      font-weight: bold;
      color:#fff;
      font-size: 12px;
  }
  .font-account {
    color: #483D8B;
    font-weight: bold;
  }
  .font-title {
      color:#808080;
      font-weight:bold;
      font-size:12px;
  }

  .font-input {
      color:#483D8B;
      font-weight:bold;
      font-size:12px;
  }
  .font-textarea {
    color:#483D8B;
    font-size:12px;
  }
  .font-button {
    width:300px;
    height:50px;
    font-size:16px;
    font-weight:bold;
  }
  .font-account {
    color: #483D8B;
    font-weight: bold;
    text-decoration:underline;
  }
</style>