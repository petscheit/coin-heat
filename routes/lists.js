var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var coincap = require('../functions/coincap');




router.get('/', function(req, res, next) {
  res.render('list');
});

router.get('/test', function(req, res) {
  res.send(coincap.getMainData());
})

router.get('/del', function(req, res) {
  res.send(coincap.deleteCoins());
})

router.get('/img', function(req, res) {
  res.send(coincap.getCoinImages());
})


module.exports = router;
