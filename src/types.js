/* @flow */

export type StorageOptions = {
  prefix?: string,
  driver?: string,
  ttl?: number
}

export type SetterOptions = {
  ttl?: number
}

export interface StorageInterface {
  name: string;
  version: string;
  options: StorageOptions;
  driver: any;
  setOptions(config: StorageOptions): void;
  keyPrefix(key: string): string;
  toJSON(data: any, options: StorageOptions): string;
  fromJSON(key: string): any;
  printError(e: Error): void;
  get(key: string): any;
  set(key: string, data: any, options: SetterOptions): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): Array<string>;
  length(): number;
}
