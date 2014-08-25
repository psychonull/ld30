
module.exports = {

  elapsedFormat: function (actual){

    var milliseconds = parseInt((actual%1000)/100)
        , seconds = parseInt((actual/1000)%60)
        , minutes = parseInt((actual/(1000*60))%60);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return {
      minutes: minutes,
      seconds: seconds,
      milliseconds: milliseconds
    };
  }

};