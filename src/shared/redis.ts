import { SetOptions, createClient } from 'redis';
import config from '../config';

const redisClient = createClient({
  url: config.redis.url,
});

const redisPubClient = createClient({
  url: config.redis.url,
});

const redisSubClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', error => console.log('RedisError', error));
redisClient.on('connect', error =>
  console.log(' 🔋 Redis Connected', error ? error : '')
);

const connect = async (): Promise<void> => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

// set to redis
const set = async (
  key: string,
  value: string,
  options?: SetOptions
): Promise<void> => {
  await redisClient.set(key, value, options);
};

// get from redis
const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

// delete from redis
const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

// set to accessToken
const setAccessToken = async (userId: string, token: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClient.set(key, token, { EX: Number(config.redis.expires_in) });
};

// get from access Token
const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `access-token:${userId}`;
  return await redisClient.get(key);
};

// delete access Token
const delAccessToken = async (userId: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClient.del(key);
};

// disconnect redis server
const disconnect = async (): Promise<void> => {
  await redisClient.quit();
  await redisPubClient.quit();
  await redisSubClient.quit();
};

export const RedisClient = {
  connect,
  set,
  get,
  del,
  setAccessToken,
  getAccessToken,
  delAccessToken,
  disconnect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
