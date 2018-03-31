/* @flow */

import type { StorageOptions, SetterOptions, StorageInterface } from './types'

class Storage implements StorageInterface {
  name: string;
  version: string;
  options: StorageOptions;
  driver: any;

  constructor (config: StorageOptions = {}) {
    this.version = '__VERSION__'
    this.name = '__NAME__[v__VERSION__]'
    this.setOptions(config)
    switch (this.options.driver) {
      case 'local':
        this.driver = window.localStorage
        break
      case 'session':
        this.driver = window.sessionStorage
        break
      default:
        this.driver = window.localStorage
        break
    }
  }

  setOptions (config: StorageOptions = {}): void {
    const options = Object.assign({
      prefix: '',
      driver: 'local',
      ttl: 60 * 60 * 24 * 1000 // 24 hours
    }, config)
    this.options = Object.freeze(options)
  }

  keyPrefix (key: string): string {
    return `${this.options.prefix || ''}${key}`
  }

  toJSON (data: any, options: SetterOptions = {}): string {
    const ttl = ('ttl' in options) ? options.ttl : this.options.ttl
    return JSON.stringify({
      value: data,
      ttl: Date.now() + ttl
    })
  }

  fromJSON (key: string): any {
    switch (this.options.driver) {
      case 'local':
      case 'session':
        try {
          const data: Object = JSON.parse(this.driver.getItem(key))
          if (data && data.ttl >= Date.now()) {
            return data.value
          }
          this.remove(key)
          return null
        } catch (e) {
          return null
        }
      default:
        return null
    }
  }

  printError (e: Error): void {
    console.error(`${this.name}: ${e.stack}`)
  }

  get (key: string) {
    try {
      return this.fromJSON(this.keyPrefix(key))
    } catch (e) {
      this.printError(e)
    }
  }

  set (key: string, val: any, options: SetterOptions = {}): void {
    try {
      this.driver.setItem(this.keyPrefix(key), this.toJSON(val, options))
    } catch (e) {
      this.printError(e)
    }
  }

  remove (key: string): void {
    switch (this.options.driver) {
      case 'local':
      case 'session':
      default:
        try {
          this.driver.removeItem(this.keyPrefix(key))
        } catch (e) {
          this.printError(e)
        }
        break
    }
  }

  clear (): void {
    switch (this.options.driver) {
      case 'local':
      case 'session':
      default:
        try {
          this.driver.clear()
        } catch (e) {
          this.printError(e)
        }
        break
    }
  }

  has (key: string): boolean {
    switch (this.options.driver) {
      case 'local':
      case 'session':
        return (this.keyPrefix(key) in this.driver)
      default:
        return false
    }
  }

  keys (): Array<string> {
    switch (this.options.driver) {
      case 'local':
      case 'session':
        return Object.keys(this.driver)
      default:
        return []
    }
  }

  length (): number {
    return this.keys().length
  }
}

export default Storage
