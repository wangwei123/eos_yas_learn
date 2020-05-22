<template>
  <div id="app">
    <md-app md-mode="reveal">
      <md-app-toolbar>   
        <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
        </div>

        <div style="md-toolbar-offset">{{$route.name}}</div>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="refresh" ref="refreshBtn">
            <md-icon>refresh</md-icon>
          </md-button>
          <md-button @click="addNameHandle" ref="addNameBtn" v-if="$route.path.indexOf('/main/newbids/ibt') !== -1 || $route.path.indexOf('/main/newbids/yas') !== -1 || $route.path.indexOf('/main/newbids/ydao') !== -1">
            短号上架
          </md-button>
          <!--<md-button class="md-icon-button">
            <md-icon>more_vert</md-icon>
          </md-button>-->
        </div>
      </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" style="width:200px;">
        <md-toolbar class="md-transparent" md-elevation="0">功能菜单</md-toolbar>
        <md-list>
          <md-list-item @click="navigateToHandle('/main/vote')">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">首页 | 投票</span>
          </md-list-item>

          <md-list-item @click="navigateToHandle('/main/newbids/ibt')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">竞拍挖矿</span>
          </md-list-item>

          <md-list-item @click="navigateToHandle('/main/bidname/top')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">靓号竞拍</span>
          </md-list-item>

          <!--<md-list-item @click="navigateToHandle('/main/namedex/ibt')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">靓号交易所</span>
          </md-list-item>-->

          <!--<md-list-item @click="navigateToHandle('/main/mining_pool')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">双挖矿池</span>
          </md-list-item>-->

          <!--<md-list-item @click="navigateToHandle('/main/mining')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">万能矿机</span>
          </md-list-item>-->

          <md-list-item @click="navigateToHandle('/main/rex')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">资源 | REX</span>
          </md-list-item>

          <md-list-item @click="navigateToHandle('/main/namebids')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">官方竞拍</span>
          </md-list-item>
          
          <md-list-item @click="navigateToHandle('/main/ram')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">内存交易</span>
          </md-list-item>

          <md-list-item @click="navigateToHandle('/main/richlist')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">富豪榜</span>
          </md-list-item>

          <md-list-item @click="navigateToHandle('/main/transfer')">
            <md-icon>list</md-icon>
            <span class="md-list-item-text">批量转账</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <router-view v-if="isRouterAlive"></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: "main",
  data: () => ({
    menuVisible: false,
    isRouterAlive: true
  }),
  methods: {
    refresh() {
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    },
    addNameHandle() {
      this.$router.push({path: "/main/newbids_addname"})
    },
    navigateToHandle: function(path) {
      this.menuVisible = false
      this.$router.push({path: path})
    }
  }
} 
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>