"use strict";

var Platform = function(game, x, y, rad, i) {
  this.game = game;
  this.radius = rad;
  //var shape = this.getCircleShape(rad, null, 'white', 10);
  //Phaser.Sprite.call(this, game, x, y, shape);

  Phaser.Sprite.call(this, game, x, y, "shape");

  var graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFF000+i, 0.2);
  graphics.lineStyle(10, 0xffffff, 1);

  graphics.drawCircle(x, y, rad);

  game.physics.p2.enable(this, false);
  this.body.setCircle(200);
  this.body.static = true;
  
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};
/*
Platform.prototype.getCircleShape = function(rad, fill, stroke, lineWidth){
  var margin = 20 + lineWidth;
  var center = rad + margin / 2;

  var size = (rad * 2) + margin;
  var shape = this.game.add.bitmapData(size, size);  //init rect
  
  shape.context.beginPath();
  shape.context.arc(center, center, rad, 0, 2 * Math.PI, false);

  shape.context.lineWidth = lineWidth;
  shape.context.strokeStyle = stroke;
  shape.context.stroke();

  return shape;
};
*/
module.exports = Platform;
