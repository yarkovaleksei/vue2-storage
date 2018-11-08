/* @flow */

import objectAssign from 'object-assign'
import MemoryStorage from './MemoryStorage'

class Storage implements StorageInterface {
  options: StorageOptions;

  constructor (config: StorageOptions = {}) {
    this.setOptions(config)
  }

  get name (): string {
    return '__NAME__[v__VERSION__]'
  }

  get version (): string {
    return '__VERSION__'
  }

  get length (): number {
    return this.keys().length
  }

  get driver (): typeof window.localStorage | typeof window.sessionStorage | typeof MemoryStorage {
    switch (this.options.driver) {
      case 'local':
      default:
        return (typeof window !== 'undefined') ? window.localStorage : MemoryStorage
      case 'session':
        return (typeof window !== 'undefined') ? window.sessionStorage : MemoryStorage
      case 'memory':
        return MemoryStorage
    }
  }

  setOptions (config: StorageOptions = {}): void {
    const options = objectAssign({
      prefix: 'app_',
      driver: 'local',
      ttl: 60 * 60 * 24 * 1000 // 24 hours
    }, config)
    this.options = Object.freeze(options)
  }

  printError (e: Error): void {
    console.error(`${this.name}: ${e.stack}`)
  }

  addPrefix (key: string): string {
    return `${this.options.prefix || ''}${key}`
  }

  removePrefix (key: string): string {
    const re = new RegExp(`^${this.options.prefix || ''}`)
    return key.replace(re, '')
  }

  toJSON (data: any, options: SetterOptions = {}): string {
    const ttl = ('ttl' in options) ? options.ttl : this.options.ttl
    return JSON.stringify({
      value: data,
      ttl: Date.now() + ttl
    })
  }

  fromJSON (key: string): any {
    try {
      const data: Object = JSON.parse(this.driver.getItem(key))
      if (data !== null) {
        if (('ttl' in data) &&
          Number(data.ttl) < Date.now()) {
          this.remove(this.removePrefix(key))
          return null
        }
        if ('value' in data) {
          return data.value
        }
        return data
      }
      return null
    } catch (e) {
      return null
    }
  }

  get (key: string, fallback: any = null) {
    try {
      const val = this.fromJSON(this.addPrefix(key))
      if (val === null) {
        return fallback
      }
      return val
    } catch (e) {
      this.printError(e)
    }
  }

  set (key: string, val: any, options: SetterOptions = {}): void {
    try {
      this.driver.setItem(this.addPrefix(key), this.toJSON(val, options))
    } catch (e) {
      this.printError(e)
    }
  }

  remove (key: string): void {
    try {
      this.driver.removeItem(this.addPrefix(key))
    } catch (e) {
      this.printError(e)
    }
  }

  clear (force: boolean = false): void {
    try {
      if (force) {
        this.driver.clear()
      } else {
        const keys = this.keys().filter(key => key.startsWith(this.options.prefix || ''))
        keys.forEach(key => this.remove(this.removePrefix(key)))
      }
    } catch (e) {
      this.printError(e)
    }
  }

  has (key: string): boolean {
    if (this.options.driver !== 'memory') {
      return (this.addPrefix(key) in this.driver)
    }
    return (this.addPrefix(key) in this.driver.storage)
  }

  key (index: number): any {
    try {
      const key = this.keys()[index]
      return this.get(this.removePrefix(key))
    } catch (e) {
      this.printError(e)
    }
  }

  keys (): Array<string> {
    if (this.options.driver !== 'memory') {
      return Object.keys(this.driver)
    }
    return Object.keys(this.driver.storage)
  }
}

export default Storage
