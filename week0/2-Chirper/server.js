var http = require('http')
var url = require('url');
var chirps = [
    {
        "userId": 12,
        "chirpId": 48,
        "chirpText": "Terst Message.",
        "chirpTime": "10-10-2014 12:54"
    }
];

function getChirpByChirpId(chirpId){
    var result;

    chirps.some(function(ch){
        if(ch["chirpId"] == chirpId){
            result = ch;
            return true;
        }
    });
    if(result){
        console.log(result);
        return result;
    } else {
        return false;
    }
};

http.createServer(function (req, res) {

    var method = req.method;
    var url_parts = url.parse(req.url, true);
    var getParams = url_parts.query;
    var pathName = url_parts.pathname;
console.log(getParams);
    console.log(pathName);

    req.on('data', function () {


    });

    req.on('end', function () {
        res.writeHead(200, "OK", {'Content-Type': 'text/html'});
        if(pathName === "/chirps"){
            if(getParams["chirpId"]){
                res.write("Chirp id: ");
                res.write(getParams["chirpId"]);
                var result  = getChirpByChirpId(getParams["chirpId"]);
                if(result){
                    res.write(JSON.stringify(result));
                }
                else{
                    res.write("Invalid id.");
                }
            }
        }
        res.end();
    });
}).listen(9932);