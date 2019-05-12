# Установка

### Прямая загрузка / CDN

https://unpkg.com/vue2-storage/dist/vue2-storage

[unpkg.com](https://unpkg.com) предоставляет ссылки на CDN на основе NPM. Вышеуказанная ссылка всегда указывает на последнюю версию NPM пакета. Вы также можете использовать конкретную версию/тег через URL-адрес, например https://unpkg.com/vue2-storage@{{book.packageVersion}}/dist/vue2-storage.js

Подключите vue2-storage после Vue и используйте согласно документации:

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

При использовании с модульной системой вы должны явно установить `vue2-storage` через` Vue.use()`:

```javascript
import Vue from 'vue'
import Vue2Storage from 'vue2-storage'

Vue.use(Vue2Storage)
```

Вам не нужно делать это при подключении скриптов глобально.

### Dev Build

Вам нужно будет клонировать непосредственно из GitHub и самостоятельно собирать `vue2-storage`, если
вы хотите использовать последнюю `dev` версию.

    $ git clone https://github.com/yarkovaleksei/vue2-storage.git node_modules/vue2-storage
    $ cd node_modules/vue2-storage
    $ yarn
    $ yarn build
