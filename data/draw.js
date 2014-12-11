//https://bgrins.github.io/spectrum/
//http://blogzinet.free.fr/blog/index.php?post/2013/05/17/Blocage-du-contenu-mixte-dans-Mozilla-Firefox-23-Aurora
//https://davidsimpson.me/2013/10/10/how-to-allow-not-block-mixed-content-in-web-browsers/
//https://bugzilla.mozilla.org/show_bug.cgi?id=886663
// > https://bugzilla.mozilla.org/show_bug.cgi?id=866522
// > https://bugzilla.mozilla.org/show_bug.cgi?id=1014545
//https://www.eff.org/https-everywhere/
//http://stackoverflow.com/questions/14367711/bookmarklet-on-https-page
//http://content-security-policy.com/

//http://dxr.mozilla.org/mozilla-central/source/toolkit/devtools/gcli/commands/screenshot.js#100-252
//http://stackoverflow.com/questions/26525639/firefox-addon-sdk-1-17-take-screenshot
//http://stackoverflow.com/questions/25332458/firefox-addon-api-for-taking-screenshot?rq=1
//http://stackoverflow.com/questions/17913911/how-do-i-use-the-canvas-drawwindow-function-in-an-addon-created-using-the-addon

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

//Brush behavior
function on_change(){
  var biggness = ABBDslider.firstChild.value;
  nodraw = true;
  percent(biggness);
  //toslide(ABBDbrush);
}

function stopBrush(ctxBrush){
  //if(editingtxt == false){nodraw = false;}else{nodraw = true;}
  ABBDslider.removeEventListener("mousemove", on_change, true);
  ABBDslider.removeEventListener("change", stopBrush, true);
  
  sizeBrush = ABBDslider.firstChild.value;

  nodraw = editingtxt !== false;
  ctxBrush.clearRect(0,0,200,200);
}

function previsuBrush(){
  ABBDslider.addEventListener("mousemove", on_change, true);
}

function offset(elt) {
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
function setColors(){exa = ABBDcolorpicker.value;}

// Set Gum behavior
function setGum(){
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
}

function setTxt(){
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
function setCleanAll(){
  var allTxtareas = document.querySelectorAll(".ABBDtxtarea");
  for(var aTextarea of allTxtareas){
    aTextarea.parentNode.removeChild(aTextarea);
  }
  clearAll(largeurcv,hauteurcv);
}

function eraseALL(){
  var allAddTheAddon = document.querySelector(".fwABBDcanvas");
  allAddTheAddon.parentNode.removeChild(allAddTheAddon);
  ABBDcanvas.removeEventListener("mousedown", on_mousedown, true);
  ABBDcanvas.removeEventListener("mousemove", on_mousemove, true);
  ABBDcanvas.removeEventListener(  "mouseup", on_mouseup  , true);
}

function defineBehavior(params){
  //Si on appuie alors que l'interface est déjà présente
  if(document.querySelector(".fwABBDcanvas")){
    eraseALL();
  }else{
    runthis(params);
  }

}

function runNext(){

  ABBDcanvas = document.getElementById("fwABBDwindow");
  ABBDconsole = document.querySelector(".fwABBDcanvas");
  ABBDbrush = document.getElementById("ABBDbrush");
  ABBDslider = document.getElementById("ABBDslider");
  ABBDcolorpicker = document.getElementById("colorpicker");
  ABBDgomme = document.getElementById("gomme");
  ABBDforms = document.querySelectorAll(".p5 span");
  ABBDentertxt = document.getElementById("entertext");
  ABBDclean = document.getElementById("eraseall");

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
  txtareas = document.querySelectorAll(".fwABBDcanvas .ABBDtxtarea");
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
  //console.log(exa+" - "+lastpos.x+" - "+lastpos.y);
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
  //var coordx = window.pageXOffset;//For knowing how much has been scrolled
  //var coordy = window.pageYOffset;
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


	wrapper.innerHTML= '<div class="fwABBDcanvas"><div class="fwABBDconsol">'+
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
          '<a href="#" id="gomme" class="off">'+dataFromPlugin[2]["mod_gomme_id"]+'</a>'+
          '<a href="#" id="pencil" class="on active crayon">'+dataFromPlugin[2]["mod_write_id"]+'</a>'+
      '</div>'+
      '<div class="part p5">'+
          '<span class="drawsquare">'+dataFromPlugin[2]["mod_fullsquare_id"]+'</span>'+
          '<span class="drawcircle">'+dataFromPlugin[2]["mod_circle_id"]+'</span>'+
          '<span class="drawtrait">'+dataFromPlugin[2]["mod_trait_id"]+'</span>'+
          '<span class="drawsquarempty">'+dataFromPlugin[2]["mod_emptysquare_id"]+'</span>'+
      '</div>'+
      '<div class="part p3">'+
          '<a href="#" id="eraseall" class="legend">'+dataFromPlugin[2]["mod_erraseall_id"]+'</a>'+
      '</div>'+
      '<div class="part p6">'+
          '<span class="hide active" title="typo a empattement" id="abbdTimes">'+dataFromPlugin[2]["mod_sansserif_id"]+'</span>'+
          '<span class="hide" title="typo sans empattement" id="abbdArial">'+dataFromPlugin[2]["mod_serif_id"]+'</span>'+
          '<a href="#" id="entertext">'+dataFromPlugin[2]["mod_entertext_id"]+'</a>'+
      '</div>'+
      '</div><canvas id="fwABBDwindow">'+
      '</canvas><canvas id="ABBDbrush" height="150" width="150"></canvas>'+
      '</div>';

	var canevas = wrapper.firstChild;
  document.body.appendChild(canevas);
  addCSS(dataFromPlugin[0]);
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
  e.target.classList.add("active");
  e.target.previousSibling.classList.remove("active");
  ffamily = "Arial, sans-serif";
  setFieldFocus;
}

function initTimes(e){
  e.target.classList.add("active");
  e.target.nextSibling.classList.remove("active");
  ffamily = "Times, serif";
  setFieldFocus;
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
  pseudoTxtarea.style.top = e.clientY+"px";
  pseudoTxtarea.style.left = e.clientX+"px";
  txtpntFromx = e.clientX;
  txtpntFromy = e.clientY;
  realCalculation = true;
  createtextarea = false;
  ABBDconsole.removeEventListener("mousedown", setTxtArea, true);
  initTextarea(e.clientX, e.clientY);
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
  if(5>sizeBrush){sizeTxt=12;}else{sizeTxt=sizeBrush;}
  var newTxtarea = document.createElement("textarea");
  newTxtarea.id = "thisActive";
  newTxtarea.classList.add("ABBDtxtarea");
  newTxtarea.placeholder = "Entrez ici votre texte";
  newTxtarea.style.cssText = 'width:'+txtawidth+'px !important;color:'+exa+';font-size:'+sizeTxt+'px;height:'+txtaheight+'px !important;top:'+txtapos.top+'px;left:'+txtapos.left+'px;';
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
  ABBDcanvas.removeEventListener(  "mouseup", on_mouseup  , true);

  var canvasTmp = document.getElementById("fwABBDwindowTemp");
  var container = ABBDcanvas.parentNode;
  if(canvasTmp){canvasTmp.parentNode.removeChild(temporary);}
  ABBDcanvas.parentNode.removeChild(ABBDcanvas);

  neoCanvas = document.createElement("canvas");
  neoCanvas.id = "fwABBDwindow";
  neoCanvas.style.width = wCV+"px";
  neoCanvas.style.height = hCV+"px";
  ABBDcanvas = container.insertBefore(neoCanvas, ABBDbrush);


  initCV(wCV,hCV);

  var iconPencil = document.getElementById("pencil");
  var iconGum = document.getElementById("gomme");

  if(!iconPencil.classList.contains("active") && !iconGum.classList.contains("active")){
    nodraw = true;
    waswriting = 0;
    var formBTDom = document.querySelector(".drawsquare, .drawcircle, .drawtrait, .drawsquarempty");
    var txtAreasBTDom = document.querySelectorAll(".fwABBDcanvas .p6 span");
    for(var aTxtArea of txtAreasBTDom){
      if(aTxtArea.classList.contains("active")) waswriting++;
    }

    if(formBTDom.classList.contains("active")){
      drawForm();
    }else if(waswriting>0){
      nodraw = true;
      drawing = false;
      startDrawForms = false;
      editingtxt = true;
      createtextarea = true;
      initTextarea(0,0);
    }
  }

}


//* Launch everything!! *//
self.port.on("init", function(params){

  if(document.doctype.ownerDocument.contentType == "text/html"){
    defineBehavior(params);
  }else{
    alert(params[2]["mod_warning_id"]);
  }
  
});
