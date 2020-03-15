import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { formatDate } from './utils'
import './worker'

Vue.config.productionTip = false

Vue.filter('date', formatDate)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
