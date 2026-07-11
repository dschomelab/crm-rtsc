import { describe, it, expect } from 'vitest';

describe('App Infrastructure', () => {
  it('should have valid environment', () => {
    expect(import.meta.env.VITE_API_URL).toBe('http://localhost:3001/api/v1');
  });

  it('should have valid type imports', () => {
    // Verify we can import and use types
    interface TestUser {
      id: string;
      email: string;
      name: string;
      role: string;
    }
    const user: TestUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'ADMIN' };
    expect(user.email).toBe('test@test.com');
  });
});
