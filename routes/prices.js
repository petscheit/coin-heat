var express = require('express');
var coinRouter = express.Router();
var app = express();
var price = require('../objects/price')

/* GET home page. */
// coinRouter.get("/", coin.getAllPrices);
// // A POST to the root of a resource should create a new object
// coinRouter.post("/", coin.createCoin);
// We specify a param in our path for the GET of a specific object
coinRouter.get('/:id', function(res, req, next){
  console.log("Reached route")
  return new Promise(function(resolve, reject){
    var data = price.getNewPrices(req, res, next);
    if(data){
      resolve(data)
    } else {
      reject(data)
    }
  })
  .catch(function(err){
    console.log(err)
  })
});
// Similar to the GET on an object, to update it we can PATCH
// coinRouter.patch('/:id', function(req, res) { });
// // Delete a specific object
// coinRouter.delete('/:id', function(req, res) { });
// Attach the routers for their respective paths




module.exports = coinRouter;
