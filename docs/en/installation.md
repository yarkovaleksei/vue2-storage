# Installation

### Direct Download / CDN

https://unpkg.com/vue2-storage/dist/vue2-storage

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/vue2-storage@6.1.3/dist/vue2-storage.js

Include vue2-storage after Vue and use according to the documentation:

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js"></script>
<script src="https://unpkg.com/vue2-storage/dist/vue2-storage.js"></script>
<script>
  window.Vue.use(window.Vue2StoragePlugin)
</script>
```

### NPM

```bash
$ npm install vue2-storage
```

### Yarn

```bash
$ yarn add vue2-storage
```

When used with a module system, you must explicitly install the `vue2-storage` via `Vue.use()`:

```javascript
import Vue from 'vue';
import { Plugin } from 'vue2-storage';

Vue.use(Plugin);
// You can pass options
Vue.use(Plugin, {
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000, // 24 hours
  replacer: (key, value) => value
});
```

You don't need to do this when using global script tags.

### Dev Build

You will have to clone directly from GitHub and build `vue2-storage` yourself if
you want to use the latest dev build.

```bash
$ git clone https://github.com/yarkovaleksei/vue2-storage.git node_modules/vue2-storage
$ cd node_modules/vue2-storage
$ yarn
$ yarn build
```
