var http = require('http');
var psandis = require('./psandis');
var fs = require('fs');
var nodestatic = require('node-static');

var PORT = 7726;

var files = new nodestatic.Server("static");

var writeHeader = function(res) {
	res.writeHead(200, {"Content-type": "text/html"});
	res.write("<html><head>");
	res.write('<link rel="stylesheet" href="/main.css"></style>');
	res.write("</head><body>");
};

http.createServer(function(req, res) {
	var spl = req.url.substring(1).split("/");
	if(spl[0] == "image") {
		var svgCallback = function(path) {
			fs.readFile(path, function(err, data) {
				if(err) {
					res.writeHead(500, {"Content-type": "text/plain"});
					res.write("Error loading file.");
					res.end();
				}
				else {
					res.writeHead(200, {"Content-type": "image/svg+xml"});
					res.write(data);
					res.end();
				}
			});
		};
		if(spl[1] == "type") {
			psandis.getTypeImagePath(spl[2], svgCallback);
		}
		else {
			psandis.getCardImagePath(spl[2], svgCallback);
		}
	}
	else if(spl[0] == "card") {
		writeHeader(res);
		res.write(psandis.getCardHTML(spl[1]));
		res.write("</body></html>");
		res.end();
	}
	else if(spl[0] == "cards") {
		fs.readdir("data/cards", function(err, files) {
			var cards = [];
			for(var i = 0; i < files.length; i++) {
				var sp = files[i].split(".");
				if(sp.length == 2 && sp[1] == "yaml") {
					cards.push(sp[0]);
				}
			}
			var selected;
			if(spl[1] == "page") {
				selected = cards.slice(spl[2]*9, spl[2]*9+9);
			}
			else {
				selected = [];
				for(var i = 0; i < 9; i++) {
					selected.push(cards[Math.floor(Math.random()*cards.length)]);
				}
			}
			console.log(selected);
			writeHeader(res);
			res.write("<table border=1>");
			var WIDTH = 3;
			for(var y = 0; y < 2; y++) {
				res.write("<tr>");
				for(var x = 0; x < WIDTH; x++) {
					var i = y*WIDTH+x;
					res.write('<td class="ps-card-cell">');
					if(selected.length > i) {
						console.log(selected[i]);
						res.write(psandis.getCardHTML(selected[i]));
					}
					res.write("</td>");
				}
				res.write("</tr>");
			}
			res.write("</table></body></html>");
			res.end();
		});
	}
	else {
		files.serve(req, res);
	}
}).listen(PORT);
