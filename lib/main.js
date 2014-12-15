//addon https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/SDK
//sdk https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started
//wget : http://users.ugent.be/~bpuype/wget/
//script : http://stackoverflow.com/questions/10519440/how-to-modify-source-code-without-re-running-cfx-and-firefox-when-debugging-an-s
//http://www.accessfirefox.org/Firefox_Addons_Options.php

// Set le niveau de loggin a max https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/preferences_service
//http://stackoverflow.com/questions/26314232/how-to-open-file-in-mozilla-add-on-sdk-using-system-default-application

require("sdk/preferences/service").set("extensions.sdk.console.logLevel", "info");

var _ = require("sdk/l10n").get;
var self = require("sdk/self").data;
var tabs = require("sdk/tabs");
var currentTab = require("sdk/tabs");
var opt = require('sdk/simple-prefs');
var system = require("sdk/system");

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



console.log("profile directory = " + system.pathFor("Desk"));
//console.log("profile directory = " + system.pathFor("Home"));


data = "data:image/png;base64,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";

var homeDir = require('sdk/system').pathFor('Home');
require('chrome').Cu.import('resource://gre/modules/FileUtils.jsm');
new FileUtils.getDir("Home", ["crayonFiles"], true);
var file = new FileUtils.File("/iso.png");



//console.log(file);
//var ostream = FileUtils.openSafeFileOutputStream(file);

//var converter = require('chrome').Cu.classes["@mozilla.org/intl/scriptableunicodeconverter"].
//createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
//converter.charset = "UTF-8";
//var istream = converter.convertToInputStream(data);

//NetUtil.asyncCopy(istream, ostream, function(status){
//  if (!Components.isSuccessCode(status)){
//    return;
//  }
//});

//new FileUtils.File(homeDir).launch();

/*  Components.Cu.import("resource://gre/modules/FileUtils.jsm");
  var file = new FileUtils.File("/home");
*/


}