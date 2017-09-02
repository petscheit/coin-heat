"use strict"

var schedule = require('node-schedule')
var stringSimilarity = require('string-similarity');
var request = require("request");
var rp = require("request-promise")
var _ = require('underscore')

//2419200000 <- 28 days in ms

module.exports = {
  coinCapAPI: function(){
    var options = {
      uri: "https://api.coinmarketcap.com/v1/ticker",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
      }
    }

    rp(options)
    .then(function(data){
      console.log("received data")
      return JSON.parse(data)
    })
    .then(res => {
      console.log('reached')
      var inserts = [];
      for(var i = 0; i < res.length; i++){
        console.log("Updated: " + res[i].id)
        var obj = {coin_id: res[i].id,
          rank: res[i].rank,
          price_usd: res[i].price_usd,
          price_btc: res[i].price_btc,
          volume_usd: res[i]['24h_volume_usd'],
          marketcap_usd: res[i].market_cap_usd,
          avail_supply: res[i].available_supply,
          total_supply: res[i].total_supply,
          percent_change_1h: res[i]['percent_change_1h'],
          percent_change_24h: res[i]['percent_change_24h'],
          percent_change_7d: res[i]['percent_change_7d'],
          last_updated: res.last_updated}
          inserts.push(obj)
        }
      return inserts;
    })
    .then(inserts => {
      var query = pgpp.helpers.insert(inserts, ['coin_id', 'rank', 'price_usd', 'price_btc', 'volume_usd', 'marketcap_usd', 'avail_supply', 'total_supply', 'percent_change_1h', 'percent_change_24h', 'percent_change_7d', 'last_updated'], 'coincap')
      db.none(query)
        .then(() => {
            console.log("All records added!")
        })
        .catch(error => {
            console.log(error)
        });
    })
    .catch(function(error){
      console.log(error)
    })
  }
  // ,

  // checkDiff: function(id){
  //   db.any("SELECT timestamp from price_point WHERE coin_id=$1 ORDER BY timestamp ASC", id)
  //   .then((data) => {
  //     var counter = 0;
  //     for(var i = 0; i < data.length - 1; i++){
  //       if((data[i + 1].timestamp - data[i].timestamp) > 960000 || (data[i + 1].timestamp - data[i].timestamp) < 840000){
  //         counter += 1
  //         // console.log(data[i].timestamp + " - " + data[i+1].timestamp)
  //         var diffmin = (data[i + 1].timestamp - data[i].timestamp) /1000 / 60
  //         if(diffmin > 15.1 || diffmin < 14.9){
  //           console.log("-------------" + diffmin)
  //         }
  //       }
  //     }
  //     console.log(counter)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
  // },
  //
  // getStartTimestamp: function(id, mode){
  //   var options = {
  //     uri: "https://graphs.coinmarketcap.com/currencies/" + id,
  //     headers: {
  //       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
  //     }
  //   }
  //
  //   rp(options)
  //   .then(function(data){
  //     console.log("received data")
  //     return JSON.parse(data)
  //   })
  //   .then(function(res){
  //     let inserts = []
  //     for(var i = 0; i < res.price_btc.length; i++){
  //       var supply = parseInt(res.market_cap_by_available_supply[i][1] / res.price_usd[i][1])
  //       var obj = {coin_id: id,
  //         timestamp: res.price_btc[i][0],
  //         market_cap: res.market_cap_by_available_supply[i][1],
  //         supply: supply,
  //         price_usd: res.price_usd[i][1],
  //         price_btc: res.price_btc[i][1],
  //         volume_usd: res.volume_usd[i][1]}
  //         inserts.push(obj)
  //       }
  //     return inserts;
  //   })
  //   .then((inserts) => {
  //     console.log(inserts.length)
  //     var query = pgpp.helpers.insert(inserts, ['coin_id', 'timestamp', 'market_cap', 'supply', 'price_usd', 'price_btc', 'volume_usd'], 'price_point')
  //     db.none(query)
  //       .then(() => {
  //           console.log("All records added!")
  //       })
  //       .catch(error => {
  //           console.log(error)
  //       });
  //   })
  //   .catch(function(error){
  //     console.log(error)
  //   })
  // },
  //
  // getNewPrices: function(res,req,next){
  //   var id = req.params.id
  //   console.log(id)
  //   db.any("SELECT * FROM price_point WHERE coin_id=$1 ORDER BY timestamp", id)
  //   .then(function (data) {
  //     res.status(200)
  //     .json({
  //       data: data
  //     });
  //   }).then(function(){
  //     // test();
  //   })
  //   .catch(function (err) {
  //     return next(err);
  //   });
  // },
  //
  // cryptoCompareCoinList: function(){
  //   getCCData();
  // }
  //

}
//
//
// function getCCData(){
//   // console.log(stringSimilarity.compareTwoStrings('ethereum', 'etherium'))
//   var options = {
//     uri: "https://www.cryptocompare.com/api/data/coinlist/" ,
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
//     }
//   }
//   rp(options)
//   .then(function(data){
//     console.log("received data")
//     return JSON.parse(data)
//   })
//   .then(function(res){
//     var obj = {};
//     var arr = [];
//     Object.keys(res.Data).forEach((key, index) => {
//       var id;
//
//       //Fixing the bad Data!
//       if (res.Data[key].CoinName.slice(-1) == ' ') {
//         id = res.Data[key].CoinName.slice(0, -1).replace(/ /g, "-").toLowerCase();
//       } else {
//         id = res.Data[key].CoinName.replace(/ /g, "-").toLowerCase()
//       }
//       arr.push({id: id,
//       cc_symbol: key,
//       algo: res.Data[key].Algorithm,
//       proof_type: res.Data[key].ProofType})
//
//       // obj[id] = {
//       //   id: id,
//       //   cc_symbol: key,
//       //   algo: res.Data[key].Algorithm,
//       //   proof_type: res.Data[key].ProofType
//       // }
//     });
//     return arr;
//   })
//   .then(arr => {
//     return db.any("SELECT id,symbol FROM coins")
//     .then(function(res){
//       var plus1=0
//       var minus1=0;
//       let inserts = [];
//       let insert = [];
//
//       var dataToAdd;
//
//       // for(var i = 0; i < arr.length; i++){
//       //   var found = false;
//       //   for(var ind = 0; ind < res.length; ind++){
//       //     if(){
//       //       if(arr[i].cc_symbol == res[ind].symbol){
//       //         stringSimilarity.compareTwoStrings(res[ind].id, arr[i].id) > 0.8
//       //       }
//       //       console.log(arr[i].id + ":" + arr[i].cc_symbol + " - " + res[ind].id + ":" + res[ind].symbol)
//       //       dataToAdd = {
//       //         id: res[ind].id,
//       //         cc_symbol: arr[i].cc_symbol,
//       //         algo: arr[i].algo,
//       //         proof_type: arr[i].proof_type
//       //       }
//       //       inserts.push(dataToAdd)
//       //       found = true
//       //       plus1 += 1
//       //       break;
//       //     } else if (arr[i].cc_symbol == res[ind].symbol){
//       //       dataToAdd = {
//       //         id: res[ind].id,
//       //         cc_symbol: arr[i].cc_symbol,
//       //         algo: arr[i].algo,
//       //         proof_type: arr[i].proof_type
//       //       }
//       //       inserts.push(dataToAdd)
//       //       break;
//       //       plus1 += 1
//       //     }
//       //   }
//         // if (!found){console.log(arr[i].id + " - " + arr[i].symbol)}
//       // }
//
//       console.log("Data1 found: " + plus1 + "----- NOt found1: " + minus1)
//       return inserts
//     })
//   })
//   .then(inserts => {
//     var update = pgpp.helpers.update(inserts, ['?id','cc_symbol', 'algo', 'proof_type'], 'coins') + ' WHERE v.id = t.id';
//     db.none(update)
//     .then(function(){
//       console.log("Entries have been updated with newest INFO")
//     })
//     .catch(err => {
//       console.log(err)
//     })
//   })
//   .then(inserts => {
//     console.log("Reached Last Step!!")
//   })
//   .catch(function(error){
//     console.log(error)
//   })
// }
//
//
//
//
// //     .then((inserts) => {
// //       console.log(inserts.length)
// //       var query = pgpp.helpers.insert(inserts, ['coin_id', 'timestamp', 'market_cap', 'supply', 'price_usd', 'price_btc', 'volume_usd'], 'price_point')
// //       db.none(query)
// //         .then(() => {
// //             console.log("All records added!")
// //         })
// //         .catch(error => {
// //             console.log(error)
// //         });
// //     })
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// function getCoinCapData(id, startTime, mode){
//   var stepDic = {quarter: 2419200000, daily: 31536000000}
//   var step = String(stepDic[mode] + parseInt(startTime))
//   var options = {
//     uri: "https://graphs.coinmarketcap.com/currencies/" + id + '/' + startTime + '/' + step ,
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
//     }
//   }
//   rp(options)
//   .then(function(data){
//     console.log("received data")
//     return JSON.parse(data)
//   })
//   .then(function(res){
//     let inserts = []
//     for(var i = 0; i < res.price_btc.length; i++){
//       var supply = parseInt(res.market_cap_by_available_supply[i][1] / res.price_usd[i][1])
//       var obj = {coin_id: id,
//         timestamp: res.price_btc[i][0],
//         market_cap: res.market_cap_by_available_supply[i][1],
//         supply: supply,
//         price_usd: res.price_usd[i][1],
//         price_btc: res.price_btc[i][1],
//         volume_usd: res.volume_usd[i][1]}
//         inserts.push(obj)
//       }
//     return inserts;
//   })
//   .then((inserts) => {
//     console.log(inserts.length)
//     var query = pgpp.helpers.insert(inserts, ['coin_id', 'timestamp', 'market_cap', 'supply', 'price_usd', 'price_btc', 'volume_usd'], 'price_point')
//     db.none(query)
//       .then(() => {
//           console.log("All records added!")
//       })
//       .catch(error => {
//           console.log(error)
//       });
//   })
//   .catch(function(error){
//     console.log(error)
//   })
//   .then(() => {
//     if(step < new Date().getTime() + stepDic[mode]){
//       return getCoinCapData(id, step);
//     } else {
//       console.log("All Data Fetched and Written to DB!")
//     }
//   })
// }

//id, timestamp, market_cap, supply, price_usd, price_btc, volume_usd

// function writeCoinCapDataToDB(obj, step){
//   //no empty and no duplicate entries
//   // if(obj.low != 0 && obj.high != 0 && obj.open != 0 && obj.close != 0){
//     //obj.time converted to ms
//     return db.any("INSERT INTO price_point(coin_id, timestamp, market_cap, supply, price_usd, price_btc, volume_usd) SELECT ${id}, ${timestamp}, ${market_cap}, ${supply}, ${price_usd}, ${price_btc}, ${volume_usd} WHERE NOT EXISTS(SELECT 1 FROM price_point WHERE coin_id = ${id} AND timestamp = ${timestamp})",
//     obj)
//     .then(() => {
//       if(step < new Date().getTime()){
//         return getCoinCapData(obj.id, step);
//       } else {
//         console.log("All Data Fetched and Written to DB!")
//       }
//     })
//     .catch(function(error){
//       console.log(error)
//     })
//   // }
// }
//
// ,

// fetchPrices: function(symbol, type){
//   console.log("REACHED!")
//   if(type == 'btc'){
//     var options = {
//       uri: "https://min-api.cryptocompare.com/data/histoday?fsym=" + symbol + "&tsym=BTC&limit=2000",
//       headers: {
//         'User-Agent': 'Request-Promise'
//       }
//     }
//   } else {
//     var options = {
//       uri: "https://min-api.cryptocompare.com/data/histohour?fsym=" + symbol + "&tsym=USD&limit=2000",
//       headers: {
//         'User-Agent': 'Request-Promise'
//       }
//     }
//   }
//
//   rp(options)
//   .then(function(data){
//     console.log("received data")
//     return JSON.parse(data)
//   })
//   .then(function(response){
//     console.log(response)
//     _.each(response.Data, function(e,k){
//       writePriceToDB(symbol, e, type)
//     })
//   })
//   .catch(function(error){
//     console.log(error)
//   })
// }

// function fixData(start, end, id){
//   var options = {
//     uri: "https://graphs.coinmarketcap.com/currencies/" + id + "/" + start + "/" + end,
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
//     }
//   }
//
//     rp(options)
//     .then(function(data){
//       console.log("received data")
//       return JSON.parse(data)
//     })
//     .then(function(res){
//       let inserts = []
//       for(var i = 0; i < res.price_btc.length; i++){
//         var supply = parseInt(res.market_cap_by_available_supply[i][1] / res.price_usd[i][1])
//         var obj = {coin_id: id,
//           timestamp: res.price_btc[i][0],
//           market_cap: res.market_cap_by_available_supply[i][1],
//           supply: supply,
//           price_usd: res.price_usd[i][1],
//           price_btc: res.price_btc[i][1],
//           volume_usd: res.volume_usd[i][1]}
//           inserts.push(obj)
//         }
//       return inserts;
//     })
//     .then((inserts) => {
//       console.log(inserts.length)
//       var query = pgpp.helpers.insert(inserts, ['coin_id', 'timestamp', 'market_cap', 'supply', 'price_usd', 'price_btc', 'volume_usd'], 'price_point')
//       db.none(query)
//         .then(() => {
//             console.log("All records added!")
//         })
//         .catch(error => {
//             console.log(error)
//         });
//     })
//     .catch(function(error){
//       console.log(error)
//     })
//     .then(() => {
//       console.log("Fixed!")
//     })
// }


//
//
// function writePriceToDB(symbol, obj, type){
//   //no empty and no duplicate entries
//   if(obj.low != 0 && obj.high != 0 && obj.open != 0 && obj.close != 0){
//     //obj.time converted to ms
//     db.any("INSERT INTO prices(symbol, time, close, high, low, open, volume, type) SELECT $1, $2, $3, $4, $5, $6, $7, $8 WHERE NOT EXISTS(SELECT 1 FROM prices WHERE symbol = $1 AND time = $2)",
//     [symbol, obj.time * 1000, obj.close, obj.high, obj.low, obj.open, obj.volumeto, type])
//     .then(console.log("Added!"))
//     .catch(function(error){
//       console.log(error)
//     })
//   }
// }
//
