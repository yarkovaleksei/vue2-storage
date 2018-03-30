/* @flow */

import { StorageInterface } from './interface'

export type StorageOptions = {
  storage?: string,
  ttl?: number
}

class Storage implements StorageInterface {
  name: string
  version: string
  options: StorageOptions
  storage: any

  constructor (config: StorageOptions = {}) {
    this.version = '__VERSION__'
    this.name = `__NAME__[v${this.version}]`
    const options = Object.assign({
      storage: 'local',
      ttl: 60 * 60 * 1000
    }, config)
    this.options = Object.freeze(options)
    switch (this.options.storage) {
      case 'local':
        this.storage = window.localStorage
        break
      case 'session':
        this.storage = window.sessionStorage
        break
      default:
        this.storage = window.localStorage
        break
    }
  }

  toJSON (data: any, options: StorageOptions = {}) {
    const ttl = ('ttl' in options) ? options.ttl : this.options.ttl
    return JSON.stringify({
      value: data,
      ttl: Date.now() + ttl
    })
  }

  fromJSON (key: string) {
    try {
      const data: Object = JSON.parse(this.storage.getItem(key))
      if (data && data.ttl >= Date.now()) {
        return data.value
      }
      this.remove(key)
      return null
    } catch (e) {
      return null
    }
  }

  printError (e: Error) {
    console.error(`${this.name}: ${e.stack}`)
  }

  get (key: string) {
    try {
      return this.fromJSON(key)
    } catch (e) {
      this.printError(e)
    }
  }

  set (key: string, val: any, options: StorageOptions = {}) {
    try {
      this.storage.setItem(key, this.toJSON(val, options))
    } catch (e) {
      this.printError(e)
    }
  }

  remove (key: string) {
    try {
      this.storage.removeItem(key)
    } catch (e) {
      this.printError(e)
    }
  }

  clear () {
    try {
      this.storage.clear()
    } catch (e) {
      this.printError(e)
    }
  }
}

export default Storage
