declare type StorageOptions = {
  prefix?: string,
  driver?: string,
  ttl?: number
}

declare type SetterOptions = {
  ttl?: number
}

declare interface StorageInterface {
  +name: string;
  +version: string;
  +length: number;
  +driver: any;
  options: StorageOptions;
  setOptions(config: StorageOptions): void;
  printError(e: Error): void;
  addPrefix(key: string): string;
  removePrefix(key: string): string;
  toJSON(data: any, options: StorageOptions): string;
  fromJSON(key: string): any;
  get(key: string, fallback: any): any;
  set(key: string, data: any, options: SetterOptions): void;
  remove(key: string): void;
  clear(force: boolean): void;
  has(key: string): boolean;
  key(index: number): any;
  keys(): Array<string>;
}

declare interface MemoryStorageInterface {
  +length: number;
  +storage: Object;
  getItem(key: string): any;
  setItem(key: string, data: any): void;
  removeItem(key: string): void;
  clear(): void;
}
