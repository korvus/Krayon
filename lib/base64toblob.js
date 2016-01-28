/* jshint moz: true */
/* jshint node: true */

const { atob } = require("chrome").Cu.import("resource://gre/modules/Services.jsm", {});

exports.dataURItoBlob = function(dataURI){
    let binary = atob(dataURI.split(',')[1]);
    let aInteger = [];
    let i = 0;
    let len = binary.length;
    for(i; i < len; i++){
        aInteger.push(binary.charCodeAt(i));
    }
    return new Uint8Array(aInteger);
};