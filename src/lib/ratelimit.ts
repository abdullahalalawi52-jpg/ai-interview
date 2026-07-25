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
    console.warn("Upstash Redis is not configured. Falling back to in-memory rate limiting (dev only).");
  }
} catch (error) {
  console.error("Failed to initialize Upstash Redis:", error);
}

// Simple in-memory rate limiter for dev fallback
const memoryStore = new Map<string, { count: number, resetTime: number }>();

export const ratelimit = {
  limit: async (identifier: string) => {
    if (limiter) {
      try {
        return await limiter.limit(identifier);
      } catch (error) {
        console.error("Rate limiting error", error);
        return { success: true, reset: Date.now() + 60000 }; // Graceful fallback
      }
    }
    
    // In-memory fallback (e.g. 100 requests per 5 minutes)
    const now = Date.now();
    const windowMs = 5 * 60 * 1000;
    const limit = 100;
    
    const record = memoryStore.get(identifier);
    if (!record || now > record.resetTime) {
      const resetTime = now + windowMs;
      memoryStore.set(identifier, { count: 1, resetTime });
      return { success: true, reset: resetTime };
    }
    
    if (record.count >= limit) {
      return { success: false, reset: record.resetTime };
    }
    
    record.count += 1;
    return { success: true, reset: record.resetTime };
  }
};
