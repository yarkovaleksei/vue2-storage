# Installation

### Direct Download / CDN

https://unpkg.com/vue2-storage/dist/vue2-storage

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vue2-storage@3.0.0/dist/vue2-storage.js.......

Include vue2-storage after Vue and use according to the documentation:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue2-storage/dist/vue2-storage.js"></script>
<script>
  window.Vue.use(window.Vue2Storage)
</script>
```

### NPM

    $ npm install vue2-storage

### Yarn

    $ yarn add vue2-storage

When used with a module system, you must explicitly install the `vue2-storage` via `Vue.use()`:

```javascript
import Vue from 'vue'
import Vue2Storage from 'vue2-storage'

Vue.use(Vue2Storage)
```

You don't need to do this when using global script tags.

### Dev Build

You will have to clone directly from GitHub and build `vue2-storage` yourself if
you want to use the latest dev build.

    $ git clone https://github.com/yarkovaleksei/vue2-storage.git node_modules/vue2-storage
    $ cd node_modules/vue2-storage
    $ npm install
    $ npm run build
