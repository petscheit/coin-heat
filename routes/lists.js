var express = require('express');
var router = express.Router();
var coincap = require('../functions/coincap');
var coin = require('../objects/coin')
var price = require('../objects/price')



// router.get('/', function(req, res, next) {
//   res.render('list');
// });

// router.get('/all', function(req, res, next){
//   return new Promise(function(resolve, reject){
//     var data = coin.getAllCoins(req, res, next);
//     if(data){
//       resolve(data)
//     } else {
//       reject(data)
//     }
//   })
//   .then((data) => {
//     res.render('all', {data: data})
//   })
//
// })
//
// router.get('/test', function(req, res) {
//   res.send(coincap.getMainData());
// })
//
// router.get('/list', function(req, res) {
//   res.send(price.checkDiff("bitcoin"));
// })

router.get('/start', function(req, res) {
  res.send(price.coinCapAPI());
})

// router.get('/del', function(req, res) {
//   res.send(coincap.deleteCoins());
// })
//
// router.get('/delpri', function(req, res) {
//   res.send(coincap.delAllPrices());
// })
//
// router.get('/img', function(req, res) {
//   res.send(coincap.getCoinImages());
// })
//
// router.get('/meta', function(req, res) {
//   res.send(coincap.getMeta());
// })
//
// router.get('/fetchprice', function(req, res) {
//   res.send(price.fetchPrices("XZC", "btc"));
// })
//
// router.get('/price', function(req, res) {
//   res.render('coin/single', {name: "Francs"})
// })


module.exports = router;
