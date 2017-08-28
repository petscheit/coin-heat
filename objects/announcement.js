"use strict"

module.exports = {
  getAllAnn: function(req, res, next){
    console.log("reached!")
    db.any("SELECT * FROM announcement")
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

  getAnn: function(req, res, next){
    var id = req.params.id;
    db.one("SELECT * FROM coins WHERE coin_id=$1", id)
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

  createAnn: function(req, res, next) {
    req.body.age = parseInt(req.body.age);
    db.none('insert into coin(id, coin_id, url)' +
        "values(${coin_id}, ${url}",
      req.body)
    .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Added Announcement Page'
          });
      })
    .catch(function (err) {
      return next(err);
    });
  }
}


// id, name, symbol, rank, img_url
