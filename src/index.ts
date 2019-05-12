import Vue2Storage from './storage';
export default Vue2Storage;

if (typeof window !== 'undefined') {
  // tslint:disable-next-line
  window['Vue2Storage'] = Vue2Storage;
}
