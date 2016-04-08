const fs = require('fs'),
	  SVGO = require('svgo');

svgo = new SVGO(/*{ custom config object }*/);

fs.readFile('svg/tools.svg', 'utf8', function(err, data) {

	if (err) {
		return console.log(err);
	}

	svgo.optimize(data, function(result) {

		fs.writeFile("../data/i/tools.svg", result, function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    console.log("File saved");
		}); 

    });

});