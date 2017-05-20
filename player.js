var PIXI = require('pixi.js')
import math from 'math.js'

class Player {
  constructor (data, game) {
    this.id = data.id
    this.isMe = data.isMe

    this.speed = data.speed
    this.turnSpeed = data.turnSpeed
    this.color = data.color

    this.sprite = new PIXI.Sprite(PIXI.loader.resources.circle.texture)
    this.sprite.x = data.x
    this.sprite.x = data.y
    this.sprite.scale.x = data.sizeX
    this.sprite.scale.y = data.sizeY
    this.sprite.vx = data.vx
    this.sprite.vy = data.vy
    // this.sprite.rotation = data.heading
    this.heading = data.heading
    this.sprite.tint = data.color

    game.stage.addChild(this.sprite)
    this.sprite.x = 10
    this.sprite.y = 10

    this.game = game
    console.log('player created')

    // keys
    this.keys = data.keys
    this.keys.right = false
    this.keys.left = false
    this.keys.up = false
    this.keys.down = false
  }

  // Updates on the local client
  update (deltaTime) {
    let {left, right, up, down} = this.keys

    if (deltaTime) {
      var sprite = this.sprite
      deltaTime = deltaTime / 1000
      if (left) {
        this.turnAntiClockwise(deltaTime)
      }

      else if (right) {
        this.turnClockwise(deltaTime)
      }

      sprite.x += this.speed * math.cos(this.heading) * deltaTime
      sprite.y += this.speed * math.sin(this.heading) * deltaTime
    }
  }

  sync (data) {
    // this.sprite.x = data.x
    // this.sprite.y = data.y
  }

  turnAntiClockwise (deltaTime) {
    // this.sprite.rotation -= this.turnSpeed * deltaTime
    this.heading -= this.turnSpeed * deltaTime
  }

  turnClockwise (deltaTime) {
    // this.sprite.rotation += this.turnSpeed * deltaTime
    this.heading += this.turnSpeed * deltaTime
  }

  getPlayerInfo () {
    var info = {}

    info.id = this.id

    info.x = this.sprite.x
    info.y = this.sprite.y

    info.sizeX = this.sprite.scale.x
    info.sizeY = this.sprite.scale.y

    info.vx = this.sprite.vx
    info.vy = this.sprite.vy

    info.speed = this.speed
    info.color = this.color

    return info
  }

  pressed (movement) {
    let info = this.getPlayerInfo()
    let sprite = this.sprite
    let keys = this.keys

    switch(movement) {
    case 'up':
      keys.up = true
      keys.down = false
      // this.game.emit('up', info)
      break

    case 'up-release':
      keys.up = false
      break

    case 'right':
      keys.left = false
      keys.right = true
      // this.game.emit('right', info)
      break

    case 'right-release':
      keys.right = false
      break

    case 'left':
      keys.left = true
      keys.right = false
      // sprite.x -= this.speed
      this.game.emit('left', info)
      break

    case 'left-release':
      keys.left= false
      break

    case 'down':
      keys.down = true
      keys.up = false
      // sprite.y += this.speed
      this.game.emit('down', info)
      break

    case 'down-release':
      keys.down = false
      break
    }
  }
}

module.exports = Player
