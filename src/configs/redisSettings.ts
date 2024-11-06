import redis from "redis";

const redisClient = redis.createClient({
  url: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
// Connect to Redis
await redisClient.connect();

// Function to set a key-value pair in Redis
export const setValue = async (key: string, value: string): Promise<void> => {
  await redisClient.set(key, value);
};

// Function to retrieve a value by key from Redis
export const getValue = async (key: string): Promise<string | null> => {
  return redisClient.get(key);
};
// Dispose of the Redis connection
export const dispose = async (): Promise<void> => {
  await redisClient.quit();
};

export default redisClient;
