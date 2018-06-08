const redis = require('redis');
const config = require('../../config/config');
const redisActive = config.Redis.Active;

if (redisActive) {
    // use custom redis url or localhost
    var client = redis.createClient(config.Redis.Port || 6379, config.Redis.Host || 'localhost');
    client.on('error', function (err) {
        console.error('Redis连接错误：' + err);
        process.exit(1);
    });
}

/**
 * 设置缓存
 * @param key：缓存key
 * @param value：缓存value
 * @param expired：缓存的有效时常，单位秒
 * @param callback：回调函数
 * @returns {*}
 */
exports.setItem = function (key, value, expired, callback) {
    if (!redisActive) {
        return callback(null);
    }
    client.set(key, JSON.stringify(value), function (err) {
        if (err) {
            return callback(err);
        }
        if (expired) {
            client.expire(key, expired);
        }
        return callback(null);
    });
};

/**
 * 获取缓存
 * @param key：缓存key
 * @param callback：回调函数
 * @returns {*}
 */
exports.getItem = function (key, callback) {
    if (!redisActive) {
        return callback(null, null);
    }
    client.get(key, function (err, reply) {
        if (err) {
            return callback(err);
        }
        return callback(null, JSON.parse(reply));
    });
};

/**
 * 移除缓存
 * @param key：缓存key
 * @param callback：回调函数
 * @returns {*}
 */
exports.removeItem = function (key, callback) {
    if (!redisActive) {
        return callback(null);
    }
    client.del(key, function (err) {
        if (err) {
            return callback(err);
        }
        return callback(null);
    });
};

/**
 * 获取默认过期时间，单位秒
 * @type {number}
 */
exports.defaultExpired = parseInt(require('../../config/props/settings').CacheExpired);