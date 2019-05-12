import Plugin from './storage';
import { StorageOptions } from './types';

export class Vue2Storage {
  static install (Vue: any, options: StorageOptions): void {
    const storage = new Plugin(options);
    Vue.$storage = storage;
    Vue.prototype.$storage = storage;
  }
}

export default Vue2Storage;

if (typeof window !== 'undefined') {
  // tslint:disable-next-line
  window['Vue2Storage'] = Vue2Storage;
}
