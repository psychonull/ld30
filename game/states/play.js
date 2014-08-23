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

      var d = this.game.physics.p2.createDistanceConstraint(this.player, this.shape, this.shape.radius + this.player.height / 2);
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
        obj1.body.rotation = angle;
        
        obj1.body.thrust(speed * -1);
        obj1.body.velocity.x 
      }

      var limitSpeedP2JS = function(p2Body, maxSpeed) {
          var x = p2Body.velocity.x;
          var y = p2Body.velocity.y;

          if (Math.pow(x, 2) + Math.pow(y, 2) > Math.pow(maxSpeed, 2)) {

              var a = Math.atan2(y, x);
              x = -20 * Math.cos(a) * maxSpeed;
              y = -20 * Math.sin(a) * maxSpeed;
              p2Body.velocity.x = x;
              p2Body.velocity.y = y;
          }
          return p2Body;
      }

      move.call(this, 10000);
      limitSpeedP2JS.call(this, this.player.body, 5);
    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;