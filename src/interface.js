/* @flow */

import type StorageOptions from './storage'

export interface StorageInterface {
  +name: string;
  +version: string;
  -options: StorageOptions;
  - storage: any;
  get(key: string): any;
  set(key: string, data: any, options: StorageOptions): any;
  remove(key: string): void;
  clear(): void;
}
