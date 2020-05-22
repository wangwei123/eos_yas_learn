import axios from 'axios'

window.serverHost = 'https://yas.maiziqianbao.net'
axios.defaults.timeout = 10000
axios.defaults.baseURL = window.serverHost

export const getAccountInfo = params => { return axios.post(`/v1/chain/get_account`, params).then(res => res.data)}