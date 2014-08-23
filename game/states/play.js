  'use strict';
  var Platform = require('../prefabs/platform'),
    Player = require('../prefabs/player');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);
      
      var stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
      var circlesCollisionGroup = this.game.physics.p2.createCollisionGroup();

      this.player = this.game.add.existing(new Player(this.game, 300,10) );
      this.player.body.setCollisionGroup(stuffCollisionGroup);
      
      this.shape = this.game.add.existing( new Platform(this.game, this.game.world.centerX, this.game.world.centerY, 200) );
      this.shape.body.setCollisionGroup(circlesCollisionGroup);

      var d = this.game.physics.p2.createDistanceConstraint(this.player, this.shape, 230);
      console.log(d);
      this.player.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
        //console.log('collide');
      });

      this.shape.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
        //console.log('collide');
      });

      this.game.camera.follow(this.player);
    },
    update: function() {
      function move(speed) {
        var crazySpeed = 1;

        var obj1 = this.player;
        var obj2 = this.shape;

        if (typeof speed === 'undefined') { speed = 100; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + this.game.math.degToRad(90);
        
        obj1.body.force.x = Math.cos(angle) * speed;
        obj1.body.force.y = Math.sin(angle) * speed;
   
        obj1.body.rotation = obj1.body.rotation - this.game.math.degToRad(90);
        obj1.body.thrust(100);
      }

      move.call(this, 100);

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;