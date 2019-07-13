import Vue from 'vue'
import Router from 'vue-router'

const LOGIN = resolve => require(['@/page/login'], resolve)
const Home = resolve => require(['@/page/index'], resolve)



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '我的面板',
      component: Home,
      redirect: '/home',
      children: [
        { 
          path: '/home', 
          component: Home, 
          name: '我的面板', 
          meta: {
            title: '登录页面',
            leaf: true,
          }
        }
      ]
      
    },
    {
      path: '/login',
      name: 'login',
      component: LOGIN,
      meta: {
        title: '登录页面',
        leaf: true,
      }
    },



  ]
})
