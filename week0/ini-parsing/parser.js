"use strict";
var endOfLine = require('os').EOL;
var http = require('https');
var fs = require('fs');
function parseType(string) {
    string = string.toLocaleLowerCase();
    var arr = string.split(".");
    if (arr[arr.length - 1] === "ini") {
        return "ini";
    } else if (arr[arr.length - 1] === "json") {
        return "json";
    } else {
        return false;
    }
}

function parseIni(link, name) {
    var result = {};
        http.get(link, function (res) {
            res.on('data', function (data) {
            data = data.toString();

            var rows = data.split(endOfLine);
            var lastObj = "";
            rows.forEach(function (row) {
               var word = row.trim().replace(" ", "");
                console.log(word);
                if (word.indexOf("[") === 0 && word.indexOf("]") === word.length - 1) {
                    word = word.slice(1, word.length - 1);
                    result[word] = {};
                    lastObj = word;
                } else if (word.indexOf("=") > -1) {
                    var vals = word.split("=");
                    result[lastObj][vals[0]] = vals[1];
                }
            });
            fs.writeFile(name+".json", JSON.stringify(result), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                }
            });
        });
    });

}

function parseJson(link, name) {
    var result = "";
    http.get(link, function (res) {
        res.on('data', function (data) {
            data = JSON.parse(data.toString());
            Object.keys(data).forEach(function (key) {
                result += endOfLine + "[" + key + "]" + endOfLine;
                Object.keys(data[key]).forEach(function (k) {
                    result += k + "=" + data[key][k] + endOfLine;
                });
            });
            fs.writeFile(name+".ini", result, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                }
            });

        });
    });
}

var args = [];
process.argv.forEach(function (val) {
    args.push(val);
});

args.shift();
args.shift();

args.forEach(function (val) {
    var type = parseType(val);
    var arr = val.split("/");
    var name = arr[arr.length - 1].split(".")[0];
    if (type === "ini") {
        parseIni(val, name);
    } else if (type === "json") {
        parseJson(val, name);
    }
});
