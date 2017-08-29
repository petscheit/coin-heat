var express = require('express');
var router = express.Router();
var coincap = require('../functions/coincap');
var coin = require('../objects/coin')



router.get('/', function(req, res, next) {
  res.render('list');
});

router.get('/all', function(req, res, next){
  return new Promise(function(resolve, reject){
    var data = coin.getAllCoins(req, res, next);
    if(data){
      resolve(data)
    } else {
      reject(data)
    }
  })
  .then((data) => {
    res.render('all', {data: data})
  })
  
})

router.get('/test', function(req, res) {
  res.send(coincap.getMainData());
})

router.get('/del', function(req, res) {
  res.send(coincap.deleteCoins());
})

router.get('/img', function(req, res) {
  res.send(coincap.getCoinImages());
})

router.get('/meta', function(req, res) {
  res.send(coincap.getMeta());
})


module.exports = router;
