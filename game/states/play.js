'use strict';
var Manager = require('../prefabs/manager');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.setImpactEvents(true);

    this.manager = new Manager(this.game);

  },
  update: function() {
    this.manager.update();
  },
  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;