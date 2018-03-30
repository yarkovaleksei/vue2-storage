/*!
 * vue2-storage v1.0.0 
 * (c) 2018 Yarkov Aleksey
 * Released under the MIT License.
 */
/*  */

/*  */

var Storage = function Storage (config) {
  if ( config === void 0 ) config = {};

  this.version = '1.0.0';
  this.name = "vue2-storage[v" + (this.version) + "]";
  var options = Object.assign({
    storage: 'local',
    ttl: 60 * 60 * 24 * 1000 // 24 hours
  }, config);
  this.options = Object.freeze(options);
  switch (this.options.storage) {
    case 'local':
        this.storage = window.localStorage;
        break
    case 'session':
      this.storage = window.sessionStorage;
      break
    default:
      this.storage = window.localStorage;
      break
  }
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
    var data = JSON.parse(this.storage.getItem(key));
    if (data && data.ttl >= Date.now()) {
      return data.value
    }
    this.remove(key);
    return null
  } catch (e) {
    return null
  }
};

Storage.prototype.printError = function printError (e) {
  console.error(((this.name) + ": " + (e.stack)));
};

Storage.prototype.get = function get (key) {
  try {
    return this.fromJSON(key)
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.set = function set (key, val, options) {
    if ( options === void 0 ) options = {};

  try {
    this.storage.setItem(key, this.toJSON(val, options));
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.remove = function remove (key) {
  try {
    this.storage.removeItem(key);
  } catch (e) {
    this.printError(e);
  }
};

Storage.prototype.clear = function clear () {
  try {
    this.storage.clear();
  } catch (e) {
    this.printError(e);
  }
};

/*  */

function Vue2Storage (Vue, options) {
  Vue.prototype.$storage = new Storage(options || {});
}

window.Vue2Storage = Vue2Storage;

export default Vue2Storage;
