import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT);

export const pubSub = new RedisPubSub({
  publisher: new Redis({ host: redisHost, port: redisPort }),
  subscriber: new Redis({ host: redisHost, port: redisPort }),
});
