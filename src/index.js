/* @flow */
function plugin (Vue: any, options: Object = {}) {
  Vue.prototype.$add = (a: number, b: number): number => {
    return a + b
  }
}

plugin.version = '__VERSION__'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
