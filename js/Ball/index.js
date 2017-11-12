function Ball(dimensions){
  console.log('dimensions ',dimensions);
  this.size = 20;
  this.velocity = {
    x: 0,
    y: 0
  };
  this.speed = 3;
  this.position = {
    x: dimensions.width / 2 - this.size / 2,
    y: dimensions.height / 2,
  }
}

Ball.prototype.initialize = function () {
  var r = Math.random() - 0.5;
  var angle = Math.PI * r;
  this.velocity = {
    x: this.speed * Math.cos(angle),
    y: this.speed * Math.sin(angle)
  }
};

Ball.prototype.update = function (Game) {
  var PLAYERS = Game.PLAYERS;

  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  if (this.position.x + this.size >= Game.dimensions.width) {
    this.velocity.x *= -1;
  }
  if (this.position.y <= 0 || this.position.y > Game.dimensions.height - this.size) {
    this.velocity.y *= -1;
  }

  for(var ID in PLAYERS){
    if (this.position.x < PLAYERS[ID].x + PLAYERS[ID].width) {
      if (this.position.y < PLAYERS[ID].y + PLAYERS[ID].height &&
        this.position.y > PLAYERS[ID].y) {
        //in here, it bounced against the PLAYERS[ID]
        this.velocity.x *= -1;
        this.velocity.x += PLAYERS[ID].velocity.x;
        this.velocity.y += PLAYERS[ID].velocity.y;
      }
    }
  }

  // if (this.position.x < 0 && this.velocity.x < 0) {
  //   Game.stop();
  // }

};

Ball.prototype.draw = function (ctx) {
  ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
}

module.exports = Ball;
