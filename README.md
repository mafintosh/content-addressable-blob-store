# fs-blob-store

Streamable content addressable [blob](http://en.wikipedia.org/wiki/Binary_large_object) object store that is streams2 and implements the blob store interface on top of the fs module.

Conforms to the [abstract-blob-store](https://github.com/maxogden/abstract-blob-store) API and passes it's test suite.

``` js
npm install fs-blob-store
```

[![build status](http://img.shields.io/travis/mafintosh/fs-blob-store.svg?style=flat)](http://travis-ci.org/mafintosh/fs-blob-store)
![dat](http://img.shields.io/badge/Development%20sponsored%20by-dat-green.svg?style=flat)

## Usage

``` js
var blobs = require('fs-blob-store')
var store = blobs({path: './data'})

var w = store.createWriteStream()

w.write('hello ')
w.write('world\n')

w.end(function() {
  console.log('blob written: '+w.hash)
  store.createReadStream(w).pipe(process.stdout)
})
```

## API

#### `var store = blobs(opts)`

Creates a new instance. Opts should have a `path` property to where the blobs should live on the fs. The directory will be created if it doesn't exist. If not supplied it will default to `path.join(process.cwd(), 'blobs')`

You can also specify a node `crytpo` module hashing algorithm to use using the `algo` key in options. The default is `sha256`.

#### `var readStream = store.createReadStream(opts)`

Open a read stream to a blob. `opts` must have a `hash` key with the hash of the blob you want to read.

#### `var writeStream = store.createWriteStream([cb])`

Add a new blob to the store. Use `writeStream.hash` to get the hash after the `finish` event has fired
or add a callback which will be called with `callback(err, metadata)`.

#### `store.exists(metadata, cb)`

Check if an blob exists in the blob store. `metadata` must have a `hash` property. Callback is called with `callback(err, exists)`

#### `store.remove(metadata, [cb])`

Remove a blob from the store. `metadata` must have a `hash` property. Callback is called with `callback(err, wasDeleted)`

## License

MIT