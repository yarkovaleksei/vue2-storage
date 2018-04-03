/* @flow */

const storage: Object = {}

class MemoryStorage implements MemoryStorageInterface {
  get length (): number {
    return Object.keys(this.storage).length
  }

  get storage (): Object {
    return storage
  }

  getItem (key: string): string | null {
    return (key in this.storage) ? this.storage[key] : null
  }

  setItem (key: string, value: any): void {
    this.storage[key] = value
  }

  removeItem (key: string) {
    const found = (key in this.storage)
    if (found) {
      delete this.storage[key]
    }
  }

  clear () {
    for (const k in this.storage) {
      delete this.storage[k]
    }
  }

}

export default new MemoryStorage()
