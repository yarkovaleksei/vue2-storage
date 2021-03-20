# Using without Vue

> We will be using [ES2015](https://github.com/lukehoban/es6features) in the code samples in the guide.


### HTML

```html
<script src="https://unpkg.com/vue2-storage/dist/vue2-storage.js"></script>

<script>
  // You can specify the storage configuration when instantiating the class
  const storage = window.Vue2Storage({
    prefix: 'app_',
    driver: 'local',
    ttl: 60 * 60 * 24 * 1000, // 24 часа
    replacer: (key, value) => value
  });

  storage.set('key', 'value');
  console.log(storage.get('key')); // value

  // The configuration of the storage can be changed at any time.
  // Just call the setOptions method and pass the object with the settings to it.
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
// If you are using a modular system then import the Vue2Storage class
import Vue2Storage from 'vue2-storage';

// You can specify the storage configuration when instantiating the class
const storage = Vue2Storage({
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000, // 24 часа
  replacer: (key, value) => value
});

storage.set('key', 'value');
console.log(storage.get('key')); // value

// The configuration of the storage can be changed at any time.
// Just call the setOptions method and pass the object with the settings to it.
storage.setOptions({
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000, // 24 часа
  replacer: (key, value) => value.repeat(2)
});

storage.set('key', 'value');
console.log(storage.get('key')); // valuevalue
```
