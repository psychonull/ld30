"use strict";
//var switchTime = 0;

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player', frame);
  this.game.physics.p2.enable(this, false);
  this.body.mass = 10;
  this.speed = 1;
  this.currentAngle = 0;
  this.jumpDistance = 30;
  this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

  this.cam = this.game.add.sprite(this.x, this.y);

  this.switchTime = 0;
  this.animations.add('running', [0,1,2,3,4], 10, true);
  this.animations.play('running');

  this.emitter = game.add.emitter(game.world.centerX, game.world.centerY - 300, 400);
  this.emitter.makeParticles( ['smoke' ] );
  this.emitter.gravity = 0;
  this.emitter.setAlpha(0.25, 0, 300);
  this.emitter.setScale(3, 0, 3, 0, 3000);
  //this.emitter.start(false, 3000, 5);
  this.camShakeTime = 0;
  this.camShakeTimeLong = 20;
  this.platformChange = false;

  this.switchPlatformKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.switchPlatformKey.onDown.add(this.switchPlatform, this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if(this.currentPlatform){
    this.move();
    this.cam.x = this.x;
    this.cam.y = this.y;
    //this.moveCam();
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
  {
    this.speed+= 0.01;
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
  {
    this.speed-= 0.01;
  }
  
  var run = this.animations.getAnimation("running");
  run.speed = Math.abs(this.speed * 8);

  //Particles
  var px = this.body.velocity.x;
  var py = this.body.velocity.y;

  px *= -1;
  py *= -1;

  this.emitter.minParticleSpeed.set(px, py);
  this.emitter.maxParticleSpeed.set(px, py);

  var value = Math.cos(this.body.rotation);
  this.emitter.emitX = this.x + (this.height/2 * value);
  this.emitter.emitY = this.y + (this.width/2 * value);

  if(this.platformChange && this.camShakeTime < this.camShakeTimeLong){

    var min = -5;
    var max = 5;
    ++this.camShakeTime;
    
    if(this.camShakeTime >= this.camShakeTimeLong){
      this.platformChange = false;
      this.camShakeTime = 0;
    }
    this.cam.x+= Math.floor(Math.random() * (max - min + 1)) + min;
    this.cam.y+= Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var dir = -1 * this.speed/this.speed;
  this.scale.x = dir;
  
  if(this.currentPlatform === this.innerPlatform){
    this.scale.y = 1;
  }
  else {
    this.scale.y = -1;
  }

};

Player.prototype.move = function() {
  if(!this.jumping){
    this.currentAngle = this.currentAngle + this.speed;
    var p = this.getPosition();
    this.body.x = p.x;
    this.body.y = p.y;
  }
  var spriteRotationAngle = 270;
  this.body.rotation = Math.atan2(this.currentPlatform.y - this.body.y, this.currentPlatform.x - this.body.x) + spriteRotationAngle * (Math.PI / 180);
};

Player.prototype.getPosition = function(angleOffset){
  var platform = this.currentPlatform,
    offset = this.height / 2;
  var rad = (this.currentAngle + (angleOffset || 0)) * (Math.PI / 180); // Converting Degrees To Radiansradius
  return { 
    x: this.game.world.centerX + (platform.radius + offset) * Math.cos(rad),
    y: this.game.world.centerY + (platform.radius + offset) * Math.sin(rad)
  };
};
/*
Player.prototype.moveCam = function() {
  var inner = this.innerPlatform.radius;
  var outter = this.outerPlatform.radius;

  var center = { x: this.game.world.centerX, y: this.game.world.centerY };
  var player = { x: this.x, y: this.y };

  var player_center = { x: player.x - center.x, y: player.y - center.y };
  var player_center_length = Math.sqrt(player_center.x * player_center.x + player_center.y * player_center.y);
  var player_center_normal = { x: player_center.x / player_center_length, y: player_center.y / player_center_length };

  var outter_pos;

  if(this.currentPlatform === this.innerPlatform){
    outter_pos = { x: player_center_normal.x * outter, y: player_center_normal.y * outter };
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
};
*/
Player.prototype.setPlatform = function(innerPlatform, outerPlatform){
  this.innerPlatform = innerPlatform;
  this.outerPlatform = outerPlatform;
  this.currentPlatform = innerPlatform;
};

Player.prototype.switchPlatform = function(){
  if (this.game.time.now < this.switchTime)
  {
    return;
  }

  var nextPlatform = this.currentPlatform === this.innerPlatform ? this.outerPlatform : this.innerPlatform;
  this.currentPlatform = nextPlatform;

  var TWEEN_TIME = 500;
  var facing = this.speed > 0 ? 1 : -1; 
  if(this.jumping){
    var timeElapsed = this.game.time.now - this.jumpStarted;
    //var TimePending = TWEEN_TIME - timeElapsed;

    this.currentAngle = this.currentAngle + (this.jumpDistance * facing * timeElapsed ) / TWEEN_TIME;
    this.jumpTween.stop();
    this.jumpTween = this.game.add.tween(this.body);
    this.jumping = true;
    
    this.jumpTween.to(this.getPosition(this.jumpDistance * facing * timeElapsed / TWEEN_TIME) , timeElapsed, Phaser.Easing.Linear.None, true, 0, false);
    //this.jumpTween.to(this.getPosition(this.jumpDistance * facing * TimePending / TWEEN_TIME) , TimePending, Phaser.Easing.Linear.None, true, 0, false);
    //this.jumpTween.to(this.getPosition(this.jumpDistance * facing * timeElapsed) , TimePending, Phaser.Easing.Linear.None, true, 0, false);
    this.jumpStarted = this.game.time.now;

    this.jumpTween.onComplete.add(this.onPlayerFloor, this);
  }
  else {
    this.jumpTween = this.game.add.tween(this.body);
    this.jumping = true;
    this.jumpTween.to(this.getPosition(this.jumpDistance * facing) , TWEEN_TIME, Phaser.Easing.Linear.None, true, 0, false);
    this.jumpStarted = this.game.time.now;
    
    this.jumpTween.onComplete.add(this.onPlayerFloor, this);

  }
  
  this.switchTime = this.game.time.now + 100;
};

Player.prototype.onPlayerFloor = function(){
  var facing = this.speed > 0 ? 1 : -1; 

  this.emitter.start(true, 5000, 250, 0, true);
  this.jumping = false;
  this.currentAngle = this.currentAngle + this.jumpDistance * facing;
  this.jumpStarted = null;
  this.platformChange = true;
};

module.exports = Player;
