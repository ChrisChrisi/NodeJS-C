var http = require('http');
var chirp = [];
http.createServer(function(req, res){
    var url = req.url;
    var method = req.method;

    req.on('data', function(){

    });

    req.on('end', function(){
        res.writeHead(200, "OK", {'Content-Type': 'text/html'});
        res.write("url: "+ url);
        res.end("method: " + method);
    });
}).listen(1222);