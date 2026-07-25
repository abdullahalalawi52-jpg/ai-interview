import { describe, it, expect } from 'vitest';
import { ratelimit } from './ratelimit';

describe('Rate Limit Fallback', () => {
  it('should allow requests within limit', async () => {
    const ip = '127.0.0.1';
    
    // Make 2 requests
    const res1 = await ratelimit.limit(ip);
    const res2 = await ratelimit.limit(ip);
    
    expect(res1.success).toBe(true);
    expect(res2.success).toBe(true);
  });
});
