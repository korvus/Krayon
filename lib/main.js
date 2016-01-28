/* jshint moz: true */
/* jshint node: true */

//var nameloglvl = "extensions.jid1-1269JvYFBgj1Wg.sdk.console.logLevel";
//require("sdk/preferences/service").set(nameloglvl, "all");

exports.krayon = function(){

  /* local moduls */
  let url = require("./url");
  let save = require("./savepic");
  let DOM = require("./console");

  /* sdk moduls */
  let self = require("sdk/self").data;
  let currentTab = require("sdk/tabs");
  let opt = require('sdk/simple-prefs');
  let btAddon = require("sdk/ui/button/action");

  let active = false;
  let params = [];

  let iconBt = btAddon.ActionButton({
    id: "style-tab",
    label: DOM.translations.label_ID,
    icon: {
      "16": "./i/icon-default-16.png",
      "32": "./i/icon-default-32.png",
      "64": "./i/icon-default-64.png"
    },
    onClick: handleClick
  });

  function icOnOff(stat){
    if(stat === 1){
      iconBt.state("tab", {
        "icon" : {
          "16": "./i/icon-16.png",
          "32": "./i/icon-32.png",
          "64": "./i/icon-64.png"
        }
      });
    }else{
      iconBt.state("tab", {
        "icon" : {
          "16": "./i/icon-default-16.png",
          "32": "./i/icon-default-32.png",
          "64": "./i/icon-default-64.png"
        }
      });
    }
    active = (stat) ? 0 : 1;
  }

  function handleClick(){
    active = (active) ? 0 : 1;
    
    icOnOff(active);

    /* prepare params for console called inside webpage */
    params[0] = self.url("consoleControl.css");
    params[1] = active;
    params[2] = DOM.translations;
    params[4] = DOM.console;
    if(opt.prefs.alignement === "B"){
      params[3] = self.url("bottom.css");
    }else{
      params[3] = self.url("top.css");
    }

    let includeJS = currentTab.activeTab.attach({
      contentScriptFile: self.url("overlay.js")
    });

    includeJS.port.on('setIconFromContent', function(status){
      icOnOff(status);
    });

    includeJS.port.emit("init", params);

    includeJS.port.on('takeascreen', function(feedb){

      /* Get the current tab caracteristics */
      let windows = require("sdk/windows").browserWindows;
      let windon = require('sdk/window/utils').getMostRecentBrowserWindow();
      let tab = require('sdk/tabs/utils').getActiveTab(windon);

      let tabTitleForFN = url.convertToSlug(windows.activeWindow.title);
      let thumbnail = windon.document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
      let fenetre = tab.linkedBrowser.contentWindow;
      thumbnail.width = fenetre.screen.availWidth;
      thumbnail.height = fenetre.screen.availHeight;

      let ctx = thumbnail.getContext("2d");

      //If crop.
      let topOrigin = 0;
      let leftOrigin = 0;
      let snippetWidth = fenetre.outerWidth;
      let snippetHeight = fenetre.outerHeight;
      let canvasWidth = fenetre.innerWidth;
      let hauteurFen = feedb.heightTotal;
      let fullscreen = true;

      if (typeof feedb.to != 'undefined'){
        topOrigin = feedb.to;
        leftOrigin = feedb.le;
        snippetWidth = feedb.wi;
        canvasWidth = feedb.wi;
        snippetHeight = feedb.he;
        hauteurFen = feedb.he;
        fullscreen = false;
        ctx.canvas.height = feedb.he;
      }else{
        ctx.canvas.height = feedb.heightTotal;
      }

      ctx.canvas.left  = 0;
      ctx.canvas.top = 0;
      ctx.canvas.width  = canvasWidth;

      if(hauteurFen!== 0 && snippetWidth!== 0){
        //canvas height is made equal to the scroll height of window
        ctx.drawWindow(fenetre, leftOrigin, topOrigin, snippetWidth, snippetHeight+hauteurFen, "rgb(255,255,255)");

        let imageDataUri = thumbnail.toDataURL('image/png');

        save.pic(opt, url, {imageDataUri, tabTitleForFN, includeJS});
      }else{
        includeJS.port.emit("displayKrayonConsole", 1);
      }

    });

  }

};