
var canvas;
var ctx;
var output;
var input;
var importBtn;
var center = { x: 0, y: 0 };
var oneScale = 500;
var scale = 100;
var spSize = 25;
var platformsAm = 7;
var platforms = [];
var size = { x: 0, y: 0 };

var images = {
    "player": "../assets/dude.png"
  , "target": "../assets/portal.png"
  , "key": "../assets/key.png"
  , "enemy": "../assets/bg.png"
  , "obstacle:toaster": "../assets/toaster.png"
  , "obstacle:clock": "../assets/clock.png"
  , "obstacle:pillow": "../assets/pillow.png"
  , "obstacle:cup": "../assets/cup.png"
  , "obstacle:teapot": "../assets/teapot.png"
};

$(function(){

  window.repository
    .addResources(images)
    .on('complete', function(){
      
      initCanvasMap();
      attachEvents();
      initPlatforms();
      drawAll();

    })
    .load();
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

  importBtn.onclick = parseInput;

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

  document.getElementById('output').onclick = function(){
    selectText('output');
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

  if (platform.keys && platform.keys.length){
    platform.keys.some(function(ele, i){
      if (pointInCircle(pos, ele, 10)){
        platform.keys.splice(i, 1);
        drawAll();
        return true;
      }
    });
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
    case "key":
      if (!platform.keys){
        platform.keys = [];
      }
      platform.keys.push(pos);
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
      drawSprite({
        resource: "player",
        pos: platform.player,
        sp: { x: 0, y: 0, w: 50, h: 50 }
      });
    }

    if (platform.target){
      drawSprite({
        resource: "target",
        pos: platform.target,
        sp: { x: 0, y: 0, w: 100, h: 100 }
      });
    }

    if (platform.elements && platform.elements.length){
      platform.elements.forEach(function(ele){
        var spsize = 50;
        if (ele.type.indexOf("pillow")>-1){
          spsize = 100;
        }

        drawSprite({
          resource: ele.type,
          pos: ele.pos,
          sp: { x: 0, y: 0, w: spsize, h: spsize }
        });
      });
    }

    if (platform.keys && platform.keys.length){
      platform.keys.forEach(function(ele){
        drawSprite({
          resource: "key",
          pos: ele,
          sp: { x: 0, y: 0, w: 50, h: 50 }
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

function drawSprite(ps){
  var img = window.repository[ps.resource]
    , x = ps.pos.x - spSize/2
    , y = ps.pos.y - spSize/2
    , w = spSize//ps.size.x
    , h = spSize//ps.size.y
    , sp = ps.sp;

  function draw(){
    if (sp){
      ctx.drawImage(img, sp.x, sp.y, sp.w, sp.h, x, y, w, h);
    }
    else {
      ctx.drawImage(img, x, y, w, h);
    }
  }

  draw();
};

function ColorToRGBA(arr){
  return "rgba(" + arr[0] + "," + arr[1] + "," + arr[2] + "," + (arr[3] || 1) + ")";
}

function parseInput(){
  var jsonStr = $(input).val();
  var platformsIn;

  jsonStr = jsonStr.replace("module.exports =", "");
  jsonStr = jsonStr.replace(";", "");

  try {
    platformsIn = JSON.parse(jsonStr);
  }
  catch(ex){
    console.dir(ex);
    alert("Malformed JSON");
    return;
  }

  // first platform (only core circle)
  platforms = [{
    radius: scale
  }];

  platformsIn.forEach(function(platformIn, i){
    var platform = {
      radius: (i+2)*scale
    };
    
    if (platformIn.player){
      platform.player = toEditorPosition(platformIn.player);
    }

    if (platformIn.target){
      platform.target = toEditorPosition(platformIn.target);
    }

    if (platformIn.elements && platformIn.elements.length){
      if (!platform.elements){
        platform.elements = [];
      }

      platformIn.elements.forEach(function(ele){
        platform.elements.push({
          type: ele.type,
          pos: toEditorPosition(ele.pos)
        });
      });
    }

    if (platformIn.keys && platformIn.keys.length){
      if (!platform.keys){
        platform.keys = [];
      }

      platformIn.keys.forEach(function(ele){
        platform.keys.push(
          toEditorPosition(ele.pos)
        );
      });
    }

    platforms.push(platform);
  });

  drawAll();
}

function toWorldPosition(pos){
  var scaleUnit = oneScale/scale;

  var dif = vectorDif(center, pos);
  dif.x *= scaleUnit;
  dif.y *= scaleUnit;

  return dif;
}

function toEditorPosition(pos){
  var scaleUnit = oneScale/scale;

  pos.x /= scaleUnit;
  pos.y /= scaleUnit;

  pos.x += center.x;
  pos.y += center.y;

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

    if (platform.keys && platform.keys.length){
      if (!outPlatform.keys){
        outPlatform.keys = [];
      }

      platform.keys.forEach(function(ele){
        outPlatform.keys.push(
          toWorldPosition(ele)
        );
      });
    }

    outputJSON.push(outPlatform);
  });

  var str = JSON.stringify(outputJSON, undefined, 2);
  var html = syntaxHighlight(str);

  html = "module.exports = " + html + ";";
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

function selectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) { //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();        
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}


/* REPO */

window.repository = (function(){
  var resources = {}
    , loaded = 0
    , getCount = function(){
        return Object.keys(resources).length;
      };
  
  var events = {
      complete: function(){}
    , report: function(){}
    , error: function(){}
  };

  var imageLoaded = function() {
    var current = getCount();
    var prg = (++loaded * 100) / current;

    if (loaded <= current){
      events.report(prg);

      if (prg >= 100) { 
        events.complete();
      }
    }
  };
  
  var imageFailed = function(evt, etc){
    events.error(evt, etc);       
  };

  return {
    on: function(eventName, callback){
      if (events[eventName]) {
        events[eventName] = callback;
      }
      return this;
    },
    
    load: function(){
      loaded = 0;
      for (var img in resources) {
        this[img] = new window.Image();
        this[img].onload = imageLoaded;
        this[img].onerror = imageFailed;
        this[img].src = resources[img];
      }
      return this;
    },
    
    addResources: function(newResources){
      for(var r in newResources){
        resources[r] = newResources[r];
      }
      return this;
    }
    
  };
  
})();
