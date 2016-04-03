var http = require('http');
var psandis = require('./psandis');
var fs = require('fs');

var PORT = 7726;

http.createServer(function(req, res) {
	var spl = req.url.substring(1).split("/");
	if(spl[0] == "image") {
		psandis.getCardImagePath(spl[1], function(path) {
			fs.readFile(path, function(err, data) {
				if(err) {
					res.writeHead(500, {"Content-type": "text/plain"});
					res.write("Error loading file.");
				}
				else {
					res.writeHead(200, {"Content-type": "image/svg+xml"});
					res.write(data);
					res.end();
				}
			});
		});
	}
}).listen(PORT);
