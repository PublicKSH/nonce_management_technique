const axios = require("axios");
const config = require("../config/config");

const exampleAppServerAddr = config.exampleAppServerAddr;

const exampleServer = {};

exampleServer.post = function (path, data, config) {
  return axios.post(encodeURI(exampleAppServerAddr + path), data, config);
};

exampleServer.get = function (path, config) {
  return axios.get(encodeURI(exampleAppServerAddr + path), config);
};

exampleServer.put = function (path, data, config) {
  return axios.put(encodeURI(exampleAppServerAddr + path), data, config);
};

exampleServer.delete = function (path, config) {
  return axios.delete(encodeURI(exampleAppServerAddr + path), config);
};

module.exports = exampleServer;
