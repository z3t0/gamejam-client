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
    this.sprite.tint = data.color

    game.stage.addChild(this.sprite)

    this.game = game
  }

  // Updates on the local client
  update (deltaTime) {
   //  if (deltaTime) {
   //    var sprite = this.sprite
   //    const speed = 0.05
   //    deltaTime = deltaTime / 1000
   //    console.log(deltaTime)
   //    sprite.x += sprite.vx * this.speed * deltaTime
   //    sprite.y += sprite.vy * this.speed * deltaTime
   //  }
   // console.log(this.sprite.y)
  }

  sync (data) {
    this.sprite.x = data.x
    this.sprite.y = data.y

    this.sprite.vx = data.vx
    this.sprite.vy = data.vy
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
}

module.exports = Player
