import Redis from 'ioredis';
var redisInstance = new Redis({
    port: 6379,
    host: process.env.REDIS_HOST
});
redisInstance.on("connect", function () {
    console.log('Connected to redis!');
});
export var getRedisInstance = function () {
    return redisInstance;
};
