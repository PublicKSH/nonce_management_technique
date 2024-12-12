const _ = require("lodash");

const snakeKeys = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(v => snakeKeys(v));
    } else if (obj != null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => {
                return {
                    ...result,
                    [_.snakeCase(key)]: snakeKeys(obj[key]),
                }
            },
            {},
        );
    }
    return obj;
};

const existNull = (object, checks) => {
    for (const check of checks) {
        if (_.isNull(object[check])) {
            return check;
        }
    }

    return false;
}

module.exports = {
    snakeKeys,
    existNull
}
