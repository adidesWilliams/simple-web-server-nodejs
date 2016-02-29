//required modules

var http = require('http'); 
var url = require('url');
var path = require('path');
var fs = require('fs')

//array of mimetypes
var mimeTypes = {

	"html" : "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};
//create server
http.createServer(function(req, res){
	var uri = url.parse(req.url).pathname;
	//process.cwd ->returns current working directory of the process, then pass in uri but make sure it's not escaped
	var fileName = path.join(process.cwd(),unescape(uri));
	
//message to let us know that uri is loading
	console.log('Loading' + uri);
var stats;

//look for file and confirm that file is actually there
//try catch block

try{
 stats = fs.lstatSync(fileName) 
} catch(e) {
	//if file not there give 404 error
	res.writeHead(404, {'Content-type': 'text/plain'})
	res.write('404 NOT FOUND\n')
	res.end();
	return;
}

//check if file or directory

if (stats.isFile()){

	//if it's a file, return 200, then get the file
	var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]; //return file extension
	res.writeHead(200,{'Content-type': mimeType}); //write out success and mimetype 

	var fileStream = fs.createReadStream(fileName);
	fileStream.pipe(res)

	//if it's a directory give 302 to redirect
} else if (stats.isDirectory()){
	res.writeHead(302, {
		'Location': 'index.html'
	});
	res.end();
} else {
	res.writeHead(500, {'Content-type': 'text/plain'});
	res.write('500 Internal Error\n');
	res.end();
}

}).listen(3000);