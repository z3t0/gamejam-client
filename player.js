var PIXI = require('pixi.js')

class Player {
  constructor (data, game) {
    this.id = data.id
    this.isMe = data.isMe

    this.speed = data.speed
    this.color = data.color

    this.sprite = new PIXI.Sprite(PIXI.loader.resources.circle.texture)
    this.sprite.x = data.x
    this.sprite.x = data.y
    this.sprite.scale.x = data.sizeX
    this.sprite.scale.y = data.sizeY
    this.sprite.vx = data.vx
    this.sprite.vy = data.vy
    // this.sprite.tint = data.color

    game.stage.addChild(this.sprite)
    this.sprite.x = 10
    this.sprite.y = 10

    this.game = game
    console.log('player created')
  }

  // Updates on the local client
  update (deltaTime) {
    if (deltaTime) {
      var sprite = this.sprite
      const speed = 0.05
      deltaTime = deltaTime / 1000
      console.log(deltaTime)
      sprite.x += sprite.vx * this.speed * deltaTime
      sprite.y += sprite.vy * this.speed * deltaTime
    }
   console.log(this.sprite.y)
  }

  sync (data) {
    debugger
    this.sprite.x = data.x
    this.sprite.y = data.y
  }

  setVelocityY (vy) {
    var sprite = this.sprite
    sprite.vy = vy
  }

  setVelocityX (vx) {
    var sprite = this.sprite
    sprite.vx = vx
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

    switch(movement) {
    case 'up':
      sprite.y -= this.speed
      this.game.emit('up', info)
      break

    case 'right':
      sprite.x += this.speed
      this.game.emit('right', info)
      break

    case 'left':
      sprite.x -= this.speed
      this.game.emit('left', info)
      break


    case 'down':
      sprite.y += this.speed
      this.game.emit('down', info)
      break
    }
  }
}

module.exports = Player
