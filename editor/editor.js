
var canvas;
var ctx;
var output;
var input;
var importBtn;
var center = { x: 0, y: 0 };
var oneScale = 500;
var scale = 100;
var platformsAm = 7;
var platforms = [];
var size = { x: 0, y: 0 };

var colors = {
  player: [0,0,255,1],
  target: [0,255,0,1],
  enemy: [255,0,0,1],
  box: [190,150,60,1]
};

$(function(){
  initCanvasMap();
  attachEvents();
  initPlatforms();
  drawAll();
});

function getElement(){
  var opt = $("#elements option:selected");

  return {
    type: opt.text()
  };
}

function initCanvasMap(){
  var margin = (platformsAm * scale) * 1.5;
  var s = (platformsAm * scale) + margin;
  
  size = { x: s, y: s };
  
  canvas = document.getElementById("game-viewport");
  canvas.width = size.x;
  canvas.height = size.y;
  ctx = canvas.getContext("2d");

  center = { 
    x: size.x - size.x/2,
    y: size.y - size.y/2
  };

  output = document.getElementById("output");
  input = document.getElementById("input");
  importBtn = document.getElementById("import");
}

function getCoordsEvent(e){
  var x, y
    , body = document.body
    , docEle = document.documentElement;

  if (e.pageX || e.pageY) { 
    x = e.pageX;
    y = e.pageY;
  }
  else { 
    x = e.clientX + body.scrollLeft + docEle.scrollLeft; 
    y = e.clientY + body.scrollTop + docEle.scrollTop; 
  } 
  
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  
  return { x: x, y: y };
}

function vectorDif(a, b){
  return { x: b.x - a.x, y: b.y - a.y };
}

function vectorLength(a, b){
  var dif = vectorDif(a, b);
  return Math.sqrt(dif.x*dif.x + dif.y*dif.y);
};

function pointInCircle(a, b, radius){
  return vectorLength(a, b) < radius;
};

function getPlatformByCoords(p){
  var found;
  platforms.forEach(function(plat){
    if (pointInCircle(p, center, plat.radius)){
      if (!found || (found && found.radius > plat.radius)){
        found = plat;
      }
    }
  });
  return found;
}

function attachEvents(){

  importBtn.onclick = parseInput();

  canvas.onmouseup = function(e){
    var pos = getCoordsEvent(e);
    var plat = getPlatformByCoords(pos);

    if (!plat) return;

    var action = getElement();
    if (action.type === "remove"){
      removeElement(plat, pos);
      return;
    }

    setElement(action, plat, pos);
  };
}

function removeElement(platform, pos){

  if (platform.player && pointInCircle(pos, platform.player, 10)){
    delete platform.player;
    drawAll();
    return;
  }

  if (platform.target && pointInCircle(pos, platform.target, 10)){
    delete platform.target;
    drawAll();
    return;
  }

  if (platform.elements && platform.elements.length){
    platform.elements.some(function(ele, i){
      if (pointInCircle(pos, ele.pos, 10)){
        platform.elements.splice(i, 1);
        drawAll();
        return true;
      }
    });
  }
}

function setElement(action, platform, pos){
  switch(action.type){
    case "player":
      platform.player = pos;
    break;
    case "target":
      platform.target = pos;
    break;
    default: 
      if (!platform.elements){
        platform.elements = [];
      }

      platform.elements.push({
        type: action.type,
        pos: pos
      });
    break;
  }

  drawAll();
}

function initPlatforms(){
  for (var i=1; i<=platformsAm; i++){
    platforms.push({
      radius: i*scale
    });
  }
};

function drawAll(){
  ctx.clearRect(0, 0, size.x, size.y);

  for (var i=platforms.length-1; i>=0; i--){
    var platform = platforms[i];

    var opts = {
      pos: center,
      radius: platform.radius,
      fill: { color: (i===0 ? "#000" : "#3C3C3C") },
      stroke: {
        color: "#fff",
        size: 2
      }
    };

    drawCircle(opts);

    if (platform.player){
      drawCircle({
        pos: platform.player,
        fill: { color: ColorToRGBA(colors.player)},
        radius: scale/10
      });
    }

    if (platform.target){
      drawCircle({
        pos: platform.target,
        fill: { color: ColorToRGBA(colors.target)},
        radius: scale/10
      });
    }

    if (platform.elements && platform.elements.length){
      platform.elements.forEach(function(ele){
        drawCircle({
          pos: ele.pos,
          fill: { color: ColorToRGBA(colors[ele.type])},
          radius: scale/10
        });
      });
    }
  };

  sendOutput();
}

function drawCircle(ps){
  ctx.beginPath();
  ctx.arc(ps.pos.x, ps.pos.y, ps.radius, 0, 2 * Math.PI, false);

  if (ps.fill){
    ctx.fillStyle = ps.fill.color || "rgba(255,255,255,0.1)";
    ctx.fill();
  }

  if (ps.stroke){
    ctx.lineWidth = ps.stroke.size || 1;
    ctx.strokeStyle = ps.stroke.color || "#000";
    ctx.stroke();
  }
};

function ColorToRGBA(arr){
  return "rgba(" + arr[0] + "," + arr[1] + "," + arr[2] + "," + (arr[3] || 1) + ")";
}

function parseInput(){
  console.log($(input).text());
}

function toWorldPosition(pos){
  var scaleUnit = oneScale/scale;

  var dif = vectorDif(center, pos);
  dif.x *= scaleUnit;
  dif.y *= scaleUnit;

  return dif;
}

function toEditorPosition(pos){
  return pos;
}

function sendOutput(){
  var outputJSON = [];
  
  platforms.forEach(function(platform, i){
    if (i===0){
      // skip first circle 
      return;
    }
    
    var outPlatform = {};

    if (platform.player){
      outPlatform.player = toWorldPosition(platform.player);
    }

    if (platform.target){
      outPlatform.target = toWorldPosition(platform.target);
    }

    if (platform.elements && platform.elements.length){
      if (!outPlatform.elements){
        outPlatform.elements = [];
      }

      platform.elements.forEach(function(ele){
        outPlatform.elements.push({
          type: ele.type,
          pos: toWorldPosition(ele.pos)
        });
      });
    }

    outputJSON.push(outPlatform);
  });

  var str = JSON.stringify(outputJSON, undefined, 2);
  var html = syntaxHighlight(str);
  $(output).html(html);
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
