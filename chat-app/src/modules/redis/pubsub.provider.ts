import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const pubSub = new RedisPubSub({
  publisher: new Redis({ host: 'localhost', port: 6379 }),
  subscriber: new Redis({ host: 'localhost', port: 6379 }),
});
