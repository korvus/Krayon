/* jshint moz: true */
/* global self: false */

(function(){
  
  var Krayoncanvas = {};
  var Krayonconsole = {};
  var Krayonbrush = {};
  var Krayonslider = "";
  var Krayoncolorpicker = "";
  var Krayongomme = "";
  var Krayonforms = "";
  var Krayonentertxt = "";
  var Krayonclean = "";
  var Krayonfullscreen = "";
  var KrayonscreenZone = "";
  var allTools = "";
  var IconCrayon = false;
  var IconFeutre = false;
  
  /* Nodes */
  var nDomTool = {};

  /* Variables */
  var nodraw = 0;
  var drawing = false;
  var lastpos = {x:-1,y:-1};
  var sizeBrush = 1;
  var exa = "#000000";
  var eraser = false;
  var type = "round";
  var ctx = "";
  var firstPos = {x:0,y:0};
  var startDrawForms = false;
  var modefusion = "source-over";
  var hauteurcv = 0;
  var largeurcv = 0;
  var ptFromx = 0;
  var ptFromy = 0;
  var txtpntFromx = 0;
  var txtpntFromy = 0;
  var heightTotal = 0;
  var sizeTxt = 12;
  var pos = {};

  /* Text mod */
  var createtextarea = false;
  var realCalculation = false;
  var editingtxt = false;
  var ffamily = "Times, serif";
  var placeholderTXT = "";

  /* Screenshot Area */
  var createScreenShot = false;
  var currentCalcul = false;

  //Brush behavior
  function on_change(){
    var biggness = Krayonslider.firstChild.value;
    nodraw = true;
    percent(biggness);
    //toslide(Krayonbrush);
  }

  function stopBrush(ctxBrush){
    Krayonslider.removeEventListener("mousemove", on_change, true);
    Krayonslider.removeEventListener("change", stopBrush, true);
    
    sizeBrush = Krayonslider.firstChild.value;

    if(editingtxt){
      if(document.getElementById("thisActive")){
        document.getElementById("thisActive").style.fontSize = sizeBrush+"px";
      }
    }

    Krayonbrush.style.zIndex = 0;
    nodraw = editingtxt !== false;
    ctxBrush.clearRect(0,0,200,200);
  }

  function previsuBrush(){
    Krayonslider.addEventListener("mousemove", on_change, true);
  }

  function offset(elt){
    var rect = elt.getBoundingClientRect(), bodyElt = document.body;
    return {
        top: rect.top + bodyElt.scrollTop,
        left: rect.left + bodyElt.scrollLeft
    };
  }

  // Get the context for the canvas brush representation and draw it
  function percent(value){
    var ctxBrush = Krayonbrush.getContext("2d");
    sbs(value,ctxBrush);
    sizeBrush = value;
    Krayonbrush.style.zIndex = 4;
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
    exa = Krayoncolorpicker.value;
    if(editingtxt){//If user has an active textarea
      if(document.getElementById("thisActive")){
        document.getElementById("thisActive").style.color = exa;
      }
    }
  }

  // Set Gum behavior
  function setGum(e){
    initSoft();
    Krayongomme.classList.add("active");
    Krayongomme.nextSibling.classList.remove("on","active");
    var othersNodesTool = document.querySelectorAll(".drawtrait, .drawsquare, .drawcircle, .p6 span");
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
    initFontBt();
    for(var MultipleTool of allTools){
      MultipleTool.classList.remove("active");
      MultipleTool.classList.remove("on");
    }
    e.target.classList.add("active");
    drawForm();
    e.preventDefault();
  }

  function initFontBt(){
    var allFonts = document.querySelectorAll("#KrayonTimes, #KrayonArial");
    for(var font of allFonts){
      font.classList.add("hide");
    }
    Krayonentertxt.classList.remove("active");
  }

  function setTxt(e){
    e.preventDefault();
    reinitxt();
    var allFonts = document.querySelectorAll(".p6 span");
    for(var MultipleTool of allTools){
      MultipleTool.classList.remove("active");
      MultipleTool.classList.remove("on");
    }
    for(var fontBT of allFonts){
      fontBT.classList.remove("hide");
    }
    Krayonentertxt.classList.add("active");
    Krayonconsole.classList.add("crosshairstyle");
    nodraw = true;
    drawing = false;
    startDrawForms = false;
    editingtxt = true;
    createtextarea = true;
    initTextarea(0,0);
  }

  //Appelé lors du click sur le bouton tout effacer
  function setCleanAll(e){
    var allTxtareas = document.querySelectorAll(".Krayontxtarea");
    for(var aTextarea of allTxtareas){
      aTextarea.parentNode.removeChild(aTextarea);
    }
    clearAll(largeurcv,hauteurcv);
    e.preventDefault();
  }

  function eraseALL(){
    var allAddTheAddon = document.getElementById("fwKrayoncanvas");
    allAddTheAddon.parentNode.removeChild(allAddTheAddon);
  }

  function defineBehavior(params){
    //If already in the page
    if(document.getElementById("fwKrayoncanvas")){
      eraseALL();
    }else{
      createConsole(params);
    }

  }

  var displayKrayonconsole = function(){
    Krayonconsole.classList.remove("Krayonhide");
  }

  function takeFScreenShot(){
    heightTotal = document.body.scrollHeight;
    var params = {
      "heightTotal":heightTotal
    };
    Krayonconsole.classList.add("Krayonhide");
    self.port.emit('takeascreen', params);
    setTimeout(displayKrayonconsole,1000);
  }


  function setScreenArea(e){
    var pntTo = transform_event_coord(e);
    var screenAreaNode = document.getElementById("KrayonsurfaceScreen");

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
    pseudoScreen.id = "KrayonsurfaceScreen";
    Krayonconsole.appendChild(pseudoScreen);
    firstPos = transform_event_coord(e);
    pseudoScreen.style.top = firstPos.y+"px";
    pseudoScreen.style.left = firstPos.x+"px";
    ptFromx = firstPos.x;
    ptFromy = firstPos.y;
    currentCalcul = true;
    createScreenShot = false;
    Krayonconsole.removeEventListener("mousedown", createScreenArea, true);
    takeScreenShotZ();
  }

  function finishScreenArea(){
    currentCalcul = false;
    Krayonconsole.classList.remove("crosshairstyle");
    var KrayonscreenSize = document.getElementById("KrayonsurfaceScreen");
    Krayonconsole.removeEventListener("mousemove", setScreenArea, false);
    Krayonconsole.removeEventListener("mouseup", finishScreenArea, false);
    var screenPos = KrayonscreenSize.getBoundingClientRect();
    var topS = screenPos.top+document.documentElement.scrollTop;
    var leftS = screenPos.left+document.documentElement.scrollLeft;
    var widthS = KrayonscreenSize.offsetWidth;
    var heightS = KrayonscreenSize.offsetHeight;
    self.port.emit('takeascreen', {"to":topS,"le":leftS,"wi":widthS,"he":heightS});
    finishScreen();
  }

  function takeScreenShotZ(){
    if(createScreenShot === true){
      Krayonconsole.addEventListener("mousedown", createScreenArea, true);
    }

    if(currentCalcul === true){
      Krayonconsole.addEventListener("mousemove", setScreenArea, false);
      Krayonconsole.addEventListener("mouseup", finishScreenArea, true);
    }

  }

  function setScreen(){
    initSoftTxt();
    nodraw = true;
    drawing = false;
    startDrawForms = false;
    editingtxt = true;
    KrayonscreenZone.classList.add("active");
    Krayonconsole.classList.add("crosshairstyle");
    createScreenShot = true;
    takeScreenShotZ();
  }

  function manageFlash(){
    // http://www.onlineaspect.com/2009/08/13/javascript_to_fix_wmode_parameters/
    var embeds = document.getElementsByTagName('embed');
    for(i=0, nEmbeds = embeds.length; i<nEmbeds; i++)  {
      embed = embeds[i];
      var new_embed;
      new_embed = embed.cloneNode(true);
      if(!new_embed.getAttribute('wmode') || new_embed.getAttribute('wmode').toLowerCase()=='window')
        new_embed.setAttribute('wmode','transparent');
      embed.parentNode.replaceChild(new_embed,embed);
    }
  }

  function initEvents(){

    Krayoncanvas = document.getElementById("fwKrayonwindow");
    Krayonconsole = nDomTool.nMaster;
    Krayonbrush = document.getElementById("Krayonbrush");
    Krayonslider = document.getElementById("Krayonslider");
    Krayoncolorpicker = document.getElementById("krayonColorpicker");
    Krayongomme = document.getElementById("KrayonGum");
    Krayonentertxt = document.getElementById("entertext");
    Krayonclean = document.getElementById("eraseall");
    Krayonfullscreen = document.getElementById("fullscreenshot");
    KrayonscreenZone = document.getElementById("screenshot");
    KrayonscreenZone = document.getElementById("screenshot");
    Krayonforms = document.querySelectorAll(".p4 span");
    allTools = document.querySelectorAll(".p3 span,.p4 span,.p5 span");
    IconCrayon = document.querySelector(".p3 #pencil.pencil");
    IconFeutre = document.querySelector(".p3 #pencil.feutre");

    hauteurcv = document.documentElement.scrollHeight;
    largeurcv = document.documentElement.scrollWidth;
    var ctxBrush = Krayonbrush.getContext("2d");
    initCV(largeurcv,hauteurcv);
    Krayoncanvas.width  = largeurcv;
    Krayoncanvas.height = hauteurcv;

    Krayonslider.addEventListener("mousedown", previsuBrush, true);
    Krayonslider.addEventListener("change", function(){stopBrush(ctxBrush);}, true);
    Krayonslider.addEventListener("mouseup", function(){stopBrush(ctxBrush);}, true);
    window.addEventListener("resize", resizeCanvas, true);
    Krayoncolorpicker.addEventListener("change", setColors, true);
    Krayongomme.addEventListener("click", setGum, true);
    Krayonentertxt.addEventListener("click",setTxt, true);
    Krayonclean.addEventListener("click",setCleanAll, true);
    Krayonfullscreen.addEventListener("click",takeFScreenShot, true);
    KrayonscreenZone.addEventListener("click",setScreen, true);
    inittools();

    for(var Krayonform of Krayonforms){
      Krayonform.addEventListener("click", setForm, true);
    }

  }


  function pencil(e){
    initSoft();
    var typeSelected = e.target;
    typeSelected.classList.add("active");
    Krayongomme.classList.remove("active");
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
    typeSelected.removeEventListener("click", pencil, false);
    inittools();
    e.preventDefault();
  }


  function initPencilandFeutre(){
    if(IconCrayon){IconCrayon.usethisclass = 'feutre';IconCrayon.notthisone = 'crayon';}
    if(IconFeutre){IconFeutre.usethisclass = 'crayon';IconFeutre.notthisone = 'feutre';}

    //passer en mode carré
    if(IconCrayon) IconCrayon.addEventListener('click', pencil, true);
    if(IconFeutre) IconFeutre.addEventListener('click', pencil, true);
  }

  function inittools(){
    modefusion = "source-over";
    createtextarea = false;
    editingtxt = false;
    var nodeForms = document.querySelectorAll(".p4 span");
    for(var nodeForm of nodeForms){
      nodeForm.classList.remove("active");
    }
    initFontBt();
    initPencilandFeutre();
  }

  //remove textarea behind
  function reinitxt(){
    var txtareas = document.querySelectorAll("#fwKrayoncanvas .Krayontxtarea");
    for(var txtarea of txtareas){
      txtarea.style.zIndex = 2;
      txtarea.style.border = "none";
      txtarea.removeAttribute("id");
    }
  }

  //Remove temporary canvas + remove textarea behind (reinitxt) + add EventListener
  function initSoft(){
    //var canvas = document.getElementById("fwKrayonwindow");
    if(document.getElementById("fwKrayonwindowTemp")){
      var CanvasTMP = document.getElementById("fwKrayonwindowTemp");
      CanvasTMP.parentNode.removeChild(CanvasTMP);
    }
    reinitxt();
    //var ctx = canvas.getContext("2d");
    //$("#fwKrayonwindowTemp").remove();
    nodraw = false;
    Krayoncanvas.addEventListener("mousedown", on_mousedown, true);
    Krayoncanvas.addEventListener("mousemove", on_mousemove, true);
    Krayoncanvas.addEventListener("mouseup"  , on_mouseup  , true);
  }

  /* size the Canvas and remove the tmp canvas */
  function initCV(largeurCanvas,hauteurCanvas){
    var Krayoncanvas = document.getElementById("fwKrayonwindow");
    var canvasTmp = document.getElementById("fwKrayonwindowTemp");
    Krayoncanvas.width = largeurCanvas;
    Krayoncanvas.height = hauteurCanvas;
    ctx = Krayoncanvas.getContext("2d");
    if(canvasTmp){canvasTmp.parentNode.removeChild(canvasTmp);}
    Krayoncanvas.addEventListener("mousedown", on_mousedown, true);
    Krayoncanvas.addEventListener("mousemove", on_mousemove, true);
    Krayoncanvas.addEventListener("mouseup", on_mouseup, true);
  }

  function on_mousedown(e){
    if(createtextarea === false){drawing = true;}else{drawing = false;}
    lastpos = transform_event_coord(e);
    
    //init context
    ctx = Krayoncanvas.getContext("2d");
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
  }

  function on_mousemove(e){
    if (!drawing || nodraw === true){
      return;
    }
    pos = transform_event_coord(e);
    ctx.beginPath();
    ctx.moveTo(lastpos.x, lastpos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.closePath();
    ctx.stroke();
    lastpos = pos;
    //http://www.html5rocks.com/en/tutorials/canvas/performance/
    //requestAnimationFrame(on_mousemove);
  }

  //Call when user release mouse of when he manipulate brush size
  function on_mouseup(){
      drawing = false;
  }


  function transform_event_coord(e){
    var coord = offset(Krayoncanvas);
    return{
        x: 0 - coord.left+e.clientX,
        y: 0 - coord.top+e.clientY
    };
  }


  // Resize the canvas size when user change window size
  function resizeCanvas(){
    var wheight = window.innerHeight;
    var wwidth = window.innerWidth;
    var context = Krayoncanvas.getContext("2d");
    var previousDrawing = context.getImageData(0, 0, wwidth, wheight);
    if(wheight>hauteurcv){
      Krayoncanvas.height = wheight;
      hauteurcv = wheight;
      context.putImageData(previousDrawing,0,0);
    }
    if(wwidth>largeurcv){
      Krayoncanvas.width = wwidth;
      largeurcv = wwidth;
      context.putImageData(previousDrawing,0,0);
    }
  }

  function createSizeInputNode(){
    let nSize = document.createElement("input");
    nSize.setAttribute("type","range");
    nSize.setAttribute("min","1");
    nSize.setAttribute("max","150");
    nSize.setAttribute("value","1");
    nSize.setAttribute("name","krayonSize");
    return nSize;
  }

  function createColorInputNode(){
    let nColor = document.createElement("input");
    nColor.setAttribute("type","color");
    nColor.setAttribute("id","krayonColorpicker");
    nColor.setAttribute("name","krayonColorpicker");
    return nColor;
  }

  function deployConsole(nConsole, aDom){
    for(var nN=0,nnNode=aDom.length; nN < nnNode; nN++){
      nDomTool["nTool"+nN] = document.createElement('li');
      nDomTool["nTool"+nN].setAttribute("class", "part p"+(nN+1));
      nConsole.appendChild(nDomTool["nTool"+nN]);
      for(var nNa=0,nnNa=aDom[nN][0].length; nNa < nnNa; nNa++){
        nDomTool["nTool"+nN]["nToolAtom"+nNa] = document.createElement(aDom[nN][0][nNa]);
        if(aDom[nN][1][nNa].length>1) nDomTool["nTool"+nN]["nToolAtom"+nNa].setAttribute("id",aDom[nN][1][nNa]);
        if(aDom[nN][2][nNa].length>1) nDomTool["nTool"+nN]["nToolAtom"+nNa].setAttribute("class",aDom[nN][2][nNa]);
        if(aDom[nN][3][nNa].length>1) nDomTool["nTool"+nN]["nToolAtom"+nNa].setAttribute("title",aDom[nN][3][nNa]);
        if(aDom[nN][4][nNa].content){
          let sTxt = document.createTextNode(aDom[nN][4][nNa].content);
          nDomTool["nTool"+nN]["nToolAtom"+nNa].appendChild(sTxt);
        }else if(aDom[nN][4][nNa].domnode === "ref1"){//Create a range input for sizing brush
          nDomTool.nSize = createSizeInputNode();
          nDomTool["nTool"+nN]["nToolAtom"+nNa].appendChild(nDomTool.nSize);
        }else if(aDom[nN][4][nNa].domnode === "ref2"){//Create a color input for coloring brush
          nDomTool.nColor = createColorInputNode();
          nDomTool["nTool"+nN]["nToolAtom"+nNa].appendChild(nDomTool.nColor);
        }
        nDomTool["nTool"+nN].appendChild(nDomTool["nTool"+nN]["nToolAtom"+nNa]);
      }
    }
  }

  function calculSizeConsole(){
    let widthConsole = nDomTool.nConsole.clientWidth;
    nDomTool.nConsole.style.width = widthConsole+"px";
  }

  function addCSS(source){
    var head = document.getElementsByTagName('HEAD')[0];
    var css = document.createElement('link');
    css.setAttribute('type','text/css');
    css.setAttribute('media','screen');
    css.setAttribute('rel','stylesheet');
    css.href = source;
    css.onload = calculSizeConsole;
    head.appendChild(css);
  }

  function createConsole(dataFromPlugin){

    placeholderTXT = dataFromPlugin[2].placeholder;

    /* https://developer.mozilla.org/fr/docs/DOM/document.createDocumentFragment */
    nDomTool.nMaster = document.createElement('section');
    nDomTool.nMaster.setAttribute("id", "fwKrayoncanvas");

    nDomTool.nOverlay = document.createElement('div');
    nDomTool.nOverlay.setAttribute("class", "fwKrayonconsolWrap");
    nDomTool.nMaster.appendChild(nDomTool.nOverlay);

    nDomTool.nConsole = document.createElement('menu');
    nDomTool.nConsole.setAttribute("class", "fwKrayonconsol");
    nDomTool.nConsole.setAttribute("type", "toolbar");
    nDomTool.nOverlay.appendChild(nDomTool.nConsole);

    deployConsole(nDomTool.nConsole, dataFromPlugin[4]);
    
    nDomTool.mainCanvas = document.createElement('canvas');
    nDomTool.mainCanvas.setAttribute("id","fwKrayonwindow");

    nDomTool.mainCanvas = document.createElement('canvas');
    nDomTool.mainCanvas.setAttribute("id","fwKrayonwindow");
    nDomTool.nMaster.appendChild(nDomTool.mainCanvas);

    nDomTool.sizeTools = document.createElement('canvas');
    nDomTool.sizeTools.setAttribute("id","Krayonbrush");
    nDomTool.sizeTools.setAttribute("width","150px");
    nDomTool.sizeTools.setAttribute("height","150px");
    nDomTool.nMaster.appendChild(nDomTool.sizeTools);

    document.body.insertBefore(nDomTool.nMaster,document.body.firstChild);
    //document.body.appendChild(nDomTool.nMaster);

    addCSS(dataFromPlugin[0]);
    if(dataFromPlugin[3] != 'undefined'){
      addCSS(dataFromPlugin[3]);
    }
    initEvents();
    manageFlash();

  }

  function drawForm(){
    var container = Krayoncanvas.parentNode;
    var canvasTemp = document.createElement('canvas');
    canvasTemp.id     = 'fwKrayonwindowTemp';
    canvasTemp.width  = Krayoncanvas.width;
    canvasTemp.height = Krayoncanvas.height;
    container.appendChild(canvasTemp);

    createtextarea = false;
    editingtxt = false;

    exa = Krayoncolorpicker.value;

    canvasTemp.addEventListener("mousedown", startShape, true);
    canvasTemp.addEventListener("mousemove", CalculShape, true);
    canvasTemp.addEventListener("mouseup", EndShape, true);
  }


  // Pack Behavior for drawing forms
  function startShape(e){
    startDrawForms = (editingtxt === false) ? true : false;
    nodraw = true;
    eraser = false;
    drawing = false;
    firstPos = transform_event_coord(e);
    var canvasTp = document.getElementById("fwKrayonwindowTemp");
    ctx = canvasTp.getContext("2d");
  }

  function CalculShape(e){
    if(startDrawForms === true){
      var CurPos = transform_event_coord(e);

      var BTdrawsquare = document.querySelector(".fwKrayonconsol .drawsquare");
      var BTdrawcircle = document.querySelector(".fwKrayonconsol .drawcircle");
      var BTdrawsquarempty = document.querySelector(".fwKrayonconsol .drawsquarempty");

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

  function EndShape(e){
    var canvasRoot = document.getElementById("fwKrayonwindow").getContext("2d");
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
      var currentField = document.getElementById("thisActive");
      currentField.style.fontFamily = ffamily;
      currentField.focus();
    }
  }

  function setTxtArea(e){
    var pseudoTxtarea = document.createElement("div");
    pseudoTxtarea.id = "Krayonenteringtxt";
    pseudoTxtarea.classList.add("Krayontxtarea");
    Krayonconsole.appendChild(pseudoTxtarea);
    var pntTo = transform_event_coord(e);
    pseudoTxtarea.style.top = pntTo.y+"px";
    pseudoTxtarea.style.left = pntTo.x+"px";
    txtpntFromx = pntTo.x;
    txtpntFromy = pntTo.y;
    realCalculation = true;
    createtextarea = false;
    Krayonconsole.removeEventListener("mousedown", setTxtArea, true);
    initTextarea(pntTo.x, pntTo.y);
  }

  function createTxtArea(e){
    let pntTo = transform_event_coord(e);
    let txtareaNode = document.getElementById("Krayonenteringtxt");
    txtareaNode.style.width = (pntTo.x-txtpntFromx)+"px";
    txtareaNode.style.height = (pntTo.y-txtpntFromy)+"px";
  }

  function finishTxtArea(){
    var KrayonpseudoTxtAra = document.getElementById("Krayonenteringtxt");
    Krayonconsole.removeEventListener("mousemove", createTxtArea, true);
    Krayonconsole.removeEventListener("mouseup", finishTxtArea, true);
    realCalculation = false;
    createtextarea = false;
    editingtxt = true;
    let txtawidth = KrayonpseudoTxtAra.offsetWidth;
    let txtaheight = KrayonpseudoTxtAra.offsetHeight;
    //http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    
    var txtapos = KrayonpseudoTxtAra.getBoundingClientRect();
    var topTxtarea = txtapos.top+document.documentElement.scrollTop;
    var leftTxtarea = txtapos.left+document.documentElement.scrollLeft;
    if(5>sizeBrush){sizeTxt=12;}else{sizeTxt=sizeBrush;}
    var newTxtarea = document.createElement("textarea");
    newTxtarea.id = "thisActive";
    newTxtarea.classList.add("Krayontxtarea");
    newTxtarea.placeholder = placeholderTXT;
    newTxtarea.style.cssText = 'width:'+txtawidth+'px !important;color:'+exa+';font-size:'+sizeTxt+'px;height:'+txtaheight+'px !important;top:'+topTxtarea+'px;left:'+leftTxtarea+'px;';
    KrayonpseudoTxtAra.parentNode.replaceChild(newTxtarea,KrayonpseudoTxtAra);
    newTxtarea.focus();
    Krayonconsole.classList.remove("crosshairstyle");
    initTextarea();

  }

  //Function calling herself each click /via createTxtArea
  function initTextarea(){
    initSoftTxt();

    var KrayonfontArial = document.getElementById("KrayonArial");
    var KrayonfontTimes = document.getElementById("KrayonTimes");

    KrayonfontArial.addEventListener("click", initArial, true);
    KrayonfontTimes.addEventListener("click", initTimes, true);

    if(createtextarea === true){
      Krayonconsole.addEventListener("mousedown", setTxtArea, true);
    }

    if(realCalculation === true){
      createtextarea = false;
      Krayonconsole.addEventListener("mousemove", createTxtArea, true);
      Krayonconsole.addEventListener("mouseup", finishTxtArea, true);
    }

  }

  //Remove temporary canvas
  function initSoftTxt(){
    if(document.getElementById("fwKrayonwindowTemp")){
      var canvasTp = document.getElementById("fwKrayonwindowTemp");
      canvasTp.parentNode.removeChild(canvasTp);
    }
  }

  function clearAll(wCV,hCV){

    Krayoncanvas.removeEventListener("mousedown", on_mousedown, true);
    Krayoncanvas.removeEventListener("mousemove", on_mousemove, true);
    Krayoncanvas.removeEventListener("mouseup", on_mouseup, true);

    var canvasTmp = document.getElementById("fwKrayonwindowTemp");
    var container = Krayoncanvas.parentNode;
    if(canvasTmp){canvasTmp.parentNode.removeChild(canvasTmp);}
    Krayoncanvas.parentNode.removeChild(Krayoncanvas);

    var neoCanvas = document.createElement("canvas");
    neoCanvas.id = "fwKrayonwindow";
    neoCanvas.style.width = wCV+"px";
    neoCanvas.style.height = hCV+"px";
    Krayoncanvas = container.insertBefore(neoCanvas, Krayonbrush);

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

      var txtAreasBTDom = document.querySelectorAll(".fwKrayoncanvas .p5 span");
      for(var aTxtArea of txtAreasBTDom){
        if(aTxtArea.classList.contains("active")) waswriting++;
      }

      var formBTDom = document.querySelectorAll(".drawsquare, .drawcircle, .drawtrait, .drawsquarempty");
      for(var aBTDom of formBTDom){
        if(aBTDom.classList.contains("active")) wasForming++;
      }

      if(wasForming>0){
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
    var crop = document.getElementById("KrayonsurfaceScreen");
    crop.parentNode.removeChild(crop);
    KrayonscreenZone.classList.remove("active");
    currentCalcul = false;
    backToPreviousActive();
  }


  //* Launch everything!! *//
  self.port.on("init", function(params){
    if(document.doctype !== null){
      if(document.doctype.ownerDocument.contentType == "text/html"){
        defineBehavior(params);
      }else{
        alert(params[2].mod_warning_id);
      }
    }else{
      alert(params[2].mod_warning_id);
    }
    
  });


})();