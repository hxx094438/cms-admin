import axios from 'axios'
// import * as config from '../config'
import querystring from 'querystring'
// import { loginIn } from '../utils/loginIn'
import app from '../main'

const isDev = process.env.NODE_ENV !== 'production'

const baseUrl = isDev ? 'http://127.0.0.1:3002/api' : `http://shawsen.site/api`
axios.defaults.withCredentials = true
const request = axios.create({
  baseURL: baseUrl
})



request.interceptors.request.use(
  config => {
    if(config.method === 'get') {
      config.params && (config.params = JSON.stringify(config.params))
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)


// 拦截器
request.interceptors.request.use(
  (config) => {
    if (window.localStorage.getItem('TOKEN')) {
      config.headers.Authorization = `Bearer ${window.localStorage.getItem('TOKEN')}`
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
