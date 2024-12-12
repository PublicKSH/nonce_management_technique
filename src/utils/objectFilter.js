const filterUndefinedOrNull = (fields) => {
  return Object.entries(fields).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

module.exports = {
  filterUndefinedOrNull,
};
