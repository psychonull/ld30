"use strict";
//var switchTime = 0;

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player', frame);
  this.game.physics.p2.enable(this, true);
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
  this.emitter.gravity = 200;
  this.emitter.setAlpha(1, 0, 300);
  this.emitter.setScale(0.3, 0, 0.3, 0, 3000);
  this.emitter.start(false, 3000, 5);
  this.camShakeTime = 0;
  this.platformChange = false;
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
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.jumping)
  {
    this.switchPlatform();
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
    this.speed+= 0.1;
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
    this.speed-= 0.1;
  }
  var speed = Math.sqrt(this.body.velocity.x * this.body.velocity.x + this.body.velocity.y * this.body.velocity.y);
  var run = this.animations.getAnimation("running");
  run.speed = speed / 4;

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

  if(this.platformChange && this.camShakeTime < 50){
    var min = -10;
    var max = 10;
    ++this.camShakeTime;
    if(this.camShakeTime >= 50){
      this.platformChange = false;
      this.camShakeTime = 0;
    }
    this.cam.x+= Math.floor(Math.random() * (max - min + 1)) + min;
    this.cam.y+= Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

Player.prototype.move = function() {
  if(!this.jumping){
    this.currentAngle = this.currentAngle + this.speed;
    var p = this.getPosition();
    this.body.x = p.x;
    this.body.y = p.y;
  }
  this.body.rotation = Math.atan2(this.currentPlatform.y - this.body.y, this.currentPlatform.x - this.body.x) + 270 * (Math.PI / 180);
};

Player.prototype.getPosition = function(angleOffset){
  var platform = this.currentPlatform,
    offset = this.height / 2 * (platform === this.outerPlatform ? -1 : 1);   
  var rad = (this.currentAngle + (angleOffset || 0)) * (Math.PI / 180); // Converting Degrees To Radiansradius
  return { 
    x: this.game.world.centerX + (platform.radius + offset) * Math.cos(rad),
    y: this.game.world.centerY + (platform.radius + offset) * Math.sin(rad)
  };
};

Player.prototype.moveCam = function() {
  // TODO: change this to 
  // var constraint = game.physics.p2.createLockConstraint(sprite, vu1, [0, 80], 0);
  // http://examples.phaser.io/_site/view_full.html?d=p2%20physics&f=lock+constraint.js&t=lock%20constraint

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

  /*
  this.cam.x = this.x;
  this.cam.y = this.y;
  */
};

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

  var jumpTween = this.game.add.tween(this.body);
  this.jumping = true;
  var facing = this.speed > 0 ? 1 : -1; 
  jumpTween.to(this.getPosition(this.jumpDistance * facing) , 500, Phaser.Easing.Linear.None, true, 0, false);

  jumpTween.onComplete.add(function(){
    this.jumping = false;
    this.currentAngle = this.currentAngle + this.jumpDistance * facing;
  }, this);

  this.switchTime = this.game.time.now + 300;
  this.platformChange = true;
};


module.exports = Player;
