"use strict";
var Manager = require('../prefabs/manager'),
  Board = require('../prefabs/board'),
  map = require('../data/map');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.p2.setImpactEvents(true);

    var mgr = new Manager(this.game);
    this.manager = mgr;

    this.capturedKeys = 0;
    this.neededKeys = map[mgr.current - 1].keys && map[mgr.current - 1].keys.length || 0;

    mgr.player.body.collides([mgr.stuffCollisionGroup, mgr.keyCollisionGroup], function(a,b){
      if(b.sprite){
        this.capturedKeys++;
        b.sprite.destroy();
        console.log('collected %s / %s',this.capturedKeys,this.neededKeys);
      }
    }, this);

    mgr.player.body.onBeginContact.add(function(body, shapeA, shapeB, equation){
      if (body.sprite.key === "target" && this.neededKeys === this.capturedKeys){
        equation.enabled = false;
        mgr.setCurrentPlatform();

        this.capturedKeys = 0;
        this.neededKeys = map[mgr.current-1].keys && map[mgr.current-1].keys.length || 0;

      }
    }, this);

    this.board = new Board(this.game);

  },
  update: function() {
    this.manager.update();
  },
  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;