'use strict';

var Platform = function(game, x, y, rad) {
  this.game = game;
  var shape = this.getCircleShape(rad, null, 'white');
  Phaser.Sprite.call(this, game, x, y, shape);

  game.physics.p2.enable(this, false);
  this.body.setCircle(200);
  this.body.static = true;
  
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Platform.prototype.getCircleShape = function(rad, fill, stroke){
  var shape = this.game.add.bitmapData(rad * 2, rad * 2);  //init rect
  shape.context.beginPath();
  shape.context.arc(rad, rad, rad, 0, 2 * Math.PI, false);
  if(fill){
    shape.context.fillStyle = fill;
    shape.context.fill();
  }
  shape.context.lineWidth = 1;
  shape.context.strokeStyle = stroke;
  shape.context.stroke();
  return shape;
};

module.exports = Platform;
