/*  Bookmarks */
/* Node */
var ABBDcanvas = "";
var ABBDbrush = "";
var ABBDslider = "";
var ABBDcolorpicker = "";
var ABBDgomme = "";

/* Variables */
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
var hauteurcv = 0;
var largeurcv = 0;

/* Text mod */
var createtextarea = false;
var realCalculation = false;
var editingtxt = false;
var ffamily = "Times, serif";

/* Screenshot Area */
var createScreenShot = false;
var currentCalcul = false;

//Brush behavior
function on_change(){
  var biggness = ABBDslider.firstChild.value;
  nodraw = true;
  percent(biggness);
  //toslide(ABBDbrush);
}

function stopBrush(ctxBrush){
  ABBDslider.removeEventListener("mousemove", on_change, true);
  ABBDslider.removeEventListener("change", stopBrush, true);
  
  sizeBrush = ABBDslider.firstChild.value;

  if(editingtxt){
    if(document.getElementById("thisActive")){
      document.getElementById("thisActive").style.fontSize = sizeBrush+"px";
    }
  }

  nodraw = editingtxt !== false;
  ctxBrush.clearRect(0,0,200,200);
}

function previsuBrush(){
  ABBDslider.addEventListener("mousemove", on_change, true);
}

function offset(elt){
  var rect = elt.getBoundingClientRect(), bodyElt = document.body;
  return {
      top: rect.top + bodyElt.scrollTop,
      left: rect.left + bodyElt.scrollLeft
  }
}

// Get the context for the canvas brush representation and draw it
function percent(value){
  var ctxBrush = ABBDbrush.getContext("2d");
  sbs(value,ctxBrush);
  sizeBrush = value;
  ABBDbrush.style.zIndex = 4;
}

/*
* Canvas for brush size
*/
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

// Git to variable exa the right value
function setColors(){
  exa = ABBDcolorpicker.value;
  if(editingtxt){//If user has an active textarea
    if(document.getElementById("thisActive")){
      document.getElementById("thisActive").style.color = exa;
    }
  }
}

// Set Gum behavior
function setGum(e){
  initSoft();
  ABBDgomme.classList.add("active");
  ABBDgomme.nextSibling.classList.remove("on","active");
  var othersNodesTool = document.querySelectorAll(".drawtrait, .drawsquare, .drawcircle, .p6 a");
  for(var nodeTool of othersNodesTool){
    nodeTool.classList.remove("active");
  }
  nodraw = false;
  startDrawForms = false;
  eraser = true;
  modefusion = "destination-out";
  e.preventDefault();
}

function setForm(e){
  initSoft();
  var MultipleTools = document.querySelectorAll(".p5 span,.p4 a, .p6 a");
  for(var MultipleTool of MultipleTools){
    MultipleTool.classList.remove("active");
    MultipleTool.classList.remove("on");
  }
  e.target.classList.add("active");
  drawForm();
  e.preventDefault();
}

function setTxt(e){
  e.preventDefault();
  reinitxt();
  var MultipleTools = document.querySelectorAll(".p4 a,.p5 span");
  var allFonts = document.querySelectorAll(".p6 span");
  for(var MultipleTool of MultipleTools){
    MultipleTool.classList.remove("active");
    MultipleTool.classList.remove("on");
  }
  for(var fontBT of allFonts){
    fontBT.classList.remove("hide");
  }
  ABBDentertxt.classList.add("active");
  ABBDconsole.classList.add("crosshairstyle");
  nodraw = true;
  drawing = false;
  startDrawForms = false;
  editingtxt = true;
  createtextarea = true;
  initTextarea(0,0);
}

//Appelé lors du click sur le bouton tout effacer
function setCleanAll(e){
  var allTxtareas = document.querySelectorAll(".ABBDtxtarea");
  for(var aTextarea of allTxtareas){
    aTextarea.parentNode.removeChild(aTextarea);
  }
  clearAll(largeurcv,hauteurcv);
  e.preventDefault();
}

function eraseALL(){
  var allAddTheAddon = document.getElementById("fwABBDcanvas");
  allAddTheAddon.parentNode.removeChild(allAddTheAddon);
}

function defineBehavior(params){
  //Si on appuie alors que l'interface est déjà présente
  if(document.getElementById("fwABBDcanvas")){
    eraseALL();
  }else{
    runthis(params);
  }

}


function takeFScreenShot(){
  heightTotal = document.body.scrollHeight;
  thisConsole = ABBDconsole;
  var params = {
    "heightTotal":heightTotal
  }
  ABBDconsole.classList.add("ABBDhide");
  self.port.emit('takeascreen', params);
}


function setScreenArea(e){
  var pntTo = transform_event_coord(e);
  var screenAreaNode = document.getElementById("ABBDsurfaceScreen");

  if(pntTo.x > ptFromx && pntTo.y > ptFromy){
    screenAreaNode.style.width = (pntTo.x-ptFromx)+"px";
    screenAreaNode.style.height = (pntTo.y-ptFromy)+"px";
  }else if(pntTo.x > ptFromx && pntTo.y < ptFromy){//if pointer is verticaly upper than the original click
    screenAreaNode.style.top = pntTo.y+"px";
    screenAreaNode.style.width = (pntTo.x-ptFromx)+"px";
    screenAreaNode.style.height = (ptFromy-pntTo.y)+"px";
  }else if(pntTo.x < ptFromx && pntTo.y > ptFromy){//îf pointer is horizontaly lefter than the original click
    screenAreaNode.style.left = pntTo.x+"px";
    screenAreaNode.style.width = (ptFromx - pntTo.x)+"px";
    screenAreaNode.style.height = (pntTo.y-ptFromy)+"px";
  }else{//if pointer is lefter and upper than the original point
    screenAreaNode.style.top = pntTo.y+"px";
    screenAreaNode.style.left = pntTo.x+"px";
    screenAreaNode.style.width = (ptFromx-pntTo.x)+"px";
    screenAreaNode.style.height = (ptFromy-pntTo.y)+"px";
  }

}

function createScreenArea(e){
  var pseudoScreen = document.createElement("div");
  pseudoScreen.id = "ABBDsurfaceScreen";
  ABBDconsole.appendChild(pseudoScreen);
  firstPos = transform_event_coord(e);
  pseudoScreen.style.top = firstPos.y+"px";
  pseudoScreen.style.left = firstPos.x+"px";
  ptFromx = firstPos.x;
  ptFromy = firstPos.y;
  currentCalcul = true;
  createScreenShot = false;
  ABBDconsole.removeEventListener("mousedown", createScreenArea, true);
  takeScreenShotZ(e.clientX, e.clientY);
}

function finishScreenArea(e){
  currentCalcul = false;
  ABBDconsole.classList.remove("crosshairstyle");
  var ABBDscreenSize = document.getElementById("ABBDsurfaceScreen");
  ABBDconsole.removeEventListener("mousemove", setScreenArea, false);
  ABBDconsole.removeEventListener("mouseup", finishScreenArea, false);
  var screenPos = ABBDscreenSize.getBoundingClientRect();
  var topS = screenPos.top+document.documentElement.scrollTop;
  var leftS = screenPos.left+document.documentElement.scrollLeft;
  var widthS = ABBDscreenSize.offsetWidth;
  var heightS = ABBDscreenSize.offsetHeight;
  self.port.emit('takeascreen', {"to":topS,"le":leftS,"wi":widthS,"he":heightS});
  finishScreen();
}

function takeScreenShotZ(ptFromx,ptFromy){
  if(createScreenShot === true){
    ABBDconsole.addEventListener("mousedown", createScreenArea, true);
  }

  if(currentCalcul === true){
    ABBDconsole.addEventListener("mousemove", setScreenArea, false);
    ABBDconsole.addEventListener("mouseup", finishScreenArea, true);
  }

}

function setScreen(){

  initSoftTxt();
  nodraw = true;
  drawing = false;
  startDrawForms = false;
  editingtxt = true;
  ABBDscreenZone.classList.add("active");
  ABBDconsole.classList.add("crosshairstyle");
  createScreenShot = true;
  takeScreenShotZ();
}

function runNext(){

  ABBDcanvas = document.getElementById("fwABBDwindow");
  ABBDconsole = document.getElementById("fwABBDcanvas");
  ABBDbrush = document.getElementById("ABBDbrush");
  ABBDslider = document.getElementById("ABBDslider");
  ABBDcolorpicker = document.getElementById("colorpicker");
  ABBDgomme = document.getElementById("gomme");
  ABBDforms = document.querySelectorAll(".p5 span");
  ABBDentertxt = document.getElementById("entertext");
  ABBDclean = document.getElementById("eraseall");
  ABBDfullscreen = document.getElementById("fullscreenshot");
  ABBDscreenZone = document.getElementById("screenshot");

  hauteurcv = document.documentElement.scrollHeight;
  largeurcv = document.documentElement.scrollWidth;
  var ctxBrush = ABBDbrush.getContext("2d");
  initCV(largeurcv,hauteurcv);
  ABBDcanvas.width  = largeurcv;
  ABBDcanvas.height = hauteurcv;

  ABBDslider.addEventListener("mousedown", previsuBrush, true);
  ABBDslider.addEventListener("change", function(){stopBrush(ctxBrush);}, true);
  ABBDslider.addEventListener("mouseup", function(){stopBrush(ctxBrush);}, true);
  window.addEventListener("resize", resizeCanvas, true);
  ABBDcolorpicker.addEventListener("change", setColors, true);
  ABBDgomme.addEventListener("click", setGum, true);
  ABBDentertxt.addEventListener("click",setTxt, true)
  ABBDclean.addEventListener("click",setCleanAll, true);
  ABBDfullscreen.addEventListener("click",takeFScreenShot, true);
  ABBDscreenZone.addEventListener("click",setScreen, true);
  inittools();
  
  for(var ABBDform of ABBDforms){
    ABBDform.addEventListener("click", setForm, true);
  }

}

function initType(e){
  initSoft();
  typeSelected = e.target;
  typeSelected.classList.add("active");
  ABBDgomme.classList.remove("active");
  startDrawForms = false;
  eraser = false;
  drawing = false;
  if(typeSelected.classList.contains("on")){
    typeSelected.classList.remove(e.target.notthisone);
    typeSelected.classList.add(e.target.usethisclass);
    type = (e.target.usethisclass == "crayon") ? "round" : "miter";
  }else{
    typeSelected.classList.add("on");
  }
  typeSelected.removeEventListener("click", initType, false);
  inittools();
  e.preventDefault();
}

function initPencilandFeutre(){
  var IconCrayon = document.querySelector(".p4 #pencil.crayon");
  var IconFeutre = document.querySelector(".p4 #pencil.feutre");

  if(IconCrayon){IconCrayon.usethisclass = 'feutre';IconCrayon.notthisone = 'crayon';}
  if(IconFeutre){IconFeutre.usethisclass = 'crayon';IconFeutre.notthisone = 'feutre';}

  //passer en mode carré
  if(IconCrayon) IconCrayon.addEventListener('click', initType, true);
  if(IconFeutre) IconFeutre.addEventListener('click', initType, true);
}

function inittools(){
  modefusion = "source-over";
  createtextarea = false;
  editingtxt = false;
  var nodeForms = document.querySelectorAll(".p5 span");
  for(var nodeForm of nodeForms){
    nodeForm.classList.remove("active");
  }

  initPencilandFeutre();
}

//remove textarea behind
function reinitxt(){
  txtareas = document.querySelectorAll("#fwABBDcanvas .ABBDtxtarea");
  for(var txtarea of txtareas){
    txtarea.style.zIndex = 2;
    txtarea.style.border = "none";
    txtarea.removeAttribute("id");
  }
}

//Remove temporary canvas + remove textarea behind (reinitxt) + add EventListener
function initSoft(){
  //var canvas = document.getElementById("fwABBDwindow");
  if(document.getElementById("fwABBDwindowTemp")){
    var CanvasTMP = document.getElementById("fwABBDwindowTemp");
    CanvasTMP.parentNode.removeChild(CanvasTMP);
  }
  reinitxt();
  //var ctx = canvas.getContext("2d");
  //$("#fwABBDwindowTemp").remove();
  nodraw = false;
  ABBDcanvas.addEventListener("mousedown", on_mousedown, true);
  ABBDcanvas.addEventListener("mousemove", on_mousemove, true);
  ABBDcanvas.addEventListener("mouseup"  , on_mouseup  , true);
}

/* size the Canvas and remove the tmp canvas */
function initCV(largeurCanvas,hauteurCanvas){
  var ABBDcanvas = document.getElementById("fwABBDwindow");
  var canvasTmp = document.getElementById("fwABBDwindowTemp");
  ABBDcanvas.width = largeurCanvas;
  ABBDcanvas.height = hauteurCanvas;
  var ctx = ABBDcanvas.getContext("2d");
  if(canvasTmp){canvasTmp.parentNode.removeChild(temporary);}
  ABBDcanvas.addEventListener("mousedown", on_mousedown, true);
  ABBDcanvas.addEventListener("mousemove", on_mousemove, true);
  ABBDcanvas.addEventListener("mouseup", on_mouseup, true);
}

function on_mousedown(e){
  if(createtextarea == false){drawing = true;}else{drawing = false;}
  lastpos = transform_event_coord(e);
}

function on_mousemove(e){
  if (!drawing || nodraw == true){
    return;
  }

  var pos = transform_event_coord(e);

  var ctx = ABBDcanvas.getContext("2d");

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

//Call when user release mouse of when he manipulate brush size
function on_mouseup(){
    drawing = false;
}


function transform_event_coord(e){
  var coord = offset(ABBDcanvas);
  var coordx = window.pageXOffset;//For knowing how much has been scrolled
  var coordy = window.pageYOffset;
  return{
      //x: coordy - coord.left+e.clientX,
      //y: coordx - coord.top+e.clientY
      x: 0 - coord.left+e.clientX,
      y: 0 - coord.top+e.clientY
  };
}


// Resize the canvas size when user change window size
function resizeCanvas(){
  var wheight = window.innerHeight;
  var wwidth = window.innerWidth;

  var context = ABBDcanvas.getContext("2d");
  var previousDrawing = context.getImageData(0, 0, wwidth, wheight);

  if(wheight>hauteurcv){
      ABBDcanvas.height = wheight;
      hauteurcv = wheight;
      context.putImageData(previousDrawing,0,0);
  }
  if(wwidth>largeurcv){
      canvas.width = wwidth+"px";
      largeurcv = wwidth;
      context.putImageData(previousDrawing,0,0);
  }
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


function runthis(dataFromPlugin){
  var wrapper = document.createElement('div');

	wrapper.innerHTML= '<div id="fwABBDcanvas">'+
  '<div class="fwABBDconsolWrap">'+
  '<div class="fwABBDconsol">'+
      '<div class="part p1">'+
          '<span class="legend">'+dataFromPlugin[2]["size_id"]+' :</span>'+
          '<div id="ABBDslider">'+
              '<input type="range" min="1" max="150" value="1" />'+
          '</div>'+
      '</div>'+
      '<div class="part p2">'+
          '<span class="legend">'+dataFromPlugin[2]["color_id"]+' :</span>'+
          '<div class="cp"><input type="color" name="colorpicker" id="colorpicker"></div>'+
      '</div>'+
      '<div class="part p4">'+
          '<a href="#" title="'+dataFromPlugin[2]["mod_ttl_gum_id"]+'" id="gomme" class="off">'+dataFromPlugin[2]["mod_gomme_id"]+'</a>'+
          '<a href="#" id="pencil" class="on active crayon">'+dataFromPlugin[2]["mod_write_id"]+'</a>'+
      '</div>'+
      '<div class="part p5">'+
          '<span title="'+dataFromPlugin[2]["mod_ttl_square_id"]+'" class="drawsquare">'+dataFromPlugin[2]["mod_fullsquare_id"]+'</span>'+
          '<span title="'+dataFromPlugin[2]["mod_ttl_circle_id"]+'" class="drawcircle">'+dataFromPlugin[2]["mod_circle_id"]+'</span>'+
          '<span title="'+dataFromPlugin[2]["mod_ttl_trait_id"]+'" class="drawtrait">'+dataFromPlugin[2]["mod_trait_id"]+'</span>'+
          '<span title="'+dataFromPlugin[2]["mod_ttl_emptySquare_id"]+'" class="drawsquarempty">'+dataFromPlugin[2]["mod_emptysquare_id"]+'</span>'+
      '</div>'+
      '<div class="part p6">'+
          '<span class="hide" title="'+dataFromPlugin[2]["mod_sansserif_id"]+'" id="abbdTimes">'+dataFromPlugin[2]["mod_sansserif_id"]+'</span>'+
          '<span class="hide" title="'+dataFromPlugin[2]["mod_serif_id"]+'" id="abbdArial">'+dataFromPlugin[2]["mod_serif_id"]+'</span>'+
          '<a href="#" id="entertext">'+dataFromPlugin[2]["mod_entertext_id"]+'</a>'+
      '</div>'+
      '<div class="part p7">'+
          '<span class="" title="'+dataFromPlugin[2]["mod_screenshot"]+'" id="screenshot">'+dataFromPlugin[2]["mod_screenshot"]+'</span>'+
          '<span class="" title="'+dataFromPlugin[2]["mod_fullscreenshot"]+'" id="fullscreenshot">'+dataFromPlugin[2]["mod_fullscreenshot"]+'</span>'+
      '</div>'+
      '<div class="part p3">'+
          '<a href="#" id="eraseall" class="legend">'+dataFromPlugin[2]["mod_erraseall_id"]+'</a>'+
      '</div>'+
      '</div>'+
      '</div>'+
      '<canvas id="fwABBDwindow"></canvas>'+
      '<canvas id="ABBDbrush" height="150" width="150"></canvas>'+
      '</div>';

	var canevas = wrapper.firstChild;
  document.body.appendChild(canevas);
  addCSS(dataFromPlugin[0]);
  if(dataFromPlugin[3] != 'undefined'){
    addCSS(dataFromPlugin[3]);
  }
  runNext();

  /*
  $b("embed").attr('wmode','transparent');
  */

}

function drawForm(){
  var container = ABBDcanvas.parentNode;
  canvasTemp = document.createElement('canvas');
  canvasTemp.id     = 'fwABBDwindowTemp';
  canvasTemp.width  = ABBDcanvas.width;
  canvasTemp.height = ABBDcanvas.height;
  container.appendChild(canvasTemp);

  exa = ABBDcolorpicker.value;

  canvasTemp.addEventListener("mousedown", startForm, true);
  canvasTemp.addEventListener("mousemove", CalculForm, true);
  canvasTemp.addEventListener("mouseup", EndForm, true);
}


// Pack Behavior for drawing forms
function startForm(e){
  startDrawForms = (editingtxt==false) ? true : false;
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
    var ctx = e.target.getContext("2d");

    var BTdrawsquare = document.querySelector(".fwABBDconsol .drawsquare");
    var BTdrawcircle = document.querySelector(".fwABBDconsol .drawcircle");
    var BTdrawsquarempty = document.querySelector(".fwABBDconsol .drawsquarempty");

    ctx.clearRect(0, 0, largeurcv, hauteurcv);
    if(BTdrawsquare.classList.contains("active")){
        drawRectangle(firstPos,CurPos,ctx);
    }else if(BTdrawcircle.classList.contains("active")){
        drawCircle(firstPos,CurPos,ctx);
    }else if(BTdrawsquarempty.classList.contains("active")){
        drawRectanglempty(firstPos,CurPos,ctx);
    }else{
        drawLine(firstPos,CurPos,ctx);
    }
  }
}

function EndForm(e){
  var canvasRoot = document.getElementById("fwABBDwindow").getContext("2d");
  canvasRoot.globalCompositeOperation = "source-over";
  startDrawForms = false;
  nodraw = true;
  canvasRoot.drawImage(e.target,0,0);
}
// End pack of Behavior for drawing forms

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

function initArial(e){
  ffamily = "Arial, sans-serif";
  e.target.classList.add("active");
  e.target.previousSibling.classList.remove("active");
  setFieldFocus();
}

function initTimes(e){
  ffamily = "Times, serif";
  e.target.classList.add("active");
  e.target.nextSibling.classList.remove("active");
  setFieldFocus();
}

function setFieldFocus(){
  if(document.getElementById("thisActive")){
    currentField = document.getElementById("thisActive");
    currentField.style.fontFamily = ffamily;
    currentField.focus();
  }
}

function setTxtArea(e){
  var pseudoTxtarea = document.createElement("div");
  pseudoTxtarea.id = "ABBDenteringtxt";
  pseudoTxtarea.classList.add("ABBDtxtarea");
  ABBDconsole.appendChild(pseudoTxtarea);
  var pntTo = transform_event_coord(e);
  pseudoTxtarea.style.top = pntTo.y+"px";
  pseudoTxtarea.style.left = pntTo.x+"px";
  txtpntFromx = pntTo.x;
  txtpntFromy = pntTo.y;
  realCalculation = true;
  createtextarea = false;
  ABBDconsole.removeEventListener("mousedown", setTxtArea, true);
  initTextarea(pntTo.x, pntTo.y);
}

function createTxtArea(e){
  var pntTo = transform_event_coord(e);
  var txtareaNode = document.getElementById("ABBDenteringtxt");
  txtareaNode.style.width = (pntTo.x-txtpntFromx)+"px";
  txtareaNode.style.height = (pntTo.y-txtpntFromy)+"px";
}

function finishTxtArea(e){
  var ABBDpseudoTxtAra = document.getElementById("ABBDenteringtxt");
  ABBDconsole.removeEventListener("mousemove", createTxtArea, false);
  ABBDconsole.removeEventListener("mouseup", finishTxtArea, false);
  realCalculation = false;
  createtextarea = false;
  editingtxt = true;

  var txtawidth = ABBDpseudoTxtAra.offsetWidth;
  var txtaheight = ABBDpseudoTxtAra.offsetHeight;
  //http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
  
  var txtapos = ABBDpseudoTxtAra.getBoundingClientRect();
  var topTxtarea = txtapos.top+document.documentElement.scrollTop;
  var leftTxtarea = txtapos.left+document.documentElement.scrollLeft;
  if(5>sizeBrush){sizeTxt=12;}else{sizeTxt=sizeBrush;}
  var newTxtarea = document.createElement("textarea");
  newTxtarea.id = "thisActive";
  newTxtarea.classList.add("ABBDtxtarea");
  newTxtarea.placeholder = "Entrez ici votre texte";
  newTxtarea.style.cssText = 'width:'+txtawidth+'px !important;color:'+exa+';font-size:'+sizeTxt+'px;height:'+txtaheight+'px !important;top:'+topTxtarea+'px;left:'+leftTxtarea+'px;';
  ABBDpseudoTxtAra.parentNode.replaceChild(newTxtarea,ABBDpseudoTxtAra);
  newTxtarea.focus;
  ABBDconsole.classList.remove("crosshairstyle");
  initTextarea(txtpntFromx,txtpntFromy);

}

//Function calling herself each click /via createTxtArea
function initTextarea(txtpntFromx,txtpntFromy){
  initSoftTxt();

  ABBDfontArial = document.getElementById("abbdArial");
  ABBDfontTimes = document.getElementById("abbdTimes");

  ABBDfontArial.addEventListener("click", initArial, true);
  ABBDfontTimes.addEventListener("click", initTimes, true);

  if(createtextarea==true){
    ABBDconsole.addEventListener("mousedown", setTxtArea, true);
  }

  if(realCalculation == true){
    createtextarea = false;
    ABBDconsole.addEventListener("mousemove", createTxtArea, false);
    ABBDconsole.addEventListener("mouseup", finishTxtArea, true);
  }

}

//Remove temporary canvas
function initSoftTxt(){
  if(document.getElementById("fwABBDwindowTemp")){
    var canvasTp = document.getElementById("fwABBDwindowTemp");
    canvasTp.parentNode.removeChild(canvasTp);
  }
}

function clearAll(wCV,hCV){

  ABBDcanvas.removeEventListener("mousedown", on_mousedown, true);
  ABBDcanvas.removeEventListener("mousemove", on_mousemove, true);
  ABBDcanvas.removeEventListener("mouseup", on_mouseup, true);

  var canvasTmp = document.getElementById("fwABBDwindowTemp");
  var container = ABBDcanvas.parentNode;
  if(canvasTmp){canvasTmp.parentNode.removeChild(canvasTmp);}
  ABBDcanvas.parentNode.removeChild(ABBDcanvas);

  neoCanvas = document.createElement("canvas");
  neoCanvas.id = "fwABBDwindow";
  neoCanvas.style.width = wCV+"px";
  neoCanvas.style.height = hCV+"px";
  ABBDcanvas = container.insertBefore(neoCanvas, ABBDbrush);

  initCV(wCV,hCV);
  backToPreviousActive();

}

function backToPreviousActive(){
  var iconPencil = document.getElementById("pencil");
  var iconGum = document.getElementById("gomme");

  if(!iconPencil.classList.contains("active") && !iconGum.classList.contains("active")){
    nodraw = true;
    var waswriting = 0;
    var wasForming = 0;

    var txtAreasBTDom = document.querySelectorAll(".fwABBDcanvas .p6 span");
    for(var aTxtArea of txtAreasBTDom){
      if(aTxtArea.classList.contains("active")) waswriting++;
    }

    var formBTDom = document.querySelectorAll(".drawsquare, .drawcircle, .drawtrait, .drawsquarempty");
    for(var aBTDom of formBTDom){
      if(aBTDom.classList.contains("active")) wasForming++;
    }

    if(wasForming>0){
      editingtxt = false;
      drawForm();
    }else if(waswriting>0){
      nodraw = true;
      drawing = false;
      startDrawForms = false;
      editingtxt = true;
      createtextarea = true;
      initTextarea(0,0);
    }

  }else{
    editingtxt = false;
    nodraw = false;//Mod dessiner
    drawing = false;//is true only with mouse move event.
  }

}

// when screenshot over
function finishScreen(){
  var crop = document.getElementById("ABBDsurfaceScreen");
  crop.parentNode.removeChild(crop);
  ABBDscreenZone.classList.remove("active");
  currentCalcul = false;
  backToPreviousActive();
};

self.port.on("displayABBDconsole",function(){
  ABBDconsole = document.getElementById("fwABBDcanvas");
  ABBDconsole.classList.remove("ABBDhide");
})


//* Launch everything!! *//
self.port.on("init", function(params){
  if(document.doctype != null){
    if(document.doctype.ownerDocument.contentType == "text/html"){
      defineBehavior(params);
    }else{
      alert(params[2]["mod_warning_id"]);
    }
  }else{
    alert(params[2]["mod_warning_id"]);
  }
  
});
