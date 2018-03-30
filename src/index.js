/* @flow */

import Storage from './storage'
import type StorageOptions from './storage'

function Vue2Storage (Vue: any, options: StorageOptions) {
  Vue.prototype.$storage = new Storage(options || {})
}

export default Vue2Storage

window.Vue2Storage = Vue2Storage
