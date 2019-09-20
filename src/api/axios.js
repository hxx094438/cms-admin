import axios from 'axios'
// import * as config from '../config'
import querystring from 'querystring'
// import { loginIn } from '../utils/loginIn'
import app from '../main'

const baseUrl = 'http://127.0.0.1:3002/api'
axios.defaults.withCredentials = true
const request = axios.create({
  baseURL: baseUrl
})



// 拦截器
request.interceptors.request.use(
  (config) => {
    if (window.localStorage.getItem('TOKEN')) {
      config.headers.Authorization = `Bearer ${JSON.parse(window.localStorage.getItem('TOKEN') || '')}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (res) => {
    if(res.data.code === 401) {
      app.$alert('用户信息已过期，请点击确定后重新登录。', '提示', {
        confirmButtonText: '确定',
        callback: action => app.$router.push({
          path: '/login',
          query: { redirect: app.$route.fullPath }
        })
      })
    }
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
