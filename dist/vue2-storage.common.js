/*!
 * vue2-storage v4.0.0 
 * (c) 2019 Yarkov Aleksey
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var objectAssign = _interopDefault(require('object-assign'));

const storage = {};
class MemoryStorage {
    get length() {
        return Object.keys(this.storage).length;
    }
    get storage() {
        return storage;
    }
    getItem(key) {
        return (key in this.storage) ? this.storage[key] : null;
    }
    setItem(key, value) {
        this.storage[key] = value;
    }
    removeItem(key) {
        if (key in this.storage) {
            delete this.storage[key];
        }
    }
    clear() {
        const keys = Object.keys(this.storage);
        for (let i = 0; i <= keys.length; i++) {
            try {
                delete this.storage[keys[i]];
            }
            catch (_a) {
                // pass
            }
        }
    }
}
var MemoryStorage$1 = new MemoryStorage();

var StorageDriver;
(function (StorageDriver) {
    StorageDriver["LOCAL"] = "local";
    StorageDriver["SESSION"] = "session";
    StorageDriver["MEMORY"] = "memory";
})(StorageDriver || (StorageDriver = {}));

class Vue2Storage {
    constructor(config = {}) {
        this.setOptions(config);
    }
    get length() {
        return this.keys().length;
    }
    get prefix() {
        return this.options.prefix;
    }
    get name() {
        return 'vue2-storage';
    }
    get version() {
        return '4.0.0';
    }
    get driver() {
        switch (this.options.driver) {
            case StorageDriver.LOCAL:
            default:
                return (typeof window !== 'undefined') ? window.localStorage : MemoryStorage$1;
            case StorageDriver.SESSION:
                return (typeof window !== 'undefined') ? window.sessionStorage : MemoryStorage$1;
            case StorageDriver.MEMORY:
                return MemoryStorage$1;
        }
    }
    static install(Vue, options) {
        const storage = new Vue2Storage(options);
        Vue.$storage = storage;
        Vue.prototype.$storage = storage;
    }
    setOptions(config = {}) {
        const options = objectAssign({
            prefix: 'app_',
            driver: StorageDriver.LOCAL,
            ttl: 60 * 60 * 24 * 1000,
        }, config);
        this.options = Object.freeze(options);
    }
    get(key, fallback = null) {
        try {
            const val = this.fromJSON(this.addPrefix(key));
            if (val === null) {
                return fallback;
            }
            return val;
        }
        catch (e) {
            this.printError(e);
        }
    }
    set(key, val, options = {}) {
        try {
            this.driver.setItem(this.addPrefix(key), this.toJSON(val, options));
        }
        catch (e) {
            this.printError(e);
        }
    }
    remove(key) {
        try {
            this.driver.removeItem(this.addPrefix(key));
        }
        catch (e) {
            this.printError(e);
        }
    }
    clear(force = false) {
        try {
            if (force) {
                this.driver.clear();
            }
            else {
                const keys = this.keys().filter((key) => key.startsWith(this.options.prefix || ''));
                keys.forEach((key) => this.remove(this.removePrefix(key)));
            }
        }
        catch (e) {
            this.printError(e);
        }
    }
    has(key) {
        if (this.options.driver !== StorageDriver.MEMORY) {
            return (this.addPrefix(key) in this.driver);
        }
        return (this.addPrefix(key) in this.driver.storage);
    }
    key(index) {
        try {
            const key = this.keys()[index];
            return this.get(this.removePrefix(key));
        }
        catch (e) {
            this.printError(e);
        }
    }
    keys() {
        if (this.options.driver !== StorageDriver.MEMORY) {
            return Object.keys(this.driver);
        }
        return Object.keys(this.driver.storage);
    }
    addPrefix(key) {
        return `${this.options.prefix || ''}${key}`;
    }
    removePrefix(key) {
        const re = new RegExp(`^${this.options.prefix || ''}`);
        return key.replace(re, '');
    }
    toJSON(data, options = {}) {
        const ttl = ('ttl' in options) ? options.ttl : this.options.ttl;
        return JSON.stringify({
            value: data,
            ttl: Date.now() + ttl,
        });
    }
    fromJSON(key) {
        try {
            const data = JSON.parse(this.driver.getItem(key));
            if (data !== null) {
                if (('ttl' in data) &&
                    Number(data.ttl) < Date.now()) {
                    this.remove(this.removePrefix(key));
                    return null;
                }
                if ('value' in data) {
                    return data.value;
                }
                return data;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    printError(e) {
        console.error(`${this.name}[${this.version}]: ${e.stack}`);
    }
}

if (typeof window !== 'undefined') {
    // tslint:disable-next-line
    window['Vue2Storage'] = Vue2Storage;
}

module.exports = Vue2Storage;
