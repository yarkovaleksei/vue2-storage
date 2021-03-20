/*!
 * vue2-storage v6.0.0 
 * (c) 2021 Yarkov Aleksey
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

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

class StorageError extends Error {
    constructor(message, stack) {
        super(message);
        this.name = 'StorageError';
        if (stack) {
            this.stack = stack;
        }
    }
}

const availableDrivers = ['local', 'session', 'memory'];
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
        return '6.0.0';
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
    setOptions(config = {}) {
        this.checkConfig(config);
        this.options = Object.freeze({
            prefix: config.prefix || 'app_',
            driver: config.driver || StorageDriver.LOCAL,
            ttl: config.ttl || 0,
            replacer: config.replacer || undefined,
        });
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
            this.throwError(e);
        }
    }
    pull(key, fallback = null) {
        const val = this.get(key, fallback);
        if (val !== fallback) {
            this.remove(key);
        }
        return val;
    }
    set(key, val, options = {}) {
        try {
            this.driver.setItem(this.addPrefix(key), this.toJSON(val, options));
        }
        catch (e) {
            this.throwError(e);
        }
    }
    remember(key, closure, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let val = this.get(key, null);
            if (val !== null) {
                return val;
            }
            try {
                val = yield closure();
                this.set(key, val, options);
                return val;
            }
            catch (e) {
                this.throwError(e);
            }
        });
    }
    remove(key) {
        try {
            this.driver.removeItem(this.addPrefix(key));
        }
        catch (e) {
            this.throwError(e);
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
            this.throwError(e);
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
            this.throwError(e);
        }
    }
    keys() {
        if (this.options.driver !== StorageDriver.MEMORY) {
            return Object.keys(this.driver);
        }
        return Object.keys(this.driver.storage);
    }
    checkConfig(config) {
        if (config.prefix !== undefined) {
            if (typeof config.prefix !== 'string') {
                this.throwError(new TypeError('Option "prefix" must be a string'));
            }
        }
        if (config.driver !== undefined) {
            if (!availableDrivers.includes(config.driver)) {
                this.throwError(new TypeError(`Option "driver" must be one of ${availableDrivers.join(', ')}`));
            }
        }
        if (config.ttl !== undefined) {
            if (typeof config.ttl !== 'number') {
                this.throwError(new TypeError('Option "ttl" must be a number'));
            }
        }
        if (config.replacer !== undefined) {
            if (typeof config.replacer !== 'function') {
                this.throwError(new TypeError('Option "replacer" must be a function'));
            }
        }
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
        const { replacer } = this.options;
        return JSON.stringify({
            value: data,
            ttl: ttl > 0 ? ttl + Date.now() : 0,
        }, (key, value) => {
            if (!replacer || key !== 'value') {
                return value;
            }
            return replacer(key, value);
        });
    }
    fromJSON(key) {
        try {
            const data = JSON.parse(this.driver.getItem(key));
            if (data !== null) {
                if (('ttl' in data)
                    && Number(data.ttl) > 0
                    && Number(data.ttl) < Date.now()) {
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
    throwError(e) {
        throw new StorageError(`${this.name}[${this.version}]: ${e.message}`, e.stack);
    }
}

class Plugin {
    static install(Vue, options) {
        const storage = new Vue2Storage(options);
        Vue.$storage = storage;
        Vue.prototype.$storage = storage;
    }
}
if (typeof window !== 'undefined') {
    window['Vue2StoragePlugin'] = Plugin;
    window['Vue2Storage'] = Vue2Storage;
}

exports.Plugin = Plugin;
exports.default = Vue2Storage;
