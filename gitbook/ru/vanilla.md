# Использование без Vue

> Мы будем использовать [ES2015](https://github.com/lukehoban/es6features) в примерах кода в руководстве.


### HTML

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue2-storage/dist/vue2-storage.js"></script>

<script>
  // Вы можете указать конфигурацию хранилища при создании экземпляра класса
  const storage = window.Vue2Storage({
    prefix: 'app_',
    driver: 'local',
    ttl: 60 * 60 * 24 * 1000, // 24 часа
    replacer: (key, value) => value
  });

  storage.set('key', 'value');
  console.log(storage.get('key')); // value

  // Конфигурация хранилища может быть изменена в любой момент.
  // Просто вызовите метод setOptions и передайте в него объект с настройками.
  storage.setOptions({
    prefix: 'app_',
    driver: 'local',
    ttl: 60 * 60 * 24 * 1000, // 24 часа
    replacer: (key, value) => value.repeat(2)
  });

  storage.set('key', 'value');
  console.log(storage.get('key')); // valuevalue
</script>
```

### JavaScript

```javascript
// Если вы используете модульную систему, то импортируйте класс Vue2Storage
import Vue2Storage from 'vue2-storage';

// Вы можете указать конфигурацию хранилища при создании экземпляра класса
const storage = Vue2Storage({
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000, // 24 часа
  replacer: (key, value) => value
});

storage.set('key', 'value');
console.log(storage.get('key')); // value

// Конфигурация хранилища может быть изменена в любой момент.
// Просто вызовите метод setOptions и передайте в него объект с настройками.
storage.setOptions({
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000, // 24 часа
  replacer: (key, value) => value.repeat(2)
});

storage.set('key', 'value');
console.log(storage.get('key')); // valuevalue
```
