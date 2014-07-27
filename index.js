var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var stream = require('stream')
var util = require('util')
var eos = require('end-of-stream')
var os = require('os')
var mkdirp = require('mkdirp')
var thunky = require('thunky')

var noop = function() {}

var SIGNAL_FLUSH = new Buffer([0])

var toPath = function(base, hash) {
  return path.join(base, hash.slice(0, 2), hash.slice(2))
}

var Writer = function(dir, algo, init) {
  this.hash = null
  this.destroyed = false

  this._tmp = null
  this._ws = null
  this._directory = dir
  this._digest = crypto.createHash(algo)
  this._init = init

  stream.Writable.call(this)
}

util.inherits(Writer, stream.Writable)

Writer.prototype._flush = function(cb) {
  var self = this
  var hash = this.hash = this._digest.digest('hex')
  var dir = path.join(this._directory, hash.slice(0, 2))

  fs.mkdir(dir, function() {
    fs.rename(self._tmp, toPath(self._directory, hash), cb)
  })
}

Writer.prototype._setup = function(data, enc, cb) {
  var self = this
  var destroy = function(err) {
    self.destroy(err)
  }

  this._init(function(dir) {
    if (self.destroyed) return cb(new Error('stream destroyed'))
    self._tmp = path.join(dir, Date.now()+'-'+Math.random().toString().slice(2))
    self._ws = fs.createWriteStream(self._tmp)
    self._ws.on('error', destroy)
    self._ws.on('close', destroy)
    self._write(data, enc, cb)
  })
}

Writer.prototype.destroy = function(err) {
  if (this.destroyed) return
  this.destroyed = true
  if (this.ws) this._ws.destroy()
  if (err) this.emit('error', err)
  this.emit('close')
}

Writer.prototype._write = function(data, enc, cb) {
  if (!this._tmp) return this._setup(data, enc, cb)
  if (data === SIGNAL_FLUSH) return this._flush(cb)
  this._digest.update(data)
  this._ws.write(data, enc, cb)
}

Writer.prototype.end = function(data, enc, cb) {
  if (typeof data === 'function') return this.end(null, null, data)
  if (typeof enc === 'function') return this.end(data, null, enc)
  if (data) this.write(data)
  this.write(SIGNAL_FLUSH)
  stream.Writable.prototype.end.call(this, cb)
}

module.exports = function(dir, algo) {
  if (!algo) algo = 'sha256'
  var that = {}

  var init = thunky(function(cb) {
    var tmp = path.join(os.tmpDir(), 'blob-object-store')
    mkdirp(tmp, function() {
      mkdirp(dir, function() {
        cb(dir)
      })
    })
  })

  that.createWriteStream = function(cb) {
    var ws = new Writer(dir, algo, init)
    if (!cb) return ws

    eos(ws, function(err) {
      if (err) return cb(err)
      cb(null, ws.hash)
    })

    return ws
  }

  that.createReadStream = function(hash) {
    return fs.createReadStream(toPath(dir, hash))
  }

  that.exists = function(hash, cb) {
    fs.stat(toPath(dir, hash), function(err, stat) {
      if (err && err.code === 'ENOENT') return cb(null, false)
      if (err) return cb(err)
      cb(null, true)
    })
  }

  that.delete =
  that.del = function(hash, cb) {
    if (!cb) cb = noop
    fs.unlink(toPath(dir, hash), function(err) {
      if (err && err.code === 'ENOENT') return cb(null, false)
      if (err) return cb(err)
      cb(null, true)
    })
  }

  return that
}