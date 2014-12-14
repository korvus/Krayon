//addon https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/SDK
//sdk https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started
//wget : http://users.ugent.be/~bpuype/wget/
//script : http://stackoverflow.com/questions/10519440/how-to-modify-source-code-without-re-running-cfx-and-firefox-when-debugging-an-s
//http://www.accessfirefox.org/Firefox_Addons_Options.php

// Set le niveau de loggin a max https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/preferences_service

require("sdk/preferences/service").set("extensions.sdk.console.logLevel", "info");

var _ = require("sdk/l10n").get;
var self = require("sdk/self").data;
var tabs = require("sdk/tabs");
var currentTab = require("sdk/tabs");
var opt = require('sdk/simple-prefs');


var status = 0;

var params = Array();
var trads = {
  "label_id" : _("label_id"),
  "size_id" : _("size_id"),
  "color_id" : _("color_id"),
  "mod_gomme_id" : _("mod_gomme_id"),
  "mod_write_id" : _("mod_write_id"),
  "mod_fullsquare_id" : _("mod_fullsquare_id"),
  "mod_circle_id" : _("mod_circle_id"),
  "mod_trait_id" : _("mod_trait_id"),
  "mod_emptysquare_id" : _("mod_emptysquare_id"),
  "mod_erraseall_id" : _("mod_erraseall_id"),
  "mod_sansserif_id" : _("mod_sansserif_id"),
  "mod_serif_id" : _("mod_serif_id"),
  "mod_entertext_id" : _("mod_entertext_id"),
  "mod_warning_id" : _("mod_warning_id"),
  "mod_screenshot" : _("mod_screenshot"),
  "mod_fullscreenshot" : _("mod_fullscreenshot"),
  "mod_ttl_gum_id" : _("mod_ttl_gum_id"),
  "mod_ttl_square_id" : _("mod_ttl_square_id"),
  "mod_ttl_circle_id" : _("mod_ttl_circle_id"),
  "mod_ttl_trait_id" : _("mod_ttl_trait_id"),
  "mod_ttl_emptySquare_id" : _("mod_ttl_emptySquare_id")

}


var button = require("sdk/ui/button/action").ActionButton({
  id: "style-tab",
  label: _("label_id"),
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state){

    status = (status) ? 0 : 1;

    /* prepare file for call inside page */
    params[0] = self.url("consoleControl.css");
    params[1] = status;
    params[2] = trads;
    if(opt.prefs['alignement'] === "B"){
      params[3] = self.url("bottom.css");
    }else{
      params[3] = self.url("top.css");
    }
    //var ste = '';

    //button.disabled = true;
    includeJS = currentTab.activeTab.attach({
      //contentScript: 'document.body.style.border = "5px solid red";'
      contentScriptFile: self.url("draw.js")
    });

    includeJS.port.emit("init", params);

/*
    includeJS.port.on('takeascreen', function(feedb){
      var uri = tabs.activeTab.url;
      tabs.open(uri);

      //includeJS.port.emit("finishScreen");
    });
*/

    includeJS.port.on('takeascreen', function(feedb){
      var windon = require('sdk/window/utils').getMostRecentBrowserWindow();
      var tab = require('sdk/tabs/utils').getActiveTab(windon);
      //var tab = tabs.activeTab;
      var thumbnail = windon.document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
      fenetre = tab.linkedBrowser.contentWindow;
      thumbnail.width = fenetre.screen.availWidth;
      thumbnail.height = fenetre.screen.availHeight;

      var ctx = thumbnail.getContext("2d");

      //If crop.
      if (typeof feedb.to != 'undefined'){
        var topOrigin = feedb.to;
        var leftOrigin = feedb.le;
        var snippetWidth = feedb.wi;
        var canvasWidth = feedb.wi;
        var snippetHeight = feedb.he;
        var hauteurFen = feedb.he;
        ctx.canvas.height = feedb.he;
      }else{
        var topOrigin = 0;
        var leftOrigin = 0;
        var snippetWidth = fenetre.outerWidth;
        var snippetHeight = fenetre.outerHeight;
        var canvasWidth = fenetre.innerWidth;
        var hauteurFen = feedb;
        ctx.canvas.height = feedb;
      }

      ctx.canvas.left  = 0;
      ctx.canvas.top = 0;
      ctx.canvas.width  = canvasWidth;

      console.log(snippetHeight+hauteurFen);
      //ctx.canvas.height = feedb;//canvas height is made equal to the scroll height of window
      ctx.drawWindow(fenetre, leftOrigin, topOrigin, snippetWidth, snippetHeight+hauteurFen, "rgb(255,255,255)");
      //ctx.drawWindow(fenetre, 0, 0, snippetWidth, snippetHeight+hauteurFen, "rgb(255,255,255)");

      var imageDataUri = thumbnail.toDataURL('image/png');
      //imageDataUri = imageDataUri.replace("image/png", "image/octet-stream");        
      tabs.open(imageDataUri);
      //includeJS.port.emit("finishScreen");
    })




}