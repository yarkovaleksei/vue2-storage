/* @flow */

import Storage from './storage'

function Vue2Storage (Vue: any, options: StorageOptions) {
  const storage = new Storage(options)
  Vue['$storage'] = storage
  Vue.prototype.$storage = storage
}

export default Vue2Storage

window.Vue2Storage = Vue2Storage
