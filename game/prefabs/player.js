
var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player', frame);
  
  this.game.physics.p2.enable(this, false);
  
  this.body.data.gravityScale = 0;
  this.body.mass = 10;
  this.speed = 80;
  this.currentAngle = 0;
  this.jumpDistance = 2000;

  this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

  this.switchTime = 0;
  this.animations.add('running', [0,1,2,3,4], 10, true);
  this.animations.play('running');

  this.emitter = game.add.emitter(game.world.centerX, game.world.centerY - 300, 400);
  this.emitter.makeParticles( ['smoke' ] );
  this.emitter.gravity = 0;
  this.emitter.setAlpha(0.5, 0, 300);
  this.emitter.setScale(3, 0, 3, 0, 3000);
  
  this.camShakeTime = 0;
  this.camShakeTimeLong = 20;
  this.platformChange = false;

  this.allowSwitchTime = 20;
  this.switchPlatformKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.switchPlatformKey.onDown.add(this.switchPlatform, this);

  this.loopBackEmitter = game.add.emitter(game.world.centerX, game.world.centerY - 300, 300);
  this.loopBackEmitter.makeParticles( ['player' ] );
  this.loopBackEmitter.gravity = 200;
  this.loopBackEmitter.setAlpha(1, 0, 300);
  this.loopBackEmitter.setScale(1, 1, 0.5, 0.5, 3000);
  this.loopBackEmitter.start(false, 2000, 2);

  this.loopBackEmitter.visible = false;

  this.collisionEmitter = this.game.add.emitter(50, 50, 20);

  this.cam = this.game.add.sprite(this.x, this.y /*, "key"*/);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.S) && this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
  {
    if(this.stopped) {
      this.start();
    } 
    else { 
      this.stop();
    }
  }
  
  if (this.stopped){
    this.body.angularDamping = 0;
    this.body.angularForce = 0;
    this.body.angularVelocity = 0;

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    
    this.cam.x = this.x;
    this.cam.y = this.y;
    return;
  }

  if(this.currentPlatform){
    this.move();
    this.moveCam();
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
  {
    this.speed+= 1;
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
  {
    this.speed-= 1;
  }
  
  var run = this.animations.getAnimation("running");
  run.speed = Math.abs(this.getNormalizedSpeed() * 8);

  this.emitter.emitX = this.x;
  this.emitter.emitY = this.y;

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

  var dir = -1 * this.getNormalizedSpeed()/this.getNormalizedSpeed();
  this.scale.x = dir;
  
  if(this.currentPlatform === this.innerPlatform){
    this.scale.y = 1;
  }
  else {
    this.scale.y = -1;
  }

  //LoopbackParticles
  if(this.loopBackEmitter){
    var px = this.body.velocity.x;
    var py = this.body.velocity.y;
    px *= -1;
    py *= -1;

    if(this.loopBackEmitter.minParticleSpeed){
      this.loopBackEmitter.minParticleSpeed.set(px, py);
    }
    if(this.loopBackEmitter.maxParticleSpeed){
      this.loopBackEmitter.maxParticleSpeed.set(px, py);
      
    }

    this.loopBackEmitter.emitX = this.x - (this.height/2);
    this.loopBackEmitter.emitY = this.y;
    //this.loopBackEmitter.rotation = this.currentAngle;
    //this.loopBackEmitter.rotation = 90 * (Math.PI / 180);
    //this.loopBackEmitter.angle = this.body.rotation * 180 / Math.PI;
    this.loopBackEmitter.angularDrag = 1;
  }


};

Player.prototype.move = function() {
  if(!this.jumping){
    this.currentAngle = this.currentAngle + this.getNormalizedSpeed();
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

Player.prototype.getPosition2 = function(currAngle, angleOffset){
  var platform = this.currentPlatform,
    offset = this.height / 2;
  var rad = (currAngle + (angleOffset || 0)) * (Math.PI / 180); // Converting Degrees To Radiansradius

  return { 
    x: this.game.world.centerX + (platform.radius + offset) * Math.cos(rad),
    y: this.game.world.centerY + (platform.radius + offset) * Math.sin(rad)
  };
};

Player.prototype.moveCam = function() {
  var inner = this.innerPlatform.radius;
  var outter = this.outerPlatform.radius;
  var radius = ((outter - inner) / 2 ) + inner;

  var center = { x: this.game.world.centerX, y: this.game.world.centerY };
  var player = { x: this.x, y: this.y };
  //var cameraOffset = 10 - (this.platformIndex);
  if (this.jumping){
    var TWEEN_TIME = 500;
    var facing = this.speed > 0 ? 1 : -1; 
    var timeElapsed = this.game.time.now - this.jumpStarted;
    player = this.getPosition2(this.currentAngle + this.getNormalizedJumpDistance() * facing * timeElapsed / TWEEN_TIME, this.getNormalizedCameraOffset());
  }
  else {
    player = this.getPosition2(this.currentAngle, this.getNormalizedCameraOffset());
  }

  var plCenter = { x: player.x - center.x, y: player.y - center.y };
  var plCenter_length = Math.sqrt(plCenter.x * plCenter.x + plCenter.y * plCenter.y);
  var plCenter_normal = { x: plCenter.x / plCenter_length, y: plCenter.y / plCenter_length };

  var outter_pos;
  outter_pos = { x: plCenter_normal.x * radius, y: plCenter_normal.y * radius };

  outter_pos.x += center.x;
  outter_pos.y += center.y;

  var dif = { x: outter_pos.x - player.x, y: outter_pos.y - player.y };

  this.cam.x = dif.x;
  this.cam.y = dif.y;

  this.cam.x += player.x;
  this.cam.y += player.y;

};


Player.prototype.setPlatform = function(innerPlatform, outerPlatform, index){
  this.innerPlatform = innerPlatform;
  this.outerPlatform = outerPlatform;
  this.currentPlatform = innerPlatform;
  this.platformIndex = index;
};

Player.prototype.switchPlatform = function(){
  if (this.stopped){
    return;
  }

  if (this.game.time.now < this.switchTime)
  {
    return;
  }

  var nextPlatform = this.currentPlatform === this.innerPlatform ? this.outerPlatform : this.innerPlatform;
  this.currentPlatform = nextPlatform;

  this.loopBackEmitter.visible = true;

  var TWEEN_TIME = 500;
  var facing = this.speed > 0 ? 1 : -1; 
  if(this.jumping){
    var timeElapsed = this.game.time.now - this.jumpStarted;
    //var TimePending = TWEEN_TIME - timeElapsed;

    this.currentAngle = this.currentAngle + (this.getNormalizedJumpDistance() * facing * timeElapsed ) / TWEEN_TIME;
    this.jumpTween.stop();
    this.jumpTween = this.game.add.tween(this.body);
    this.jumping = true;
    
    this.jumpTween.to(this.getPosition(this.getNormalizedJumpDistance() * facing * timeElapsed / TWEEN_TIME) , timeElapsed, Phaser.Easing.Linear.None, true, 0, false);
    //this.jumpTween.to(this.getPosition(this.jumpDistance * facing * TimePending / TWEEN_TIME) , TimePending, Phaser.Easing.Linear.None, true, 0, false);
    //this.jumpTween.to(this.getPosition(this.jumpDistance * facing * timeElapsed) , TimePending, Phaser.Easing.Linear.None, true, 0, false);
    this.jumpStarted = this.game.time.now;

    this.jumpTween.onComplete.add(this.onPlayerFloor(this.getNormalizedJumpDistance() * facing * timeElapsed / TWEEN_TIME), this);
  }
  else {
    this.jumpTween = this.game.add.tween(this.body);
    this.jumping = true;
    this.jumpTween.to(this.getPosition(this.getNormalizedJumpDistance() * facing) , TWEEN_TIME, Phaser.Easing.Linear.None, true, 0, false);
    this.jumpStarted = this.game.time.now;
    
    this.jumpTween.onComplete.add(this.onPlayerFloor(this.getNormalizedJumpDistance() * facing), this);

  }
  
  this.switchTime = this.game.time.now + this.allowSwitchTime;
};

Player.prototype.onPlayerFloor = function(angleToAdd){
  return function(){
    //var facing = this.speed > 0 ? 1 : -1; 

    this.loopBackEmitter.visible = false;

    this.emitter.start(true, 5000, 250, 0, true);
    this.jumping = false;
    //this.currentAngle = this.currentAngle + this.jumpDistance * facing;
    this.currentAngle = this.currentAngle + angleToAdd;
    this.jumpStarted = null;
    this.platformChange = true;
  };
};

Player.prototype.stop = function(){
  this.animations.stop("running", true);
  this.stopped = true;
};

Player.prototype.start = function(){
  this.animations.play("running");
  this.stopped = false;
};

Player.prototype.animateOnStart = function(position){
  this.stop();
  this.jumping = false;
  if(this.jumpTween){
    this.jumpTween.stop();
  }

  var p1 = { x: this.game.world.centerX, y: this.game.world.centerY };
  var p2 = position;
  this.currentAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

  var BubleTime = 500;
  var TeleportTime = 1000;

  var bubleTweenBig = this.game.add.tween(this.scale).to({ x: -5, y: 5 }, BubleTime);
  var teleportTween = this.game.add.tween(this.body).to(position, TeleportTime);
  var bubleTweenSmall = this.game.add.tween(this.scale).to({ x: -1, y: 1 }, BubleTime);

  bubleTweenBig.onComplete.addOnce(function(){
    teleportTween.start();
  });

  teleportTween.onComplete.addOnce(function(){
    bubleTweenSmall.start();
  });

  bubleTweenSmall.onComplete.addOnce(function(){
    this.start();
  }, this);

  bubleTweenBig.start();
};

Player.prototype.getNormalizedSpeed = function(){
  var distanceVector = {
    x: this.body.x - this.game.world.centerX,
    y: this.body.y - this.game.world.centerY,
  };
  var distance = Math.sqrt(Math.pow(distanceVector.x, 2) + Math.pow(distanceVector.y, 2));
  return (this.speed * 1 / distance) * 10;
};

Player.prototype.getNormalizedCameraOffset = function(){
  // var distanceVector = {
  //   x: this.body.x - this.game.world.centerX,
  //   y: this.body.y - this.game.world.centerY,
  // };
  // var distance = Math.sqrt(Math.pow(distanceVector.x, 2) + Math.pow(distanceVector.y, 2));
  // console.log(distance);
  // return (this.cameraOffset - (distance / 1000));
  var CAMERA_OFFSET_BY_LEVEL = [10, 9, 5, 5, 4, 4, 3, 3, 2];
  return CAMERA_OFFSET_BY_LEVEL[this.platformIndex];
};

Player.prototype.getNormalizedJumpDistance = function(){
  return (this.jumpDistance * 1 / this.innerPlatform.radius) * 10;
};

Player.prototype.shootParticles = function(){
  this.collisionEmitter.x = this.body.x;
  this.collisionEmitter.y = this.body.y;

  this.collisionEmitter.makeParticles('particles', [0,1,2,3]);

  this.collisionEmitter.minParticleScale = 0.2;
  this.collisionEmitter.maxParticleScale = 1;

  this.collisionEmitter.minParticleSpeed.setTo(-700, -700);
  this.collisionEmitter.maxParticleSpeed.setTo(700, 700);
  this.collisionEmitter.gravity = 0;

  this.collisionEmitter.start(true, 100, 0, 50);
};


module.exports = Player;
