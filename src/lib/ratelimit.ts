import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "5 m"),
      analytics: true,
    });
  } else {
    console.warn("Upstash Redis is not configured. Rate limiting is disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Upstash Redis:", error);
}

export const ratelimit = {
  limit: async (identifier: string) => {
    if (!limiter) {
      return { success: true };
    }
    try {
      return await limiter.limit(identifier);
    } catch (error) {
      console.error("Rate limiting error", error);
      return { success: true }; // Graceful fallback
    }
  }
};
