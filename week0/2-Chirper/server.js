var http = require('http'),
    url = require('url'),
    rand = require('generate-key'),
    qs = require('querystring');
var chirps = [
    {
        "userId": 12,
        "chirpId": 48,
        "chirpText": "Terst Message.",
        "chirpTime": "10-10-2014 12:54"
    }
];

var users = [];

function getChirpByChirpId(chirpId) {
    var result;

    chirps.some(function (ch) {
        if (ch["chirpId"] == chirpId) {
            result = ch;
            return true;
        }
    });
    if (result) {
        console.log(result);
        return result;
    } else {
        return false;
    }
};

function createUser(username) {
    var dbUser;
    users.some(function (em) {
        if (em["username"] === username) {
            dbUser = em;
            return true;
        }
    });

    if (typeof dbUser === "undefined") {
        return {response: 409};
    } else {
        var id = rand.generateKey(25);
        var newUser = {
            id: id,
            username: username
        }
        users.push(newUser);
        return {id: id};
    }
}

http.createServer(function (req, res) {

    var method = req.method;
    var url_parts = url.parse(req.url, true);
    var getParams = url_parts.query;
    var pathName = url_parts.pathname;
    console.log(getParams);
    console.log(pathName);

    req.on('data', function () {


    });
    var body = "";

    req.on("data", function (data) {

        body += data;

    });
    if (res.method === "POST" ) {

        var body = "";

        req.on("data", function (data) {

            body += data;
            console.log(data);

        });

            var variables = qs.parse(body);
        console.log(variables);


    }

    req.on('end', function () {

        console.log(pathName);
//
//
//        res.writeHead(200, "OK", {'Content-Type': 'text/html'});
//        if (pathName === "/chirps") {
//            if (getParams["chirpId"]) {
//                res.write("Chirp id: ");
//                res.write(getParams["chirpId"]);
//                var result = getChirpByChirpId(getParams["chirpId"]);
//                if (result) {
//                    res.write(JSON.stringify(result));
//                }
//                else {
//                    res.write("Invalid id.");
//                }
//            }
//        }
        res.end();
    });
}).listen(8888);