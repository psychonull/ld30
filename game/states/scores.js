
var helpers = require("../prefabs/helpers");

function Tuto() {}

Tuto.prototype = {
  preload: function() {

  },
  create: function() {

    var cx = this.game.world.centerX;
    var cy = this.game.world.centerY;
 /*
    var times = [ 1500, 2500, 3000, 5000, 3000, 2222100, 32500 ];
    var total = 0;
*/
    var times = this.game.playerState.times;
    var total = this.game.playerState.total;

    var fontTitle = { font: '40px Arial', fill: '#ffffff', align: 'center'};
    var fontPartial = { font: '20px Arial', fill: '#ffffff', align: 'center'};
    var fontTotal = { font: '30px Arial', fill: '#ffffff', align: 'center'};

    var scores = this.game.add.text(cx, 50, "SCORES", fontTitle);
    scores.anchor.setTo(0.5, 0.5);

    for (var i=0; i<times.length; i++){
      //total+=times[i];

      var index = this.game.add.text(cx-10, (cy-180)+(i*30), "World " + (i+1) + ":",fontPartial);
      index.anchor.setTo(1, 0.5);
      
      var txt = helpers.elapsedFormat(times[i]);
      txt = txt.minutes + ":" + txt.seconds + "." + txt.milliseconds;

      var partial = this.game.add.text(cx+50, (cy-180)+(i*30), txt , fontPartial);
      partial.anchor.setTo(0.5, 0.5);
    }

    // Total
    var totalLbl = this.game.add.text(cx-60, cy+80, "Total:", fontTotal);
    totalLbl.anchor.setTo(0.5, 0.5);

    var txtTot = helpers.elapsedFormat(total);
    txtTot = txtTot.minutes + ":" + txtTot.seconds + "." + txtTot.milliseconds;
    
    var totalTxt = this.game.add.text(cx+50, cy+80, txtTot, fontTotal);
    totalTxt.anchor.setTo(0.5, 0.5);

    // Continue
    this.instructionsText = this.game.add.text(this.game.world.centerX, 460, 'Click anywhere to continue', 
      { font: '30px Arial', fill: '#ffffff', align: 'center'});
    
    this.instructionsText.anchor.setTo(0.5, 0.5);

  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('menu');
    }
  }
};

module.exports = Tuto;
