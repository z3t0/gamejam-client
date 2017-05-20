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

    this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2)
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
    this.physics.body = Matter.Bodies.rectangle(data.x, data.y, this.sprite.width, this.sprite.height)
    this.game.world.add(this.game.engine.world, this.physics.body)
    // Matter.Body.applyForce(this.body, Matter.Vector.create(-100,100), Matter.Vector.create(1, -1))
  }

  // Updates on the local client
  update (deltaTime) {
    let sprite = this.sprite
    let pos = this.physics.body.position

    sprite.x = pos.x
    sprite.y = pos.y

    sprite.rotation = this.physics.body.angle
  }

  sync (data) {
    // this.sprite.x = data.x
    // this.sprite.y = data.y
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
    let speed = 2

    switch(movement) {
    case 'up':
      keys.up = true
      keys.down = false
      var x = speed * math.cos(this.physics.body.angle)
      var y = speed * math.sin(this.physics.body.angle)
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(x, y))
      // this.game.emit('up', info)
      break

    case 'up-release':
      keys.up = false
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(0, 0))
      this.game.emit('up-release', info)
      break

    case 'right':
      keys.left = false
      keys.right = true
      Matter.Body.setAngularVelocity(this.physics.body, this.turnSpeed)
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(0, 0))
      this.game.emit('right', info)
      break

    case 'right-release':
      keys.right = false
      Matter.Body.setAngularVelocity(this.physics.body, 0)
      this.game.emit('right-release', info)
      break

    case 'left':
      keys.left = true
      keys.right = false
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(0, 0))
      Matter.Body.setAngularVelocity(this.physics.body, -this.turnSpeed)
      this.game.emit('left', info)
      break

    case 'left-release':
      Matter.Body.setAngularVelocity(this.physics.body, 0)
      keys.left = false
      this.game.emit('left-release', info)
      break

    case 'down':
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(-2, 0))
      keys.down = true
      keys.up = false
      let dx = speed * math.cos(this.physics.body.angle)
      let dy = speed * math.sin(this.physics.body.angle)
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(-dx, -dy))
      this.game.emit('down', info)
      break

    case 'down-release':
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(0, 0))
      keys.down = false
      this.game.emit('down-release', info)
      break
    }
  }
}

module.exports = Player
