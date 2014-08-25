'use strict';

var Board = function(game) {
  Phaser.Group.call(this, game);

  this.remainingKeys = '? / ?';
  
  this.game = game;
  var style = { font: "25px Arial", fill: "#fff" };

  this.keys = this.game.add.sprite(0, 0, 'key', 0);
  this.keys.scale.x = this.keys.scale.y = 0.5;

  this.keysLeft = this.game.add.text(30, 0, this.remainingKeys, style);
  this.guiTimer = this.game.add.text(0, 30, "00:00", style);
  this.guiTimerPlatform = this.game.add.text(100, 30, "00:00", style);

  this.currentSeconds = 0;
  
  this.fixedToCamera = true;
  this.add(this.guiTimer);
  this.add(this.guiTimerPlatform);
  this.add(this.keys);
  this.add(this.keysLeft);
  
  this.startCount();
};

Board.prototype = Object.create(Phaser.Group.prototype);
Board.prototype.constructor = Board;

Board.prototype.update = function() {
  if (this._timeStarted){
    this.updateTimer();
  }
};

Board.prototype.startCount = function(){
  this._timeStarted = this.game.time.time;
  this._timeStartedPlatform = this.game.time.time;
};

Board.prototype.stopCountdown = function(){
  this._timeStarted = 0;
};

Board.prototype.resetCountdownPlatform = function(){
  this._timeStartedPlatform = this.game.time.time;
};

Board.prototype.updateTimer = function(){
  var elapsedFormat = function(actual){
    var seconds = Math.floor(actual / 1000) % 60;
    var milliseconds = Math.floor(actual) % 100;

    if (milliseconds < 10){
      milliseconds = '0' + milliseconds;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return {
      seconds: seconds,
      milliseconds: milliseconds
    };
  };
  var actual = elapsedFormat(this.game.time.time - this._timeStarted);
  var actualPlatform = elapsedFormat(this.game.time.time - this._timeStartedPlatform);

  this.guiTimer.setText(actual.seconds + '.' + actual.milliseconds);
  this.guiTimerPlatform.setText(actualPlatform.seconds + '.' + actualPlatform.milliseconds);
};

Board.prototype.setKeys = function(actual, total){
  this.keysLeft.setText(actual + ' / ' + total);
};

module.exports = Board;