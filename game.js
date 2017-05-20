// client - game.js
var PIXI = require('pixi.js')
var Player = require('./player.js')
var timeframe= require('timeframe')

class Game {
  constructor () {
    this.players = {}
    this.world = null

    this.me = null
    // Load Resources
    PIXI.loader
    .add('circle', 'res/img/circle.png')
    .on('progress', loadProgressHandler)
    .load(() => {
      this.init()
    })
  }

  loop (time) {
    window.requestAnimationFrame((time) => {
      this.loop(time)
    })

    this.deltaTime = time - this.lastTime
    this.lastTime = time

    if (time != null) {
      for (var id in this.players) {
        this.players[id].update(this.deltaTime)
      }

      this.renderer.render(this.stage)
    }
  }

  emit(msg, data) {
    this.me.
    this.client.socket.emit(msg, this.timeline.offset(0))
  }

  connect () {
    this.client = require('./client.js')({path: '10.226.158.2:3000'}, this)

    var client = this.client.emitter

    client.on('new_player', (data) => {
      console.log('new player')
      var newPlayer = new Player(data, this)
      this.players[newPlayer.id] = newPlayer
    })

    client.on('connect', (data) => {
      this.timeline = timeframe.createTimeline()
      this.me = new Player(data, this)
      this.players[this.me.id] = this.me
      this.loop()
    })

    client.on('update', (data) => {
      for (var i = 0; i < data.length; i++) {
        try {
          this.players[data[i].id].sync(data[i])
        } catch (err) {
          console.log(this.players)
          console.log(data)
        }
      }
    })
  }

  log (msg) {
    console.log('Game > ' + msg)
  }

  newPlayer (client) {
    this.log('Created a new player')
    var player = new Player({client: client})
    this.players[player.id] = player
  }

  init () {
  // Create the renderer
    var renderer = PIXI.autoDetectRenderer(256, 256)

  // Add the canvas to the HTML document
    document.getElementById('game').appendChild(renderer.view)

  // Autoresize
    renderer.view.style.position = 'absolute'
    renderer.view.style.display = 'block'
    renderer.autoResize = true
    renderer.resize(window.innerWidth, window.innerHeight)

  // Create a container object called the `stage`
    var stage = new PIXI.Container()

    this.renderer = renderer
    this.stage = stage
    this.pixi = PIXI

  // keyboard
  // Capture the keyboard arrow keys
    var left = keyboard(37)
    var up = keyboard(38)
    var right = keyboard(39)
    var down = keyboard(40)

    // Left arrow key `press` method
    left.press = () => {
      this.me.setVelocityX(-1)
      this.emit('left')
    }

  // Up
    up.press = () => {
      this.me.setVelocityY(-1)
      this.emit('up')
    }

  // Right
    right.press = () => {
      this.me.setVelocityX(1)
      this.emit('right')
    }

  // Down
    down.press = () => {
      this.me.setVelocityY(1)
      this.emit('down')
    }

    this.connect()
  }
}

function loadProgressHandler (loader, resource) {
  // Display the file `url` currently being loaded
  console.log('loading: ' + resource.url)

  // Display the precentage of files currently loaded
  console.log('progress: ' + loader.progress + '%')

  // If you gave your files names as the first argument
  // of the `add` method, you can access them like this
  // console.log("loading: " + resource.name);
}

function keyboard (keyCode) {
  var key = {}
  key.code = keyCode
  key.isDown = false
  key.isUp = true
  key.press = undefined
  key.release = undefined
  // The `downHandler`
  key.downHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press()
      key.isDown = true
      key.isUp = false
    }
    event.preventDefault()
  }

  // The `upHandler`
  key.upHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release()
      key.isDown = false
      key.isUp = true
    }
    event.preventDefault()
  }

  // Attach event listeners
  window.addEventListener(
    'keydown', key.downHandler.bind(key), false
    )
  window.addEventListener(
    'keyup', key.upHandler.bind(key), false
    )
  return key
}

module.exports = Game