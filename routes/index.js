var express = require('express');
var request = require('request');
var router = express.Router();
var session = require('express-session');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = process.env.KOKONATSUDB
var hostname = process.env.HOSTNAME;
var clientId = process.env.CLIENTID;
var clientSecret = process.env.CLIENTSECRET;

var sess = {
    secret: 'michael loves lolis',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}

router.use(session(sess));

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.token) {
        req.session.token = 123;
    }
    // res.render('landing', { title: 'Express' });
    res.redirect('/login');
});

router.get('/login', function(req, res, next) {
    if (!req.session.access_token) {
        res.redirect('https://discordapp.com/api/oauth2/authorize?response_type=code&redirect_uri=http://' + hostname + '/callback&scope=identify+guilds&client_id=' + clientId);
    } else {
        res.redirect('/index');
    }
});

router.get('/callback', function(req, res, next) {
    var return_code = req.query.code;

    request.post('https://discordapp.com/api/oauth2/token', {form: {
        code : return_code,
        client_id : clientId,
        client_secret : clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: 'http://' + hostname + '/callback'
    }}, function (err, response, body ){
        console.log(body);
        var jsonBody = JSON.parse(body);
        req.session.access_token = jsonBody.access_token;
        req.session.token_type = jsonBody.token_type;
        req.session.refresh_token = jsonBody.refresh_token;
        res.redirect('/index');
    });

});

router.get('/index', function(req, res, nest) {
    if(!req.session.access_token){
        res.redirect('/login');
    }
    else{
        res.render('index', { title: 'Express' });
    }
});

router.get('/macros', function(req, res, next) {
    if(!req.session.access_token){
        res.redirect('/login');
    }
    else{
        var options = {
            url: 'https://discordapp.com/api/users/@me/guilds',
            headers: {
            'Authorization' : req.session.token_type + " " + req.session.access_token
            }
        }

        request.get(options, function (err, response, body) {
            console.log(body);
            MongoClient.connect(dbUrl, function(err, db){
                if(err){
                    console.log(err);
                }
                db.collection('Macros', function(err, macros){
                    macros.find({guild: {$eq: '137974531175350272'}}).toArray(function(err, macroArray){
                        res.json(macroArray);
                    });
                });
            });
        });
    }




});

module.exports = router;
