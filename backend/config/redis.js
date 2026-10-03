

import "dotenv/config";
import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
    console.log("Redis error:", error.message);
});

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        console.log("Redis connected");
    } catch (error) {
        console.log("Redis connection failed:", error.message);
    }
};

export default redisClient;