var http = require('http');
var psandis = require('./psandis');
var fs = require('fs');
var nodestatic = require('node-static');

var PORT = 7726;

var files = new nodestatic.Server("static");

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
		res.writeHead(200, {"Content-type": "text/html"});
		res.write("<html><head>");
		res.write('<link rel="stylesheet" href="/main.css"></style>');
		res.write("</head><body>");
		res.write(psandis.getCardHTML(spl[1]));
		res.write("</body></html>");
		res.end();
	}
	else {
		files.serve(req, res);
	}
}).listen(PORT);
