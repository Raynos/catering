'use strict'

var queueTick = require('queue-tick')

exports.fromCallback = function (callback, symbol) {
  if (callback === undefined) {
    var promise = new Promise(function (resolve, reject) {
      callback = function (err, res) {
        if (err) reject(err)
        else resolve(res)
      }
    })

    callback[symbol !== undefined ? symbol : 'promise'] = promise
  } else if (typeof callback !== 'function') {
    throw new TypeError('Callback must be a function')
  }

  return callback
}

exports.fromPromise = function (promise, callback) {
  if (callback === undefined) return promise

  promise
    .then(function (res) { queueTick(() => callback(null, res)) })
    .catch(function (err) { queueTick(() => callback(err)) })
}
