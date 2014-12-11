//addon https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/SDK
//sdk https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started
//Python : https://www.python.org/
//wget : http://users.ugent.be/~bpuype/wget/
//script : http://stackoverflow.com/questions/10519440/how-to-modify-source-code-without-re-running-cfx-and-firefox-when-debugging-an-s
//http://www.accessfirefox.org/Firefox_Addons_Options.php

// Set le niveau de loggin a max https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/preferences_service

require("sdk/preferences/service").set("extensions.sdk.console.logLevel", "info");

var self = require("sdk/self").data;
var tabs = require("sdk/tabs");
var currentTab = require("sdk/tabs");
var crawlBot = require("sdk/page-mod");
var _ = require("sdk/l10n").get;
var status = 0;

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
      "mod_warning_id" : _("mod_warning_id")
    }

    status = (status) ? 0 : 1;

    /* prepare file for call inside page */
    params[0] = self.url("consoleControl.css");
    params[1] = status;
    params[2] = trads;

    //var ste = '';

    //button.disabled = true;
    includeJS = currentTab.activeTab.attach({
      //contentScript: 'document.body.style.border = "5px solid red";'
      contentScriptFile: self.url("draw.js")
    });

    includeJS.port.emit("init", params);


}