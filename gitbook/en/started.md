# Getting Started

> We will be using [ES2015](https://github.com/lukehoban/es6features) in the code samples in the guide.


### HTML

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue2-storage/dist/vue2-storage.js"></script>

<div id="app"></div>

<script>
  // You can specify the plug-in configuration when connecting, passing the second object to Vue.use
  window.Vue.use(window.Vue2StoragePlugin, {
    prefix: 'app_',
    driver: 'local',
    ttl: 60 * 60 * 24 * 1000, // 24 hours
    replacer: (key, value) => value
  });

  new window.Vue({
    el: '#app',
    created () {
      // The configuration of the plugin can be changed at any time.
      // Just call the setOptions method and pass the object with the settings to it.
      this.$storage.setOptions({
        prefix: 'app_',
        driver: 'local',
        ttl: 60 * 60 * 24 * 1000, // 24 hours
        replacer: (key, value) => value
      });
    }
  }).$mount('#app');
</script>
```

### JavaScript

```html
<div id="app"></div>
```

```javascript
// If using a module system (e.g. via vue-cli), import Vue and Vue2Storage plugin and then call Vue.use(Vue2Storage).
import Vue from 'vue';
import { Plugin } from 'vue2-storage';

// You can specify the plug-in configuration when connecting, passing the second object to Vue.use
Vue.use(Plugin, {
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000, // 24 hours
  replacer: (key, value) => value
});

// Now the app has started!
new Vue({
  el: '#app',
  created () {
    // The configuration of the plugin can be changed at any time.
    // Just call the setOptions method and pass the object with the settings to it.
    this.$storage.setOptions({
      prefix: 'app_',
      driver: 'local',
      ttl: 60 * 60 * 24 * 1000, // 24 hours
      replacer: (key, value) => value
    });
  }
}).$mount('#app');
```
