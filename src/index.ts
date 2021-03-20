import Vue from 'vue';
import Vue2Storage, { StorageOptions }  from './storage';

export class Plugin {
  static install (vue: typeof Vue, options?: StorageOptions): void {
    const storage = new Vue2Storage(options || {});
    vue.$storage = storage;
    vue.prototype.$storage = storage;
  }
}

if (typeof window !== 'undefined') {
  window['Vue2StoragePlugin'] = Plugin;
  window['Vue2Storage'] = Vue2Storage;
}

declare module 'vue/types/vue' {
  interface Vue   {
    $storage: Vue2Storage;
  }

  interface VueConstructor {
    $storage: Vue2Storage;
  }
}

export default Vue2Storage;
