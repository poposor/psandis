var YAML = require('yamljs');
var fs = require('fs');

var getImagePath = function(filename, callback) {
	fs.stat(filename, function(err, stats) {
		if(err || !stats.isFile()) {
			filename = 'data/missing.svg';
		}
		callback(filename);
	});
};

var getCardImagePath = function(name, callback) {
	getImagePath('data/cards/'+name+'.svg', callback);
};

var getTypeImagePath = function(name, callback) {
	getImagePath('data/types/'+name+'.svg', callback);
};

var getCardData = function(name) {
	return YAML.load('data/cards/'+name+'.yaml');
};

var getCardHTML = function(name, callback) {
	var data = getCardData(name);
	var tr = "";
	tr += '<div class="ps-card">';
	if("Health" in data) {
		tr += '<span class="ps-topright">';
		tr += '<span class="ps-health">'+data.Health+'</span>';
		tr += '<img src="/image/type/'+data.Type+'" class="ps-type ps-type-main" />';
		tr += '</span>';
	}
	tr += '<span class="ps-name">'+data.Name+'</span><br />';
	tr += '<div class="ps-image-area">';
	tr += '<img src="/image/card/'+name+'" class="ps-image" />';
	tr += '</div>';
	if("Info" in data) {
		tr += '<span class="ps-info ps-card-info">'+data.Info+'</span><br />';
	}
	if("Moves" in data) {
		var moves = data.Moves;
		for(var i = 0; i < moves.length; i++) {
			var move = moves[i];
			tr += '<div class="ps-move">';
			tr += '<img class="ps-type ps-type-move" src="/image/type/'+move.Type+'" />';
			tr += '<span class="ps-move-name">'+move.Name+'</span>';
			if("Damage" in move) {
				tr += '<span class="ps-move-damage">'+move.Damage+'</span>';
			}
			tr += "<br />";
			if("Info" in move) {
				tr += '<span class="ps-info ps-move-info">'+move.Info+'</span>';
			}
			if("Recoil" in move) {
				tr += '<span class="ps-move-recoil">-'+move.Recoil+'</span>';
			}
			tr += '</div>';
		}
	}
	tr += '</div>';
	return tr;
};

module.exports = {
	getCardImagePath: getCardImagePath,
	getTypeImagePath: getTypeImagePath,
	getCardData: getCardData,
	getCardHTML: getCardHTML
};
