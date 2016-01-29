
var mUrl = require("../lib/url");

exports["test convertToSlug"] = function(assert){
	assert.ok(mUrl.convertToSlug("Mozilla Firefox title test") == "title-test", "Function convert slup is not working properly");
}

exports["test url http://www.example.com"] = function(assert){
	assert.ok(mUrl.ValidURL("http://www.example.com"), "Work with http://www.example.com");
}

exports["test url http://www.example.com/index.php"] = function(assert){
	assert.ok(mUrl.ValidURL("http://www.example.com/index.php"), "Work with http://www.example.com/index.php");
}

require("sdk/test").run(exports);