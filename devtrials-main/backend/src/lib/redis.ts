import { createClient } from 'redis';
import { config } from '../config';

const client = createClient({
  url: config.redis.url,
});

client.on('error', (err) => console.log('Redis Client Error', err));

export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log('Connected to Redis');
  }
};

export const redis = client;
