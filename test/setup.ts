import 'jest-localstorage-mock';
import plugin from '../src/index';

const Vue = require('vue');

Vue.config.productionTip = false;
Vue.use(plugin);
