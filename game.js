// client - game.js
var PIXI = require('pixi.js')
var Player = require('./player.js')
let keyboardjs = require('keyboardjs')

class Game {
  constructor (url) {
    this.url = url

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

    // Setup controls
    keyboardjs.bind('a', () => {
      this.input('left')
    })

    keyboardjs.bind('a', null, () => {
      this.input('left-release')
    })

    keyboardjs.bind('s', () => {
      this.input('down')
    })

    keyboardjs.bind('s', null, () => {
      this.input('down-release')
    })

    keyboardjs.bind('d', () => {
      this.input('right')
    })

    keyboardjs.bind('d', null, () => {
      this.input('right-release')
    })

    keyboardjs.bind('w', () => {
      this.input('up')
    })

    keyboardjs.bind('w', null, () => {
      this.input('up-release')
    })
  }

  input (press) {
    if (this.me !== null) {
      this.me.pressed(press)
    }
  }

  loop (time) {
    window.requestAnimationFrame((time) => {
      this.loop(time)
    })

    this.deltaTime = time - this.lastTime
    this.lastTime = time
    // console.log(`Delta time : ${this.deltaTime}`)
    // console.log(`Last time : ${this.lastTime}`)
    // console.log(`time : ${time}`)

    if (this.deltaTime) {
      for (var id in this.players) {
        this.players[id].update(this.deltaTime)
      }
    }

    this.renderer.render(this.stage)
  }

  emit (msg, data) {
    this.client.socket.emit(msg, data)
  }

  connect () {
    this.client = require('./client.js')({path: this.url}, this)

    var client = this.client.emitter

    client.on('newPlayer', this.gotNewPlayer.bind(this))

    client.on('connect', this.gotConnect.bind(this))

    client.on('update', this.gotUpdate.bind(this))
  }

  gotConnect (data) {
    console.log('connect')
    this.me = new Player(data, this)
    this.players[this.me.id] = this.me
    this.loop()
  }

  gotNewPlayer (data) {
    console.log(`newPlayer: ${data.id}`)
    var newPlayer = new Player(data, this)
    this.players[newPlayer.id] = newPlayer
  }

  gotUpdate (data) {
    for (let i = 0; i < data.length; i++) {
      this.players[data[i].id].sync(data[i])
    }
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

module.exports = Game
