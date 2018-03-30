/* @flow */

import Storage from './storage'
import type StorageOptions from './storage'

function plugin (Vue: any, options: StorageOptions) {
  Vue.prototype.$storage = new Storage(options || {})
}

plugin.version = '__VERSION__'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
