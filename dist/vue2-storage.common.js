/*!
 * vue2-storage v4.0.7 
 * (c) 2019 Yarkov Aleksey
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

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

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
        return '4.0.7';
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
            this.printError(e);
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
                this.printError(e);
            }
        });
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

class Vue2Storage$1 {
    static install(Vue, options) {
        const storage = new Vue2Storage(options);
        Vue.$storage = storage;
        Vue.prototype.$storage = storage;
    }
}
if (typeof window !== 'undefined') {
    // tslint:disable-next-line
    window['Vue2Storage'] = Vue2Storage$1;
}

exports.Vue2Storage = Vue2Storage$1;
exports.default = Vue2Storage$1;
