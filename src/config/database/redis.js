const redis = require('redis');
const config = require('../config');

let redisCluster = null;

if (process.env.NODE_ENV === 'test' || 'development') {
    redisCluster = redis.createClient({
        url: config.redis.url
    })

    redisCluster.isOpen = async () => {
        return redisCluster.isOpen;
    }
} else {
    redisCluster = redis.createCluster({
        rootNodes: [
            {
                url: config.redis.url
            }
        ]
    })

    redisCluster.isOpen = async () => {
        const masters = await redisCluster.getMasters();
        return (masters.length !== 0);
    }

}

module.exports = redisCluster
