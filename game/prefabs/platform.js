"use strict";

var Platform = function(game, x, y, rad) {
  this.game = game;
  this.radius = rad;
  var shape = this.getCircleShape(rad, null, 'white', 10);
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

Platform.prototype.getCircleShape = function(rad, fill, stroke, lineWidth){
  var margin = 20 + lineWidth;
  var center = rad + margin / 2;

  var size = (rad * 2) + margin;
  var shape = this.game.add.bitmapData(size, size);  //init rect
  
  shape.context.beginPath();
  shape.context.arc(center, center, rad, 0, 2 * Math.PI, false);
  /*
  if(fill){
    shape.context.fillStyle = fill;
    shape.context.fill();
  }*/

  shape.context.lineWidth = lineWidth;
  shape.context.strokeStyle = stroke;
  shape.context.stroke();
/*
  var w = 2;
  for(var i=6; i>0; i--){
    w+=5;
    shape.context.lineWidth = w;
    shape.context.strokeStyle = "rgba(255,255,255,"+(i/10)+")";
    shape.context.stroke();
  }
*/
  return shape;
};

module.exports = Platform;
