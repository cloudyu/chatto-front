import '@babel/polyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import Config from './Config.vue'
import router from './router'
import axios from 'axios'
import Notify from 'vue-notifyjs'
import 'vue-notifyjs/themes/material.css'

router.afterEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Notify)

Vue.prototype.CONFIG = Config
Vue.prototype.$axios = axios

Vue.prototype.$axios.interceptors.request.use((request) => {
  let token = localStorage.getItem('token')
  if (token) {
    request.headers.Authorization = `JWT ${token}`
  }
  if (request.method !== 'get') {
    if (typeof (request.data) === 'object') {
      request.data = JSON.stringify(request.data)
    } else {
      // request.headers
    }
    // text/plain;charset=UTF-8
  }
  return request
})

Vue.prototype.$axios.interceptors.response.use((response) => {
  if (response.data.success && response.data.message) {
    Vue.prototype.$notify({
      title: 'Success',
      type: 'success',
      message: response.data.message
    })
  }
  return response
}, (error) => {
  if (error.response.status === 401) {
    Vue.prototype.$notify({
      title: 'Authorization',
      message: error.response.data.error,
      type: 'danger'
    })
    localStorage.setItem('token', '')
  } else if (error.response.status === 403 && error.response.data.detail) {
    localStorage.setItem('token', '')
  } else if (!error.response.data.success && error.response.data.error) {
    if (typeof (error.response.data.error) === 'object') {
      for (var msgType in error.response.data.error) {
        for (var msg in error.response.data.error[msgType]) {
          Vue.prototype.$notify({
            title: 'Fail',
            type: 'danger',
            message: `${msgType}: ${error.response.data.error[msgType][msg]}`
          })
        }
      }
    } else {
      Vue.prototype.$notify({
        title: 'Fail',
        type: 'danger',
        message: error.response.data.error
      })
    }
  } else {
    console.log(error)
  }
  return Promise.reject(error)
})
// eslint-disable-next-line
let vue = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// console.log(vue.$axios.interceptors)
