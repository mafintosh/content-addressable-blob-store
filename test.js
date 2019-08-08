var os = require('os')
var path = require('path')
var fs = require('fs')

var test = require('tape')
var rimraf = require('rimraf')
var abstractBlobTests = require('abstract-blob-store/tests')

var blobs = require('./')
var blobPath = path.join(os.tmpdir(), 'fs-blob-store-tests')

var common = {
  setup: function (t, cb) {
    rimraf(blobPath, function () {
      var store = blobs({ path: blobPath })
      cb(null, store)
    })
  },
  teardown: function (t, store, blob, cb) {
    rimraf(blobPath, cb)
  }
}

abstractBlobTests(test, common)

test('remove file', function (t) {
  common.setup(t, function (err, store) {
    t.ifError(err, 'no error')
    var w = store.createWriteStream()
    w.write('hello')
    w.write('world')
    w.end(function () {
      store.remove(w, function (err, deleted) {
        t.notOk(err, 'no err')
        t.ok(deleted, 'was deleted')
        common.teardown(t, null, null, function (err) {
          t.ifError(err, 'no error')
          t.end()
        })
      })
    })
  })
})

test('seek blob', function (t) {
  common.setup(t, function (err, store) {
    t.ifError(err, 'no error')
    var w = store.createWriteStream()
    w.write('hello')
    w.write('world')
    w.end(function () {
      var buff = ''
      var blob = store.createReadStream({ key: w.key, start: 5 })
      blob.on('data', function (data) { buff += data })
      blob.on('end', function () {
        t.equal(buff, 'world')
        common.teardown(t, null, null, function (err) {
          t.ifError(err, 'no error')
          t.end()
        })
      })
    })
  })
})

test('resolve blob', function (t) {
  common.setup(t, function (err, store) {
    t.ifError(err, 'no error')
    var w = store.createWriteStream()
    w.write('hello')
    w.write('world')
    w.end(function () {
      store.resolve({ key: w.key }, function (err, path, stat) {
        t.error(err, 'no error')
        t.notEqual(path, false, 'path should not be false')
        t.notEqual(stat, null, 'path is not null')
        t.true(stat instanceof fs.Stats, 'stat is instanceof Stats')
        store.resolve('foo', function (err, path, stat) {
          t.ifError(err, 'no error')
          t.equal(path, false, 'path should be false for missing key')
          t.equal(stat, null, 'path is null for missing key')
          common.teardown(t, null, null, function (err) {
            t.ifError(err, 'no error')
            t.end()
          })
        })
      })
    })
  })
})
