/*!
 * vue2-storage v2.0.0 
 * (c) 2018 Yarkov Aleksey
 * Released under the MIT License.
 */
/*  */



var Storage = function Storage (config) {
  if ( config === void 0 ) config = {};

  this.version = '2.0.0';
  this.name = 'vue2-storage[v2.0.0]';
  this.setOptions(config);
  switch (this.options.driver) {
    case 'local':
      this.driver = window.localStorage;
      break
    case 'session':
      this.driver = window.sessionStorage;
      break
    default:
      this.driver = window.localStorage;
      break
  }
};

Storage.prototype.setOptions = function setOptions (config) {
    if ( config === void 0 ) config = {};

  var options = Object.assign({
    prefix: '',
    driver: 'local',
    ttl: 60 * 60 * 24 * 1000 // 24 hours
  }, config);
  this.options = Object.freeze(options);
};

Storage.prototype.keyPrefix = function keyPrefix (key) {
  return ("" + (this.options.prefix || '') + key)
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
  switch (this.options.driver) {
    case 'local':
    case 'session':
      try {
        var data = JSON.parse(this.driver.getItem(key));
        if (data && data.ttl >= Date.now()) {
          return data.value
        }
        this.remove(key);
        return null
      } catch (e) {
        return null
      }
    default:
      return null
  }
};

Storage.prototype.printError = function printError (e) {
  console.error(((this.name) + ": " + (e.stack)));
};

Storage.prototype.get = function get (key) {
  try {
    return this.fromJSON(this.keyPrefix(key))
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.set = function set (key, val, options) {
    if ( options === void 0 ) options = {};

  try {
    this.driver.setItem(this.keyPrefix(key), this.toJSON(val, options));
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.remove = function remove (key) {
  switch (this.options.driver) {
    case 'local':
    case 'session':
    default:
      try {
        this.driver.removeItem(this.keyPrefix(key));
      } catch (e) {
        this.printError(e);
      }
      break
  }
};

Storage.prototype.clear = function clear () {
  switch (this.options.driver) {
    case 'local':
    case 'session':
    default:
      try {
        this.driver.clear();
      } catch (e) {
        this.printError(e);
      }
      break
  }
};

Storage.prototype.has = function has (key) {
  switch (this.options.driver) {
    case 'local':
    case 'session':
      return (this.keyPrefix(key) in this.driver)
    default:
      return false
  }
};

Storage.prototype.keys = function keys () {
  switch (this.options.driver) {
    case 'local':
    case 'session':
      return Object.keys(this.driver)
    default:
      return []
  }
};

Storage.prototype.length = function length () {
  return this.keys().length
};

/*  */

function Vue2Storage (Vue, options) {
  Vue.prototype.$storage = new Storage(options || {});
}

window.Vue2Storage = Vue2Storage;

export default Vue2Storage;
