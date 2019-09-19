import Vue from 'vue'
import Router from 'vue-router'
import request from "../api/axios";

const LOGIN = resolve => require(['@/page/login'], resolve)
const Home = resolve => require(['@/page/Home/index'], resolve)

const INDEX = resolve => require(['@/page/index'], resolve)
const Article = resolve => require(['@/page/Article/Index'], resolve)
const Release = resolve => require(['@/page/Article/Release'],resolve)
const Comments = resolve => require(['@/page/Comments/Index'],resolve)

Vue.use(Router)

function loginIn () {
  if (!window.localStorage.getItem('TOKEN')) return false
  const lifeTime = JSON.parse(window.localStorage.getItem('TOKEN') || '').lifeTime * 1000
  const nowTime = (new Date()).getTime()
  if (nowTime > lifeTime) return false
  return true
}

const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: '我的面板',
      component: INDEX,
      redirect: '/home',
      meta: {leaf: true, icon: 'icon-home'},
      children: [
        {
          path: '/home',
          component: Home,
          name: '我的面板',
          meta: {
            requiresAuth: true
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
        requiresAuth: false
      }
    },

    {
      path: '/',
      name: '文章管理',
      component: INDEX,
      meta: {
        leaf: false,
        icon: 'icon-article',
        requiresAuth: true
      },
      children: [
        {path: '/article/index', component: Article, name: '文章列表', meta: {requiresAuth: false, icon: 'icon-list'}},
        {path: '/article/release', component: Release, name: '发布文章', meta: {requiresAuth: false, icon: 'icon-write'}}
      ]
    },
    {
      path: '/',
      name: '评论',
      component: INDEX,
      meta: { leaf: true, icon: 'icon-comments',requiresAuth: true },
      children: [
        { path: '/comment', component: Comments, name: '评论', meta: { requiresAuth: false, icon: 'icon-comments' } }
      ]
    },


  ]
},)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loginIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router