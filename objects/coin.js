"use strict"

module.exports = {
  getAllCoins: function(req, res, next){
    console.log("reached!")
    db.any("SELECT * FROM coins")
    .then(function (data) {
      res.status(200)
      .json({
        status: 'success',
        data: data
      });
    })
    .catch(function (err) {
      return next(err);
    });
  },

  getCoin: function(req, res, next){
    var id = req.params.id;
    db.one("SELECT * FROM coins WHERE id=$1", id)
    .then(function (data) {
      res.status(200)
      .json({
        status: 'success',
        data: data
      });
    })
    .catch(function (err) {
      return next(err);
    });
  },

  createCoin: function(req, res, next) {
    req.body.age = parseInt(req.body.age);
    db.none('insert into coin(id, name, symbol, rank, img_url)' +
        "values(${id}, ${name}, ${symbol}, ${rank}, 'https://files.coinmarketcap.com/static/img/coins/32x32/'.concat(${id}, '.png'))",
      req.body)
    .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserted one Coin'
          });
      })
    .catch(function (err) {
      return next(err);
    });
  }
}


// id, name, symbol, rank, img_url
