import { PluginFunction } from 'vue';

export interface StorageOptions {
  prefix?: string
  driver?: StorageDriver
  ttl?: number
}

export interface SetterOptions {
  ttl?: number
}

export enum StorageDriver {
  LOCAL   = 'local',
  SESSION = 'session',
  MEMORY  = 'memory',
}

export type Dictionary<T = any> = { [index: string]: T };

export declare class Vue2Storage {
  static install: PluginFunction<StorageOptions>;
  readonly length: number;
  readonly prefix: string;
  setOptions (config: StorageOptions): void;
  get (key: string, fallback?: any): any;
  set (key: string, data: any, options?: SetterOptions): void;
  remove (key: string): void;
  clear (force?: boolean): void;
  has (key: string): boolean;
  key (index: number): any;
  keys (): string[];
}

declare module 'vue/types/vue' {
  interface Vue   {
    $storage: Vue2Storage;
  }

  interface VueConstructor {
    $storage: Vue2Storage;
  }
}
