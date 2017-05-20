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


  socket.on('newPlayer', function (playerData) {
    playerData.isMe = false
    console.log('new player')
    emitter.emit('newPlayer', playerData)
  })

  socket.on('disconnectPlayer', (id) => {
    emitter.emit('disconnectPlayer', id)
  })

  socket.on('update', (data) => {
    emitter.emit('update', data)
  })

  socket.on('shoot', (data) => {
    console.log('shooting network received')
    emitter.emit('shoot', data)
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
