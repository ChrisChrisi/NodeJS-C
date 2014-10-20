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
/**
 * convert the read data to json and store it in the same folder
 *
 * @param data
 * @param name
 */
function convertDataToJson(data, name) {
    var result = {};
    data = data.toString();

    var rows = data.split(endOfLine);
    if (rows.length === 1) {
        rows = data.split("\n");
    }
    var lastObj = "";
    rows.forEach(function (row) {

        var word = row.trim().replace(" ", "");

        if (word.indexOf("[") === 0 && word.indexOf("]") === word.length - 1) {
            word = word.slice(1, word.length - 1);
            result[word] = {};
            lastObj = word;
        } else if (word.indexOf("=") > -1) {
            var vals = word.split("=");
            result[lastObj][vals[0]] = vals[1];
        }
    });
    fs.writeFile(name + ".json", JSON.stringify(result), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}
function convertDataToIni(data, name) {
    var result = "";
    data = JSON.parse(data.toString());
    Object.keys(data).forEach(function (key) {
        result += endOfLine + "[" + key + "]" + endOfLine;
        Object.keys(data[key]).forEach(function (k) {
            result += k + "=" + data[key][k] + endOfLine;
        });
    });
    fs.writeFile(name + ".ini", result, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
}
/**
 * read the input file and store convert it and store it as json
 *
 * @param link
 * @param name
 * @param ltype - file of https link
 */
function parseFile(link, name, extType, ltype) {

    if (ltype === "http") {
        http.get(link, function (res) {
            res.on('data', function (data) {
                if (extType === "ini") {
                    convertDataToJson(data, name);
                } else {
                    convertDataToIni(data, name);
                }
            });
        });
    } else {
        fs.readFile(link, "utf8", function (err, res) {
            if (extType === "ini") {
                convertDataToJson(res, name);
            } else {
                convertDataToIni(res, name);
            }
        });
    }
}

function parseJson(link, name, type) {
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
            fs.writeFile(name + ".ini", result, function (err) {
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
process.argv.forEach(function (val, index) {
    args.push(val);
});

args.shift();
args.shift();

args.forEach(function (val) {
    var ltype = "file";
    if (val.indexOf("https://") === 0) {
        ltype = "http"
    }
    var type = parseType(val);
    var arr = val.split("/");
    var name = arr[arr.length - 1].split(".")[0];
    if (type === "ini") {
        parseFile(val, name, "ini", ltype);
    } else if (type === "json") {
        parseFile(val, name, "json", ltype);
    } else if (val.indexOf("--type" > -1)) {
        var ltype = "file";
        if (val.indexOf("https://") === 0) {
            ltype = "http"
        }
        var vals = val.split("=");
        var ctype = vals[1];
        var newLink = args[index - 1];
        name = newLink;
        if (newLink.indexOf("/") > -1) {
            var linkSplit = newLink.split("/");
            name = newLink[newLink.length - 1]
        } else if (newLink.indexOf('\\') > -1) {
            var linkSplit = newLink.split("/");
            name = newLink[newLink.length - 1]
        }
        parseFile(newLink, name, ctype, ltype);
    }
});
