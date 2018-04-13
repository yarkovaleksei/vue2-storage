import Vue, { PluginFunction } from 'vue';

interface StorageOptions {
  prefix?: string,
  driver?: string,
  ttl?: number
}

interface SetterOptions {
  ttl?: number
}

export declare class VueStorage {
  static install: PluginFunction<StorageOptions>;
  readonly name: string;
  readonly version: string;
  readonly length: number;
  setOptions(config: StorageOptions): void;
  get(key: string, fallback?: any): any;
  set(key: string, data: any, options?: SetterOptions): void;
  remove(key: string): void;
  clear(force?: boolean): void;
  has(key: string): boolean;
  key(index: number): any;
  keys(): string[];
}

declare module 'vue/types/vue' {
  interface Vue   {
    $storage: VueStorage;
  }

  interface VueConstructor {
    $storage: VueStorage;
  }
}
