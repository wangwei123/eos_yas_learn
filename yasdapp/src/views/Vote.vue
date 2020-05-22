<template>
  <div ref="votePage" class="animated fadeIn">
    <loading :active.sync="isLoading" 
      background-color="#000"
      color="#007bff"
      :is-full-page="true"></loading>
    <md-toolbar class="animated zoomIn">
      <div class="card-container">
        <div class="card-item">
          <span>
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
          <span style="float:right;">
            <span class="font-title">已投票节点: </span>
            <span class="font-deepblue">{{voteProducers.length}}个</span>
          </span>
        </div>
      </div>
    </md-toolbar>
    <span class="notice animated zoomIn">投票可支持主网生态建设,赋予YAS更大的价值,如果本工具对你有帮助,可以给yasflyflyfly投票，谢谢</span>
    <div ref="listtoolbar" class="listtoolbar">
    <md-toolbar :key="index" v-for="(item,index) in bpNodes" class="animated zoomIn" style="margin-bottom:20px;">
      <div class="md-layout">
        <div class="md-layout-item md-size-10">
          <md-checkbox v-model="selectBpNodes" :value="item.owner" />
        </div>
        <div class="md-layout-item">
          <div class="md-layout">
            <div class="md-layout-item">
              <span class="font-title">节点排名: </span>
              <span class="font-deepblue">{{index+1}}</span>
            </div>
            <div class="md-layout-item">
              <span class="font-title">得票数: </span>
              <span class="font-deepblue">{{item.votes}}</span>
            </div>
          </div>
          <div class="md-layout">
            
            <div class="md-layout-item">
              <span class="font-title">节点账号: </span>
              <span class="font-deepblue">{{item.owner}}</span>
            </div>
            <div class="md-layout-item">
              <span class="font-title">投票率: </span>
              <span class="font-deepblue">{{item.votes_percentage}}%</span>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item">
              <span class="font-title">社区贡献: </span>
              <span class="font-gx">{{GongXianList[item.owner]}}</span>
            </div>
          </div>
        </div>
      </div>
      <br>
      <br>
    </md-toolbar>
    </div>
    <div class="bottom">
      <md-button class="md-dense md-accent" style="float:left;" @click="viewSelVoteProducersHandle">已勾选{{selectBpNodes.length}}个节点</md-button>
      <md-button class="md-dense md-primary" @click="viewVoteProducersHandle">投票记录</md-button>
      <md-button class="md-raised md-primary" style="width:100px;" @click="voteHandle">投票</md-button>
    </div>
    <md-dialog-confirm
      :md-active.sync="showConfirmDialog"
      md-title="系统提示"
      :md-content="confirmContent"
      md-confirm-text="确认"
      md-cancel-text="取消"
      @md-cancel="onCancelVote"
      @md-confirm="onConfirmVote" />
    <md-dialog-alert
    :md-active.sync="alertShow"
    :md-content="alertContent"
    md-confirm-text="关闭" />
  </div>
</template>
<script>
import Try from '@/utils/try';
import { async } from 'q'
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import ScatterJS from "@scatterjs/core"
import ScatterEOS from "@scatterjs/eosjs2"
import { Api } from "eosjs"
import {eosApi, network, rpc} from "@/common/nodes"

const GongXianList = {
  "mathwalletbp": "麦子钱包,第一个支持YAS主网映射的钱包",
  "yasflyflyfly": "YAS早期布道者，社区核心成员, 椰子社区矿机开发者, 短号竞拍平台开发者",
  "plusplusplus": "yas.plus开发者, codex+交易所开发者",
  "peilin444yas": "YAS早期布道者，从牛油果开始支持ap的节点",
  "yaschinaclub": "yas100.com系列工具开发节点，投票工具，口袋交易所，矿机等",
  "whale.ex": "鲸交所节点",
  "lichang.io": "力场节点",
  "io": "io积分",
  "zhaoyilun532": "社区核心成员",
  "ciaciaciacia": "cia预言机项目方节点",
  "eidosyasbp1a": "ap节点",
  "eosmongolia5": "社区核心成员",
  "dingshenghui": "社区核心成员,全历史节点",
  "ivote4yasusa": "美国节点，也是EOS超级节点",
  "eidosyasbp1f": "ap节点",
  "miningbp.one": "专用挖矿节点,联系人未知",
  "eidosyasbp1c": "ap节点",
  "eidosyasbp2e": "ap节点",
  "fullhistoryb": "美国人迈克的节点",
  "eidosyasbp2b": "ap节点",
  "gravity.io": "引力区节点",
  "shehasgflybp": "社区众筹节点",
  "eidosyasbp2c": "ap节点",
  "mxcpospoolbp": "抹茶交易所节点",
  "princessclub": "柚子公主节点"
}

var ContractAccounts = {
  "YAS": "eosio.token",
} 

const TIMESTAMP_EPOCH = 946684800
const calculateEosFromVotes = votes => {
  const date = Date.now() / 1000 - TIMESTAMP_EPOCH
  const weight = (date / (86400 * 7)) / 52
  return parseInt(votes) / 2 ** weight / 10000
}

export default {
  components: {
    Loading
  },
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
      selectBpNodes: ["yasflyflyfly"],
      GongXianList: GongXianList,
      clientHeight:'',
      alertShow: false,
      alertContent: "",
      showConfirmDialog: false,
      confirmContent: "",
      isLoading: false
    }
  },
  mounted(){
    // 获取浏览器可视区域高度
    this.clientHeight =   `${document.documentElement.clientHeight}`       
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
    this.getVoteList()
  },
  methods: {
    changeFixed(clientHeight){                        //动态修改样式
      this.$refs.votePage.style.height = (clientHeight-86)+'px';
      this.$refs.listtoolbar.style.height = (clientHeight-86-80-60)+'px';
    },
    voteHandle() {
      this.showConfirmDialog = true
      this.confirmContent = "您选择的投票节点: <br>"
      for (let i = 0; i < this.selectBpNodes.length; i++) {
        this.confirmContent += '<span style="font-weight:bold;display:block;">' + this.selectBpNodes[i] + "</span>"
      }
    },
    viewVoteProducersHandle() {
      this.alertShow = true
      this.alertContent = "您已投票的节点: <br>"
      for (let i = 0; i < this.voteProducers.length; i++) {
        this.alertContent += '<span style="font-weight:bold;display:block;">' + this.voteProducers[i] + "</span>"
      }
    },
    viewSelVoteProducersHandle() {
      this.alertShow = true
      this.alertContent = "您已选择的节点: <br>"
      for (let i = 0; i < this.selectBpNodes.length; i++) {
        this.alertContent += '<span style="font-weight:bold;display:block;">' + this.selectBpNodes[i] + "</span>"
      }
    },
    onConfirmVote() {
      let voteProducers = this.selectBpNodes
      let actions = [{
        account: "eosio",
        name: "voteproducer",
        authorization: [{
            actor: this.currentAccount,
            permission: this.currentPermission
        }],
        data: {
            voter: this.currentAccount,
            proxy: "",
            producers: voteProducers.sort(),
        }
      }]
    
      this.isLoading = true
      this.getApi().transact(
        {
          actions: actions
        },{
          blocksBehind: 3,
          expireSeconds: 30
        }
      )
      .then(res => {
        this.isLoading = false
        alert("投票成功！")
        this.selectBpNodes = ["yasflyflyfly"]
        this.getVoteList()
        this.refreshInfo()
      })
      .catch(err => {
        this.isLoading = false
        alert("投票失败: " + err)
      })
    },
    onCancelVote() {
      this.showConfirmDialog = false
      this.confirmContent = ""
    },
    refreshInfo() {
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
    async getAccountResourceBalance() {
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

      this.selectBpNodes = []
      this.voteProducers = producers
      this.voteProducers.forEach(item=>{
        this.selectBpNodes.push(item)
      })

      if (this.selectBpNodes.indexOf("yasflyflyfly") === -1) {
        this.selectBpNodes.push("yasflyflyfly")
      }

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
    },
    async connect() {
      let connected = await ScatterJS.scatter.connect('yastools.io', {network})
      if(!connected) {
          this.currentAccount = "登录"
          return
      }

      let id = await ScatterJS.scatter.login()
      if(!id) {
        this.currentAccount = "登录"
        return
      } 

      const account = ScatterJS.account('eos')
      this.currentAccount = account.name
      this.currentPermission = account.authority
      this.currentPublicKey = account.publicKey
    },
    getApi() {
        let api = ScatterJS.scatter.eos(network, Api, { rpc })
        return api
    },
    async getVoteList() {
      this.isLoading = true
      let result = await eosApi.getProducers({ json: true, limit: 100 })
      this.isLoading = false
      
      // 投票权重
      const total_producer_vote_weight = result.total_producer_vote_weight

      // 投票比例
      const onePercent = parseInt(total_producer_vote_weight) / 100

      let filterBpNodes = []
      result.rows.forEach((item)=>{
        item.votes = parseInt(calculateEosFromVotes(item.total_votes))
        item.votes_percentage = (item.total_votes / onePercent).toFixed(3)
        if (item.is_active === 1) {
          filterBpNodes.push(item)
        } else {
          if (this.selectBpNodes.indexOf(item.owner) !== -1) {
            this.selectBpNodes.remove(item.owner)
          }
        }
      })

      this.bpNodes = filterBpNodes
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
  .md-layout {
    width: 100%;
  }

  .font-deepblue {
      font-weight: bold;
      color:#fff;
      font-size:12px;
  }
  .font-account {
    color: #483D8B;
    font-weight: bold;
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