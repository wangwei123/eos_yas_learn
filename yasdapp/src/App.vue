<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "app",
  data: () => ({
    menuVisible: false
  }),
  methods: {
    toMySecretHandle: function() {
      this.$router.push({path: "/mysecret"})
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
