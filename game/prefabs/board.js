'use strict';

var helpers = require("./helpers");

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
  //if (this._timeStarted){
    this.updateTimer();
  //}
};

Board.prototype.startCount = function(){
  //this._timeStarted = this.game.time.time;
  this._timeStartedPlatform = this.game.time.time;
};

Board.prototype.stopCountdown = function(){
  //this._timeStarted = 0;
};

Board.prototype.finishedPlatform = function(platformIndex){
  this.game.playerState.addTimeStamp(platformIndex, this.game.time.time - this._timeStartedPlatform);
  this._timeStartedPlatform = this.game.time.time;
};

Board.prototype.updateTimer = function(){
  var actualPlatform = this.game.time.time - this._timeStartedPlatform;
  var actual = helpers.elapsedFormat(this.game.playerState.total + actualPlatform);
  
  actualPlatform = helpers.elapsedFormat(actualPlatform);

  this.guiTimer.setText(actual.minutes + ":" + actual.seconds + '.' + actual.milliseconds);
  this.guiTimerPlatform.setText(actualPlatform.minutes + ":" + actualPlatform.seconds + '.' + actualPlatform.milliseconds);
};

Board.prototype.setKeys = function(actual, total){
  this.keysLeft.setText(actual + ' / ' + total);
};

module.exports = Board;