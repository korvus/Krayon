/* jshint moz: true */

exports.convertToSlug = function(tabTitle){
  return tabTitle.toLowerCase().replace(/Mozilla Firefox ?/i,"").replace(/[^\w ]+/g,'').replace(/ +/g,'-');
};

exports.ValidURL = function(str) {
  var pattern = /^(https?:\/\/){1}((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
  return pattern.test(str);
};
