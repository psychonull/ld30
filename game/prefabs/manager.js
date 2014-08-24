"use strict";

var Platform = require('../prefabs/platform'),
  Player = require('../prefabs/player'),
  Target = require('../prefabs/target'),
  Enemy = require('../prefabs/enemy'),
  map = require('../data/map');

var Manager = function(game) {
  this.game = game;

  //todo - Change bounds dynamically
  this.game.world.setBounds(0, 0, 100000, 100000);

  this.thrust = 10000;
  this.maxSpeed = 5;

  var stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var circlesCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var targetCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();

  var plPos = map[0].player;

  plPos.x += this.game.world.centerX;
  plPos.y += this.game.world.centerY;

  var targetPos = map[0].target;
  targetPos.x += this.game.world.centerX;
  targetPos.y += this.game.world.centerY;  

  this.player = this.game.add.existing(new Player(this.game, plPos.x, plPos.y) );
  this.player.body.setCollisionGroup(stuffCollisionGroup);
  this.game.camera.follow(this.player.cam);

  this.platform = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, 500) );
  this.platform.body.setCollisionGroup(circlesCollisionGroup);

  this.platform2 = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, 1000) );
  this.platform.body.setCollisionGroup(circlesCollisionGroup);

  this.target = this.game.add.existing(new Target(this.game, targetPos.x, targetPos.y));
  this.target.body.setCollisionGroup(targetCollisionGroup);

  map[0].elements.forEach(function(e){
    if (e.type === "enemy"){
      var enemyPos = { x: e.pos.x, y: e.pos.y };
      enemyPos.x += this.game.world.centerX;
      enemyPos.y += this.game.world.centerY;  

      this.enemy = this.game.add.existing(new Enemy(this.game, this.platform, enemyPos.x, enemyPos.y));
      this.enemy.body.setCollisionGroup(enemyCollisionGroup);
    }
  }, this);
/*
  this.enemy = this.game.add.existing(new Enemy(this.game, this.platform, this.game.world.centerX - 225, this.game.world.centerY - 225));
  this.enemy.body.setCollisionGroup(enemyCollisionGroup);
*/
  this.player.initPlatforms(this.platform, this.platform2);

  /*
  this.player.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });


  this.platform.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });
*/
  this.target.body.collides([targetCollisionGroup, stuffCollisionGroup], function(){
    
  });

  this.player.body.collides([stuffCollisionGroup, targetCollisionGroup], function(){
    //console.log('collide');
  });

  this.enemy.body.collides([enemyCollisionGroup, stuffCollisionGroup], function(){
    console.log('collide');
    //this.move();
  });

   this.player.body.collides([stuffCollisionGroup, enemyCollisionGroup], function(){
    //console.log('collide');
  });

  
  
};

Manager.prototype.update = function() {

};

module.exports = Manager;
