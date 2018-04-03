# Options

To install the configuration, the plug-in accepts an object of a certain format.

`prefix` - a string that will be added to the beginning of the key to avoid collisions. Default is an `app_`.

`driver` - the identifier of the storage used. While values are supported **local**, **session** and **memory** (**localStorage**, **sessionStorage** and **memoryStorage** respectively). Default is an `local`.

`ttl` - record lifetime in seconds. Default is an `60 * 60 * 24 * 1000 // 24 hours`.
