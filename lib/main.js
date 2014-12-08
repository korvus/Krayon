//addon https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/SDK
//sdk https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Getting_started
//Python : https://www.python.org/
//wget : http://users.ugent.be/~bpuype/wget/
//script : http://stackoverflow.com/questions/10519440/how-to-modify-source-code-without-re-running-cfx-and-firefox-when-debugging-an-s


// Set le niveau de loggin a max https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/preferences_service

require("sdk/preferences/service").set("extensions.sdk.console.logLevel", "info");

var self = require("sdk/self").data;
var tabs = require("sdk/tabs");
var currentTab = require("sdk/tabs");
var crawlBot = require("sdk/page-mod");
var status = 0;

var button = require("sdk/ui/button/action").ActionButton({
  id: "style-tab",
  label: "Draw Tab",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state){

    var params = Array();

    status = (status) ? 0 : 1;

    /* prepare file for call inside page */
    params[0] = self.url("consoleControl.css");
    params[1] = status;
    //var ste = '';

    //button.disabled = true;
    includeJS = currentTab.activeTab.attach({
      //contentScript: 'document.body.style.border = "5px solid red";'
      contentScriptFile: self.url("draw.js")
    });

    includeJS.port.emit("init", params);


}