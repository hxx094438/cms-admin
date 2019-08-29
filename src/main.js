// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as ElementUi from 'element-ui'
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import hljs from 'highlight.js'
import store from './store'
import axios from 'axios'
import './assets/scss/index.scss'
import { format } from './filters/index'

window.hljs = hljs
Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(ElementUi)
Vue.use(VueSimplemde)
Vue.filter('format', format)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
