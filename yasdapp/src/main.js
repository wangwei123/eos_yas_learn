import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'animate.css'
//import 'vue-material/dist/theme/default.css'
import 'vue-material/dist/theme/default-dark.css'
import './registerServiceWorker'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import _ from "lodash"
import './common/lib'

// Init plugin
Vue.use(VueMaterial)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  template: '<App/>'
})
