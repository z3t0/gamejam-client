var PIXI = require('pixi.js')
import math from 'math.js'
import Matter from 'matter-js'

let howler = require('howler')

class Player {
  constructor (data, game) {
    this.id = data.id
    this.isMe = data.isMe

    this.speed = data.speed
    this.turnSpeed = data.turnSpeed
    this.shootSpeed = data.shootSpeed
    this.color = data.color

    this.sprite = new PIXI.Sprite(PIXI.loader.resources.tank1.texture)
    this.sprite.x = data.x
    this.sprite.y = data.y
    this.sprite.scale.x = data.sizeX
    this.sprite.scale.y = data.sizeY
    this.sprite.vx = data.vx
    this.sprite.vy = data.vy
    this.sprite.rotation = data.heading
    this.heading = data.heading
    this.sprite.tint = data.color
i
    game.stage.addChild((this.sprite))

    this.mass = data.mass

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

    if (this.isMe) {
      this.game.world.add(this.game.engine.world, this.physics.body)
      Matter.Body.setMass(this.physics.body, this.mass)
    }
    // Matter.Body.setStatic(this.physics.body, true)
    // Matter.Body.applyForce(this.body, Matter.Vector.create(-100,100), Matter.Vector.create(1, -1))


    // sounds
    this.sounds = {}
    this.sounds.move = new Howl({
      src: ['res/sound/moving.mp3']
    })

    this.sounds.fire = new Howl({
      src: ['res/sound/fire.mp3']
    })

    this.sounds.bomb = new Howl({
      src: ['res/sound/bomb.mp3']
    })


    this.request = 0
    this.sentTime = null
    this.difference = 0
    this.time = new Date().getTime()
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
    let pos = this.physics.body.position
    this.difference = new Date().getTime() - data.time
    this.sentTime = new Date().getTime() - this.sentTime
    let d = new Date().getTime() - this.sentTime()
    if(this.game.me.id === this.id) {
      // if (data.request <= this.request)
      //   return
      console.log(`Data X: ${data.x}, Y: ${data.y}`)
      console.log(`dif: ${this.difference}`)
      console.log(`dife: ${d}`)
      console.log(`Phys X: ${this.physics.body.position.x}, Y: ${this.physics.body.position.y}`)
    }

    this.physics.body.position = Matter.Vector.create(data.x, data.y)
    Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(data.velocity.x, data.velocity.y))
    Matter.Body.setAngle(this.physics.body, data.angle)
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

    this.request++
    info.request = this.request

    info.time = new Date().getTime()
    info.shootSpeed = this.shootSpeed

    info.mass = this.mass

    this.sentTime = new Date().getTime()

    return info
  }

  pressed (movement) {
    let info = this.getPlayerInfo()
    let sprite = this.sprite
    let keys = this.keys
    let speed = this.speed

    switch(movement) {
    case 'up':
      keys.up = true
      keys.down = false
      console.log(`vel bef : ${this.physics.body.velocity.x}, y: ${this.physics.body.velocity.y}`)
      var x = speed * math.cos(this.physics.body.angle)
      var y = speed * math.sin(this.physics.body.angle)
      console.log(`Velx : ${x}, y: ${y}`)
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(x, y))
      this.moveSound()
      this.game.emit('up', info)
      break

    case 'up-release':
      keys.up = false
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(0, 0))
      this.game.emit('up-release', info)
      this.moveSoundStop()
      break

    case 'right':
      keys.left = false
      keys.right = true
      Matter.Body.setAngularVelocity(this.physics.body, this.turnSpeed)
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(0, 0))
      this.game.emit('right', info)
      this.moveSound()
      break

    case 'right-release':
      keys.right = false
      Matter.Body.setAngularVelocity(this.physics.body, 0)
      this.game.emit('right-release', info)
      this.moveSoundStop()
      break

    case 'left':
      keys.left = true
      keys.right = false
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(0, 0))
      Matter.Body.setAngularVelocity(this.physics.body, -this.turnSpeed)
      this.game.emit('left', info)
      this.moveSound()
      break

    case 'left-release':
      Matter.Body.setAngularVelocity(this.physics.body, 0)
      keys.left = false
      this.game.emit('left-release', info)
       this.moveSoundStop()
      break

    case 'down':
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(-2, 0))
      keys.down = true
      keys.up = false
      let dx = speed * math.cos(this.physics.body.angle)
      let dy = speed * math.sin(this.physics.body.angle)
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(-dx, -dy))
      this.game.emit('down', info)
      this.moveSound()
      break

    case 'down-release':
      Matter.Body.setVelocity(this.physics.body, Matter.Vector.create(0, 0))
      keys.down = false
      this.game.emit('down-release', info)
      this.moveSoundStop()
      break

    case 'shoot':
      this.game.emit('shoot',info)
      this.shoot()
      
      break
    }
  }

  shoot(){
    let bullet = {}
    bullet.render = new PIXI.Sprite(PIXI.loader.resources.bullet.texture)
    bullet.render.scale.x = 0.04
    bullet.render.scale.y = 0.04
    bullet.render.x = 0 + this.sprite.x
    bullet.render.y = 0 + this.sprite.y
    bullet.physics = {}
    bullet.render.rotation = this.sprite.rotation

    this.game.stage.addChild(bullet.render)
    bullet.physics.body = Matter.Bodies.rectangle(bullet.render.x, bullet.render.y, bullet.render.width, bullet.render.height)
    Matter.Body.setAngle(bullet.physics.body, this.physics.body.angle)
    this.game.world.add(this.game.engine.world, bullet.physics.body)

    this.shootSpeed = 100
    let fx = this.shootSpeed * math.cos(this.physics.body.angle)
    let fy = this.shootSpeed * math.sin(this.physics.body.angle)
    console.log(`bulet vel: ${fx} ${fy}`)
    Matter.Body.setVelocity(bullet.physics.body, Matter.Vector.create(fx, fy))
    console.log(`Bullet pos: ${bullet.render.x} ${bullet.render.y}`)
    this.game.bullets.push(bullet)
    this.fireSound();
  }

  moveSound(){
    this.sounds.move.play()
  }

  moveSoundStop(){
      this.sounds.move.stop()
  }

  fireSound(){
      this.sounds.fire.play()
  }

  fireSoundStop(){
      this.sounds.fire.stop()
  }

  bombSound(){
    this.sounds.bomb.play()
  }

  bombSoundStop(){
    this.sounds.bomb.stop()
  }


}

module.exports = Player
