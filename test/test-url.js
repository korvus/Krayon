var mUrl = require("./url");

exports["test convertToSlug"] = function(assert){
	assert.ok(mUrl.convertToSlug("Mozilla Firefox title  test") == "title-test", "");
}

exports["test url http://www.example.com"] = function(assert){
	assert.ok(mUrl.ValidURL("http://www.example.com"), "Work with http://www.example.com");
}

exports["test url https://www.example.com"] = function(assert){
	assert.ok(mUrl.ValidURL("https://www.example.com"), "Work with https://www.example.com");
}

exports["test url http://example.com"] = function(assert){
	assert.ok(mUrl.ValidURL("http://example.com"), "Work with http://example.com");
}

exports["test url http://www.example.com/index.php"] = function(assert){
	assert.ok(mUrl.ValidURL("http://www.example.com/index.php"), "Work with http://www.example.com/index.php");
}

require("sdk/test").run(exports);