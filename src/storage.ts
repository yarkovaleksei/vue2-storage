import objectAssign from 'object-assign';
import MemoryStorage from './MemoryStorage';
import { Dictionary, SetterOptions, StorageDriver, StorageOptions } from './types';

export default class Vue2Storage {
  private options: StorageOptions;

  constructor (config: StorageOptions = {}) {
    this.setOptions(config);
  }

  get length (): number {
    return this.keys().length;
  }

  get prefix (): string {
    return this.options.prefix;
  }

  private get name (): string {
    return '__NAME__';
  }

  private get version (): string {
    return '__VERSION__';
  }

  private get driver (): typeof window.localStorage | typeof window.sessionStorage | typeof MemoryStorage {
    switch (this.options.driver) {
      case StorageDriver.LOCAL:
      default:
        return (typeof window !== 'undefined') ? window.localStorage : MemoryStorage;
      case StorageDriver.SESSION:
        return (typeof window !== 'undefined') ? window.sessionStorage : MemoryStorage;
      case StorageDriver.MEMORY:
        return MemoryStorage;
    }
  }

  setOptions (config: StorageOptions = {}): void {
    const options = objectAssign({
      prefix: 'app_',
      driver: StorageDriver.LOCAL,
      ttl: 60 * 60 * 24 * 1000, // 24 hours
    },                           config);
    this.options = Object.freeze(options);
  }

  get (key: string, fallback: any = null) {
    try {
      const val = this.fromJSON(this.addPrefix(key));
      if (val === null) {
        return fallback;
      }

      return val;
    } catch (e) {
      this.printError(e);
    }
  }

  pull (key: string, fallback: any = null) {
    const val = this.get(key, fallback);
    if (val !== fallback) {
      this.remove(key);
    }

    return val;
  }

  set (key: string, val: any, options: SetterOptions = {}): void {
    try {
      this.driver.setItem(this.addPrefix(key), this.toJSON(val, options));
    } catch (e) {
      this.printError(e);
    }
  }

  async remember (key: string, closure: () => Promise<any>, options: SetterOptions = {}) {
    let val = this.get(key, null);
    if (val !== null) {
      return val;
    }

    try {
      val = await closure();
      this.set(key, val, options);

      return val;
    } catch (e) {
      this.printError(e);
    }
  }

  remove (key: string): void {
    try {
      this.driver.removeItem(this.addPrefix(key));
    } catch (e) {
      this.printError(e);
    }
  }

  clear (force: boolean = false): void {
    try {
      if (force) {
        this.driver.clear();
      } else {
        const keys = this.keys().filter((key) => key.startsWith(this.options.prefix || ''));
        keys.forEach((key) => this.remove(this.removePrefix(key)));
      }
    } catch (e) {
      this.printError(e);
    }
  }

  has (key: string): boolean {
    if (this.options.driver !== StorageDriver.MEMORY) {
      return (this.addPrefix(key) in this.driver);
    }

    return (this.addPrefix(key) in this.driver.storage);
  }

  key (index: number): any {
    try {
      const key = this.keys()[index];

      return this.get(this.removePrefix(key));
    } catch (e) {
      this.printError(e);
    }
  }

  keys (): string[] {
    if (this.options.driver !== StorageDriver.MEMORY) {
      return Object.keys(this.driver);
    }

    return Object.keys(this.driver.storage);
  }

  private addPrefix (key: string): string {
    return `${this.options.prefix || ''}${key}`;
  }

  private removePrefix (key: string): string {
    const re = new RegExp(`^${this.options.prefix || ''}`);

    return key.replace(re, '');
  }

  private toJSON (data: any, options: SetterOptions = {}): string {
    const ttl = ('ttl' in options) ? options.ttl : this.options.ttl;

    return JSON.stringify({
      value: data,
      ttl: Date.now() + ttl,
    });
  }

  private fromJSON (key: string): any {
    try {
      const data: Dictionary<any> = JSON.parse(this.driver.getItem(key));
      if (data !== null) {
        if (('ttl' in data) &&
          Number(data.ttl) < Date.now()) {
          this.remove(this.removePrefix(key));

          return null;
        }
        if ('value' in data) {
          return data.value;
        }

        return data;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  private printError (e: Error): void {
    console.error(`${this.name}[${this.version}]: ${e.stack}`);
  }
}
