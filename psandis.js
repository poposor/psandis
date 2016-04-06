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

var getTypeData = function(name) {
	try {
		return YAML.load('data/types/'+name+'.yaml');
	} catch(e) {
		return {};
	}
};

var getCardHTML = function(name, callback) {
	var data = getCardData(name);
	var tr = "";
	tr += '<div class="ps-card">';
	if("Health" in data) {
		var types = data.Type;
		if(typeof types != "object") {
			types = [types];
		}
		var interactions = {};
		tr += '<span class="ps-topright">';
		tr += '<span class="ps-health">'+data.Health+'</span>';
		for(var i = 0; i < types.length; i++) {
			tr += '<img src="/image/type/'+types[i]+'" class="ps-type ps-type-main" />';
			var td = getTypeData(types[i]);
			if("Interactions" in td) {
				var ci = td.Interactions;
				for(var t in ci) {
					if(!(t in interactions)) {
						interactions[t] = 1;
					}
					interactions[t] *= ci[t];
				}
			}
		}
		tr += '</span>';
		tr += '<div class="ps-card-footer">';
		var ri = {};
		for(var t in interactions) {
			var v = interactions[t];
			if(!(v in ri)) {
				ri[v] = [];
			}
			ri[v].push(t);
		}
		var mults = Object.keys(ri).sort(function(a,b) {return b-a});
		for(var i = 0; i < mults.length; i++) {
			var mult = mults[i];
			tr += '<span class="ps-interaction-box">'+mult+'x';
			var cit = ri[mult];
			for(var j = 0; j < cit.length; j++) {
				var t = cit[j];
				tr += '<img src="/image/type/'+t+'" class="ps-type ps-type-interation" />';
			}
			tr += '</span>';
		}
		tr += '</div>';
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
	getTypeData: getTypeData,
	getCardHTML: getCardHTML
};
