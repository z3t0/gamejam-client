// Client
// Copyright Rafi Khan

var EventEmitter = require('eventemitter3')

function Client (opts) {
  console.log('created client')

  var client = {}

  var socket = require('socket.io-client')(opts.path)

  var emitter = new EventEmitter()

  socket.on('registered', function (playerData) {
    console.log('registered')

    playerData.isMe = true
    emitter.emit('connect', playerData)
  })

  socket.on('new_player', function (playerData) {
    playerData.isMe = false
    console.log('new player')
    emitter.emit('new_player', playerData)
  })

  socket.on('update', function (data) {
    emitter.emit('update', data)
  })

  socket.on('disconnect', function (data) {
    console.log('disconnect')
    emitter.emit('disconnect', data)
  })

  client.socket = socket
  client.emitter = emitter

  return client
}

module.exports = Client
