# Options

To install the configuration, the plug-in accepts an object of a certain format.

`prefix` - a string that will be added to the beginning of the key to avoid collisions. Default is an empty string.

`driver` - the identifier of the storage used. While values are supported **local** and **session** (**localStorage** and **sessionStorage** respectively). Default is an `local`.

`ttl` - record lifetime in seconds. Default is an `60 * 60 * 24 * 1000 // 24 часа`.
