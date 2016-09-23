var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://admin:password@ds047612.mlab.com:47612/kokonatsu';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
