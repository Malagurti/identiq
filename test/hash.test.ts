import { generateHash } from '../src/modules/hash.js';

describe('Hash Generation Module', () => {
  // Store original crypto object
  const originalCrypto = global.crypto;
  
  afterEach(() => {
    // Restore original crypto
    Object.defineProperty(global, 'crypto', {
      value: originalCrypto,
      writable: true
    });
  });

  test('should generate a SHA-256 hash using SubtleCrypto', async () => {
    // Mock crypto.subtle.digest
    const mockDigest = jest.fn().mockImplementation(() => {
      // Create a mock hash buffer (32 bytes for SHA-256)
      const buffer = new ArrayBuffer(32);
      const view = new Uint8Array(buffer);
      
      // Fill with predictable values (all 0xAB)
      for (let i = 0; i < 32; i++) {
        view[i] = 0xAB;
      }
      
      return Promise.resolve(buffer);
    });
    
    Object.defineProperty(global, 'crypto', {
      value: {
        subtle: {
          digest: mockDigest
        }
      },
      writable: true
    });
    
    // TextEncoder mock
    global.TextEncoder = jest.fn().mockImplementation(() => ({
      encode: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3]))
    }));
    
    const result = await generateHash('test input');
    
    // Expected hash: 32 bytes of 0xAB = 'ababab...' (64 chars)
    const expected = 'abababababababababababababababababababababababababababababababab';
    
    expect(result).toBe(expected);
    expect(mockDigest).toHaveBeenCalledWith('SHA-256', expect.any(Uint8Array));
  });

  test('should use fallback hash when SubtleCrypto is not available', async () => {
    // Remove crypto.subtle
    Object.defineProperty(global, 'crypto', {
      value: {},
      writable: true
    });
    
    const result = await generateHash('test input');
    
    // Ensure we get a string result of expected length
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThanOrEqual(16);
    
    // Hash should be consistent for the same input
    const secondResult = await generateHash('test input');
    expect(result).toBe(secondResult);
    
    // Different inputs should produce different hashes
    const differentResult = await generateHash('different input');
    expect(result).not.toBe(differentResult);
  });

  test('should use fallback hash when SubtleCrypto throws an error', async () => {
    // Mock crypto.subtle.digest that throws an error
    const mockDigest = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('SubtleCrypto error'));
    });
    
    Object.defineProperty(global, 'crypto', {
      value: {
        subtle: {
          digest: mockDigest
        }
      },
      writable: true
    });
    
    const result = await generateHash('test input');
    
    // Ensure we get a string result
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThanOrEqual(16);
  });
});
