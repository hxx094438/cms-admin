import Vue from 'vue'
import Router from 'vue-router'

const LOGIN = resolve => require(['@/page/login'], resolve)
const Home = resolve => require(['@/page/Home/index'], resolve)

const INDEX = resolve => require(['@/page/index'], resolve)
const Article = resolve => require(['@/page/Article/Index'], resolve)



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '我的面板',
      component: INDEX,
      redirect: '/home',
      meta: { leaf: true ,icon: 'icon-home'},
      children: [
        { 
          path: '/home', 
          component: Home, 
          name: '我的面板', 
          meta: {
            requiresAuth: false          
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
      }
    },

    {
      path: '/',
      name: '文章管理',
      component: Home,
      meta: { leaf: false, icon: 'icon-article' },
      children: [
        { path: '/article/index', component: Article, name: '文章列表', meta: { requiresAuth: false, icon: 'icon-list' } },
      ]
    },



  ]
})
