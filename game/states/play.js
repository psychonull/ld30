"use strict";

var Manager = require('../prefabs/manager'),
  Board = require('../prefabs/board'),
  PlayerStateManager = require("../prefabs/PlayerStateManager");

function Play() {}
Play.prototype = {
  create: function() {
    this.game.playerState = new PlayerStateManager();

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.p2.setImpactEvents(true);

    var mgr = new Manager(this.game);
    this.manager = mgr;

    this.capturedKeys = 0;
    this.neededKeys = mgr.getCurrentLevel().keys && mgr.getCurrentLevel().keys.length || 0;

    mgr.player.body.collides([mgr.stuffCollisionGroup, mgr.keyCollisionGroup]);
    mgr.player.body.collides([mgr.stuffCollisionGroup, mgr.enemyCollisionGroup]);
    mgr.player.body.collides([mgr.stuffCollisionGroup, mgr.targetCollisionGroup]);

    var that = this;
    var playerCollidesKey = function(b){
      if(b.sprite){
        that.capturedKeys++;
        that.board.setKeys(that.capturedKeys, that.neededKeys);
        mgr.player.pickupSound.play();
        b.sprite.kill();
        var tween = that.game.add.tween(b.sprite);
        tween.to({alpha: 0} , 500, Phaser.Easing.Linear.None, true, 0, false);
        
        tween.onComplete.add(function(){
        }, that);

      }

    };

    var muteBtn = document.getElementById('mute');
    if(muteBtn){
      muteBtn.addEventListener('click', function(){
        that.sound.mute = !that.sound.mute;
      });
    }

    var playerCollidesObstacle = function(){
      if(that.capturedKeys){
        that.capturedKeys--;
        mgr.player.explosionSound.play();
        that.board.setKeys(that.capturedKeys, that.neededKeys);

        mgr.makePlayerDropKey();
      }
      else{
        mgr.player.hurtSound.play();
      }
      mgr.player.shootParticles();
    };

    var playerCollidesTarget = function(){
      mgr.player.goalSound.play();

      that.board.finishedPlatform(mgr.current);
      if (!mgr.setCurrentPlatform(mgr.current + 1)){
        return;
      }
      
      that.capturedKeys = 0;
      that.neededKeys = mgr.getCurrentLevel().keys && mgr.getCurrentLevel().keys.length || 0;
      that.board.setKeys(that.capturedKeys, that.neededKeys);
    };

    mgr.player.body.onBeginContact.add(function(body, shapeA, shapeB, equation){
      if (body.sprite.key === "target" && this.neededKeys === this.capturedKeys){
        equation.enabled = false;
        playerCollidesTarget();
      }
      else if(body.sprite.key === "key"){
        playerCollidesKey(body);
      }
      else if(body.sprite.key === "obstacle"){
        playerCollidesObstacle();
      }    
    }, this);

    this.board = new Board(this.game);
    this.board.setKeys(this.capturedKeys, this.neededKeys);

    //Changelevel cheat
    // this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    // this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    // this.upKey.onDown.add(this.getMoveLevel(1), this);
    // this.downKey.onDown.add(this.getMoveLevel(-1), this);

  },
  update: function() {
    this.manager.update();

    if (this.neededKeys === this.capturedKeys){
      this.manager.target.open();
    }
    else {
      this.manager.target.close();
    }
  },
  clickListener: function() {
    
  },
  getMoveLevel: function(levels){
    return function(){
      this.board.finishedPlatform(this.manager.current);
      
      if (!this.manager.setCurrentPlatform(this.manager.current + levels)){
        return;
      }

      this.capturedKeys = 0;
      this.neededKeys = this.manager.getCurrentLevel().keys && this.manager.getCurrentLevel().keys.length || 0;
      this.board.setKeys(this.capturedKeys, this.neededKeys);
    };
  }
};

module.exports = Play;