# Options

To install the configuration, the plug-in accepts an object of a certain format.

`prefix` - a string that will be added to the beginning of the key to avoid collisions. Default is an `app_`.

`driver` - the identifier of the storage used. While values are supported **local**, **session** and **memory** (**localStorage**, **sessionStorage** and **memoryStorage** respectively). Default is an `local`.

`ttl` - record lifetime in milliseconds. Default is an `0 // disables the lifetime and the record will be kept forever`.

`replacer` - a handler function for the value that is written to the store. Will be called before data is written to storage. Has such a signature: `(key: string, value: any) => any`. Default is an `undefined`.
