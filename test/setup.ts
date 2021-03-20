import 'jest-localstorage-mock';
import Vue from 'vue';
import { Plugin } from '../src';

Vue.config.productionTip = false;
Vue.use(Plugin);
