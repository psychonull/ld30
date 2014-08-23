'use strict';
var switchTime = 0;

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player', frame);
  this.game.physics.p2.enable(this, true);
  this.maxSpeed = 50;
  this.THRUST = 10000;
  this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

  this.cam = this.game.add.sprite(this.x, this.y);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if(this.currentPlatform){
    this.move();
    this.moveCam();
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
  {
    this.switchPlatform();
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
    this.maxSpeed++;
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
    this.maxSpeed--;
  }
  this.limitSpeedP2JS(this.body, this.maxSpeed);
};

Player.prototype.move = function() {
  var platform = this.currentPlatform;
  
  var angle = Math.atan2(platform.y - this.y, platform.x - this.x);
  this.body.rotation = angle;
  this.body.thrust(this.THRUST * -1);
};

Player.prototype.moveCam = function() {
  var inner = this.innerPlatform.radius;
  var outter = this.outerPlatform.radius;

  var center = { x: this.game.world.centerX, y: this.game.world.centerY };
  var player = { x: this.x, y: this.y };

  var player_center = { x: player.x - center.x, y: player.y - center.y };
  var player_center_length = Math.sqrt(player_center.x * player_center.x + player_center.y * player_center.y);
  var player_center_normal = { x: player_center.x / player_center_length, y: player_center.y / player_center_length };

  //var outter_pos = { x: player_center_normal.x * (center.x + outter), y: player_center_normal.y * (center.y + outter) };
  if(this.currentPlatform === this.innerPlatform){
    var outter_pos = { x: player_center_normal.x * outter, y: player_center_normal.y * outter };
  }
  else {
    outter_pos = { x: player_center_normal.x * inner, y: player_center_normal.y * inner };
  }

  outter_pos.x += center.x;
  outter_pos.y += center.y;

  var dif = { x: outter_pos.x - player.x, y: outter_pos.y - player.y };

  this.cam.x = dif.x/2;
  this.cam.y = dif.y/2;

  this.cam.x += player.x;
  this.cam.y += player.y;

  //console.log(dif);

  /*
  this.cam.x = this.x;
  this.cam.y = this.y;
  */
};

Player.prototype.limitSpeedP2JS = function(p2Body, maxSpeed) {
  var x = p2Body.velocity.x;
  var y = p2Body.velocity.y;

  if (Math.pow(x, 2) + Math.pow(y, 2) > Math.pow(maxSpeed, 2)) {

    var a = Math.atan2(y, x);
    x = -20 * Math.cos(a) * maxSpeed;
    y = -20 * Math.sin(a) * maxSpeed;
    p2Body.velocity.x = x;
    p2Body.velocity.y = y;
  }
  return p2Body;
};

Player.prototype.initPlatforms = function(innerPlatform, outerPlatform){
  this.innerPlatform = innerPlatform;
  this.outerPlatform = outerPlatform;
  this.currentPlatform = innerPlatform;
  this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.currentPlatform, this.currentPlatform.radius + this.height / 2);
};

Player.prototype.switchPlatform = function(){

  if (this.game.time.now < switchTime)
  {
    return;
  }

  var nextPlatform = this.currentPlatform === this.innerPlatform ? this.outerPlatform : this.innerPlatform;
  var offset = this.height / 2 * (nextPlatform === this.outerPlatform ? -1 : 1);
  this.currentPlatform = nextPlatform;
  this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.currentPlatform, this.currentPlatform.radius + offset);

  switchTime = this.game.time.now + 300;
};


module.exports = Player;
