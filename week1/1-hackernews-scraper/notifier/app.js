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


function matchSubsribtions() {
    var subscribers = storage.getItem("subscribers");
    var subscriptions = storage.getItem("subscriptions");
    var articles = storage.getItem("articles");
    var keys = Object.keys(articles);

    // get all new articles
    var newArticles = [];

    keys.forEach(function(id){
       var article = articles[id];
       if(article["status"] === "new"){
           newArticles.push(article);
       }

        // get all activated subscriptions
       var activatedSubscriptions = [];
        subscribers.forEach(function(subscription){
            var dbEmail;
            var subscribers = storage.getItem("subscribers");
            subscribers.some(function(em){
                if(em["email"] === subscription.email){
                    dbEmail = em;
                    return true;
                }
            });
            if(dbEmail["confirmed"] === 1){
                activatedSubscriptions.push(subscription);
            }

            var matchedArticles = [];
            activatedSubscriptions.forEach(function(subscription){
                newArticles.forEach(function(arcticle){
                    var text;
                    if(arcticle.type == "story"){
                        text = article.title;
                    }else{
                        text = arcticle.text;
                    }
                    subscription["keywords"].some(function(word){
                        if(text.indexOf(word) > -1){
                            if(!matchedArticles.hasOwnProperty(subscription["id"])){
                                matchedArticles[subscription["id"]] = [];
                            }
                            matchedArticles[subscription["id"]].push(arcticle);
                            return true;
                        }
                    });
                });
            });

        });
    });
}

app.post('/newArticle', function (req, res) {
    //var id = req.body.id;


    res.json(
        result
    );
});