import Redis from 'ioredis'

const redisInstance = new Redis({
  port: 6379,
  host: process.env.REDIS_HOST
})

export const getRedisInstance = () => {
  return redisInstance
}