
  'use strict';

  function Play() {}
  Play.prototype = {
    create: function() {
      var that = this;
      var getCircleShape = function(rad, fill, stroke){
            var shape = that.game.add.bitmapData(rad * 2, rad * 2);  //init rect
            shape.context.beginPath();
            shape.context.arc(rad, rad, rad, 0, 2 * Math.PI, false);
            if(fill){
              shape.context.fillStyle = fill;
              shape.context.fill();
            }
            shape.context.lineWidth = 1;
            shape.context.strokeStyle = stroke;
            shape.context.stroke();
            return shape;
      };
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);
      
      var stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
      var circlesCollisionGroup = this.game.physics.p2.createCollisionGroup();
      // this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      // this.sprite.inputEnabled = true;
      
      //this.game.physics.arcade.enable(this.sprite);
      // this.sprite.body.collideWorldBounds = true;
      // this.sprite.body.bounce.setTo(1,1);
      // this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      // this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      // this.sprite.events.onInputDown.add(this.clickListener, this);
      this.player = this.game.add.sprite(300,10, 'player');

      //var circle = new Phaser.Circle(this.game.world.centerX, 100,64);

      var shape = getCircleShape(200, null, 'white');
      // shape.lineStyle(2, 0xFFFFFF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
      // shape.beginFill(0xFFFF0B, 1); //
      // shape.drawCircle(this.game.world.centerX, this.game.world.centerY, 50);

      this.game.physics.p2.enable(this.player, true);
      this.player.body.setCollisionGroup(stuffCollisionGroup);
      
      this.shape = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY, shape );
      this.game.physics.p2.enable(this.shape, false);
      this.shape.body.setCircle(200);
      this.shape.body.static = true;
      this.shape.body.setCollisionGroup(circlesCollisionGroup);

      //this.player.body.velocity.x = -200;

      this.player.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
        //console.log('collide');
      });

      this.shape.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
        //console.log('collide');
      });

      this.game.camera.follow(this.player);

      // this.game.physics.p2.gravity.x = 0;
      // this.game.physics.p2.gravity.y = 0;
      // //this.player.body.velocity.x = 10000;
      this.cursors = this.game.input.keyboard.createCursorKeys();
      // this.player.body.rotateLeft(75);
      this.shape.body.mass = 1000;
      this.player.body.mass = 10;
    },
    update: function() {
      //accelerateToObject(this.player, this.shape, 100);
      // this.player.body.gravity = new Phaser.Point(this.shape.body.x - this.player.body.x, this.shape.body.y - this.player.body.y);
      // this.player.body.gravity = this.player.body.gravity.normalize().multiply(100, 100);
      // console.log(this.player.body.gravity);
      //this.player.body.data.gravityScale = 1000;
      //this.player.body.velocity.x = 100;
      
      function move(speed) {
        var obj1 = this.player;
        var obj2 = this.shape;

        if (typeof speed === 'undefined') { speed = 10000; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + this.game.math.degToRad(95);  // correct angle of angry bullets (depends on the sprite used)
        
        //obj1.body.applyForce([-Math.cos(angle) * speed, -Math.sin(angle) * speed], obj2.x, obj2.y);

        obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.force.y = Math.sin(angle) * speed;
   
      }

      move.call(this, 100);

        // this.player.body.rotateLeft(130);
        // this.player.body.thrust(5000);

      // if(this.cursors.left.isDown){
      //   this.player.body.rotateLeft(75);
      //   this.player.body.thrust(400);
      // }
      // if(this.cursors.right.isDown){
      //   this.player.body.rotateLeft(115);
      //   this.player.body.thrust(400);
      // }

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;