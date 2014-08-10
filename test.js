var tape = require('tape')
var concat = require('concat-stream')
var fs = require('fs')
var os = require('os')
var blobs = require('./')

var store = blobs(os.tmpDir())

tape('add file', function(t) {
  var w = store.createWriteStream()
  w.write('hello')
  w.write('world')
  w.end(function() {
    t.same(w.hash, '936a185caaa266bb9cbe981e9e05cb78cd732b0b3280eb944412bb6f8f8f07af', 'hash should match')
    t.end()
  })
})

tape('add file + cb', function(t) {
  var w = store.createWriteStream(function(err, hash) {
    t.same(hash, '936a185caaa266bb9cbe981e9e05cb78cd732b0b3280eb944412bb6f8f8f07af', 'hash should match')
    t.end()
  })

  w.write('hello')
  w.write('world')
  w.end()
})

tape('add file + exists', function(t) {
  var w = store.createWriteStream()
  w.write('hello')
  w.write('world')
  w.end(function() {
    store.exists(w.hash, function(err, exists) {
      t.notOk(err, 'no err')
      t.ok(exists, 'should exist')
      t.end()
    })
  })
})

tape('add file + read file', function(t) {
  var w = store.createWriteStream()
  w.write('hello')
  w.write('world')
  w.end(function() {
    store.createReadStream(w.hash).pipe(concat(function(data) {
      t.same(data.toString(), 'helloworld')
      t.end()
    }))
  })
})

tape('remove file', function(t) {
  var w = store.createWriteStream()
  w.write('hello')
  w.write('world')
  w.end(function() {
    store.remove(w.hash, function(err, deleted) {
      t.notOk(err, 'no err')
      t.ok(deleted, 'was deleted')
      t.end()
    })
  })
})