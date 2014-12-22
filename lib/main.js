/* jshint moz: true */

(function(){

var _ = require("sdk/l10n").get;
var self = require("sdk/self").data;
var tabs = require("sdk/tabs");
var currentTab = require("sdk/tabs");
var opt = require('sdk/simple-prefs');
var base64 = require("./base64");
var Request = require("sdk/request").Request;

const {Cc, Ci, Cu} = require("chrome");
const {TextEncoder, TextDecoder, OS} = Cu.import('resource://gre/modules/osfile.jsm');
const {FileUtils} = Cu.import('resource://gre/modules/FileUtils.jsm');
//const {pathFor} = require('sdk/system');
//const path = require('sdk/fs/path');
//const file = require('sdk/io/file');

var active = false;

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
  "mod_ttl_emptySquare_id" : _("mod_ttl_emptySquare_id"),
  "placeholder" : _("placeholder")
};

require("sdk/ui/button/action").ActionButton({
  id: "style-tab",
  label: _("label_id"),
  icon: {
    "16": "./i/icon-16.png",
    "32": "./i/icon-32.png",
    "64": "./i/icon-64.png"
  },
  onClick: handleClick
});

function ValidURL(str) {
  var pattern = /^(https?:\/\/){1}((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
  return pattern.test(str);
}

function dataURItoBlob(dataURI) {
    var binary = base64.atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++){
        array.push(binary.charCodeAt(i));
    }
    return Uint8Array(array);
}

function convertToSlug(tabTitle){
  return tabTitle.toLowerCase().replace(/Mozilla Firefox/i,"").replace(/[^\w ]+/g,'').replace(/ +/g,'-');
}

function handleClick(){

  active = (active) ? 0 : 1;

  /* prepare file for call inside page */
  params[0] = self.url("consoleControl.css");
  params[1] = active;
  params[2] = trads;
  if(opt.prefs.alignement === "B"){
    params[3] = self.url("bottom.css");
  }else{
    params[3] = self.url("top.css");
  }

  includeJS = currentTab.activeTab.attach({
    contentScriptFile: self.url("draw.js")
  });

  includeJS.port.emit("init", params);

  includeJS.port.on('takeascreen', function(feedb){
    var windows = require("sdk/windows").browserWindows;
    var windon = require('sdk/window/utils').getMostRecentBrowserWindow();
    var tab = require('sdk/tabs/utils').getActiveTab(windon);
    var tabTitleForFN = convertToSlug(windows.activeWindow.title);
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

    //canvas height is made equal to the scroll height of window
    ctx.drawWindow(fenetre, leftOrigin, topOrigin, snippetWidth, snippetHeight+hauteurFen, "rgb(255,255,255)");

    var imageDataUri = thumbnail.toDataURL('image/png');
    var blobCanvas = dataURItoBlob(imageDataUri);

    var today = new Date();
    var milliscds = today.getMilliseconds();
    var day = today.getDay();
    var month = today.getMonth();
    var year = today.getFullYear();
    var fileName = tabTitleForFN+day+"-"+month+"-"+year+"-"+milliscds+".png";

    //file creation local
    if(opt.prefs['stockageLocal']){
      //require('chrome').Cu.import('resource://gre/modules/FileUtils.jsm');
      //Cu.import("resource://gre/modules/FileUtils.jsm");
      var pathFile = FileUtils.getDir("Desk",["Krayon"],true);
      var writePath = OS.Path.join(pathFile.target, fileName);
      if(opt.prefs['localDirectory'] !== undefined){
        writePath = OS.Path.join(opt.prefs['localDirectory'], fileName);
      }
      var promise = OS.File.writeAtomic(writePath, blobCanvas, {tmpPath:writePath + '.tmp'});
      promise.then(
        function(){
            includeJS.port.emit("displayABBDconsole", 1);
          tabs.open(writePath);
        },
        function(){
          console.log('failure writing file');
        }
      );
    }

    //Send file to an URL
    if(opt.prefs['stockageremote']){
      var pic64 = encodeURIComponent(imageDataUri.replace("data:image/png;base64,",""));
      var remoteAdressURL = opt.prefs['remoteDirectory'];
      if(ValidURL(remoteAdressURL)){
        var nameP = opt.prefs['paramName'];
        var picP = opt.prefs['paramPic'];
        if(!nameP.length){nameP="namePicFromKrayon";}
        if(!picP.length){nameP="pic64FromKrayon";}
        var uploadFile = Request({
          url: remoteAdressURL,
          content: nameP+"="+fileName+"&"+picP+"="+pic64,
          onComplete: function(response){
            var callback = response.text;
            if(callback.length>0){
              //If a valid URL is returned, plugin display new tab with this one, or display the url with name associated
              if(ValidURL(callback)){
                tabs.open(callback);
              }else{
                var regex = new RegExp('/[^/]*$');
                var rootUrl = remoteAdressURL.replace(regex, '/');
                tabs.open(rootUrl+fileName);
              }
            }else{//If no answer from remote server, display basic pic 64 encoded
              tabs.open(imageDataUri);
            }
          }
        });
        uploadFile.post();
      }else{
        tabs.open(imageDataUri);
      }
    }


})



}

})();