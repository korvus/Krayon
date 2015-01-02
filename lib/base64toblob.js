const { atob, btoa } = require("chrome").Cu.import("resource://gre/modules/Services.jsm", {});

exports.dataURItoBlob = function(dataURI){
    var binary = atob(dataURI.split(',')[1]);
    var aInteger = [];
    for(var i = 0, len = binary.length; i < len; i++){
        aInteger.push(binary.charCodeAt(i));
    }
    return Uint8Array(aInteger);
}