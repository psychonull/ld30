(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
'use strict';

var Platform = require('../prefabs/platform'),
  Player = require('../prefabs/player');

var Manager = function(game) {
  var world = 1;
  this.game = game;

  this.thrust = 10000;
  this.maxSpeed = 5;

  var stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
  var circlesCollisionGroup = this.game.physics.p2.createCollisionGroup();

  this.player = this.game.add.existing(new Player(this.game, 300, 10) );
  this.player.body.setCollisionGroup(stuffCollisionGroup);
  
  this.platform = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, 200) );
  this.platform.body.setCollisionGroup(circlesCollisionGroup);

  var d = this.game.physics.p2.createDistanceConstraint(this.player, this.platform, this.platform.radius + this.player.height / 2);

  this.player.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });

  this.platform.body.collides([stuffCollisionGroup, circlesCollisionGroup], function(){
    //console.log('collide');
  });
  
};

Manager.prototype.update = function() {
  var player = this.player,
    platform = this.platform,
    thrust = this.thrust,
    maxSpeed = this.maxSpeed;
  
  var angle = Math.atan2(platform.y - player.y, platform.x - player.x);
  player.body.rotation = angle;
  player.body.thrust(thrust * -1);

  this.limitSpeedP2JS(this.player.body, 5);
};

Manager.prototype.limitSpeedP2JS = function(p2Body, maxSpeed) {
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

module.exports = Manager;

},{"../prefabs/platform":3,"../prefabs/player":4}],3:[function(require,module,exports){
'use strict';

var Platform = function(game, x, y, rad) {
  this.game = game;
  this.radius = rad;
  var shape = this.getCircleShape(rad, null, 'white');
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

Platform.prototype.getCircleShape = function(rad, fill, stroke){
  var shape = this.game.add.bitmapData(rad * 2, rad * 2);  //init rect
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

module.exports = Platform;

},{}],4:[function(require,module,exports){
'use strict';

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player', frame);
  this.game.physics.p2.enable(this, true);

  // initialize your prefab here
  
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Player;

},{}],5:[function(require,module,exports){

'use strict';

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

},{}],6:[function(require,module,exports){

'use strict';
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

},{}],7:[function(require,module,exports){

'use strict';
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

},{}],8:[function(require,module,exports){
'use strict';
var Manager = require('../prefabs/manager');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.setImpactEvents(true);

    this.manager = new Manager(this.game);

    this.game.camera.follow(this.player);
  },
  update: function() {
    this.manager.update();
  },
  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;
},{"../prefabs/manager":2}],9:[function(require,module,exports){

'use strict';
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