const redisClient = require("../config/database/redis");

const redisSet = async (key, value, expiresTime = null) => {
  try {
    await redisClient.set(key, value);
    if (expiresTime) {
      await redisClient.expire(key, expiresTime);
    }

    return value;
  } catch (error) {
    return false;
  }
};

const redisIncr = async (key) => {
  try {
    const result = await redisClient.incr(key);
    return result;
  } catch (e) {
    console.log(e);
    throw new Error("redisIncr error");
  }
};

module.exports = {
  redisSet,
  redisIncr,
};
