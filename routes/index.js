var express = require('express');
var http = require("http");
var https = require("https");
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://admin:password@ds047612.mlab.com:47612/kokonatsu';
var hostname = 'localhost'
var clientId = '224633471732023298';
var clientSecret = '1aW0lQKCPypqsjs18Pjr1KlM-I0OHTp8';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('landing', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.redirect('https://discordapp.com/api/oauth2/authorize?redirect_uri=http://' + hostname + '/callback&scope=identify+guilds&client_id=' + clientId);
});

router.get('/callback', function(req, res, next) {
    console.log(req.body)
    var code = req.body.code;
    var options = {
        hostname: 'discordapp.com',
        path: '/api/oauth2/token',
        headers: {Accept : "application/json"}, 
        method: 'POST'
    }
    
    var request = https.request(options, function (response) {
        if (!req.session.token) {
            req.session.token = response.access_token;
        }
        
        console.log(req.session.token);
        
        res.render('index', { title: 'Express' });
    });
});

router.get('/macros', function(req, res, next) {
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

module.exports = router;
