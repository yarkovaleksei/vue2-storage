/*!
 * vue2-storage v3.3.0 
 * (c) 2018 Yarkov Aleksey
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('object-assign')) :
  typeof define === 'function' && define.amd ? define(['object-assign'], factory) :
  (global.Vue2Storage = factory(global.objectAssign));
}(this, (function (objectAssign) { 'use strict';

objectAssign = 'default' in objectAssign ? objectAssign['default'] : objectAssign;

/*  */

var storage = {};

var MemoryStorage = function MemoryStorage () {};

var prototypeAccessors$1 = { length: {},storage: {} };

prototypeAccessors$1.length.get = function () {
  return Object.keys(this.storage).length
};

prototypeAccessors$1.storage.get = function () {
  return storage
};

MemoryStorage.prototype.getItem = function getItem (key) {
  return (key in this.storage) ? this.storage[key] : null
};

MemoryStorage.prototype.setItem = function setItem (key, value) {
  this.storage[key] = value;
};

MemoryStorage.prototype.removeItem = function removeItem (key) {
  var found = (key in this.storage);
  if (found) {
    delete this.storage[key];
  }
};

MemoryStorage.prototype.clear = function clear () {
    var this$1 = this;

  for (var k in this.storage) {
    delete this$1.storage[k];
  }
};

Object.defineProperties( MemoryStorage.prototype, prototypeAccessors$1 );

var MemoryStorage$1 = new MemoryStorage();

/*  */

var Storage = function Storage (config) {
  if ( config === void 0 ) config = {};

  this.setOptions(config);
};

var prototypeAccessors = { name: {},version: {},length: {},driver: {} };

prototypeAccessors.name.get = function () {
  return 'vue2-storage[v3.3.0]'
};

prototypeAccessors.version.get = function () {
  return '3.3.0'
};

prototypeAccessors.length.get = function () {
  return this.keys().length
};

prototypeAccessors.driver.get = function () {
  switch (this.options.driver) {
    case 'local':
    default:
      return (typeof window !== 'undefined') ? window.localStorage : MemoryStorage$1
    case 'session':
      return (typeof window !== 'undefined') ? window.sessionStorage : MemoryStorage$1
    case 'memory':
      return MemoryStorage$1
  }
};

Storage.prototype.setOptions = function setOptions (config) {
    if ( config === void 0 ) config = {};

  var options = objectAssign({
    prefix: 'app_',
    driver: 'local',
    ttl: 60 * 60 * 24 * 1000 // 24 hours
  }, config);
  this.options = Object.freeze(options);
};

Storage.prototype.printError = function printError (e) {
  console.error(((this.name) + ": " + (e.stack)));
};

Storage.prototype.addPrefix = function addPrefix (key) {
  return ("" + (this.options.prefix || '') + key)
};

Storage.prototype.removePrefix = function removePrefix (key) {
  var re = new RegExp(("^" + (this.options.prefix || '')));
  return key.replace(re, '')
};

Storage.prototype.toJSON = function toJSON (data, options) {
    if ( options === void 0 ) options = {};

  var ttl = ('ttl' in options) ? options.ttl : this.options.ttl;
  return JSON.stringify({
    value: data,
    ttl: Date.now() + ttl
  })
};

Storage.prototype.fromJSON = function fromJSON (key) {
  try {
    var data = JSON.parse(this.driver.getItem(key));
    if (data !== null) {
      if (('ttl' in data) &&
        Number(data.ttl) < Date.now()) {
        this.remove(this.removePrefix(key));
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
};

Storage.prototype.get = function get (key, fallback) {
    if ( fallback === void 0 ) fallback = null;

  try {
    var val = this.fromJSON(this.addPrefix(key));
    if (val === null) {
      return fallback
    }
    return val
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.set = function set (key, val, options) {
    if ( options === void 0 ) options = {};

  try {
    this.driver.setItem(this.addPrefix(key), this.toJSON(val, options));
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.remove = function remove (key) {
  try {
    this.driver.removeItem(this.addPrefix(key));
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.clear = function clear (force) {
    var this$1 = this;
    if ( force === void 0 ) force = false;

  try {
    if (force) {
      this.driver.clear();
    } else {
      var keys = this.keys().filter(function (key) { return key.startsWith(this$1.options.prefix || ''); });
      keys.forEach(function (key) { return this$1.remove(this$1.removePrefix(key)); });
    }
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.has = function has (key) {
  if (this.options.driver !== 'memory') {
    return (this.addPrefix(key) in this.driver)
  }
  return (this.addPrefix(key) in this.driver.storage)
};

Storage.prototype.key = function key (index) {
  try {
    var key = this.keys()[index];
    return this.get(this.removePrefix(key))
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.keys = function keys () {
  if (this.options.driver !== 'memory') {
    return Object.keys(this.driver)
  }
  return Object.keys(this.driver.storage)
};

Object.defineProperties( Storage.prototype, prototypeAccessors );

/*  */

function Vue2Storage (Vue, options) {
  var storage = new Storage(options);
  Vue['$storage'] = storage;
  Vue.prototype.$storage = storage;
}

window.Vue2Storage = Vue2Storage;

return Vue2Storage;

})));
