const cache = {
  mintData: null,
  gasPrice: null,
  gas: null,
  getMintData: function () {
    return this.mintData;
  },
  setMintData: function (data) {
    this.mintData = data;
  },
  getGasPrice: function () {
    return this.gasPrice;
  },
  setGasPrice: function (gasPrice) {
    this.gasPrice = gasPrice;
  },
  getGas: function () {
    return this.gas;
  },
  setGas: function (gas) {
    this.gas = gas;
  },
};

module.exports = { cache };
