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

  this.platform2 = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, 400) );
  this.platform.body.setCollisionGroup(circlesCollisionGroup);

  this.player.initPlatforms(this.platform, this.platform2);

  this.player.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });

  this.platform.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });

  
  
};

Manager.prototype.update = function() {

};

module.exports = Manager;
