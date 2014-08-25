'use strict';

var PlayerStateManager = function(){
  this.times = [0,0,0,0,0,0,0];
  this.total = 0;
};

PlayerStateManager.prototype = {
  addTimeStamp: function(wIndex, time){
    this.times[wIndex] = time;
    this.total = 0;

    for (var i=0; i<this.times.length; i++){
      this.total += this.times[i];
    }
  },
  clearTimes: function(){
    this.times = [0,0,0,0,0,0,0];
    this.total = 0;
  }
};

module.exports = PlayerStateManager;