import { Dictionary } from './types';

const storage: Dictionary<any> = {};

class MemoryStorage {
  get length (): number {
    return Object.keys(this.storage).length;
  }

  get storage (): Dictionary {
    return storage;
  }

  getItem (key: string): string | null {
    return (key in this.storage) ? this.storage[key] : null;
  }

  setItem (key: string, value: any): void {
    this.storage[key] = value;
  }

  removeItem (key: string) {
    if (key in this.storage) {
      delete this.storage[key];
    }
  }

  clear () {
    const keys = Object.keys(this.storage);

    for (let i = 0; i <= keys.length; i++) {
      try {
        delete this.storage[keys[i]];
      } catch {
        // pass
      }
    }
  }
}

export default new MemoryStorage();
