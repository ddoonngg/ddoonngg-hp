import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

redisClient.on("end", () => {
  console.log("Disconnected from Redis server");
});
