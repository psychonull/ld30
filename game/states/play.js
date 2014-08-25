"use strict";

var Manager = require('../prefabs/manager'),
  Board = require('../prefabs/board');

function Play() {}
Play.prototype = {
  create: function() {
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
        b.sprite.kill();
        var tween = that.game.add.tween(b.sprite);
        tween.to({alpha: 0} , 500, Phaser.Easing.Linear.None, true, 0, false);
        
        tween.onComplete.add(function(){
        }, that);

      }
    };

    var playerCollidesObstacle = function(){
      if(that.capturedKeys){
        that.capturedKeys--;
        that.board.setKeys(that.capturedKeys, that.neededKeys);

        mgr.makePlayerDropKey();
      }
    };

    var playerCollidesTarget = function(){
      mgr.setCurrentPlatform(mgr.current + 1);
      that.capturedKeys = 0;
      that.neededKeys = mgr.getCurrentLevel().keys && mgr.getCurrentLevel().keys.length || 0;
      that.board.setKeys(that.capturedKeys, that.neededKeys);
      that.board.resetCountdownPlatform();
    };

    mgr.player.body.onBeginContact.add(function(body, shapeA, shapeB, equation){
      if (body.sprite.key === "target" && this.neededKeys === this.capturedKeys){
        equation.enabled = false;
        playerCollidesTarget();
      }
      if(body.sprite.key === "key"){
        playerCollidesKey(body);
      }
      if(body.sprite.key === "obstacle"){
        playerCollidesObstacle();
      }    
    }, this);

    this.board = new Board(this.game);
    this.board.setKeys(this.capturedKeys, this.neededKeys);

    //Changelevel cheat
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.upKey.onDown.add(this.getMoveLevel(1), this);
    this.downKey.onDown.add(this.getMoveLevel(-1), this);

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
    this.game.state.start('gameover');
  },
  getMoveLevel: function(levels){
    return function(){
      this.manager.setCurrentPlatform(this.manager.current + levels);
      this.capturedKeys = 0;
      this.neededKeys = this.manager.getCurrentLevel().keys && this.manager.getCurrentLevel().keys.length || 0;
      this.board.setKeys(this.capturedKeys, this.neededKeys);
      this.board.resetCountdownPlatform();
    };
  }
};

module.exports = Play;