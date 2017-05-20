var PIXI = require('pixi.js')
import math from 'math.js'
import Matter from 'matter-js'

class Player {
  constructor (data, game) {
    this.id = data.id
    this.isMe = data.isMe

    this.speed = data.speed
    this.turnSpeed = data.turnSpeed
    this.color = data.color

    this.sprite = new PIXI.Sprite(PIXI.loader.resources.tank1.texture)
    this.sprite.x = data.x
    this.sprite.x = data.y
    this.sprite.scale.x = data.sizeX
    this.sprite.scale.y = data.sizeY
    this.sprite.vx = data.vx
    this.sprite.vy = data.vy
    this.sprite.rotation = data.heading
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

    // physics
    this.physics = {}
    this.physics.body = Matter.Bodies.rectangle(data.x, data.y, 100, 100)
    this.game.world.add(this.game.engine.world, this.physics.body)
    // Matter.Body.applyForce(this.body, Matter.Vector.create(-100,100), Matter.Vector.create(1, -1))
    Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(2, 0))
  }

  // Updates on the local client
  update (deltaTime) {
    let sprite = this.sprite
    let pos = this.physics.body.position

    sprite.x = pos.x
    sprite.y = pos.y
    // let {left, right, up, down} = this.keys

    // if (deltaTime) {
    //   var sprite = this.sprite
    //   deltaTime = deltaTime / 1000
    //   if (left) {
    //     this.turnAntiClockwise(deltaTime)
    //   }

    //   else if (right) {
    //     this.turnClockwise(deltaTime)
    //   }

    //   sprite.x += this.speed * deltaTime

    //   console.log(this.heading)
    //   sprite.x += this.speed * math.cos(this.heading) * deltaTime
    //   sprite.y += this.speed * math.sin(this.heading) * deltaTime
    // }
  }

  sync (data) {
    // this.sprite.x = data.x
    // this.sprite.y = data.y
  }

  turnAntiClockwise (deltaTime) {
    this.heading -= this.turnSpeed * deltaTime
    this.sprite.rotation = this.heading
  }

  turnClockwise (deltaTime) {
    this.heading += this.turnSpeed * deltaTime
    this.sprite.rotation = this.heading
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
