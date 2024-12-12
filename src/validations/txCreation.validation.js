const joi = require("joi");

const getExample = {
  query: joi.object().keys({}),
  params: joi.object().keys({}),
  body: joi.object().keys({}),
};

module.exports = {
  getExample,
};
