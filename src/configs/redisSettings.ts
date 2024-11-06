import redis from "redis";

/**
 * Creates a Redis client and connects to the Redis server using credentials from environment variables.
 * The Redis client is used to interact with the Redis server for data storage and retrieval.
 */
const redisClient = redis.createClient({
  url: process.env.REDIS_HOST, // Redis server URL
  password: process.env.REDIS_PASSWORD, // Password for Redis authentication
});

// Log Redis errors for debugging purposes
redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Connect to the Redis server asynchronously
await redisClient.connect();

/**
 * Sets a key-value pair in Redis.
 * 
 * @param {string} key - The key under which the value will be stored in Redis.
 * @param {string} value - The value to store in Redis.
 * 
 * @returns {Promise<void>} A promise that resolves when the key-value pair has been set.
 *
 * @example
 * await setValue("username", "john_doe");
 */
export const setValue = async (key: string, value: string): Promise<void> => {
  await redisClient.set(key, value);
};

/**
 * Retrieves a value from Redis by its key.
 * 
 * @param {string} key - The key to look up in Redis.
 * 
 * @returns {Promise<string | null>} The value associated with the key, or `null` if the key does not exist.
 *
 * @example
 * const value = await getValue("username");
 * console.log(value); // Logs the value associated with the key, or null if not found
 */
export const getValue = async (key: string): Promise<string | null> => {
  return redisClient.get(key);
};

/**
 * Disposes of the Redis connection by closing it.
 * This should be called when the Redis connection is no longer needed to release resources.
 * 
 * @returns {Promise<void>} A promise that resolves when the connection has been closed.
 *
 * @example
 * await dispose();
 */
export const dispose = async (): Promise<void> => {
  await redisClient.quit();
};

// Export the Redis client for use in other parts of the application
export default redisClient;
