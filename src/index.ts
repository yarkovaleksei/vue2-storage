import vue from 'vue';
import Vue2Storage from './storage';
import { StorageOptions } from './types';

export class Plugin {
  static install (Vue: typeof vue, options: StorageOptions): void {
    const storage = new Vue2Storage(options);
    Vue.$storage = storage;
    Vue.prototype.$storage = storage;
  }
}

if (typeof window !== 'undefined') {
  window['Vue2StoragePlugin'] = Plugin;
  window['Vue2Storage'] = Vue2Storage;
}

export default Vue2Storage;
