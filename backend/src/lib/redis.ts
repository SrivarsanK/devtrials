import { createClient } from 'redis';
import { config } from '../config';

const client = createClient({
  url: config.redis.url,
});

client.on('error', (err) => { /* silence is golden for logs right now */ });

export const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log('Connected to Redis');
  }
};

export const redis = client;
