(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ld30');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/preload":11}],2:[function(require,module,exports){
"use strict";

//var switchTime = 0;

var Enemy = function(game, platform, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.game.physics.p2.enable(this, true);
  this.body.mass = 100;
  this.maxSpeed = 50;
  this.platform = platform;
  this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.platform, this.platform.radius + this.height / 2);
  //this.THRUST = 100;
  //this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

  //this.cam = this.game.add.sprite(this.x, this.y);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  /*
  if(this.currentPlatform){
    //this.move();
    //this.moveCam();
  }
  */

  //this.limitSpeedP2JS(this.body, this.maxSpeed);
};

Enemy.prototype.move = function() {
  //var platform = this.currentPlatform;
  /*
  var angle = Math.atan2(platform.y - this.y, platform.x - this.x);
  this.body.rotation = angle;
  this.body.thrust(this.THRUST * -1);
  */
};

module.exports = Enemy;

},{}],3:[function(require,module,exports){
"use strict";

var Platform = require('../prefabs/platform'),
  Player = require('../prefabs/player'),
  Target = require('../prefabs/target'),
  Enemy = require('../prefabs/enemy');

var Manager = function(game) {
  //ar world = 1;
  this.game = game;

  //todo - Change bounds dynamically
  this.game.world.setBounds(0, 0, 100000, 100000);

  this.thrust = 10000;
  this.maxSpeed = 5;

  var stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var circlesCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var targetCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();

  var plPos = {
    "x": 515,
    "y": -395
  };

  plPos.x += this.game.world.centerX;
  plPos.y += this.game.world.centerY;

  this.player = this.game.add.existing(new Player(this.game, plPos.x, plPos.y) );
  this.player.body.setCollisionGroup(stuffCollisionGroup);
  this.game.camera.follow(this.player.cam);

  this.platform = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, 500) );
  this.platform.body.setCollisionGroup(circlesCollisionGroup);

  this.platform2 = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, 1000) );
  this.platform.body.setCollisionGroup(circlesCollisionGroup);

  this.target = this.game.add.existing(new Target(this.game, this.game.world.centerX + 225, this.game.world.centerY + 225));
  this.target.body.setCollisionGroup(targetCollisionGroup);

  this.enemy = this.game.add.existing(new Enemy(this.game, this.platform, this.game.world.centerX - 225, this.game.world.centerY - 225));
  this.enemy.body.setCollisionGroup(enemyCollisionGroup);

  this.player.initPlatforms(this.platform, this.platform2);

  /*
  this.player.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });


  this.platform.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });
*/
  this.target.body.collides([targetCollisionGroup, stuffCollisionGroup], function(){
    //console.log('collide');
  });

  this.player.body.collides([stuffCollisionGroup, targetCollisionGroup], function(){
    //console.log('collide');
  });

  this.enemy.body.collides([enemyCollisionGroup, stuffCollisionGroup], function(){
    console.log('collide');
    //this.move();
  });

   this.player.body.collides([stuffCollisionGroup, enemyCollisionGroup], function(){
    //console.log('collide');
  });

  
  
};

Manager.prototype.update = function() {

};

module.exports = Manager;

},{"../prefabs/enemy":2,"../prefabs/platform":4,"../prefabs/player":5,"../prefabs/target":6}],4:[function(require,module,exports){
"use strict";

var Platform = function(game, x, y, rad) {
  this.game = game;
  this.radius = rad;
  var shape = this.getCircleShape(rad, null, 'white', 10);
  Phaser.Sprite.call(this, game, x, y, shape);

  game.physics.p2.enable(this, false);
  this.body.setCircle(200);
  this.body.static = true;
  
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Platform.prototype.getCircleShape = function(rad, fill, stroke, lineWidth){
  var margin = 20 + lineWidth;
  var center = rad + margin / 2;

  var size = (rad * 2) + margin;
  var shape = this.game.add.bitmapData(size, size);  //init rect
  
  shape.context.beginPath();
  shape.context.arc(center, center, rad, 0, 2 * Math.PI, false);
  /*
  if(fill){
    shape.context.fillStyle = fill;
    shape.context.fill();
  }*/

  shape.context.lineWidth = lineWidth;
  shape.context.strokeStyle = stroke;
  shape.context.stroke();
/*
  var w = 2;
  for(var i=6; i>0; i--){
    w+=5;
    shape.context.lineWidth = w;
    shape.context.strokeStyle = "rgba(255,255,255,"+(i/10)+")";
    shape.context.stroke();
  }
*/
  return shape;
};

module.exports = Platform;

},{}],5:[function(require,module,exports){
"use strict";
var switchTime = 0;

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player', frame);
  this.game.physics.p2.enable(this, true);
  this.body.mass = 10;
  this.maxSpeed = 50;
  this.THRUST = 10000;
  this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

  this.cam = this.game.add.sprite(this.x, this.y);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if(this.currentPlatform){
    this.move();
    this.cam.x = this.x;
    this.cam.y = this.y;
    //this.moveCam();
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
  {
    this.switchPlatform();
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
    this.maxSpeed++;
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
    this.maxSpeed--;
  }
  this.limitSpeedP2JS(this.body, this.maxSpeed);
};

Player.prototype.move = function() {
  var platform = this.currentPlatform;
  
  var angle = Math.atan2(platform.y - this.y, platform.x - this.x);
  this.body.rotation = angle;
  this.body.thrust(this.THRUST * -1);
};

Player.prototype.moveCam = function() {
  var inner = this.innerPlatform.radius;
  var outter = this.outerPlatform.radius;

  var center = { x: this.game.world.centerX, y: this.game.world.centerY };
  var player = { x: this.x, y: this.y };

  var player_center = { x: player.x - center.x, y: player.y - center.y };
  var player_center_length = Math.sqrt(player_center.x * player_center.x + player_center.y * player_center.y);
  var player_center_normal = { x: player_center.x / player_center_length, y: player_center.y / player_center_length };

  var outter_pos;

  if(this.currentPlatform === this.innerPlatform){
    outter_pos = { x: player_center_normal.x * outter, y: player_center_normal.y * outter };
  }
  else {
    outter_pos = { x: player_center_normal.x * inner, y: player_center_normal.y * inner };
  }

  outter_pos.x += center.x;
  outter_pos.y += center.y;

  var dif = { x: outter_pos.x - player.x, y: outter_pos.y - player.y };

  this.cam.x = dif.x/2;
  this.cam.y = dif.y/2;

  this.cam.x += player.x;
  this.cam.y += player.y;

  //console.log(dif);

  /*
  this.cam.x = this.x;
  this.cam.y = this.y;
  */
};

Player.prototype.limitSpeedP2JS = function(p2Body, maxSpeed) {
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
};

Player.prototype.initPlatforms = function(innerPlatform, outerPlatform){
  this.innerPlatform = innerPlatform;
  this.outerPlatform = outerPlatform;
  this.currentPlatform = innerPlatform;
  this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.currentPlatform, this.currentPlatform.radius + this.height / 2);
};

Player.prototype.switchPlatform = function(){

  if (this.game.time.now < switchTime)
  {
    return;
  }

  var nextPlatform = this.currentPlatform === this.innerPlatform ? this.outerPlatform : this.innerPlatform;
  var offset = this.height / 2 * (nextPlatform === this.outerPlatform ? 1 : -1);

  this.currentPlatform = nextPlatform;
  this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.currentPlatform, this.currentPlatform.radius + offset);

  switchTime = this.game.time.now + 300;
};


module.exports = Player;

},{}],6:[function(require,module,exports){
"use strict";

var Target = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'target', frame);

  game.physics.p2.enable(this, false);
  this.body.kinematic = true;
  
};

Target.prototype = Object.create(Phaser.Sprite.prototype);
Target.prototype.constructor = Target;

Target.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Target;

},{}],7:[function(require,module,exports){

"use strict";

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

"use strict";
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],9:[function(require,module,exports){

"use strict";
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],10:[function(require,module,exports){
"use strict";
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
},{"../prefabs/manager":3}],11:[function(require,module,exports){

"use strict";
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');

  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])