"use strict"

var request = require("request");
var rp = require("request-promise")
var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://postgres:root@localhost:5432/coinheat')
var _ = require('underscore')
var coin = require('../objects/coin')
var fs = require('fs')

module.exports = {
  getMainData: function() {
    getRequest('https://api.coinmarketcap.com/v1/ticker/?limit=100')
        .then(
          function(data){
            return iterateObjects(data);
          })
        .then((coin) => {
            console.log(coin.length + " coins have been added!")
        })
        .then(fulfilled => console.log("Finished without Errors!"))
        .catch(error => console.log(error.message));
  },

  getCoinImages: function(){
    checkForCoinsWithoutImg();
  },

  deleteCoins: function(){
    reSync();
  }
};

var getRequest = function(url){
  return new Promise(function (resolve, reject) {
        request.get(url, function (err, res, body) {
            if (err) {
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code: " + res.statusCode);
                err.res = res;
                return reject(err);
            }
            var data = JSON.parse(body)
            resolve(data);
        });
    });
};

function iterateObjects(data){
  return _.each(data, function(e, k){
    writeNewToDB(e)
  })
};

const writeNewToDB = function(coin){
  return db.none("INSERT INTO coins(id, name, symbol, rank, img_url) SELECT $1, $2, $3, $4, $5 WHERE NOT EXISTS(SELECT 1 FROM coins WHERE id = $1)", [coin.id, coin.name, coin.symbol, coin.rank, "https://files.coinmarketcap.com/static/img/coins/32x32/".concat(coin.id, ".png")])
};

function reSync(){
  db.none("DELETE FROM coins")
  .then(() => {
    console.log("DB Dropped!")
  })
  .catch(error => {
    console.log("Error when writing too DB!")
    console.log(error)
  });
}

function checkForCoinsWithoutImg(){
  db.any("select * from coins where has_img=false LIMIT 100")
    .then(function(data){
      console.log("Selected: ".concat(data.length))
      downloadImages(data, data.length)
    })
    .catch(function(error){
      console.log(error)
    })
};

fs.writeFileAsync = function(fname, data, options) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fname, data, options, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function downloadImages(data) {
    let promises = data.map(obj => {
        let local = "public/images/".concat(obj.id, ".png");
        let url = obj.img_url;
        let id = obj.id;
        return rp.get({url, local, id, encoding: 'binary'}).then(imgData => {
            return fs.writeFileAsync(local, imgData, {encoding: 'binary'}).then(updateImgTag(id)).catch(err => {
                console.log("Error Downloading image");
                // propagate error after logging it
                throw err;
            });
        });
    });
    return Promise.all(promises).then((results) => {
        console.log("All done");
      })
      .catch((e) => {
          console.log(e)
      });
}

function updateImgTag(id){
  db.any("UPDATE coins SET has_img = true WHERE id=$1", id)
    .then(data => {
      console.log(id.concat(" has been updated!"))
    })
    .catch(function(error){
      console.log(error)
    })
}
