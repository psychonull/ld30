"use strict";

var Platform = require('../prefabs/platform'),
  Player = require('../prefabs/player'),
  Target = require('../prefabs/target'),
  Enemy = require('../prefabs/enemy'),
  map = require('../data/map');

var Manager = function(game) {
  this.game = game;
  this.current = 0;
  this.platforms = [];

  //todo - Change bounds dynamically
  this.game.world.setBounds(0, 0, 100000, 100000);

  this.thrust = 10000;
  this.maxSpeed = 5;

  this.stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
  this.targetCollisionGroup = this.game.physics.p2.createCollisionGroup();
  this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();

  this.initPlatform();
  this.setCurrentPlatform();

  this.player.body.onBeginContact.add(function(body, shapeA, shapeB, equation){
    if (body.sprite.key === "target"){
      equation.enabled = false;
      this.setCurrentPlatform();
    }
  }, this);

  this.player.body.collides([this.stuffCollisionGroup, this.targetCollisionGroup], function(){    
    //console.log("collide!");
  }, this);

  this.player.body.collides([this.stuffCollisionGroup, this.enemyCollisionGroup], function(){
    console.log('collide with ENEMY');
  });

};

Manager.prototype.getWorldPoint = function(p) {
  return { 
    x: p.x + this.game.world.centerX, 
    y: p.y + this.game.world.centerX 
  };
};

Manager.prototype.setCurrentPlatform = function() {
  var index = this.current++;

  if (index === map.length -1){
    console.log("YOU WON!");
    return;
  }

  var plPos = this.getWorldPoint(map[index].player);

  if (!this.player){
    this.player = this.game.add.existing(new Player(this.game, plPos.x, plPos.y) );
    this.player.body.setCollisionGroup(this.stuffCollisionGroup);
    this.game.camera.follow(this.player);
  }
  else {
    this.player.x = plPos.x;
    this.player.y = plPos.y;
  }

  // --------------------------
  //TODO: Destroy Target and Enemies from the previous Platform 
  // --------------------------

  var targetPos = this.getWorldPoint(map[index].target);
  var target = this.game.add.existing(new Target(this.game, targetPos.x, targetPos.y));

  target.body.setCollisionGroup(this.targetCollisionGroup);
  target.body.collides([this.targetCollisionGroup, this.stuffCollisionGroup]);

  if (map[index].elements){
    map[index].elements.forEach(function(e){
      if (e.type === "enemy"){
        var enemyPos = this.getWorldPoint(e.pos);
        var enemy = this.game.add.existing(new Enemy(this.game, this.platforms[index], enemyPos.x, enemyPos.y));

        enemy.body.setCollisionGroup(this.enemyCollisionGroup);
        enemy.body.collides([this.enemyCollisionGroup, this.stuffCollisionGroup]);
      }
    }, this);
  }

  //this.initPlatform(index+1);
  this.player.setPlatform(this.platforms[index], this.platforms[index+1]);
};

Manager.prototype.initPlatform = function(/*index*/) {
/*
  var radius = (index+1)*500;
  var platformObj = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, radius, index) );
  this.platforms.push(platformObj);
*/

  map.forEach(function(platform, i){
    var radius = (i+1)*500;
    var platformObj = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, radius, i) );
    this.platforms.push(platformObj);
  }, this);

};

Manager.prototype.update = function() {

};

module.exports = Manager;
