"use strict"

module.exports = class Coin {
  constructor(obj){
    this.id = obj.id;
    this.name = obj.name;
    this.symbol = obj.symbol;
    this.rank = parseInt(obj.rank);
    this.imageUrl = "https://files.coinmarketcap.com/static/img/coins/32x32/".concat(obj.name, ".png");
    this.hasImg = false
  }
}
