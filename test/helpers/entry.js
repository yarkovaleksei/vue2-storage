import 'babel-polyfill' // promise and etc ...
import Vue from 'vue'
import plugin from '../../src/index'

Vue.config.productionTip = false
Vue.use(plugin)

window.Vue = Vue
