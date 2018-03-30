/*!
 * vue2-storage v1.0.0 
 * (c) 2018 Yarkov Aleksey
 * Released under the MIT License.
 */
'use strict';

/*  */
function plugin (Vue, options) {
  if ( options === void 0 ) options = {};

  Vue.prototype.$add = function (a, b) {
    return a + b
  };
}

plugin.version = '1.0.0';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

module.exports = plugin;
