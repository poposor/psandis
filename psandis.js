var YAML = require('yamljs');
var fs = require('fs');

var getCardImagePath = function(name, callback) {
	var filename = 'data/cards/'+name+'.svg';
	fs.stat(filename, function(err, stats) {
		if(err || !stats.isFile()) {
			filename = 'data/missing.svg';
		}
		callback(filename);
	});
};

var getCardData = function(name) {
	return YAML.load('data/cards/'+name+'.yaml');
};

module.exports = {
	getCardImagePath: getCardImagePath,
	getCardData: getCardData
};
