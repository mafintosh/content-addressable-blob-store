var os = require('os')
var path = require('path')

var test = require('tape')
var rimraf = require('rimraf')
var abstractBlobTests = require('abstract-blob-store/tests')

var blobs = require('./')
var blobPath = path.join(os.tmpdir(), 'fs-blob-store-tests')

var common = {
  setup: function(t, cb) {
    rimraf(blobPath, function() {
      var store = blobs({path: blobPath})
      cb(null, store)
    })
  },
  teardown: function(t, store, blob, cb) {
    rimraf(blobPath, cb)
  }
}

abstractBlobTests(test, common)

test('remove file', function(t) {
  common.setup(t, function(err, store) {
    var w = store.createWriteStream()
    w.write('hello')
    w.write('world')
    w.end(function() {
      store.remove(w, function(err, deleted) {
        t.notOk(err, 'no err')
        t.ok(deleted, 'was deleted')
        common.teardown(t, null, null, function(err) {
          t.end()
        })
      })
    })
  })
})
