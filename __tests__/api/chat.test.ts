/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/chat/route';
import { rateLimit } from '@/lib/rateLimit';

// Mock NextRequest since we're using Next.js 14+ Edge runtime compatible API routes
const mockRequest = (body: any, ip: string = '127.0.0.1') => {
  return new NextRequest('http://localhost/api/chat', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body)
  });
};

describe('POST /api/chat', () => {
  it('returns 400 if newMessage is missing', async () => {
    const req = mockRequest({
      messages: [],
      language: 'en'
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request");
    expect(data.details.newMessage).toBeDefined();
  });

  it('returns 400 if message exceeds 500 chars', async () => {
    const req = mockRequest({
      messages: [],
      newMessage: 'a'.repeat(501),
      language: 'en'
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request");
    expect(data.details.newMessage).toBeDefined();
  });

  it('returns 400 if language is invalid code', async () => {
    const req = mockRequest({
      messages: [],
      newMessage: 'Hello',
      language: 'invalid_code'
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request");
    expect(data.details.language).toBeDefined();
  });

  it('returns 429 if rate limit exceeded (mock 21 requests)', async () => {
    const ip = '192.168.1.100'; // Unique IP for this test
    let res;
    
    // Fire 20 requests
    for (let i = 0; i < 20; i++) {
      const req = mockRequest({ messages: [], newMessage: 'Hello', language: 'en' }, ip);
      res = await POST(req);
      if (res.status === 429) {
        break; // If it hits 429 early due to mock state
      }
    }
    
    // The 21st request
    const req21 = mockRequest({ messages: [], newMessage: 'Hello', language: 'en' }, ip);
    res = await POST(req21);
    
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe("Too many requests. Please slow down.");
  });
});
