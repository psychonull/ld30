(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = [
  {
    "player": {
      "x": 325,
      "y": -540
    },
    "target": {
      "x": 445,
      "y": -320
    },
    "elements": [
      {
        "type": "enemy",
        "pos": {
          "x": -930,
          "y": -25
        }
      },
      {
        "type": "box",
        "pos": {
          "x": -755,
          "y": -570
        }
      },
      {
        "type": "box",
        "pos": {
          "x": -855,
          "y": 390
        }
      },
      {
        "type": "box",
        "pos": {
          "x": 60,
          "y": 935
        }
      },
      {
        "type": "box",
        "pos": {
          "x": 905,
          "y": 300
        }
      },
      {
        "type": "box",
        "pos": {
          "x": -120,
          "y": -940
        }
      },
      {
        "type": "enemy",
        "pos": {
          "x": -490,
          "y": 790
        }
      }
    ]
  },
  {
    "player": {
      "x": 1080,
      "y": 55
    },
    "target": {
      "x": 1020,
      "y": 270
    },
    "elements": [
      {
        "type": "enemy",
        "pos": {
          "x": -525,
          "y": -1370
        }
      },
      {
        "type": "enemy",
        "pos": {
          "x": 935,
          "y": 1070
        }
      }
    ]
  },
  {
    "player": {
      "x": -1555,
      "y": 125
    },
    "target": {
      "x": -1940,
      "y": -255
    }
  },
  {
    "player": {
      "x": 1990,
      "y": -625
    },
    "target": {
      "x": 2000,
      "y": -425
    }
  },
  {
    "player": {
      "x": -105,
      "y": -2550
    },
    "target": {
      "x": 110,
      "y": -2550
    }
  },
  {}
];

},{}],2:[function(require,module,exports){
"use strict";

//global variables
window.onload = function () {
  var game = new Phaser.Game(1100, 800, Phaser.AUTO, 'ld30');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":8,"./states/gameover":9,"./states/menu":10,"./states/play":11,"./states/preload":12}],3:[function(require,module,exports){
"use strict";

//var switchTime = 0;

var Enemy = function(game, platform, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.game.physics.p2.enable(this, true);
  this.body.kinematic = true;

  this.body.mass = 100;
  this.maxSpeed = 50;
  
  //this.platform = platform;
  
  //this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.platform, this.platform.radius + this.height / 2);

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

},{}],4:[function(require,module,exports){
"use strict";

var Platform = require('../prefabs/platform'),
  Player = require('../prefabs/player'),
  Target = require('../prefabs/target'),
  Enemy = require('../prefabs/enemy'),
  map = require('../data/map');

var Manager = function(game) {
  this.game = game;
  this.current = 0;
  this.platforms = [];

  //todo - Change bounds dynamically
  this.game.world.setBounds(0, 0, 100000, 100000);

  this.thrust = 10000;
  this.maxSpeed = 5;

  this.stuffCollisionGroup = this.game.physics.p2.createCollisionGroup();
  this.targetCollisionGroup = this.game.physics.p2.createCollisionGroup();
  this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();

  this.initPlatform();
  this.setCurrentPlatform();

  this.player.body.onBeginContact.add(function(body, shapeA, shapeB, equation){
    if (body.sprite.key === "target"){
      equation.enabled = false;
      this.setCurrentPlatform();
    }
  }, this);

  this.player.body.collides([this.stuffCollisionGroup, this.targetCollisionGroup], function(){    
    //console.log("collide!");
  }, this);

  this.player.body.collides([this.stuffCollisionGroup, this.enemyCollisionGroup], function(){
    console.log('collide with ENEMY');
  });

};

Manager.prototype.getWorldPoint = function(p) {
  return { 
    x: p.x + this.game.world.centerX, 
    y: p.y + this.game.world.centerX 
  };
};

Manager.prototype.setCurrentPlatform = function() {
  var index = this.current++;

  if (index === map.length -1){
    console.log("YOU WON!");
    return;
  }

  var plPos = this.getWorldPoint(map[index].player);

  if (!this.player){
    this.player = this.game.add.existing(new Player(this.game, plPos.x, plPos.y) );
    this.player.body.setCollisionGroup(this.stuffCollisionGroup);
    this.game.camera.follow(this.player.cam);
  }
  else {
    this.player.x = plPos.x;
    this.player.y = plPos.y;
  }

  // --------------------------
  //TODO: Destroy Target and Enemies from the previous Platform 
  // --------------------------

  var targetPos = this.getWorldPoint(map[index].target);
  var target = this.game.add.existing(new Target(this.game, targetPos.x, targetPos.y));

  target.body.setCollisionGroup(this.targetCollisionGroup);
  target.body.collides([this.targetCollisionGroup, this.stuffCollisionGroup]);

  if (map[index].elements){
    map[index].elements.forEach(function(e){
      if (e.type === "enemy"){
        var enemyPos = this.getWorldPoint(e.pos);
        var enemy = this.game.add.existing(new Enemy(this.game, this.platforms[index], enemyPos.x, enemyPos.y));

        enemy.body.setCollisionGroup(this.enemyCollisionGroup);
        enemy.body.collides([this.enemyCollisionGroup, this.stuffCollisionGroup]);
      }
    }, this);
  }

  //this.initPlatform(index+1);
  this.player.setPlatform(this.platforms[index], this.platforms[index+1]);
};

Manager.prototype.initPlatform = function(/*index*/) {
/*
  var radius = (index+1)*500;
  var platformObj = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, radius, index) );
  this.platforms.push(platformObj);
*/

  map.forEach(function(platform, i){
    var radius = (i+1)*500;
    var platformObj = this.game.add.existing(new Platform(this.game, this.game.world.centerX, this.game.world.centerY, radius, i) );
    this.platforms.push(platformObj);
  }, this);

};

Manager.prototype.update = function() {

};

module.exports = Manager;

},{"../data/map":1,"../prefabs/enemy":3,"../prefabs/platform":5,"../prefabs/player":6,"../prefabs/target":7}],5:[function(require,module,exports){
"use strict";

var Platform = function(game, x, y, rad, i) {
  this.game = game;
  this.radius = rad;
  //var shape = this.getCircleShape(rad, null, 'white', 10);
  //Phaser.Sprite.call(this, game, x, y, shape);

  Phaser.Sprite.call(this, game, x, y, "shape");

  var graphics = game.add.graphics(0, 0);
  graphics.beginFill(0xFF000+i, 0.2);
  graphics.lineStyle(10, 0xffffff, 1);

  graphics.drawCircle(x, y, rad);

  game.physics.p2.enable(this, false);
  this.body.setCircle(200);
  this.body.static = true;
  
};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};
/*
Platform.prototype.getCircleShape = function(rad, fill, stroke, lineWidth){
  var margin = 20 + lineWidth;
  var center = rad + margin / 2;

  var size = (rad * 2) + margin;
  var shape = this.game.add.bitmapData(size, size);  //init rect
  
  shape.context.beginPath();
  shape.context.arc(center, center, rad, 0, 2 * Math.PI, false);

  shape.context.lineWidth = lineWidth;
  shape.context.strokeStyle = stroke;
  shape.context.stroke();

  return shape;
};
*/
module.exports = Platform;

},{}],6:[function(require,module,exports){
"use strict";
//var switchTime = 0;

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player', frame);
  this.game.physics.p2.enable(this, true);
  this.body.mass = 10;
  this.maxSpeed = 50;
  this.THRUST = 10000;
  this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

  this.cam = this.game.add.sprite(this.x, this.y);

  this.switchTime = 0;
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
  // TODO: change this to 
  // var constraint = game.physics.p2.createLockConstraint(sprite, vu1, [0, 80], 0);
  // http://examples.phaser.io/_site/view_full.html?d=p2%20physics&f=lock+constraint.js&t=lock%20constraint

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

Player.prototype.setPlatform = function(innerPlatform, outerPlatform){
  this.game.physics.p2.removeConstraint(this.distanceConstraint);
  
  this.innerPlatform = innerPlatform;
  this.outerPlatform = outerPlatform;
  this.currentPlatform = innerPlatform;
  this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.currentPlatform, this.currentPlatform.radius + this.height / 2);
};

Player.prototype.switchPlatform = function(){

  if (this.game.time.now < this.switchTime)
  {
    return;
  }

  var nextPlatform = this.currentPlatform === this.innerPlatform ? this.outerPlatform : this.innerPlatform;
  var offset = this.height / 2 * (nextPlatform === this.outerPlatform ? 1 : -1);

  this.currentPlatform = nextPlatform;
  this.distanceConstraint = this.game.physics.p2.createDistanceConstraint(this, this.currentPlatform, this.currentPlatform.radius + offset);

  this.switchTime = this.game.time.now + 300;
};


module.exports = Player;

},{}],7:[function(require,module,exports){
"use strict";

var Target = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'target', frame);

  game.physics.p2.enable(this, false);
  this.body.static = true;
  this.body.dynamic = false;
  this.body.data.shapes[0].sensor = true;
  this.body.sprite.key = "target";
};

Target.prototype = Object.create(Phaser.Sprite.prototype);
Target.prototype.constructor = Target;

Target.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Target;

},{}],8:[function(require,module,exports){

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

},{}],9:[function(require,module,exports){

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

},{}],10:[function(require,module,exports){

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

},{}],11:[function(require,module,exports){
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
},{"../prefabs/manager":4}],12:[function(require,module,exports){

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

},{}]},{},[2])