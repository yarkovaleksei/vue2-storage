import { MemoryStorage } from './MemoryStorage';
import { StorageError } from './StorageError';

const availableDrivers = ['local', 'session', 'memory'];

export interface SetterOptions {
  ttl?: number
}

export enum StorageDriver {
  LOCAL   = 'local',
  SESSION = 'session',
  MEMORY  = 'memory',
}

export interface StorageOptions {
  prefix?: string
  driver?: StorageDriver
  ttl?: number
  replacer?: (key: string, value: any) => any
}

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
    this.checkConfig(config);

    this.options = Object.freeze({
      prefix: config.prefix || 'app_',
      driver: config.driver || StorageDriver.LOCAL,
      ttl: config.ttl || 0,
      replacer: config.replacer || undefined,
    });
  }

  get (key: string, fallback: any = null) {
    try {
      const val = this.fromJSON(this.addPrefix(key));

      if (val === null) {
        return fallback;
      }

      return val;
    } catch (e) {
      this.throwError(e);
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
      this.throwError(e);
    }
  }

  async remember <T = any>(key: string, closure: () => Promise<T>, options: SetterOptions = {}): Promise<T> {
    let val = this.get(key, null);

    if (val !== null) {
      return val;
    }

    try {
      val = await closure();
      this.set(key, val, options);

      return val;
    } catch (e) {
      this.throwError(e);
    }
  }

  remove (key: string): void {
    try {
      this.driver.removeItem(this.addPrefix(key));
    } catch (e) {
      this.throwError(e);
    }
  }

  clear (force = false): void {
    try {
      if (force) {
        this.driver.clear();
      } else {
        const keys = this.keys().filter((key) => key.startsWith(this.options.prefix || ''));
        keys.forEach((key) => this.remove(this.removePrefix(key)));
      }
    } catch (e) {
      this.throwError(e);
    }
  }

  has (key: string): boolean {
    this.removeExpiredValuesByKeys([this.addPrefix(key)]);

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
      this.throwError(e);
    }
  }

  keys (): string[] {
    let keys: string[] = [];

    switch(this.options.driver) {
    case StorageDriver.MEMORY:
      keys = Object.keys(this.driver.storage);
      break;
    default:
      keys = Object.keys(this.driver);
      break;
    }

    return keys.filter(key => {
      return this.fromJSON(key) !== null;
    });
  }

  private checkConfig (config: StorageOptions): void {
    if (config.prefix !== undefined) {
      if (typeof config.prefix !== 'string') {
        this.throwError(new TypeError('Option "prefix" must be a string'));
      }
    }

    if (config.driver !== undefined) {
      if (!availableDrivers.includes(config.driver)) {
        this.throwError(new TypeError(`Option "driver" must be one of ${availableDrivers.join(', ')}`));
      }
    }

    if (config.ttl !== undefined) {
      if (typeof config.ttl !== 'number') {
        this.throwError(new TypeError('Option "ttl" must be a number'));
      }
    }

    if (config.replacer !== undefined) {
      if (typeof config.replacer !== 'function') {
        this.throwError(new TypeError('Option "replacer" must be a function'));
      }
    }
  }

  private addPrefix (key: string): string {
    return `${this.options.prefix || ''}${this.removePrefix(key)}`;
  }

  private removePrefix (key: string): string {
    const re = new RegExp(`^${this.options.prefix || ''}`);

    return key.replace(re, '');
  }

  private toJSON (data: any, options: SetterOptions = {}): string {
    const ttl = ('ttl' in options) ? options.ttl : this.options.ttl;
    const { replacer } = this.options;

    return JSON.stringify({
      value: data,
      ttl: ttl > 0 ? ttl + Date.now() : 0,
    },                    (key: string, value: any): string => {
      if (!replacer || key !== 'value') {
        return value;
      }

      return replacer(key, value);
    });
  }

  private fromJSON (key: string): any {
    try {
      this.removeExpiredValuesByKeys([key]);

      const data: Record<string, any> | null = JSON.parse(this.driver.getItem(key));

      if (data !== null) {
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

  private removeExpiredValuesByKeys (keys: string[]): void {
    try {
      keys.forEach(key => {
        const data: Record<string, any> | null = JSON.parse(this.driver.getItem(key));

        if (data === null) {
          return;
        }

        if (('ttl' in data)
        && Number(data.ttl) > 0
        && Number(data.ttl) < Date.now()
        ) {
          this.remove(this.removePrefix(key));
        }
      });
    } catch (e) {
      return null;
    }
  }

  private throwError (e: Error): void {
    throw new StorageError(`${this.name}[${this.version}]: ${e.message}`, e.stack);
  }
}
