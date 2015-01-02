const { atob, btoa } = require("chrome").Cu.import("resource://gre/modules/Services.jsm", {});

exports.dataURItoBlob = function(dataURI){
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0, len = binary.length; i < len; i++){
        array.push(binary.charCodeAt(i));
    }
    return Uint8Array(array);
}