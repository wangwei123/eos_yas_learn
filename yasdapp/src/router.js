import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import Transfer from './views/Transfer.vue'
import Vote from './views/Vote.vue'
import Rex from './views/Rex.vue'
import Ram from './views/Ram.vue'

Vue.use(Router)
// More details: https://github.com/vuematerial/vue-material/issues/1977
Vue.component('router-link', Vue.options.components.RouterLink)
Vue.component('router-view', Vue.options.components.RouterView)

const routes = [
  {
    path: '/main',
    name: 'main',
    component: Main,
    children: [
      { path: '/main/vote', component: Vote, name: '首页' },
      { path: '/main/rex', component: Rex, name: '资源 | REX' },
      { path: '/main/ram', component: Ram, name: '内存交易' },
      { path: '/main/transfer', component: Transfer, name: '批量转账' }
    ]
  },
  // {
  //   path: '*',
  //   redirect: '/main/vote'
  // }
]

const router = new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach((to, from, next) => {
 if (to.path === '/') {
    next("/main/vote")
  } else {
    next()
  }
})

export default router
