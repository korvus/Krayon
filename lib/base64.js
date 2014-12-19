const { atob, btoa } = require("chrome").Cu.import("resource://gre/modules/Services.jsm", {});
 
exports.atob = a => atob(a);
exports.btoa = b => btoa(b);