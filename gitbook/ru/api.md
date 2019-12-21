# Методы

### setOptions

Метод позволяет переопределить настройки плагина после инициализации.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `config` | Структура описана [здесь](options.md) | Значения описаны [здесь](options.md)     | -        |          |

Пример:

```javascript
export default {
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
| `fallback`    | `*` |          | -        |          |

Пример:

```javascript
export default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    const data = this.$storage.get('test')
    const fallback = this.$storage.get('unknown', 'fallback') // Not in storage
    console.log(data) // { key: 'value' }
    console.log(fallback) // "fallback"
  }
}
```

Возвращаемое значение: `Any`

_В случае неудачи метод выбросит исключение `StorageError`_

### pull

Метод позволяет извлечь значение и удалить его из хранилища, используя строковый ключ.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |
| `fallback`    | `*` |          | -        |          |

Пример:

```javascript
export default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    const data = this.$storage.pull('test')
    const fallback = this.$storage.get('test', 'fallback') // Извлекаем и удаляем из хранилища
    console.log(data) // { key: 'value' }
    console.log(fallback) // "fallback"
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
export default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    const data = this.$storage.get('test')
    console.log(data) // { key: 'value' }
  }
}
```

_В случае неудачи метод выбросит исключение `StorageError`_

### remember

Метод позволяет получить элемент. Если переданный ключ уже существует, то метод немедленно вернет его значение.
В противном случае переданная функция выполняется и ее возвращаемое значение сохраняется в хранилище перед его возвратом.

Аргументы:

|   name   |   type         | default  | required | allow values |
|----------|----------------|----------|----------|----------|
| `key`    | `String`       |          | +        |          |
| `closure`| `Promise<any>` |          | +        |          |
| `options`| `Object`       |  `{}`    | -        | `{ ttl: number }`|

Пример:

```javascript
export default {
  async created () {
    const data = await this.$storage.remember('test', async () => {
        // Делаем HTTP-запросы или другие асинхронные вещи
        return 'value'
    })
    console.log(data) // выведет "value"
  }
}
```

Возвращаемое значение: `Any`

_В случае неудачи метод выбросит исключение `StorageError`_

### remove

Метод позволяет удалить значение из хранилища по строковому ключу.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |

Пример:

```javascript
export default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    this.$storage.remove('test')
    const data = this.$storage.get('test')
    console.log(data) // null
  }
}
```

_В случае неудачи метод выбросит исключение `StorageError`_

### clear

Метод позволяет очистить хранилище.
Если передан аргумент `force` со значением `true`, то будет очищено все хранилище.
В противном случае будут удалены только значения, ключ которых начинается с префикса, указанного в настройках.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `force`  | `Boolean`| `false`  | -        |          |

Пример:

```javascript
export default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    this.$storage.clear()
    const data = this.$storage.get('test')
    console.log(data) // null
  }
}
```

_В случае неудачи метод выбросит исключение `StorageError`_

### has

Метод позволяет узнать существует ли в хранилище запись с указанным ключом.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |

Пример:

```javascript
export default {
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

### key

Метод возвращает значение по числовому индексу ключа.

Аргументы:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `index`  | `Number` |          | +        |          |

Пример:

```javascript
export default {
  created () {
    this.$storage.set('test', 'value')
    const key = this.$storage.key(0)
    console.log(key) // 'value'
  }
}
```

Возвращаемое значение: `Any`

_В случае неудачи метод выбросит исключение `StorageError`_

### keys

Метод возвращает массив ключей хранилища.

Пример:

```javascript
export default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    this.$storage.set('lol', { key: 'value' }, { ttl: 60 * 1000 })
    const keys = this.$storage.keys()
    console.log(keys) // ['test', 'lol']
  }
}
```

Возвращаемое значение: `Array<string>`

- - -

# Свойства

### length

Возвращает количество записей в хранилище.

Пример:

```javascript
export default {
  created () {
    this.$storage.set('test', { key: 'value' })
    this.$storage.set('lol', { key: 'value' })
    console.log(this.$storage.length) // 2
  }
}
```

Возвращаемое значение: `Number`

- - -

### prefix

Возвращает префикс записей в хранилище.

Пример:

```javascript
export default {
  created () {
    this.$storage.setOptions({
      prefix: 'app_',
      driver: 'local',
      ttl: 60 * 60 * 24 * 1000 // 24 часа
    })
    console.log(this.$storage.prefix) // app_
  }
}
```

Возвращаемое значение: `String`
