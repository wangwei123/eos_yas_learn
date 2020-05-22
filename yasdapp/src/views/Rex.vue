<template>
  <div ref="votePage" class="animated fadeIn">
    <loading :active.sync="isLoading" 
      background-color="#000"
      color="#007bff"
      :is-full-page="true"></loading>
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
      <div class="card-container">
        <div class="card-item">
          <span class="font-title">REX余额: </span>
          <span class="font-deepblue">{{sellRex.rex_balance}}</span>
        </div>
      </div>
    </md-toolbar>
    <md-tabs class="animated zoomIn">
      <md-tab md-label="抵押/赎回">
        <div>
          <md-radio v-model="isDelegate" :value="true">抵押</md-radio>
          <md-radio v-model="isDelegate" :value="false">赎回</md-radio>
        </div>
        <div v-if="isDelegate">
          <label style="color:yellow;">注意: 抵押可免费获得CPU/NET资源, 赎回资金3天后到账, 资金无损失</label>
          <md-field> 
            <label class="font-title">抵押者</label>
            <md-input v-model="delegateResource.delegateAccount" class="font-input" disabled></md-input>
          </md-field>
          <md-field>
            <label class="font-title">抵押接受者(默认给自己抵押,可改为其他账号)</label>
            <md-input v-model="delegateResource.receiveAccount" class="font-input"></md-input>
          </md-field>
          <md-field>
            <label class="font-title">CPU抵押(YAS)</label>
            <md-input v-model="delegateResource.stakeCpuQuantity" class="font-input"></md-input>
          </md-field>
          <md-field>
            <label class="font-title">NET抵押(YAS)</label>
            <md-input v-model="delegateResource.stakeNetQuantity" class="font-input"></md-input>
          </md-field>
          <md-button class="md-raised md-primary" style="width:90%;" @click="delegateHandle">抵押YAS获得资源</md-button>
        </div>
        <div v-if="!isDelegate">
          <label style="color:yellow;">赎回资金将于三天后到账</label>
            <md-field> 
            <label class="font-title">抵押者</label>
            <md-input v-model="delegateResource.delegateAccount" class="font-input" disabled></md-input>
          </md-field>
          <md-field>
            <label class="font-title">赎回账号</label>
            <md-select v-model="selectedReceiveAccount" class="font-deepblue">
              <md-option class="font-deepblue" :value="item.to" :key="index" v-for="(item,index) in receiveAccounts">
                {{item.to}}<br>CPU: {{item.cpu_weight}}<br> NET: {{item.net_weight}}
                </md-option>
            </md-select>
          </md-field>
          <md-field>
            <label class="font-title">赎回CPU抵押数(YAS)</label>
            <md-input v-model="delegateResource.stakeCpuQuantity" class="font-input"></md-input>
          </md-field>
          <md-field>
            <label class="font-title">赎回NET抵押数(YAS)</label>
            <md-input v-model="delegateResource.stakeNetQuantity" class="font-input"></md-input>
          </md-field>
          <md-button class="md-raised md-primary" style="width:90%;" @click="delegateHandle">释放资源赎回YAS</md-button>
        </div>  
      </md-tab>
      <md-tab md-label="租赁CPU/NET">
        <label style="color:yellow;">注意: 租赁CPU/NET是需要花费YAS的, 资金不可返还, 想免费获得CPU/NET请到抵押/赎回中操作</label>
        <md-field>
          <label class="font-title">REX租赁比例</label>
          <md-input v-model="rexPool.rentPercentage" class="font-input" disabled></md-input>
        </md-field>
        <md-field>
          <label class="font-title">REX租赁价格</label>
          <md-input v-model="rexPool.rentPrice" disabled></md-input>
        </md-field>
        <md-field>
          <label class="font-title">可租赁总额</label>
          <md-input v-model="rexPool.total_unlent" class="font-input" disabled></md-input>
        </md-field>
        <md-field>
          <label class="font-title">支付数量(YAS)</label>
          <md-input v-model="rexPool.buyAmount" class="font-input"></md-input>
        </md-field>
        <md-field>
          <label class="font-title">接收账号</label>
          <md-input v-model="rexPool.reciveAccount" class="font-input"></md-input>
        </md-field>
        <div style="width:100%;text-align:center;">
          <md-button class="md-raised md-primary" @click="rentHandle('rentCPU')">租赁CPU</md-button>
          <md-button class="md-raised md-accent" @click="rentHandle('tentNET')">租赁NET</md-button>
        </div> 
      </md-tab>
      <md-tab md-label="买/卖REX">
        <span style="color:yellow">注意: 购买REX后需要等待4天才能卖出。卖出REX后资金存在过渡账户，需要发起取回才会回到自己的账户</span>
        <div>
          <md-radio v-model="isBuyRex" :value="true">购买REX</md-radio>
          <md-radio v-model="isBuyRex" :value="false">卖出REX</md-radio>
        </div>
        <div style="width:100%;" v-if="isBuyRex">
          <md-field>
            <label class="font-title">购买数量(YAS)</label>
            <md-input v-model="buyRex.buyQuantity" class="font-input"></md-input>
          </md-field>
          <md-field>
            <md-checkbox v-model="voteProxy" /><span>购买REX需要通过代理投票或者投票给至少21个节点，选中将投给指定代理，或者去投票至少21个节点再购买REX</span>
          </md-field>
          <md-field v-if="voteProxy">
            <label class="font-title">代理人账号</label>
            <md-input v-model="buyRex.proxy" class="font-input"></md-input>
          </md-field>
          <md-button class="md-raised md-primary" style="width:90%;" @click="rexHandle">购买REX</md-button>
        </div>
        <!-- 卖出rex -->
        <div style="width:100%;" v-if="!isBuyRex">
          <md-field> 
            <label>REX余额: </label>
            <md-input v-model="sellRex.rex_balance" class="font-input" disabled></md-input>
          </md-field> 
          <md-field> 
            <label>可出售REX: </label>
            <md-input v-model="sellRex.matured_rex" class="font-input" disabled></md-input>
          </md-field> 
          <md-field>  
            <label class="font-title">卖出REX数量</label>
            <md-input v-model="sellRex.sell_rex_quantity" class="font-input"></md-input>
          </md-field>
          <div>
            <md-button class="md-raised md-accent" style="width:90%;" @click="rexHandle">卖出REX</md-button> 
          </div>
          <div style="width:100%;">
            <md-field> 
              <label>过渡账号余额</label>
              <md-input v-model="rexfund.balance" class="font-input" disabled></md-input>
            </md-field>  
            <md-field> 
              <label>取回YAS数量</label>
              <md-input v-model="rexfund.getback_amount" class="font-input"></md-input>
            </md-field>  
            <md-button class="md-raised md-primary" style="width:90%;" @click="withdrawHandle">取回YAS</md-button> 
          </div>
        </div>
      </md-tab>
      <md-tab md-label="抵押转REX">
        <label style="color:yellow;">抵押转为REX后卖出需要等待4天, 不能将所有抵押转换为REX, 系统会自动预留3个YAS抵押资源用于发起本次交易</label>
        <md-field>
          <label class="font-title">REX接收账号</label>
          <md-select v-model="selectedDelToRexReceiveAccount" class="font-deepblue">
            <md-option class="font-deepblue" :value="item.to" :key="index" v-for="(item,index) in receiveAccounts">
              {{item.to}}<br>CPU: {{item.cpu_weight}}<br> NET: {{item.net_weight}}
              </md-option>
          </md-select>
        </md-field>
        <md-field>
          <label class="font-title">CPU抵押(YAS)</label>
          <md-input v-model="delegateToRex.stakeCpuQuantity" class="font-input"></md-input>
        </md-field>
        <md-field>
          <label class="font-title">NET抵押(YAS)</label>
          <md-input v-model="delegateToRex.stakeNetQuantity" class="font-input"></md-input>
        </md-field>
        <md-field>
          <md-checkbox v-model="voteProxy" /><span>购买REX需要通过代理投票或者投票给至少21个节点，选中将投给指定代理，或者去投票至少21个节点再购买REX</span>
        </md-field>
        <md-field v-if="voteProxy">
          <label class="font-title">代理人账号</label>
          <md-input v-model="delegateToRex.proxy" class="font-input"></md-input>
        </md-field>
        <md-button class="md-raised md-primary" style="width:90%;" @click="delegateToRexHandle">抵押转REX</md-button>
      </md-tab> 
    </md-tabs>
    <md-dialog-alert
    :md-active.sync="alertShow"
    :md-content="alertContent"
    md-confirm-text="关闭" />
    <md-dialog-confirm
      :md-active.sync="showConfirmDialog"
      md-title="系统提示"
      :md-content="confirmContent"
      md-confirm-text="确认"
      md-cancel-text="取消"
      @md-cancel="onCancelConfirm"
      @md-confirm="onCancelConfirm" />
  </div>
</template>
<script>
import Try from '../utils/try'
import { async } from 'q'
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { 
  apiGetDelBandwidthRows,
  apiDelegatebw,
  apiUnDelegatebw,
  apiBuyRex,
  apiSellRex,
  apiGetRexOrderRows,
  apiGetRexPoolRows,
  apiRentCpu,
  apiRentNet,
  apiDelegateToRex,
  apiRexWithdraw,
  apiGetRexfundRows
} from '../api/eosapi'

import ScatterJS from "@scatterjs/core"
import ScatterEOS from "@scatterjs/eosjs2"
import { Api } from "eosjs"
import {eosApi, network, rpc} from "../common/nodes"

// import VConsole from "vconsole";
// var vConsole = new VConsole();
let api = ""
var ContractAccounts = {
  "YAS": "eosio.token",
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
      bpNodes: [],
      selectBpNodes: [],
      clientHeight:'',
      alertShow: false,
      alertContent: "",
      voteProxy: false,
      selectedReceiveAccount: "",
      selectedDelToRexReceiveAccount: "",
      receiveAccounts: [],
      isDelegate: true,
      isBuyRex: true,
      delegateResource: {
        delegateAccount: "",
        receiveAccount: "",
        stakeCpuQuantity: "",
        stakeNetQuantity: ""
      },
      buyRex: {
        buyQuantity: 0,
        sellRexQuantity: 0,
        proxy: "",
      },
      sellRex: {
        rex_balance: "",
        sell_rex_quantity: ""
      },
      rexfund: {
        owner: "",
        balance: "",
        getback_amount: ""
      },
      rexPool: {
        total_lent: "",
        total_unlent: "",
        total_rent: "",
        total_lendable: "",
        total_rex: "",
        rexPrice: "",
        namebid_proceeds: "",
        loan_num: "",
        rentPrice: "",
        rentPercentage: "",
        buyAmount: "",
        reciveAccount: ""
      },
      delegateToRex: {
        receiveAccount: "",
        stakeCpuQuantity: "",
        stakeNetQuantity: "",
        proxy: ""
      },
      showConfirmDialog: false,
      confirmContent: "",
      isLoading: false
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
      //this.changeFixed(this.clientHeight)
    },
    isDelegate: function() {
      if(!this.isDelegate) {
        this.loadDelBandwidthRows()
      } else {
        this.selectedReceiveAccount = ""
        this.delegateResource.stakeCpuQuantity = ""
        this.delegateResource.stakeNetQuantity = ""
      }
    },
    selectedReceiveAccount: function() {
      if(!this.isDelegate) {
        let accountInfo = this.getReciveAccountInfo(this.selectedReceiveAccount)
        this.delegateResource.receiveAccount = this.selectedReceiveAccount
        this.delegateResource.stakeCpuQuantity = Number(accountInfo.cpu_weight.replace(" YAS", ""))
        this.delegateResource.stakeNetQuantity = Number(accountInfo.net_weight.replace(" YAS", ""))
      }
    },
    selectedDelToRexReceiveAccount: function() {
      let accountInfo = this.getReciveAccountInfo(this.selectedDelToRexReceiveAccount)
      this.delegateToRex.receiveAccount = this.selectedDelToRexReceiveAccount
      this.delegateToRex.stakeCpuQuantity = Number(accountInfo.cpu_weight.replace(" YAS", ""))
      this.delegateToRex.stakeNetQuantity = Number(accountInfo.net_weight.replace(" YAS", ""))
    }
  },
  async created() {
    this.getRentCpuPrice()
    await this.connect()
    await this.getAccountBalance(this.selectedSymbol)
    await this.getAccountResourceBalance() 
    await this.loadRexBalance()
    this.loadDelBandwidthRows()
    this.loadRexfund()

    this.delegateResource.delegateAccount = this.currentAccount
    this.delegateResource.receiveAccount = this.currentAccount
  },
  methods: {
    changeFixed(clientHeight){                        //动态修改样式
      this.$refs.votePage.style.height = (clientHeight-86)+'px';
      this.$refs.listtoolbar.style.height = (clientHeight-80-60-60)+'px';
    },
    getReciveAccountInfo: function(selectedAccount) {
      let receive = {}
      for(var i = 0; i < this.receiveAccounts.length; i++) {
          let item = this.receiveAccounts[i]
          if(selectedAccount == item.to) {
            receive = item
          }
        }

        return receive
    },
    loadDelBandwidthRows: function() {
      apiGetDelBandwidthRows(eosApi, this.currentAccount, 10).then(result=>{
        this.receiveAccounts = result.rows
      })
    },
    getRentCpuPrice: async function() {
      let [result, err] = await Try(apiGetRexPoolRows(eosApi))
      if (err) {
        alert("err="+JSON.stringify(err))
        return
      }

      this.rexPool = result.rows[0]
      let total_rex = Number(this.rexPool.total_rex.replace(" REX", ""))
      let total_rent = Number(this.rexPool.total_rent.replace(" YAS", ""))
      let total_unlent = Number(this.rexPool.total_unlent.replace(" YAS", ""))
      let total_lent = Number(this.rexPool.total_lent.replace(" YAS", ""))
      let total_lendable = Number(this.rexPool.total_lendable.replace(" YAS", ""))
      let rentPrice = (total_unlent/(total_rent + 1)).toFixed(4)
      this.rexPool.rentPrice = " 1 YAS 可租 ≈ " + rentPrice + " YAS CPU/NET/30天"
      this.rexPool.rentPercentage = ((total_lent/total_lendable)*100).toFixed(4) + "%"
      this.rexPool.reciveAccount = this.currentAccount
      this.rexPool.rexPrice = total_lendable/total_rex
    },
    loadRexBalance: async function() {
      let [result, err] = await Try(apiGetRexOrderRows(eosApi, this.currentAccount, 10))
      if (err) {
        alert("err="+JSON.stringify(err))
        return
      } 

      let sellRex = result.rows[0]
      if (sellRex && sellRex.owner === this.currentAccount) {
        this.sellRex = sellRex
        let vote_stake = Number(sellRex.vote_stake.replace(" YAS", ""))
        if (isNaN(vote_stake)) {
          vote_stake = 0
        }

        let rexBalance = Number(sellRex.rex_balance.replace(" REX", ""))
        this.sellRex.rex_balance = rexBalance + " ≈ " + (rexBalance * this.rexPool.rexPrice).toFixed(4) + " YAS"

        let matured_rex = this.sellRex.matured_rex/10000
        this.sellRex.matured_rex = matured_rex + " ≈ " + (matured_rex * this.rexPool.rexPrice).toFixed(4) + " YAS"
      }
    },
    loadRexfund: function() {
      apiGetRexfundRows(eosApi, this.currentAccount).then(res=>{
        let rexfund = res.rows[0]
        if (!rexfund) {
          this.rexfund.owner = this.currentAccount
          this.rexfund.balance = 0
          return
        }

        this.rexfund = rexfund
        this.rexfund.getback_amount = Number(this.rexfund.balance.replace(" YAS", ""))
      }).catch(err=>{
        alert("err="+JSON.stringify(err))
      })
    },
    delegateToRexHandle: function() {
      let stakeCpuQuantity = Number(this.delegateToRex.stakeCpuQuantity)
      let stakeNetQuantity = Number(this.delegateToRex.stakeNetQuantity)
      if (isNaN(stakeCpuQuantity)) {
        alert("无效的CPU抵押数量")
        return
      }

      if (isNaN(stakeNetQuantity)) {
        alert("无效的NET抵押数量")
        return
      }

      if (this.voteProxy && this.delegateToRex.proxy === "") {
        alert("请填写代理人账号")
        return
      }

      let authorization = {
          actor: this.currentAccount,
          permission: this.currentPermission
      }

      let voteData = null
      if (this.voteProxy) {
        voteData = {
            voter: this.currentAccount,
            proxy: this.delegateToRex.proxy,
            producers: []
        }
      }

      this.isLoading = true
      apiDelegateToRex(api, authorization, this.currentAccount, this.delegateToRex.receiveAccount, stakeCpuQuantity, stakeNetQuantity, voteData)
      .then(res => {
        this.isLoading = false
        alert("抵押转rex成功！")
        this.refreshInfo()
      })
      .catch(err => {
        this.isLoading = false
        let errmsg = JSON.stringify(err)
        if (errmsg.indexOf("must vote for at least 21") !== -1) {
          alert("购买失败：购买REX至少需要投票21个节点或者给投票给指定代理人账号")
        } else {
          alert(errmsg)
        }
      })
    },
    withdrawHandle: function() {
      let authorization = {
          actor: this.currentAccount,
          permission: this.currentPermission
      }

      this.isLoading = true
      apiRexWithdraw(api, authorization, this.currentAccount, this.rexfund.getback_amount)
      .then(res=>{
        this.isLoading = false
        this.refreshInfo()
        alert("YAS取回成功！")
      })
      .catch(err=>{
        this.isLoading = false
        this.refreshInfo()
        alert("err="+err)
      })
    },
    delegateHandle: function() {
      let stakeCpuQuantity = Number(this.delegateResource.stakeCpuQuantity)
      let stakeNetQuantity = Number(this.delegateResource.stakeNetQuantity)
      if (isNaN(stakeCpuQuantity) || stakeCpuQuantity < 0) {
        alert("无效的CPU抵押数量")
        return
      }

      if (isNaN(stakeNetQuantity) || stakeNetQuantity < 0) {
        alert("无效的NET抵押数量")
        return
      }

      let authorization = {
          actor: this.currentAccount,
          permission: this.currentPermission
      }
      if (this.isDelegate) {
        let data = {
          from: this.delegateResource.delegateAccount,
          receiver: this.delegateResource.receiveAccount,
          stake_cpu_quantity: stakeCpuQuantity.toFixed(4) + " YAS",
          stake_net_quantity: stakeNetQuantity.toFixed(4) + " YAS",
        }

        this.isLoading = true
        apiDelegatebw(api, authorization, data).then(res=>{
          this.isLoading = false
          this.refreshInfo()
          alert("抵押成功!")
        }).catch(err=>{
          this.isLoading = false
          alert("err = "+err)
        })
      } else {
        let data = {
          from: this.delegateResource.delegateAccount,
          receiver: this.delegateResource.receiveAccount,
          unstake_net_quantity: Number(this.delegateResource.stakeNetQuantity).toFixed(4) + " YAS",
          unstake_cpu_quantity: Number(this.delegateResource.stakeCpuQuantity).toFixed(4) + " YAS",
        }
        
        this.isLoading = true
        apiUnDelegatebw(api, authorization, data).then(res=>{
          this.isLoading = false
          this.refreshInfo()
          alert("赎回成功!")
        }).catch(err=>{
          this.isLoading = false
          alert("err = "+err)
        })
      }
    },
    rentHandle: function(type) {
      let authorization = {
          actor: this.currentAccount,
          permission: this.currentPermission
      }
      if(type === "rentCPU") {
        this.isLoading = true
        apiRentCpu(api, authorization, this.currentAccount, this.rexPool.reciveAccount, this.rexPool.buyAmount)
        .then(res=>{
          this.isLoading = false
          this.refreshInfo()
          alert("租赁成功!")
        })
        .catch(err=>{
          this.isLoading = false
          alert("err="+err)
        })
      } else {
        this.isLoading = true
        apiRentNet(api, authorization, this.currentAccount, this.rexPool.reciveAccount, this.rexPool.buyAmount)
        .then(res=>{
          this.isLoading = false
          this.refreshInfo()
          alert("租赁成功!")
        })
        .catch(err=>{
          this.isLoading = false
          alert("err="+err)
        })
      }
    },
    rexHandle: function() {
      if(this.isBuyRex) {
        this.buyRexHandle()
      } else {
        this.sellRexHandle()
      }
    },
    buyRexHandle: function() {
      let buyQuantity = Number(this.buyRex.buyQuantity)
      if (isNaN(buyQuantity)) {
        alert("无效的购买数量")
        return
      }

      if (buyQuantity <= 0) {
        alert("请填写正确的数量")
        return
      }

      if (this.voteProxy && this.buyRex.proxy === "") {
        alert("请填写代理人账号")
        return
      }

      let authorization = {
          actor: this.currentAccount,
          permission: this.currentPermission
      }

      let voteData = null
      if (this.voteProxy) {
        voteData = {
            voter: this.currentAccount,
            proxy: this.buyRex.proxy,
            producers: []
        }
      }

      this.isLoading = true
      apiBuyRex(api, authorization, this.currentAccount, buyQuantity, voteData)
      .then(res => {
        this.isLoading = false
        this.refreshInfo()
        alert("购买rex成功！")
      })
      .catch(err => {
        this.isLoading = false
        let errmsg = JSON.stringify(err)
        if (errmsg.indexOf("must vote for at least 21") !== -1) {
          alert("购买失败：购买REX至少需要投票21个节点或者给投票给指定代理人账号")
        } else {
          alert(errmsg)
        }
      })
    },
    sellRexHandle: function() {
      let sell_rex_quantity = Number(this.sellRex.sell_rex_quantity)
      if (isNaN(sell_rex_quantity)) {
        alert("无效的出售数量")
        return
      }

      let authorization = {
          actor: this.currentAccount,
          permission: this.currentPermission
      }
      
      this.isLoading = false
      apiSellRex(api, authorization, this.currentAccount, sell_rex_quantity)
      .then(res => {
        this.isLoading = false
        this.refreshInfo()
        alert("出售rex成功！")
      })
      .catch(err => {
        this.isLoading = false
        let errmsg = JSON.stringify(err)
        if (errmsg.indexOf("insufficient available rex") !== -1) {
          alert("没有可出售的REX, 购买的REX需4天后才能出售!")
        } else {
          alert(errmsg)
        }
      })
    },
    onConfirmRentCpuNet: function() {

    },
    onCancelConfirm: function() {

    },
    refreshInfo: function() {
      this.getAccountBalance(this.selectedSymbol)
      this.getAccountResourceBalance()
      this.getRentCpuPrice()
      this.loadRexBalance()
      this.loadDelBandwidthRows()
      this.loadRexfund()
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
      let connected = await ScatterJS.connect('yastools.io', {network})
      if(!connected) {
          this.currentAccount = "登录"
          this.connect()
          return
      }

      let id = await ScatterJS.login()
      if(!id) {
        this.currentAccount = "登录"
        this.connect()
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
  .font-account {
    color: #483D8B;
    font-weight: bold;
  }
  .font-size {
    font-size: 12px;
  }
  .md-layout {
    width: 100%;
  }

  .font-deepblue {
      font-weight: bold;
      color:#fff;
      font-size:12px;
  }
  .font-input {
       font-size:11px;
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