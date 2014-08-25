"use strict";

var Platform = require('../prefabs/platform'),
  Player = require('../prefabs/player'),
  Target = require('../prefabs/target'),
  Enemy = require('../prefabs/enemy'),
  Obstacle = require('../prefabs/obstacle'),
  Key = require('../prefabs/key'),
  map = require('../data/map');

var Manager = function(game) {
  this.game = game;
  this.current = 0;
  this.platforms = [];

  //todo - Change bounds dynamically
  this.game.world.setBounds(0, 0, 100000, 100000);

  //this.game.add.tileSprite(0, 0, 100000, 100000, 'bg');
  this.bg = this.game.add.tileSprite(0, 0, 100000, 100000, 'bg');

  this.thrust = 10000;
  this.maxSpeed = 5;

  this.stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
  this.targetCollisionGroup = this.game.physics.p2.createCollisionGroup();
  this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
  this.keyCollisionGroup = this.game.physics.p2.createCollisionGroup();

  this.initPlatform();

  this.keys = {}; //this.game.add.group();
  this.obstacles = this.game.add.group();
  this.setCurrentPlatform(this.current + 1);
  this.gotoScores = false;
};

Manager.prototype.getWorldPoint = function(p) {
  return { 
    x: p.x + this.game.world.centerX, 
    y: p.y + this.game.world.centerX 
  };
};

Manager.prototype.setCurrentPlatform = function(index) {
  if (this.current === map.length){
    this.gotoScores = true;
    return false;
  }

  this.destroyLevel(this.current);

  this.current = index;
  index = index - 1;

  var plPos = this.getWorldPoint(map[index].player);

  if (!this.player){
    this.player = this.game.add.existing(new Player(this.game, plPos.x, plPos.y) );
    this.player.body.setCollisionGroup(this.stuffCollisionGroup);
    this.game.camera.follow(this.player.cam);
  }
  else {
    this.player.animateOnStart(plPos);
  }

  // --------------------------
  //TODO: Destroy Target and Enemies from the previous Platform 
  // --------------------------

  var targetPos = this.getWorldPoint(map[index].target);
  this.target = this.game.add.existing(new Target(this.game, targetPos.x, targetPos.y));

  this.target.body.setCollisionGroup(this.targetCollisionGroup);
  this.target.body.collides([this.targetCollisionGroup, this.stuffCollisionGroup]);
  
  //TODO: User object pools for performance
  if (map[index].elements){
    map[index].elements.forEach(function(e){
      if (e.type === "enemy"){
        var enemyPos = this.getWorldPoint(e.pos);
        var enemy = this.game.add.existing(new Enemy(this.game, this.platforms[index], enemyPos.x, enemyPos.y));

        enemy.body.setCollisionGroup(this.enemyCollisionGroup);
        enemy.body.collides([this.enemyCollisionGroup, this.stuffCollisionGroup]);
      }
      else if (e.type.indexOf("obstacle:")>-1){
        var obstaclePos = this.getWorldPoint(e.pos);
        var obstacle = new Obstacle(this.game, obstaclePos.x, obstaclePos.y, e.type, index);
        this.obstacles.add(obstacle);//this.game.add.existing();

        obstacle.body.setCollisionGroup(this.enemyCollisionGroup);
        obstacle.body.collides([this.enemyCollisionGroup, this.stuffCollisionGroup]);
      }

    }, this);
  }

  if (map[index].keys){
    map[index].keys.forEach(function(e){
      var keyPos = this.getWorldPoint(e);
      var key = new Key(this.game, keyPos.x, keyPos.y);
      if(!this.keys[index]){
        this.keys[index] = this.game.add.group();
      }
      this.keys[index].add(key);

      key.body.setCollisionGroup(this.keyCollisionGroup);
      key.body.collides([this.stuffCollisionGroup]);
      key.mapPosition = keyPos;
    }, this);
  }

  this.player.setPlatform(this.platforms[index], this.platforms[index+1], index + 1);

  return true;
};

Manager.prototype.initPlatform = function(/*index*/) {

  for (var i=map.length; i>=0; i--){
    var radius = (i+1)*500;
    var platformObj = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, radius, i) );
    this.platforms[i] = platformObj;
  }

};

Manager.prototype.update = function() {
  if (this.gotoScores){
    this.game.state.start('menu');
  }
};

Manager.prototype.makePlayerDropKey = function(){

  var animKey = new Key(this.game, this.player.x, this.player.y);
  this.game.add.existing(animKey);

  var key = this.keys[this.current - 1].getFirstDead();
  if(key){
    
    var tween = this.game.add.tween(animKey.body);
    var distance = Math.sqrt(Math.pow(key.mapPosition.x - animKey.body.x, 2) + Math.pow(key.mapPosition.y - animKey.body.y, 2));
    tween.to({x: key.mapPosition.x, y: key.mapPosition.y} , 600 + (distance * 0.5), Phaser.Easing.Sinusoidal.in, true, 0, false);
    key.revive();
    key.exists = false;
    tween.onComplete.add(function(){
      key.exists = true;
      key.body.x = key.mapPosition.x; //this.player.x + 100;
      key.body.y = key.mapPosition.y; //this.player.y + 100;
      key.alpha = 1;
      animKey.destroy();
    }, this);

  }
  else {
    //key = new Key(this.game, this.player.x + 30, this.player.y + 30);
    console.error('no key to revive');
    return;
  }
  
};

Manager.prototype.getCurrentLevel = function(){
  return map[this.current - 1];
};

Manager.prototype.destroyLevel = function(){
  if(this.target){
    this.target.destroy();
    this.target = null;
  }
  if(this.obstacles){
    this.obstacles.destroy(true);
    this.obstacles = this.game.add.group();
  }
  if(this.keys[this.current - 1]){
    this.keys[this.current - 1].destroy(true); 
  }
};

module.exports = Manager;
