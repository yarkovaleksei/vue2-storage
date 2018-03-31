# Getting Started

> We will be using [ES2015](https://github.com/lukehoban/es6features) in the code samples in the guide.


### HTML

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue2-storage/dist/vue2-storage.js"></script>

<div id="#app">
  <!-- TODO: here the outputs -->
</div>

<script>
  // You can specify the plug-in configuration when connecting, passing the second object to Vue.use
  window.Vue.use(window.Vue2Storage, {
    prefix: 'app_',
    driver: 'local',
    ttl: 60 * 60 * 24 * 1000 // 24 hours
  })

  new Vue({
    el: '#app',
    created () {
      // The configuration of the plugin can be changed at any time.
      // Just call the setOptions method and pass the object with the settings to it.
      this.$storage.setOptions({
        prefix: 'app_',
        driver: 'local',
        ttl: 60 * 60 * 24 * 1000 // 24 hours
      })
    }
  }).$mount('#app')
</script>
```

### JavaScript

```javascript
// If using a module system (e.g. via vue-cli), import Vue and Vue2Storage and then call Vue.use(Vue2Storage).
import Vue from 'vue'
import Vue2Storage from 'vue2-storage'

// You can specify the plug-in configuration when connecting, passing the second object to Vue.use
Vue.use(Vue2Storage, {
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000
})

// TODO: here the example

// Now the app has started!
new Vue({
  el: '#app',
  created () {
    // The configuration of the plugin can be changed at any time.
    // Just call the setOptions method and pass the object with the settings to it.
    this.$storage.setOptions({
      prefix: 'app_',
      driver: 'local',
      ttl: 60 * 60 * 24 * 1000
    })
  }
}).$mount('#app')
```

```html
<div id="#app">
  <!-- TODO: here the outputs -->
</div>
```
