# Methods

### setOptions

The method allows you to override the plugin settings after initialization.

Arguments:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `config` | The structure is described [here](options.md) | The values are described [here](options.md)     | -        |          |

Example:

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

The method allows you to retrieve a value from the repository using a string key.

Arguments:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |
| `fallback`    | `*` |          | -        |          |

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', { key: 'value' }, { ttl: 60 * 1000 })
    const data = this.$storage.get('test')
    const fallback = this.$storage.get('unknown', 'fallback') // Not in storage
    console.log(data) // { key: 'value' }
    console.log(fallback) // "fallback"
  }
}
```

Return value: `Any`

### set

The method allows you to write the value in the store by specifying the string key and the lifetime.

Arguments:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |
| `data`   | `*`      |          | +        |          |
| `options`| `Object` |  `{}`    | -        | `{ ttl: number }`|

Example:

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

The method allows you to delete a value from the repository using a string key.

Arguments:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |

Example:

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

The method allows you to clear the repository.
If the argument `force` is passed with a value of `true`, then the entire storage will be cleared.
Otherwise, only the values whose key begins with the prefix specified in the settings will be deleted.

Arguments:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `force`  | `Boolean`| `false`  | -        |          |

Example:

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

The method allows you to find out whether there is an entry in the repository with the specified key.

Arguments:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `key`    | `String` |          | +        |          |

Example:

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

Return value: `Boolean`

### key

The method returns a value from the numeric key index.

Arguments:

|   name   |   type   | default  | required | allow values |
|----------|----------|----------|----------|----------|
| `index`  | `Number` |          | +        |          |

Пример:

```javascript
expoft default {
  created () {
    this.$storage.set('test', 'value')
    const key = this.$storage.key(0)
    console.log(key) // 'value'
  }
}
```

### keys

The method returns an array of storage keys.

Example:

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

Return value: `Array<string>`

### length

The method returns the number of keys in the repository.

Example:

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

Return value: `Number`

- - -
# Properties

### length

Returns the number of records in the storage.
