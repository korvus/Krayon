
var blob = require("./base64toblob");
var tabs = require("sdk/tabs");
var Request = require("sdk/request").Request;

//Using Chrome Authority
const {Cu} = require("chrome");
const {OS} = Cu.import('resource://gre/modules/osfile.jsm');

exports.pic = function(opt, url, data){

  var imageDataUri = data.imageDataUri;
  var tabTitleForFN = data.tabTitleForFN;
  var includeJS = data.includeJS;
  var blobCanvas = blob.dataURItoBlob(imageDataUri);

  var today = new Date();
  var milliscds = today.getMilliseconds();
  var day = today.getDay();
  var month = today.getMonth();
  var year = today.getFullYear();
  var fileName = tabTitleForFN+day+"-"+month+"-"+year+"-"+milliscds+".png";

  //Send file to a remote URL
  if(opt.prefs.stockageremote){
    var pic64 = encodeURIComponent(imageDataUri.replace("data:image/png;base64,",""));
    var remoteAdressURL = opt.prefs.remoteDirectory;
    if(url.ValidURL(remoteAdressURL)){
      var nameP = opt.prefs.paramName;
      var picP = opt.prefs.paramPic;
      if(!nameP.length){nameP="namePicFromKrayon";}
      if(!picP.length){nameP="pic64FromKrayon";}
      var uploadFile = Request({
        url: remoteAdressURL,
        content: nameP+"="+fileName+"&"+picP+"="+pic64,
        onComplete: function(response){
          var callback = response.text;
          //If a valid URL is returned by script, plugin display new tab with this one, or display the url with name associated
          if(callback.length>0){
            if(url.ValidURL(callback)){
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

  //file creation local
  if(opt.prefs.stockageLocal){
    var writePath = OS.Path.join(OS.Constants.Path.desktopDir, fileName);
    if(opt.prefs.localDirectory !== undefined){
      writePath = OS.Path.join(opt.prefs.localDirectory, fileName);
    }
    var promise = OS.File.writeAtomic(writePath, blobCanvas, {tmpPath:writePath + '.tmp'});
    promise.then(
      function success(){
        includeJS.port.emit("displayABBDconsole", 1);
        if(!opt.prefs.stockageremote){
          tabs.open(writePath);
        }
      },
      function failure(){
        console.log('failure writing file');
      }
    );
  }

}
