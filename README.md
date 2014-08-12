# fs-blob-store

Streamable content addressable blob object store that is streams2 and implements the blob store interface on top of the fs module

``` js
npm install fs-blob-store
```

[![build status](http://img.shields.io/travis/mafintosh/fs-blob-store.svg?style=flat)](http://travis-ci.org/mafintosh/fs-blob-store)
![dat](http://img.shields.io/badge/Development%20sponsored%20by-dat-green.svg?style=flat)

## Usage

``` js
var blobs = require('fs-blob-store')
var store = blobs('./data')

var w = store.createWriteStream()

w.write('hello ')
w.write('world\n')

w.end(function() {
  console.log('blob written: '+w.hash)
  store.createReadStream(w.hash).pipe(process.stdout)
})
```

## API

#### `var store = blobs(dir)`

Creates a new instance. `dir` will be created if it doesn't exist.

#### `var readStream = store.createReadStream(hash)`

Open a read stream to a blob

#### `var writeStream = store.createWriteStream([cb])`

Add a new blob to the store. Use `writeStream.hash` to get the hash after the `finish` event has fired
or add a callback which will be called with `callback(err, hash)`

#### `store.exists(hash, cb)`

Check if an hash exists in the blob store. Callback is called with `callback(err, exists)`

#### `store.remove(hash, [cb])`

Remove a blob from the store. Callback is called with `callback(err, wasDeleted)`

## License

MIT