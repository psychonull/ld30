"use strict";
var Manager = require('../prefabs/manager');

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

    var that = this;
    var playerCollidesKey = function(b){
      if(b.sprite){
        that.capturedKeys++;

        b.sprite.kill();
        var tween = that.game.add.tween(b.sprite);
        tween.to({alpha: 0} , 500, Phaser.Easing.Linear.None, true, 0, false);
        
        tween.onComplete.add(function(){
        }, that);

        //b.sprite.destroy();
        console.log('collected %s / %s',that.capturedKeys,that.neededKeys);
      }
    };

    var playerCollidesObstacle = function(){
      if(that.capturedKeys){
        that.capturedKeys--;
        mgr.makePlayerDropKey();
        console.log('key dropped! - %s / %s',that.capturedKeys,that.neededKeys);
      }
    };

    mgr.player.body.onBeginContact.add(function(body, shapeA, shapeB, equation){
      if (body.sprite.key === "target" && this.neededKeys === this.capturedKeys){
        equation.enabled = false;
        mgr.setCurrentPlatform();

        this.capturedKeys = 0;
        this.neededKeys = mgr.getCurrentLevel().keys && mgr.getCurrentLevel().keys.length || 0;
      }
      if(body.sprite.key === "key"){
        playerCollidesKey(body);
      }
      if(body.sprite.key === "obstacle"){
        playerCollidesObstacle();
      }    
    }, this);

    mgr.player.body.collides([mgr.stuffCollisionGroup, mgr.enemyCollisionGroup]);


  },
  update: function() {
    this.manager.update();
  },
  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;