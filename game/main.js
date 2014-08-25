"use strict";

var max = {
  x: 900,
  y: 600
};

function getWindowSize(){
  var ele = document.documentElement
    , body = document.body;

  function getSize(which){
    return Math.max(
      ele["client" + which], 
      body["scroll" + which], 
      ele["scroll" + which], 
      body["offset" + which], 
      ele["offset" + which]
    );
  }

  var size = {
    x: getSize("Width"),
    y: getSize("Height")
  };

  if (size.x > max.x){
    size.x = max.x;
  }

  if (size.y > max.y){
    size.y = max.y;
  }

  return size;
}

window.onload = function () {
  var name = "ld30";
  var ctn = document.getElementById(name);
  var size = getWindowSize();

  ctn.style.width = size.x + "px";
  ctn.style.height = size.y + "px";

  var game = new Phaser.Game(size.x, size.y, Phaser.AUTO, name);

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};