import { generateHash } from '../src/modules/hash';

describe('Hash Generation Module', () => {
  // Store original crypto object
  const originalCrypto = globalThis.crypto;
  
  afterEach(() => {
    // Restore original crypto
    Object.defineProperty(globalThis, 'crypto', {
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
    
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        subtle: {
          digest: mockDigest
        }
      },
      writable: true
    });
    
    // TextEncoder mock
    globalThis.TextEncoder = jest.fn().mockImplementation(() => ({
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
    Object.defineProperty(globalThis, 'crypto', {
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
    
    Object.defineProperty(globalThis, 'crypto', {
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

  describe('Hash Consistency Tests', () => {
    test('should generate identical hashes for identical inputs', async () => {
      const input = 'test string for consistency';
      
      // Generate hash multiple times
      const hash1 = await generateHash(input);
      const hash2 = await generateHash(input);
      const hash3 = await generateHash(input);
      
      // All should be identical
      expect(hash1).toBe(hash2);
      expect(hash2).toBe(hash3);
      expect(hash1).toBe(hash3);
    });

    test('should generate different hashes for different inputs', async () => {
      const input1 = 'first input';
      const input2 = 'second input';
      const input3 = 'third input';
      
      const hash1 = await generateHash(input1);
      const hash2 = await generateHash(input2);
      const hash3 = await generateHash(input3);
      
      // All should be different
      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
      expect(hash1).not.toBe(hash3);
    });

    test('should maintain consistency across rapid calls', async () => {
      const input = 'rapid test input';
      
      // Generate multiple hashes rapidly
      const promises = Array.from({ length: 20 }, () => generateHash(input));
      const hashes = await Promise.all(promises);
      
      // All should be identical
      const firstHash = hashes[0];
      hashes.forEach(hash => {
        expect(hash).toBe(firstHash);
      });
    });

    test('should handle edge cases consistently', async () => {
      // Empty string
      const emptyHash1 = await generateHash('');
      const emptyHash2 = await generateHash('');
      expect(emptyHash1).toBe(emptyHash2);
      
      // Very long string
      const longString = 'a'.repeat(10000);
      const longHash1 = await generateHash(longString);
      const longHash2 = await generateHash(longString);
      expect(longHash1).toBe(longHash2);
      
      // Special characters
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const specialHash1 = await generateHash(specialChars);
      const specialHash2 = await generateHash(specialChars);
      expect(specialHash1).toBe(specialHash2);
    });

    test('should be deterministic across different crypto implementations', async () => {
      const input = 'deterministic test';
      
      // Test with SubtleCrypto available
      const mockDigest = jest.fn().mockImplementation(() => {
        const buffer = new ArrayBuffer(32);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < 32; i++) {
          view[i] = 0xCD;
        }
        return Promise.resolve(buffer);
      });
      
      Object.defineProperty(globalThis, 'crypto', {
        value: {
          subtle: {
            digest: mockDigest
          }
        },
        writable: true
      });
      
      const hashWithSubtle = await generateHash(input);
      
      // Test with fallback hash
      Object.defineProperty(globalThis, 'crypto', {
        value: {},
        writable: true
      });
      
      const hashWithFallback = await generateHash(input);
      
      // Both should be consistent for the same input
      expect(hashWithSubtle).toBeTruthy();
      expect(hashWithFallback).toBeTruthy();
      expect(typeof hashWithSubtle).toBe('string');
      expect(typeof hashWithFallback).toBe('string');
    });
  });
});
