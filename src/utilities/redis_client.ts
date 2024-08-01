import Redis from 'ioredis'

const redisInstance = new Redis({
  port: 6379,
  host: process.env.REDIS_HOST,
})

redisInstance.on('connect', () => {
  console.log('Connected to redis!')
})

export const getRedisInstance = () => {
  return redisInstance
}
