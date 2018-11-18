import '@babel/polyfill'
import Vue from 'vue'
import router from './router'
import App from './App.vue'
import utils from './assets/js/utils'
import VueLazyload from 'vue-lazyload'
import $ from 'jquery'

Vue.use(VueLazyload)

// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'dist/loading.gif',
  attempt: 1
})
Vue.config.productionTip = false
window.Vue = Vue
window.$ = $
window.utils = utils
Vue.prototype.baseUrl = utils.baseUrl
Vue.prototype.apiUrl = utils.baseUrl + '/api/'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
