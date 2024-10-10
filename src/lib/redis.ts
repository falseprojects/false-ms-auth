// lib/redis.ts
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err: Error) => {
  console.error('Redis Client Error', err);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
