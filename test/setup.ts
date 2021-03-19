import 'jest-localstorage-mock';
import Vue from 'vue';
import plugin from '../src/index';

Vue.config.productionTip = false;
Vue.use(plugin);
