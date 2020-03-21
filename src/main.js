import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { formatDate } from './utils'
import './pwa'

Vue.config.productionTip = false
Vue.filter('date', formatDate)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

// avoid exit on back
window.addEventListener('load', () => {
  window.history.pushState({}, '')
})