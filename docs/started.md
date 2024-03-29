# Начало использования

> Мы будем использовать [ES2015](https://github.com/lukehoban/es6features) в примерах кода в руководстве.


### HTML

```html
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js"></script>
<script src="https://unpkg.com/vue2-storage/dist/vue2-storage.js"></script>

<div id="app"></div>

<script>
  // Вы можете указать конфигурацию плагина при подключении, передав в Vue.use вторым аргументом объект с настройками
  window.Vue.use(window.Vue2StoragePlugin, {
    prefix: 'app_',
    driver: 'local',
    ttl: 60 * 60 * 24 * 1000, // 24 часа
    replacer: (key, value) => value
  })

  new window.Vue({
    el: '#app',
    created () {
      // Конфигурация плагина может быть изменена в любой момент.
      // Просто вызовите метод setOptions и передайте в него объект с настройками.
      this.$storage.setOptions({
        prefix: 'app_',
        driver: 'local',
        ttl: 60 * 60 * 24 * 1000, // 24 часа
        replacer: (key, value) => value
      });
    }
  }).$mount('#app')
</script>
```

### JavaScript

```html
<div id="app"></div>
```

```javascript
// Если вы используете модульную систему (например via vue-cli), то импортируйте Vue и плагин Vue2Storage и подключите плагин через` Vue.use(Vue2Storage)`
import Vue from 'vue';
import { Plugin } from 'vue2-storage';

// Вы можете указать конфигурацию плагина при подключении, передав в Vue.use вторым аргументом объект с настройками
Vue.use(Plugin, {
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000, // 24 часа
  replacer: (key, value) => value
});

// Приложение запустилось!
new Vue({
  el: '#app',
  created () {
    // Конфигурация плагина может быть изменена в любой момент.
    // Просто вызовите метод setOptions и передайте в него объект с настройками.
    this.$storage.setOptions({
      prefix: 'app_',
      driver: 'local',
      ttl: 60 * 60 * 24 * 1000, // 24 часа
      replacer: (key, value) => value
    });
  }
}).$mount('#app');
```
