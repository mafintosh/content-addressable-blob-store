var blobs = require('./')
var store = blobs({path: './data'})

var w = store.createWriteStream()

w.write('hello ')
w.write('world\n')

w.end(function() {
  console.log('blob written: '+w.hash)
  store.createReadStream(w).pipe(process.stdout)
})
