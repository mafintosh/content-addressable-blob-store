# content-addressable-blob-store

Streamable content addressable [blob](http://en.wikipedia.org/wiki/Binary_large_object) object store that is streams2 and implements the blob store interface on top of the fs module.

Conforms to the [abstract-blob-store](https://github.com/maxogden/abstract-blob-store) API and passes it's test suite.

``` js
npm install content-addressable-blob-store
```

[![build status](http://img.shields.io/travis/mafintosh/content-addressable-blob-store.svg?style=flat)](http://travis-ci.org/mafintosh/content-addressable-blob-store)
![dat](http://img.shields.io/badge/Development%20sponsored%20by-dat-green.svg?style=flat)

[![blob-store-compatible](https://raw.githubusercontent.com/maxogden/abstract-blob-store/master/badge.png)](https://github.com/maxogden/abstract-blob-store)

## Usage

``` js
var blobs = require('content-addressable-blob-store')
var store = blobs('./data')

var w = store.createWriteStream()

w.write('hello ')
w.write('world\n')

w.end(function() {
  console.log('blob written: '+w.key)
  store.createReadStream(w).pipe(process.stdout)
})
```

## API

#### `var store = blobs(opts)`

Creates a new instance. Opts should have a `path` property to where the blobs should live on the fs. The directory will be created if it doesn't exist. If not supplied it will default to `path.join(process.cwd(), 'blobs')`

You can also specify a node `crypto` module hashing algorithm to use using the `algo` key in options. The default is `sha256`.
If you pass a string instead of an options map it will be used as the `path` as well.

The `tmpdir` option can be used to specify the directory where files are stored temporarily during writing. The default is `os.tmpdir()`.

#### `var readStream = store.createReadStream(opts)`

Open a read stream to a blob. `opts` must have a `key` key with the hash of the blob you want to read. `opts` can optionally contain a `start` or `end` key if you only want part of the blob.

#### `var writeStream = store.createWriteStream([cb])`

Add a new blob to the store. Use `writeStream.key` to get the hash after the `finish` event has fired
or add a callback which will be called with `callback(err, metadata)`.

#### `store.exists(metadata, cb)`

Check if an blob exists in the blob store. `metadata` must have a `key` property. Callback is called with `callback(err, exists)`


#### `store.remove(metadata, [cb])`

Remove a blob from the store. `metadata` must have a `key` property. Callback is called with `callback(err, wasDeleted)`

#### `store.resolve(metadata, cb)`

Check if an blob exists in the blob store and return its `path` and `stat` object. `metadata` must have a `key` property. Callback is called with `callback(err, path, stat)` where `path` is the path string to the file on disk and `stat` is an instance of [fs.Stats](https://nodejs.org/api/fs.html#fs_class_fs_stats).  If the `key` does does not exist in the store, `path` will be `false` and `stat` will be `null`.

## License

MIT
