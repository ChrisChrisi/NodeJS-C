var http = require('https');
var express = require('express'),
    bodyParser = require('body-parser'),
    storage = require('node-persist'),
    app = express(),
    data = {};
storage.initSync({
    continuous: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if (!storage.getItem('articles')) {
    storage.setItem('articles', []);
}

function notifyTheNotifier(){
    var request = require('request');

    request.post(
        'localhost:8887',
        { form: { key: 'value' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    );
}

function setCommentStoryUrl(commentId,parentId){
    var articles = storage.getItem("articles");
    var url = "https://hacker-news.firebaseio.com/v0/item/" + parentId + ".json";
    http.get(url, function (res) {
        res.on('data', function (data) {
            var item = data.toString();
            item = JSON.parse(item);
            if(item.type !== "comment" && item.url){
                articles[commentId]["parentUrl"] = item.url;
                storage.setItem("articles", articles);
            }else{
                setCommentStoryUrl(commentId, item.parent);
            }
        });
    });
}

function getLatestItem() {

    // get the item;
    var itemId;
    http.get("https://hacker-news.firebaseio.com/v0/maxitem.json", function (res) {
        res.on('data', function (data) {
            itemId = data.toString();
            var articles = storage.getItem("articles");
            if (!articles.hasOwnProperty(itemId)) {
                var url = "https://hacker-news.firebaseio.com/v0/item/" + itemId + ".json";
                http.get(url, function (res) {
                    res.on('data', function (data) {
                        var item = data.toString();
                        item = JSON.parse(item);
                        if (item.type === "story" || item.type === "comment") {
                            if(item.type === "comment"){
                                setCommentStoryUrl(itemId, item.parent);
                            }

                            articles[itemId] = item;
                            articles["status"] = "new";
                            storage.setItem("articles", articles);
                            console.log("added");
                        }

                    })
                });
            }

        });
    });


}
getLatestItem();
setInterval(getLatestItem, 1200);