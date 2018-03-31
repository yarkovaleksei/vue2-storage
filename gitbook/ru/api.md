# Методы

### setOptions

Метод позволяет переопределить настройки плагина после инициализации.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `config` | Структура описана [здесь](options.md) | Значения описаны [здесь](options.md)     | -        |          |

Пример:

```javascript
expoft default {
  created () {
    this.$storage.setOptions({
      prefix: 'app_',
      driver: 'local',
      ttl: 60 * 60 * 24 * 1000 // 24 часа
    })
  }
}
```

### get

Метод позволяет получить значение из хранилища по строковому ключу.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    const data = this.$storage.get('test')
    console.log(data) // { key: 'value' }
  }
}
```

Возвращаемое значение: `Any`

### set

Метод позволяет записать значение в хранилище, указав строковой ключ и время жизни.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |
| `data`   | `*`      |          | +        |          |
| `options`| `Object` |  `{}`    | -        | `{ ttl: number }`|

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    const data = this.$storage.get('test')
    console.log(data) // { key: 'value' }
  }
}
```

### remove

Метод позволяет удалить значение из хранилища по строковому ключу.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    this.$storage.remove('test')
    const data = this.$storage.get('test')
    console.log(data) // null
  }
}
```

### clear

Метод позволяет очистить хранилище.

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    this.$storage.clear()
    const data = this.$storage.get('test')
    console.log(data) // null
  }
}
```

### has

Метод позволяет узнать существует ли в хранилище запись с указанным ключом.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    const hasTest = this.$storage.has('test')
    const hasLol = this.$storage.has('lol')
    console.log(hasTest) // true
    console.log(hasLol) // false
  }
}
```

Возвращаемое значение: `Boolean`

### keys

Метод возвращает массив ключей хранилища.

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    this.$storage.set('lol', { key: 'value' }, { ttl: 60 * 1000 })
    const keys = this.$storage.keys()
    console.log(keys) // ['test', 'lol']
  }
}
```

Возвращаемое значение: `Array<string>`

### length

Метод возвращает количество ключей в хранилище.

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    this.$storage.set('lol', { key: 'value' }, { ttl: 60 * 1000 })
    const length = this.$storage.length()
    console.log(length) // 2
  }
}
```

Возвращаемое значение: `Number`
