const joi = require('joi');
const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['body', 'params', 'query']);
    const object = pick(req, Object.keys(validSchema));
    const {value, error} = joi.compile(validSchema)
        .prefs({errors: {label: 'key'}})
        .validate(object);
    
    if (error) {
        const errMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errMessage));
    }
    Object.assign(req,value);
    return next();
};

module.exports = validate;
