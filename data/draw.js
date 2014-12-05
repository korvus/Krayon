

//https://bgrins.github.io/spectrum/

//http://blogzinet.free.fr/blog/index.php?post/2013/05/17/Blocage-du-contenu-mixte-dans-Mozilla-Firefox-23-Aurora
//https://davidsimpson.me/2013/10/10/how-to-allow-not-block-mixed-content-in-web-browsers/
//https://bugzilla.mozilla.org/show_bug.cgi?id=886663
// > https://bugzilla.mozilla.org/show_bug.cgi?id=866522
// > https://bugzilla.mozilla.org/show_bug.cgi?id=1014545
//https://www.eff.org/https-everywhere/
//http://stackoverflow.com/questions/14367711/bookmarklet-on-https-page
//http://content-security-policy.com/

/*  Bookmarks */

var ABBDbrushCanvas = "";
var ABBDcanvas = "";
var ABBDbrush = "";
var ABBDslider = "";
var nodraw = 0;
var drawing = false;
var lastpos = {x:-1,y:-1};
var sizeBrush = 1;
var exa = "#000000";
var eraser = false;
var type = "round"
var firstPos = {x:0,y:0};
var startDrawForms = false;
var modefusion = "source-over";
/* Text mod */
var createtextarea = false;
var realCalculation = false;
var editingtxt = false;
var ffamily = "Times, serif";


self.port.on("init", function(params){

  //console.log(params);

  if(document.doctype != null){
    defineBehavior(params);
  }else{
    alert("Sorry, but this plugin works only on webpage");
    //params[1].disabled = true;
  }
  
});

function on_change(){
  var biggness = ABBDslider.firstChild.value;
  nodraw = 1;
  percent(biggness);
  //toslide(ABBDbrush);
}

function previsuBrush(){
  ABBDslider.addEventListener("mousemove", on_change, true);
}

function percent(value){
  var ctxBrush = ABBDbrush.getContext("2d");
  sbs(value,ctxBrush);
  sizeBrush = value;
  ABBDbrushCanvas.style.zIndex = 4;
}


function sbs(size,ctxBrush){
  ctxBrush.lineWidth = 1;
  ctxBrush.strokeStyle = "rgba(100,100,100,1)";
  ctxBrush.fillStyle = "rgba(100,100,100,0.5)";
  ctxBrush.beginPath();
  ctxBrush.clearRect(0,0,200,200);
  if(type == "round"){
      ctxBrush.arc(75, 75, (size/2), 0, Math.PI*2, true);
  }else if(type == "miter"){
      ctxBrush.strokeRect(75-(size/2), 75-(size/2), size, size);
  }
  ctxBrush.stroke();
  ctxBrush.closePath();
}

function stopBrush(ctxBrush){
  //if(editingtxt == false){nodraw = false;}else{nodraw = true;}
  nodraw = editingtxt !== false;
  cleanBrushCanvas(ctxBrush);
}

function cleanBrushCanvas(ctxBrush){
  ctxBrush.clearRect(0,0,200,200);
}

function runNext(){

  ABBDbrushCanvas = document.getElementById("brush");
  ABBDcanvas = document.getElementById("fwABBDwindow");
  ABBDbrush = document.getElementById("ABBDbrush");
  ABBDslider = document.getElementById("ABBDslider");

  window.hauteurcv = window.innerHeight;
  window.largeurcv = window.innerWidth;
  var ctxBrush = ABBDbrush.getContext("2d");
  initCV(largeurcv,hauteurcv);
  ABBDcanvas.width  = largeurcv;
  ABBDcanvas.height = hauteurcv;

  ABBDslider.addEventListener("mousedown", previsuBrush, true);
  ABBDslider.addEventListener("mouseup", function(){stopBrush(ctxBrush);}, true);

  /*

  $b("#sliderABBD").mouseup(function(e){
      if(editingtxt == false){nodraw = false;}else{nodraw = true;}
      $b(this).children(".ui-slider-handle").unbind("mousemove");
      cleanBrushCanvas(ctxBrush);
  })

  $b(window).resize(function(){
      resizeCanvas(canvas);
  });

  $b('.cp').ColorPicker({
      flat:false,
      color: '#000000',
      onShow: function(){
          nodraw = true;
      },
      onChange: function (hsb, hex, rgb) {
          $b('.cp div').css('backgroundColor', '#' + hex);
          if(eraser==false){
              exa = "#"+hex;
          }
      },
      onHide: function(){
          if(editingtxt == false){
              drawing = false;
              nodraw = false;
          }else{
              $b("#thisActive").css({"color":exa});
          }
      }
  });

  $b(".colorpicker *").click(function(e){
      drawing = false;
  })

  $b(".p4 #gomme").bind("click",function(e){
      initSoft();
      $b(this).addClass("active").next().removeClass("active").removeClass("on");
      $b(".drawtrait, .drawsquare, .drawcircle,.p6 a").removeClass("active");
      e.preventDefault();
      nodraw = false;
      startDrawForms = false;
      eraser = true;
      modefusion = "destination-out";
  })

  inittools();

  $b(".p5 span").click(function(e){
      initSoft();
      e.preventDefault();s
      $b(".p5 span,.p4 a, .p6 a").removeClass("active").removeClass("on");
      $b(this).addClass("active");
      nodraw = true;
      drawForm();
  })

  $b("#entertext").click(function(e){
      reinitxt();
      $b(".p4 a,.p5 span").removeClass("active").removeClass("on");
      $b(".p6 span").removeClass("hide");
      $b(this).addClass("active");
      $b(".fwABBDcanvas").addClass("crosshairstyle");
      nodraw = true;
      drawing = false;
      startDrawForms = false;         
      editingtxt = true;
      createtextarea = true;
      initTextarea(0,0);
  })

  $b("#eraseall").click(function(e){
      e.preventDefault();
      $b(".ABBDtxtarea").remove();
      clearAll(largeurcv,hauteurcv);
  })

  $b(".close").click(function(e){
      $b(".fwABBDcanvas").remove();
      removeEventListener("mousedown", on_mousedown, true);
      removeEventListener("mousemove", on_mousemove, true);
      removeEventListener("mouseup", on_mouseup, true);
  })
  */
}

function initCV(largeurCanvas,hauteurCanvas){
  var canvas = document.getElementById("fwABBDwindow");
  var canvasTmp = document.getElementById("fwABBDwindowTemp");
  canvas.width=largeurCanvas;
  canvas.height=hauteurCanvas;
  var ctx = canvas.getContext("2d");
  if(canvasTmp){canvasTmp.parentNode.removeChild(temporary);}
  addEventListener("mousedown", on_mousedown, true);
  addEventListener("mousemove", on_mousemove, true);
  addEventListener("mouseup", on_mouseup, true);
}

function on_mousedown(e){
  if(createtextarea == false){drawing = true;}else{drawing = false;}
  lastpos = transform_event_coord(e);
}

function on_mousemove(e){

  if (!drawing){
    return;
  }
  if(nodraw==true){
    return;
  }

  var pos = transform_event_coord(e);

  var canvas = document.getElementById("fwABBDwindow");
  var ctx = canvas.getContext("2d");

  ctx.globalCompositeOperation = modefusion;//Mode de superposition des éléments -- pour la gomme
  ctx.strokeStyle = exa;//couleur
  ctx.fillStyle = exa;
  ctx.lineWidth = sizeBrush;//Largeur du trait.
  ctx.lineJoin = type;
  ctx.lineCap = "square";
  if(type == "miter"){
    ctx.lineWidth = sizeBrush;
    ctx.fillRect(pos.x-(sizeBrush/2), pos.y-(sizeBrush/2),sizeBrush ,sizeBrush);
    ctx.strokeRect (pos.x-(sizeBrush/2), pos.y-(sizeBrush/2),0 ,0);//Comptour du carré = 0
  }
  ctx.beginPath();
  ctx.moveTo(lastpos.x, lastpos.y);
  ctx.lineTo(pos.x, pos.y);
  ctx.closePath();
  ctx.stroke();
 
  lastpos = pos;
}

function on_mouseup(e){
    drawing = false;
}

function addCSS(source){
	var head = document.getElementsByTagName('HEAD')[0];
	var css = document.createElement('link');
	css.setAttribute('type','text/css');
	css.setAttribute('media','screen');
	css.setAttribute('rel','stylesheet');
	css.href = source;
	head.appendChild(css);
}

function defineBehavior(params){
  if(document.getElementById("ABBDbrush")){
    alert("toHide");
  }else{
    runthis(params[0]);
  }

}

function runthis(cssToLoad){
	var wrapper = document.createElement('div');

	wrapper.innerHTML= '<div class="fwABBDcanvas"><div class="fwABBDconsol">'+
      '<div class="part p1">'+
          '<span class="legend">Taille :</span>'+
          '<div id="ABBDslider">'+
              '<input type="range" min="1" max="150" value="1" />'+
          '</div>'+
      '</div>'+
      '<div class="part p2">'+
          '<span class="legend">Couleur :</span>'+
          '<div class="cp"><div></div></div>'+
      '</div>'+
      '<div class="part p4">'+
          '<a href="#" id="gomme" class="off">Mode Gomme</a>'+
          '<a href="#" id="pencil" class="on active crayon">Mode Gomme</a>'+
      '</div>'+
      '<div class="part p5">'+
          '<span class="drawsquare">Carré</span>'+
          '<span class="drawcircle">Cercle</span>'+
          '<span class="drawtrait">Trait</span>'+
          '<span class="drawsquarempty">Trait</span>'+
      '</div>'+
      '<div class="part p3">'+
          '<a href="#" id="eraseall" class="legend">Tout effacer</a>'+
      '</div>'+
      '<div class="part p6">'+
          '<span class="hide active" title="typo a empattement" id="abbdTimes">Sans serif</span>'+
          '<span class="hide" title="typo sans empattement" id="abbdArial">Serif</span>'+
          '<a href="#" id="entertext">Entrer un texte</a>'+
      '</div>'+
      '</div><canvas id="fwABBDwindow">'+
      '</canvas><canvas id="ABBDbrush" height="150" width="150"></canvas>'+
      '</div>';

	var canevas = wrapper.firstChild;
  document.body.appendChild(canevas);
  addCSS(cssToLoad);
  runNext();

  /*
  $b("head").append('<link rel="stylesheet" type="text/css" href="http://annuaireblogbd.com/bkmrk/bkmrks.css">');
  $b("embed").attr('wmode','transparent');
  */

}

function toslide(){
  console.log("in toslide");
  /*
  $b("#sliderABBD .ui-slider-handle").mousemove(function(e){
      nodraw = true;
      var rootPosition = $b(this).parent().offset().left;
      if(e.clientX>rootPosition){
          if(e.clientX<rootPosition+80){
              value = e.clientX-rootPosition;
              percent(value);
              $b(this).css("left",value);
          }else{
              $b(this).css("left",rootPosition+60);
          }
      }else{
          $b(this).css("left",rootPosition-20);
      }
      if(editingtxt == true){
          $b("#thisActive").css("font-size",value+"px");
      }

  })
  $b("#sliderABBD .ui-slider-handle").mouseup(function(e){
      var ctxBrush = document.getElementById("ABBDbrush").getContext("2d");
      $b(this).unbind("mousemove");
      nodraw = false;
      cleanBrushCanvas(ctxBrush);
  })
*/
}

/*
(function(){

function loadScript(url, callback){
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


var isIE = !!window.ActiveXObject;
if(isIE){
    alert("Désolé, la technologie des canvas n'est pas supportÃ© sur votre navigateur :(");
}else{
    if(typeof jQuery == 'undefined'){
        //includeJq();
        loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", function(){
            $b = jQuery.noConflict();
            runthis();
        });
    }else{
        //Si la version de jquery est infÃ©rieur a la 1.2.6., on la met en plus rÃ©cente
        version = jQuery.fn.jquery;
        unit = version.split('.');
        var ok = 0;
        if(unit[0]==1){
            ok = 0;
            if(unit[1]==2){//Si jquery v1.2. et infÃ©rieur
                var ok = 1;
                //includeJq();
                loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", function(){
                    $b = jQuery.noConflict(true);
                    runthis();
                });
            }
        }
        if(ok == 0){
            $b = jQuery.noConflict();
            runthis();
        }
    }
}


//Initialisation script ui
function runthis(){
    $b("body").append(
        '<div class="fwABBDcanvas"><div class="fwABBDconsol">'+
        '<div class="part p1">'+
            '<span class="legend">Taille :</span>'+
            '<div id="sliderABBD">'+
                '<div class="ui-slider-range ui-slider-range-min ui-widget-header" style="width:0%;"></div>'+
                '<a href="#" class="ui-slider-handle ui-state-default ui-corner-all" style=""></a>'+
            '</div>'+
        '</div>'+
        '<div class="part p2">'+
            '<span class="legend">Couleur :</span>'+
            '<div class="cp"><div></div></div>'+
        '</div>'+
        '<div class="part p4">'+
            '<a href="#" id="gomme" class="off">Mode Gomme</a>'+
            '<a href="#" id="pencil" class="on active crayon">Mode Gomme</a>'+
        '</div>'+
        '<div class="part p5">'+
            '<span class="drawsquare">CarrÃ©</span>'+
            '<span class="drawcircle">Cercle</span>'+
            '<span class="drawtrait">Trait</span>'+
            '<span class="drawsquarempty">Trait</span>'+
        '</div>'+
        '<div class="part p3">'+
            '<a href="#" id="eraseall" class="legend">Tout effacer</a>'+
        '</div>'+
        '<div class="part p6">'+
            '<span class="hide active" title="typo a empattement" id="abbdTimes">Sans serif</span>'+
            '<span class="hide" title="typo sans empattement" id="abbdArial">Serif</span>'+
            '<a href="#" id="entertext">Entrer un texte</a>'+
        '</div>'+
        '<a href="#" title="Quitter le mode dessin et retourner sur la page." class="close" class="legend">x</a>'+
        '</div><canvas id="fwABBDwindow"></canvas><canvas id="ABBDbrush" height="150" width="150"></canvas></a></div>');

    $b("head").append('<link rel="stylesheet" type="text/css" href="http://annuaireblogbd.com/bkmrk/bkmrks.css">');
    $b("embed").attr('wmode','transparent');
    runNext();
}

//* Fonction canvas Paint *//*
function transform_event_coord(e){
    var coord = $b("#fwABBDwindow").offset();
    var coordx = $b(window).scrollTop();
    var coordy = $b(window).scrollLeft();
    return{
        x: coordy - coord.left+e.clientX,
        y: coordx - coord.top+e.clientY
    };
}



function clearAll(largeurCanvas,hauteurCanvas){
    $b("#fwABBDwindow, #fwABBDwindowTemp").remove();
    $b("#ABBDbrush").before('<canvas id="fwABBDwindow" width="'+largeurCanvas+'" height="'+hauteurCanvas+'"></canvas>');
    init(largeurCanvas,hauteurCanvas);
    if($b("#pencil").hasClass("active") == false && $b("#gomme").hasClass("active") == false){
        nodraw = true;
        if($b(".drawsquare").hasClass("active")==true){
            drawForm();
        }else if($b(".drawcircle").hasClass("active")==true){
            drawForm();
        }else if($b(".drawtrait").hasClass("active")==true){
            drawForm();
        }else if($b(".drawsquarempty").hasClass("active")==true){
            drawForm();
        }else if($b(".p6 span").hasClass("active")==true){
            nodraw = true;
            drawing = false;
            startDrawForms = false;         
            editingtxt = true;
            createtextarea = true;
            initTextarea(0,0);
        }
    }
}


function init(largeurCanvas,hauteurCanvas){
  var canvas = document.getElementById("fwABBDwindow");
  canvas.width=largeurCanvas;
  canvas.height=hauteurCanvas;
  var ctx = canvas.getContext("2d");
  $b("#fwABBDwindowTemp").remove();

    addEventListener("mousedown", on_mousedown, true);
    addEventListener("mousemove", on_mousemove, true);
    addEventListener("mouseup", on_mouseup, true);
}

function reinitxt(){
  $b(".fwABBDcanvas .ABBDtxtarea").css({"z-index":2,"border":"none"}).removeAttr("id");
}

function initSoft(){
  $b("#entertext").removeClass("active");
  $b(".p6 span").addClass("hide");
  reinitxt();

  var canvas = document.getElementById("fwABBDwindow");
  var ctx = canvas.getContext("2d");
  $b("#fwABBDwindowTemp").remove();
  nodraw = false;
  editingtxt = false;
}

function initSoftTxt(){
  var canvas = document.getElementById("fwABBDwindow");
  var ctx = canvas.getContext("2d");
  $b("#fwABBDwindowTemp").remove();
}

function drawForm(){
    var canvasRoot = document.getElementById("fwABBDwindow");
    var container = canvasRoot.parentNode;
    canvasTemp = document.createElement('canvas');
    canvasTemp.id     = 'fwABBDwindowTemp';
    canvasTemp.width  = canvasRoot.width;
    canvasTemp.height = canvasRoot.height;
    container.appendChild(canvasTemp);

    exa = $b(".cp div").css("background-color");

    canvasTemp.addEventListener("mousedown", startForm, true);
    canvasTemp.addEventListener("mousemove", CalculForm, true);
    canvasTemp.addEventListener("mouseup", EndForm, true);

}

function startForm(e){
  if(editingtxt==false){startDrawForms = true;}else{startDrawForms = false;}
  nodraw = true;
  eraser = false;
  drawing = false;
  firstPos = transform_event_coord(e);
  var canvasTp = document.getElementById("fwABBDwindowTemp");
  var ctx = canvasTp.getContext("2d");
}

function CalculForm(e){
    if(startDrawForms == true){
        CurPos = transform_event_coord(e);
        var canvasTp = document.getElementById("fwABBDwindowTemp");
        var ctx = canvasTp.getContext("2d");
        ctx.clearRect(0, 0, largeurcv, hauteurcv );
        if($b(".drawsquare").hasClass("active")==true){
            drawRectangle(firstPos,CurPos,ctx);
        }else if($b(".drawcircle").hasClass("active")==true){
            drawCircle(firstPos,CurPos,ctx);
        }else if($b(".drawsquarempty").hasClass("active")==true){
            drawRectanglempty(firstPos,CurPos,ctx);
        }else{
            drawLine(firstPos,CurPos,ctx);
        }
    }
}

function EndForm(e){
    var drawTemp = document.getElementById("fwABBDwindowTemp");
    var canvasRoot = document.getElementById("fwABBDwindow").getContext("2d");
    canvasRoot.globalCompositeOperation = "source-over";
    startDrawForms = false;
    nodraw = true;
    canvasRoot.drawImage(drawTemp,0,0);
}

function drawCircle(pntFrom, pntTo, ctx){
    var centerX = Math.max(pntFrom.x,pntTo.x) - Math.abs(pntFrom.x - pntTo.x)/2;
    var centerY = Math.max(pntFrom.y,pntTo.y) - Math.abs(pntFrom.y - pntTo.y)/2;
    ctx.strokeStyle = exa;//couleur
    ctx.fillStyle = exa;
    ctx.beginPath();
    var distance = Math.sqrt(Math.pow(pntFrom.x - pntTo.x,2) + Math.pow(pntFrom.y - pntTo.y,2));
    ctx.arc(centerX, centerY, distance/2,0,Math.PI*2 ,true);
    ctx.fill();
    ctx.closePath();
}

function drawRectangle(pntFrom, pntTo, ctx){
    ctx.strokeStyle = exa;//couleur
    ctx.fillStyle = exa;
    ctx.beginPath();
    if(pntTo.x > pntFrom.x && pntTo.y > pntFrom.y){
        ctx.fillRect(pntFrom.x, pntFrom.y, pntTo.x - pntFrom.x, pntTo.y - pntFrom.y);
    }else if(pntTo.x > pntFrom.x && pntTo.y < pntFrom.y){
        ctx.fillRect(pntFrom.x, pntTo.y, pntTo.x - pntFrom.x, pntFrom.y - pntTo.y);
    }else if(pntTo.x < pntFrom.x && pntTo.y > pntFrom.y){
        ctx.fillRect(pntTo.x, pntFrom.y, pntFrom.x - pntTo.x, pntTo.y - pntFrom.y);
    }else{
        ctx.fillRect(pntTo.x, pntTo.y, pntFrom.x - pntTo.x , pntFrom.y - pntTo.y );
    }
    ctx.closePath();
}

function drawRectanglempty(pntFrom, pntTo, ctx){
    ctx.strokeStyle = exa;//couleur
    ctx.fillStyle = exa;
    ctx.beginPath();
    ctx.lineWidth = sizeBrush;
    if(pntTo.x > pntFrom.x && pntTo.y > pntFrom.y){
        ctx.strokeRect(pntFrom.x, pntFrom.y, pntTo.x - pntFrom.x, pntTo.y - pntFrom.y);
    }else if(pntTo.x > pntFrom.x && pntTo.y < pntFrom.y){
        ctx.strokeRect(pntFrom.x, pntTo.y, pntTo.x - pntFrom.x, pntFrom.y - pntTo.y);
    }else if(pntTo.x < pntFrom.x && pntTo.y > pntFrom.y){
        ctx.strokeRect(pntTo.x, pntFrom.y, pntFrom.x - pntTo.x, pntTo.y - pntFrom.y);
    }else{
        ctx.strokeRect(pntTo.x, pntTo.y, pntFrom.x - pntTo.x , pntFrom.y - pntTo.y );
    }
    ctx.closePath();
}


function drawLine(pntFrom, pntTo, ctx){
    ctx.strokeStyle = exa;//couleur
    ctx.fillStyle = exa;
    ctx.lineWidth = sizeBrush;//Largeur du trait.
    ctx.beginPath();
    ctx.moveTo(pntFrom.x,pntFrom.y);
    ctx.lineTo(pntTo.x,pntTo.y);
    ctx.stroke();
    ctx.closePath();
}


function inittools(){
    modefusion = "source-over";
    createtextarea = false;
    editingtxt = false;
    $b(".p5 span").removeClass("active");
 
    initPencilandFeutre();
}

function initPencilandFeutre(){
    $b(".p4 #pencil.crayon").click(function(e){//passer en mode carrÃƒÂ©
        e.preventDefault();
        initSoft();
        $b(this).addClass("active").unbind().prev().removeClass("active");
        exa = $b(".cp div").css("background-color");
        startDrawForms = false;
        eraser = false;
        drawing = false;
        if($b(this).hasClass("on")){
            $b(this).removeClass("crayon").addClass("feutre");
            type = "miter";
        }else{
            $b(this).addClass("on");
        }
        inittools();
    })

    $b(".p4 #pencil.feutre").click(function(e){//passer en mode crayon
        e.preventDefault();
        initSoft();
        $b(this).addClass("active").unbind().prev().removeClass("active");
        exa = $b(".cp div").css("background-color");
        startDrawForms = false;
        eraser = false;
        drawing = false;
        if($b(this).hasClass("on")){
            $b(this).removeClass("feutre").addClass("crayon");
            type = "round";
        }else{
            $b(this).addClass("on");
        }
        inittools();
    })
}

function initTextarea(txtpntFromx,txtpntFromy){

    initSoftTxt();

    $b("#abbdArial").click(function(){
        $b(this).addClass("active").prev().removeClass("active");
        ffamily = "Arial, sans-serif";
        $b("#thisActive").css("font-family",ffamily).focus();
    })

    $b("#abbdTimes").click(function(){
        $b(this).addClass("active").next().removeClass("active");
        ffamily = "Times, serif";
        $b("#thisActive").css("font-family",ffamily).focus();
    })

    if(createtextarea==true){
        $b("#fwABBDwindow").bind("mousedown",function(e){
            $b(".fwABBDcanvas").append('<div id="ABBDenteringtxt" class="ABBDtxtarea" ></div>');
            $b("#ABBDenteringtxt").css({"top":e.clientY,"left":e.clientX});
            txtpntFromx = e.clientX;
            txtpntFromy = e.clientY;
            realCalculation = true;
            createtextarea = false;
            $b(this).unbind();
            //initSoftTxt();
            initTextarea(e.clientX, e.clientY);
        })
    }

    if(realCalculation==true){
        createtextarea = false;
        $b("#fwABBDwindow").bind("mousemove",function(e){
            var pntTo = transform_event_coord(e);
            //console.log((txtpntFromx-pntTo.x)+"-"+(txtpntFromy-pntTo.y));
            $b("#ABBDenteringtxt").css({"width":(pntTo.x-txtpntFromx)+"px","height":(pntTo.y-txtpntFromy)+"px"});
        })
     
        $b(this).mouseup(function(e){
            var ABBDwrapall = $b("#fwABBDwindow");
            var ABBDpseudoTxtAra = $b("#ABBDenteringtxt");
            ABBDwrapall.unbind("mousemove");
            $b(this).unbind("mouseup");
            $b(this).unbind("mousemove");
            realCalculation = false;
            createtextarea = false;
            editingtxt = true;
            var txtawidth = ABBDpseudoTxtAra.width();
            var txtaheight = ABBDpseudoTxtAra.height();
            var txtapos = ABBDpseudoTxtAra.position();
            if(5>sizeBrush){sizeTxt=12;}else{sizeTxt=sizeBrush;}
            //$b("#ABBDenteringtxt").css({"width":txtawidth+"px","color":exa,"font-size":sizeTxt+'px',"height":txtaheight+'px',"top":txtapos.top+"px","left":txtapos.left+"px"}).addClass("ABBDtxtarea").attr("contentEditable","true").text("Entrez votre texte ici");
            $b("#ABBDenteringtxt").replaceWith('<textarea style="width:'+txtawidth+'px !important;color:'+exa+';font-size:'+sizeTxt+'px;height:'+txtaheight+'px !important;top:'+txtapos.top+'px;left:'+txtapos.left+'px;" id="thisActive" class="ABBDtxtarea">Entrez ici votre texte</textarea>');
            $b("#thisActive").focus();
            $b(".fwABBDcanvas").removeClass("crosshairstyle");
            initTextarea(0,0);
        })
    }

}


function resizeCanvas(canvas){
    var wheight = $b(window).height();
    var wwidth = $b(window).width();

    canvas = $b('#fwABBDwindow');
    var context = canvas[0].getContext("2d");
    var previousDrawing = context.getImageData(0, 0, wwidth, wheight);

    if(wheight>hauteurcv){
        canvas.attr("height",wheight);
        hauteurcv = wheight;
        context.putImageData(previousDrawing,0,0);
    }
    if(wwidth>largeurcv){
        canvas.attr("width",wwidth);
        largeurcv = wwidth;
        context.putImageData(previousDrawing,0,0);
    }

}


//* Initialisation principales variables *//*
var nodraw = false;
var drawing = false;
var lastpos = {x:-1,y:-1};
var sizeBrush = 1;
var exa = "#000000";
var eraser = false;
var type = "round"
var firstPos = {x:0,y:0};
var startDrawForms = false;
var modefusion = "source-over";
/* Text mod *//*
var createtextarea = false;
var realCalculation = false;
var editingtxt = false;
var ffamily = "Times, serif";

function runNext(){

/* Colorpicker *//*
(function($c){var ColorPicker=function(){var
ids={},inAction,charMin=65,visible,tpl='<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',defaults={eventName:'click',onShow:function(){},onBeforeShow:function(){},onHide:function(){},onChange:function(){},onSubmit:function(){},color:'ff0000',livePreview:true,flat:false},fillRGBFields=function(hsb,cal){var rgb=HSBToRGB(hsb);$c(cal).data('colorpicker').fields.eq(1).val(rgb.r).end().eq(2).val(rgb.g).end().eq(3).val(rgb.b).end();},fillHSBFields=function(hsb,cal){$c(cal).data('colorpicker').fields.eq(4).val(hsb.h).end().eq(5).val(hsb.s).end().eq(6).val(hsb.b).end();},fillHexFields=function(hsb,cal){$c(cal).data('colorpicker').fields.eq(0).val(HSBToHex(hsb)).end();},setSelector=function(hsb,cal){$c(cal).data('colorpicker').selector.css('backgroundColor','#'+HSBToHex({h:hsb.h,s:100,b:100}));$c(cal).data('colorpicker').selectorIndic.css({left:parseInt(150*hsb.s/100,10),top:parseInt(150*(100-hsb.b)/100,10)});},setHue=function(hsb,cal){$c(cal).data('colorpicker').hue.css('top',parseInt(150-150*hsb.h/360,10));},setCurrentColor=function(hsb,cal){$c(cal).data('colorpicker').currentColor.css('backgroundColor','#'+HSBToHex(hsb));},setNewColor=function(hsb,cal){$c(cal).data('colorpicker').newColor.css('backgroundColor','#'+HSBToHex(hsb));},keyDown=function(ev){var pressedKey=ev.charCode||ev.keyCode||-1;if((pressedKey>charMin&&pressedKey<=90)||pressedKey==32){return false;}
var cal=$c(this).parent().parent();if(cal.data('colorpicker').livePreview===true){change.apply(this);}},change=function(ev){var cal=$c(this).parent().parent(),col;if(this.parentNode.className.indexOf('_hex')>0){cal.data('colorpicker').color=col=HexToHSB(fixHex(this.value));}else if(this.parentNode.className.indexOf('_hsb')>0){cal.data('colorpicker').color=col=fixHSB({h:parseInt(cal.data('colorpicker').fields.eq(4).val(),10),s:parseInt(cal.data('colorpicker').fields.eq(5).val(),10),b:parseInt(cal.data('colorpicker').fields.eq(6).val(),10)});}else{cal.data('colorpicker').color=col=RGBToHSB(fixRGB({r:parseInt(cal.data('colorpicker').fields.eq(1).val(),10),g:parseInt(cal.data('colorpicker').fields.eq(2).val(),10),b:parseInt(cal.data('colorpicker').fields.eq(3).val(),10)}));}
if(ev){fillRGBFields(col,cal.get(0));fillHexFields(col,cal.get(0));fillHSBFields(col,cal.get(0));}
setSelector(col,cal.get(0));setHue(col,cal.get(0));setNewColor(col,cal.get(0));cal.data('colorpicker').onChange.apply(cal,[col,HSBToHex(col),HSBToRGB(col)]);},blur=function(ev){var cal=$c
    (this).parent().parent();cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');},focus=function(){charMin=this.parentNode.className.indexOf('_hex')>0?70:65;$c(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');$c(this).parent().addClass('colorpicker_focus');},downIncrement=function(ev){var field=$c(this).parent().find('input').focus();var current={el:$c(this).parent().addClass('colorpicker_slider'),max:this.parentNode.className.indexOf('_hsb_h')>0?360:(this.parentNode.className.indexOf('_hsb')>0?100:255),y:ev.pageY,field:field,val:parseInt(field.val(),10),preview:$c(this).parent().parent().data('colorpicker').livePreview};$c(document).bind('mouseup',current,upIncrement);$c(document).bind('mousemove',current,moveIncrement);},moveIncrement=function(ev){ev.data.field.val(Math.max(0,Math.min(ev.data.max,parseInt(ev.data.val+ev.pageY-ev.data.y,10))));if(ev.data.preview){change.apply(ev.data.field.get(0),[true]);}
return false;},upIncrement=function(ev){change.apply(ev.data.field.get(0),[true]);ev.data.el.removeClass('colorpicker_slider').find('input').focus();$c(document).unbind('mouseup',upIncrement);$c(document).unbind('mousemove',moveIncrement);return false;},downHue=function(ev){var current={cal:$c(this).parent(),y:$c(this).offset().top};current.preview=current.cal.data('colorpicker').livePreview;$c(document).bind('mouseup',current,upHue);$c(document).bind('mousemove',current,moveHue);},moveHue=function(ev){change.apply(ev.data.cal.data('colorpicker').fields.eq(4).val(parseInt(360*(150-Math.max(0,Math.min(150,(ev.pageY-ev.data.y))))/150,10)).get(0),[ev.data.preview]);return false;},upHue=function(ev){fillRGBFields(ev.data.cal.data('colorpicker').color,ev.data.cal.get(0));fillHexFields(ev.data.cal.data('colorpicker').color,ev.data.cal.get(0));$c(document).unbind('mouseup',upHue);$c(document).unbind('mousemove',moveHue);return false;},downSelector=function(ev){var current={cal:$c(this).parent(),pos:$c(this).offset()};current.preview=current.cal.data('colorpicker').livePreview;$c(document).bind('mouseup',current,upSelector);$c(document).bind('mousemove',current,moveSelector);},moveSelector=function(ev){change.apply(ev.data.cal.data('colorpicker').fields.eq(6).val(parseInt(100*(150-Math.max(0,Math.min(150,(ev.pageY-ev.data.pos.top))))/150,10)).end().eq(5).val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX-ev.data.pos.left))))/150,10)).get(0),[ev.data.preview]);return false;},upSelector=function(ev){fillRGBFields(ev.data.cal.data('colorpicker').color,ev.data.cal.get(0));fillHexFields(ev.data.cal.data('colorpicker').color,ev.data.cal.get(0));$c(document).unbind('mouseup',upSelector);$c(document).unbind('mousemove',moveSelector);return false;},enterSubmit=function(ev){$c(this).addClass('colorpicker_focus');},leaveSubmit=function(ev){$c(this).removeClass('colorpicker_focus');},clickSubmit=function(ev){var cal=$c(this).parent();var col=cal.data('colorpicker').color;cal.data('colorpicker').origColor=col;setCurrentColor(col,cal.get(0));cal.data('colorpicker').onSubmit(col,HSBToHex(col),HSBToRGB(col),cal.data('colorpicker').el);},show=function(ev){var cal=$c('#'+$c(this).data('colorpickerId'));cal.data('colorpicker').onBeforeShow.apply(this,[cal.get(0)]);var pos=$c(this).offset();var viewPort=getViewport();var top=pos.top+this.offsetHeight;var left=pos.left;if(top+176>viewPort.t+viewPort.h){top-=this.offsetHeight+176;}
if(left+356>viewPort.l+viewPort.w){left-=356;}
cal.css({left:left+'px',top:top+'px'});if(cal.data('colorpicker').onShow.apply(this,[cal.get(0)])!=false){cal.show();}
$c(document).bind('mousedown',{cal:cal},hide);return false;},hide=function(ev){if(!isChildOf(ev.data.cal.get(0),ev.target,ev.data.cal.get(0))){if(ev.data.cal.data('colorpicker').onHide.apply(this,[ev.data.cal.get(0)])!=false){ev.data.cal.hide();}
$c(document).unbind('mousedown',hide);}},isChildOf=function(parentEl,el,container){if(parentEl==el){return true;}
if(parentEl.contains){return parentEl.contains(el);}
if(parentEl.compareDocumentPosition){return!!(parentEl.compareDocumentPosition(el)&16);}
var prEl=el.parentNode;while(prEl&&prEl!=container){if(prEl==parentEl)
return true;prEl=prEl.parentNode;}
return false;},getViewport=function(){var m=document.compatMode=='CSS1Compat';return{l:window.pageXOffset||(m?document.documentElement.scrollLeft:document.body.scrollLeft),t:window.pageYOffset||(m?document.documentElement.scrollTop:document.body.scrollTop),w:window.innerWidth||(m?document.documentElement.clientWidth:document.body.clientWidth),h:window.innerHeight||(m?document.documentElement.clientHeight:document.body.clientHeight)};},fixHSB=function(hsb){return{h:Math.min(360,Math.max(0,hsb.h)),s:Math.min(100,Math.max(0,hsb.s)),b:Math.min(100,Math.max(0,hsb.b))};},fixRGB=function(rgb){return{r:Math.min(255,Math.max(0,rgb.r)),g:Math.min(255,Math.max(0,rgb.g)),b:Math.min(255,Math.max(0,rgb.b))};},fixHex=function(hex){var len=6-hex.length;if(len>0){var o=[];for(var i=0;i<len;i++){o.push('0');}
o.push(hex);hex=o.join('');}
return hex;},HexToRGB=function(hex){var hex=parseInt(((hex.indexOf('#')>-1)?hex.substring(1):hex),16);return{r:hex>>16,g:(hex&0x00FF00)>>8,b:(hex&0x0000FF)};},HexToHSB=function(hex){return RGBToHSB(HexToRGB(hex));},RGBToHSB=function(rgb){var hsb={h:0,s:0,b:0};var min=Math.min(rgb.r,rgb.g,rgb.b);var max=Math.max(rgb.r,rgb.g,rgb.b);var delta=max-min;hsb.b=max;if(max!=0){}
hsb.s=max!=0?255*delta/max:0;if(hsb.s!=0){if(rgb.r==max){hsb.h=(rgb.g-rgb.b)/delta;}else if(rgb.g==max){hsb.h=2+(rgb.b-rgb.r)/delta;}else{hsb.h=4+(rgb.r-rgb.g)/delta;}}else{hsb.h=-1;}
hsb.h*=60;if(hsb.h<0){hsb.h+=360;}
hsb.s*=100/255;hsb.b*=100/255;return hsb;},HSBToRGB=function(hsb){var rgb={};var h=Math.round(hsb.h);var s=Math.round(hsb.s*255/100);var v=Math.round(hsb.b*255/100);if(s==0){rgb.r=rgb.g=rgb.b=v;}else{var t1=v;var t2=(255-s)*v/255;var t3=(t1-t2)*(h%60)/60;if(h==360)h=0;if(h<60){rgb.r=t1;rgb.b=t2;rgb.g=t2+t3}
else if(h<120){rgb.g=t1;rgb.b=t2;rgb.r=t1-t3}
else if(h<180){rgb.g=t1;rgb.r=t2;rgb.b=t2+t3}
else if(h<240){rgb.b=t1;rgb.r=t2;rgb.g=t1-t3}
else if(h<300){rgb.b=t1;rgb.g=t2;rgb.r=t2+t3}
else if(h<360){rgb.r=t1;rgb.g=t2;rgb.b=t1-t3}
else{rgb.r=0;rgb.g=0;rgb.b=0}}
return{r:Math.round(rgb.r),g:Math.round(rgb.g),b:Math.round(rgb.b)};},RGBToHex=function(rgb){var hex=[rgb.r.toString(16),rgb.g.toString(16),rgb.b.toString(16)];$c.each(hex,function(nr,val){if(val.length==1){hex[nr]='0'+val;}});return hex.join('');},HSBToHex=function(hsb){return RGBToHex(HSBToRGB(hsb));},restoreOriginal=function(){var cal=$c(this).parent();var col=cal.data('colorpicker').origColor;cal.data('colorpicker').color=col;fillRGBFields(col,cal.get(0));fillHexFields(col,cal.get(0));fillHSBFields(col,cal.get(0));setSelector(col,cal.get(0));setHue(col,cal.get(0));setNewColor(col,cal.get(0));};return{init:function(opt){opt=$c.extend({},defaults,opt||{});if(typeof opt.color=='string'){opt.color=HexToHSB(opt.color);}else if(opt.color.r!=undefined&&opt.color.g!=undefined&&opt.color.b!=undefined){opt.color=RGBToHSB(opt.color);}else if(opt.color.h!=undefined&&opt.color.s!=undefined&&opt.color.b!=undefined){opt.color=fixHSB(opt.color);}else{return this;}
return this.each(function(){if(!$c(this).data('colorpickerId')){var options=$c.extend({},opt);options.origColor=opt.color;var id='collorpicker_'+parseInt(Math.random()*1000);$c(this).data('colorpickerId',id);var cal=$c(tpl).attr('id',id);if(options.flat){cal.appendTo(this).show();}else{cal.appendTo(document.body);}
options.fields=cal.find('input').bind('keyup',keyDown).bind('change',change).bind('blur',blur).bind('focus',focus);cal.find('span').bind('mousedown',downIncrement).end().find('>div.colorpicker_current_color').bind('click',restoreOriginal);options.selector=cal.find('div.colorpicker_color').bind('mousedown',downSelector);options.selectorIndic=options.selector.find('div div');options.el=this;options.hue=cal.find('div.colorpicker_hue div');cal.find('div.colorpicker_hue').bind('mousedown',downHue);options.newColor=cal.find('div.colorpicker_new_color');options.currentColor=cal.find('div.colorpicker_current_color');cal.data('colorpicker',options);cal.find('div.colorpicker_submit').bind('mouseenter',enterSubmit).bind('mouseleave',leaveSubmit).bind('click',clickSubmit);fillRGBFields(options.color,cal.get(0));fillHSBFields(options.color,cal.get(0));fillHexFields(options.color,cal.get(0));setHue(options.color,cal.get(0));setSelector(options.color,cal.get(0));setCurrentColor(options.color,cal.get(0));setNewColor(options.color,cal.get(0));if(options.flat){cal.css({position:'relative',display:'block'});}else{$c(this).bind(options.eventName,show);}}});},showPicker:function(){return this.each(function(){if($c(this).data('colorpickerId')){show.apply(this);}});},hidePicker:function(){return this.each(function(){if($c(this).data('colorpickerId')){$c('#'+$c(this).data('colorpickerId')).hide();}});},setColor:function(col){if(typeof col=='string'){col=HexToHSB(col);}else if(col.r!=undefined&&col.g!=undefined&&col.b!=undefined){col=RGBToHSB(col);}else if(col.h!=undefined&&col.s!=undefined&&col.b!=undefined){col=fixHSB(col);}else{return this;}
return this.each(function(){if($c(this).data('colorpickerId')){var cal=$c('#'+$c(this).data('colorpickerId'));cal.data('colorpicker').color=col;cal.data('colorpicker').origColor=col;fillRGBFields(col,cal.get(0));fillHSBFields(col,cal.get(0));fillHexFields(col,cal.get(0));setHue(col,cal.get(0));setSelector(col,cal.get(0));setCurrentColor(col,cal.get(0));setNewColor(col,cal.get(0));}});}};}();$c.fn.extend({ColorPicker:ColorPicker.init,ColorPickerHide:ColorPicker.hidePicker,ColorPickerShow:ColorPicker.showPicker,ColorPickerSetColor:ColorPicker.setColor});})($b)

        window.hauteurcv = $b(document).height();
        window.largeurcv = $b(window).width();
        var ctxBrush = document.getElementById("ABBDbrush").getContext("2d");
        init(largeurcv,hauteurcv);
     
        canvas = $b('#fwABBDwindow');
        canvas.width  = hauteurcv;
        canvas.height = largeurcv;

        $b("#sliderABBD").mousedown(function(e){
            nodraw = true;
            var rootPosition = $b(this).offset().left;
            $b(".ui-slider-handle").css("left",e.clientX-rootPosition);
            value = e.clientX-rootPosition;
            percent(value);
            e.preventDefault();
            toslide();
        })

        $b("#sliderABBD").mouseup(function(e){
            if(editingtxt == false){nodraw = false;}else{nodraw = true;}
            $b(this).children(".ui-slider-handle").unbind("mousemove");
            cleanBrushCanvas(ctxBrush);
        })

        $b(window).resize(function(){
            resizeCanvas(canvas);
        });

        $b('.cp').ColorPicker({
            flat:false,
            color: '#000000',
            onShow: function(){
                nodraw = true;
            },
            onChange: function (hsb, hex, rgb) {
                $b('.cp div').css('backgroundColor', '#' + hex);
                if(eraser==false){
                    exa = "#"+hex;
                }
            },
            onHide: function(){
                if(editingtxt == false){
                    drawing = false;
                    nodraw = false;
                }else{
                    $b("#thisActive").css({"color":exa});
                }
            }
        });

        $b(".colorpicker *").click(function(e){
            drawing = false;
        })
     
        $b(".p4 #gomme").bind("click",function(e){
            initSoft();
            $b(this).addClass("active").next().removeClass("active").removeClass("on");
            $b(".drawtrait, .drawsquare, .drawcircle,.p6 a").removeClass("active");
            e.preventDefault();
            nodraw = false;
            startDrawForms = false;
            eraser = true;
            modefusion = "destination-out";
        })

        inittools();

        $b(".p5 span").click(function(e){
            initSoft();
            e.preventDefault();s
            $b(".p5 span,.p4 a, .p6 a").removeClass("active").removeClass("on");
            $b(this).addClass("active");
            nodraw = true;
            drawForm();
        })
     
        $b("#entertext").click(function(e){
            reinitxt();
            $b(".p4 a,.p5 span").removeClass("active").removeClass("on");
            $b(".p6 span").removeClass("hide");
            $b(this).addClass("active");
            $b(".fwABBDcanvas").addClass("crosshairstyle");
            nodraw = true;
            drawing = false;
            startDrawForms = false;         
            editingtxt = true;
            createtextarea = true;
            initTextarea(0,0);
        })
     
        $b("#eraseall").click(function(e){
            e.preventDefault();
            $b(".ABBDtxtarea").remove();
            clearAll(largeurcv,hauteurcv);
        })

        $b(".close").click(function(e){
            $b(".fwABBDcanvas").remove();
            removeEventListener("mousedown", on_mousedown, true);
            removeEventListener("mousemove", on_mousemove, true);
            removeEventListener("mouseup", on_mouseup, true);
        })

}

})()
*/