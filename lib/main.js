/* jshint moz: true */
/* global require */

//var nameloglvl = "extensions.jid1-1269JvYFBgj1Wg.sdk.console.logLevel";
//require("sdk/preferences/service").set(nameloglvl, "all");

(function(){

  /* local moduls */
  var url = require("./url");
  var save = require("./savepic");
  var DOM = require("./console");

  /* sdk moduls */
  var self = require("sdk/self").data;
  var currentTab = require("sdk/tabs");
  var opt = require('sdk/simple-prefs');
  var btAddon = require("sdk/ui/button/action");

  var active = false;
  var params = [];

  var iconBt = btAddon.ActionButton({
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

    var includeJS = currentTab.activeTab.attach({
      contentScriptFile: self.url("overlay.js")
    });

    includeJS.port.on('setIconFromContent', function(status){
      icOnOff(status);
    });

    includeJS.port.emit("init", params);

    includeJS.port.on('takeascreen', function(feedb){

      /* Get the current tab caracteristics */
      var windows = require("sdk/windows").browserWindows;
      var windon = require('sdk/window/utils').getMostRecentBrowserWindow();
      var tab = require('sdk/tabs/utils').getActiveTab(windon);

      var tabTitleForFN = url.convertToSlug(windows.activeWindow.title);
      var thumbnail = windon.document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
      var fenetre = tab.linkedBrowser.contentWindow;
      thumbnail.width = fenetre.screen.availWidth;
      thumbnail.height = fenetre.screen.availHeight;

      var ctx = thumbnail.getContext("2d");

      //If crop.
      var topOrigin = 0;
      var leftOrigin = 0;
      var snippetWidth = fenetre.outerWidth;
      var snippetHeight = fenetre.outerHeight;
      var canvasWidth = fenetre.innerWidth;
      var hauteurFen = feedb.heightTotal;
      var fullscreen = true;

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

        var imageDataUri = thumbnail.toDataURL('image/png');

        save.pic(opt, url, {imageDataUri, tabTitleForFN, includeJS});
      }else{
        includeJS.port.emit("displayKrayonConsole", 1);
      }

    });

  }

})();