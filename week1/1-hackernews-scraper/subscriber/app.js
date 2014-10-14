var express = require ('express'),
    bodyParser = require('body-parser'),
    rand = require('generate-key'),
    storage = require('node-persist'),
    app = express(),
    data = {};
storage.initSync({
    continuous: true
});

storage.setItem('subscriptions', []);

//generate key
//rand.generateKey(100);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
* validate the input and
* store the new subscription and return email and id
*
* @param email
* @param keywords
* @returns {{email: *, subscriberId: *}}
*/
function subscribe(email, keywords){
    // validate the input
    if(!validateEmail(email)){
        return { "error": "Invalid Email!"};
    }


    if(!Array.isArray(keywords) || keywords.length < 1){
        return {"error" :"Invaid keywords!"};
    }

    var subscriptions = storage.getItem('subscriptions');
    var key = rand.generateKey(25);
    var newSub = {
        "id" : key,
        "email" : email,
        "keywords" : keywords
    };
    subscriptions.push(newSub);

    storage.setItem("subscriptions", subscriptions);

    console.log(storage.getItem('subscriptions'));

    return {
        "email": email,
        "subscriberId" : key
    }
};

function deleteSubscription( id){
    if(typeof id !== "string" || id.length !== 25){
        return {"error": "Invalid id."}
    };

    var index;
    var subscriptions = storage.getItem('subscriptions');
    subscriptions.some(function(elem, i){
        if(elem.hasOwnProperty("id") && elem["id"] === id){
            index = i;

            return true;
        }
    });

    if(typeof index === "undefined"){
        return {"error" : "Invalid id."};
    }

    subscriptions.splice(index,1);

    storage.setItem("subscriptions", subscriptions);

    return {"success" : "Subscription deleted."};

}


/**
* store new subscription
*/
app.post('/subscribe', function (req, res) {
    var email = req.body.email,
        keywords = req.body.keywords;
    console.log(email);
    console.log(keywords);
    console.log(req.body);
    var result = subscribe(email, keywords);
    console.log(result);
    res.json(
        result
    );
});

/**
* Delete existing subscription
*/

app.post('/unsubscribe', function(req, res){
    var id = req.body.id;

    var result = deleteSubscription(id);

    res.json(
        result
    );
});

app.post('/listSubscribers', function(req, res){
    res.json(
        storage.getItem('subscriptions')
    );
});



app.listen(8881);
