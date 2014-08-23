'use strict';

var Platform = require('../prefabs/platform'),
  Player = require('../prefabs/player');

var Manager = function(game) {
  var world = 1;
  this.game = game;

  //todo - Change bounds dynamically
  this.game.world.setBounds(0, 0, 1000, 1000);

  this.thrust = 10000;
  this.maxSpeed = 5;

  var stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var circlesCollisionGroup = this.game.physics.p2.createCollisionGroup();

  this.player = this.game.add.existing(new Player(this.game, 300, 10) );
  this.player.body.setCollisionGroup(stuffCollisionGroup);
  this.game.camera.follow(this.player);

  this.platform = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, 100) );
  this.platform.body.setCollisionGroup(circlesCollisionGroup);

  var d = this.game.physics.p2.createDistanceConstraint(this.player, this.platform, this.platform.radius + this.player.height / 2);

  this.player.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });

  this.platform.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });

  
  
};

Manager.prototype.update = function() {
  var player = this.player,
    platform = this.platform,
    thrust = this.thrust,
    maxSpeed = this.maxSpeed;
  
  var angle = Math.atan2(platform.y - player.y, platform.x - player.x);
  player.body.rotation = angle;
  player.body.thrust(thrust * -1);

  this.limitSpeedP2JS(this.player.body, 5);
};

Manager.prototype.limitSpeedP2JS = function(p2Body, maxSpeed) {
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

module.exports = Manager;
