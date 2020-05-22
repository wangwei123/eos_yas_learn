import axios from 'axios'
import qs from 'qs'
import {LocalAccount} from '../api/local-account'
import { Notification } from 'element-ui'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import router from '../router'

///*** localhost env ***/
// window.serverHost = 'http;//192.168.0.12:8080'

///*** develop env ***/
window.serverHost = 'http://localhost:4000'
//
/////*** production env ***/
//window.serverHost = 'http://101.231.72.22:8090'

axios.defaults.timeout = 10000
axios.defaults.baseURL = window.serverHost
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'

const CLIENT = 'webadmin_'
var timestamp = Date.now()

//添加请求拦截器
axios.interceptors.request.use(function(req) {
    NProgress.start()
    req.headers['client_id'] = CLIENT + timestamp
    //在发送请求之前做某事
    if (LocalAccount.isAuth() && LocalAccount.getToken()) {
      req.headers['Authorization'] = 'Bearer ' + LocalAccount.getToken()
    } else {
      LocalAccount.clear()
      router.push('/account/login')
    }

    return req
  }, function(error) {
    //请求错误时做些事
    NProgress.done()
    Notification.error({title: '服务器错误', message: '请检查网络是否异常', duration: 2000})
    return Promise.reject(error)
})

//添加响应拦截器
axios.interceptors.response.use(function(response) {
    NProgress.done()
   //对响应数据做些事
   if (response.data.code === 501) {
      LocalAccount.clear()
      router.push('/account/login')
      //Notification.error({title: '请求错误', message: response.data.msg, duration: 2000})
   } else if (response.data.code !== 0) {
      Notification.error({title: '系统提示', message: response.data.msg, duration: 3000})
   }
   return response
 }, function(error) {
   //请求错误时做些事
   NProgress.done()
   Notification.error({title: '服务器错误', message: '请检查网络是否异常', duration: 2000})
   return Promise.reject(error)
 })

 export default axios
