import vue from 'vue';
import Plugin from './storage';
import { StorageOptions } from './types';

export class Vue2Storage {
  static install (Vue: typeof vue, options: StorageOptions): void {
    const storage = new Plugin(options);
    Vue.$storage = storage;
    Vue.prototype.$storage = storage;
  }
}

export default Vue2Storage;

if (typeof window !== 'undefined') {
  window['Vue2Storage'] = Vue2Storage;
}
