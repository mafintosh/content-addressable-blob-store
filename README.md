# blob-object-store

Streamable content addressable blob object store that is streams2 and implements the blob store interface

``` js
npm install blob-object-store
```

## Usage

``` js
var blobs = require('blob-object-store')
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

#### `store.del(hash, [cb])`

Delete a blob from the store. Callback is called with `callback(err, wasDeleted)`

## License

MIT