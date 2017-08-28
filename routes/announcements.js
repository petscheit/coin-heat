var express = require('express');
var annRouter = express.Router();
var app = express();
var ann = require('../objects/announcement')

/* GET home page. */
annRouter.get("/", ann.getAllCoins);
// A POST to the root of a resource should create a new object
annRouter.post("/", ann.createCoin);
// We specify a param in our path for the GET of a specific object
annRouter.get('/:id', ann.getCoin);
// Similar to the GET on an object, to update it we can PATCH
// annRouter.patch('/:id', function(req, res) { });
// // Delete a specific object
// annRouter.delete('/:id', function(req, res) { });
// Attach the routers for their respective paths


module.exports = annRouter;
