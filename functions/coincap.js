"use strict"

var request = require("request");
var rp = require("request-promise")
var _ = require('underscore')
var cheerio = require('cheerio');
var fs = require('fs')

module.exports = {
  getMainData: function() {
    getRequest('https://api.coinmarketcap.com/v1/ticker/?limit=50')
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
  },

  getMeta: function(){
    checkForCoinsWithoutMeta()
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
  return db.any("INSERT INTO coins(id, name, symbol, rank, img_url) SELECT $1, $2, $3, $4, $5 WHERE NOT EXISTS(SELECT 1 FROM coins WHERE id = $1)", [coin.id, coin.name, coin.symbol, coin.rank, "https://files.coinmarketcap.com/static/img/coins/32x32/".concat(coin.id, ".png")])
};

function reSync(){
  db.task(t => {
    return t.none('DELETE FROM coins')
        .then(() => {
            return t.none("DELETE FROM announcement")
              .then(() => {
                return t.none("DELETE FROM website")
                .then(() => {
                  return t.none("DELETE FROM explorer")
                    .then(() => {
                      return t.none("DELETE FROM message_board")
                        .then(console.log("coins, ann, website & explorer tables dropped!!"))
                    })
                })
              })
        })
})


  db.task("DELETE FROM coins AND DELETE FROM announcement AND DELETE FROM website AND DELETE FROM explorer")
  .then(() => {
    console.log("DB Dropped!")
  })
  .catch(error => {
    console.log("Error when writing too DB!")
    console.log(error)
  });
}

function checkForCoinsWithoutImg(){
  db.any("SELECT * FROM coins WHERE has_img=false LIMIT 50")
    .then(function(data){
      console.log("Selected: ".concat(data.length))
      downloadImages(data, data.length)
    })
    .catch(function(error){
      console.log(error)
    })
};

function checkForCoinsWithoutMeta(){
  db.any("SELECT id FROM coins WHERE has_meta=false LIMIT 50")
    .then(function(data){
      console.log("Selected: ".concat(data.length))
      downloadMeta(data)
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

function downloadMeta(data){
  let promises = data.map(obj => {
    let id = obj.id

    let options = {
      uri: "https://coinmarketcap.com/currencies/".concat(id),
      transform: function (body) {
          return cheerio.load(body);
      }
    };
    return rp(options)
    .then(function ($) {
      var data = { announcement: $('.bottom-margin-2x .list-unstyled a:contains("Announcement")').attr("href"),
        explorer: $('.bottom-margin-2x .list-unstyled a:contains("Explorer")').attr("href"),
        website: $('.bottom-margin-2x .list-unstyled a:contains("Website")').attr("href"),
        message_board: $('.bottom-margin-2x .list-unstyled a:contains("Message Board")').attr("href"),
        id: id}
      return data
    })
    .then((data) => {
      writeAnn(data)
      return data
    })
    .then((data) => {
      writeWebsite(data)
      return data
    })
    .then((data) => {
      writeExplorer(data)
      return data
    })
    .then((data) => {
      writeMessageBoard(data)
    })
    .then((data) => {
      updateMetaTag(id)
    })
    .catch(function (err) {
      console.log(err)
    });

  })
  return Promise.all(promises).then((results) => {
      console.log("All done");
    })
    .catch((e) => {
        console.log("MetaData Download Error!!")
        console.log(e)
    })
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

function updateMetaTag(id){
  db.any("UPDATE coins SET has_meta = true WHERE id=$1", id)
    .then(data => {
      console.log(id.concat(" has been updated!"))
    })
    .catch(function(error){
      console.log(error)
    })
}

function writeAnn(data){
  if(data.announcement){
    db.none("INSERT INTO announcement(coin_id, url) SELECT $1, $2", [data.id, data.announcement])
    .then(
      // console.log("Ann added to DB!")
    )
    .catch(function (err) {
      console.log(err)
    });
  }
}

function writeMessageBoard(data){
  if(data.message_board){
    db.none("INSERT INTO message_board(coin_id, url) SELECT $1, $2", [data.id, data.message_board])
    .then(
      // console.log("Ann added to DB!")
    )
    .catch(function (err) {
      console.log(err)
    });
  }
}

function writeWebsite(data){
  if(data.website){
    db.none("INSERT INTO website(coin_id, url) SELECT $1, $2", [data.id, data.website])
    .then(
      // console.log("Web added to DB!")
    )
    .catch(function (err) {
      console.log(err)
    });
  }
}

function writeExplorer(data){
  if(data.explorer){
    db.none("INSERT INTO explorer(coin_id, url) SELECT $1, $2", [data.id, data.explorer])
    .then(
      // console.log("Explorer added to DB!")
    )
    .catch(function (err) {
      console.log(err)
    });
  }
}
