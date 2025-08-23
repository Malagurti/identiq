/**
 * Generates a SHA-256 hash from the provided input string.
 * Uses the SubtleCrypto API for secure and efficient hashing.
 * Falls back to a simpler hash if SubtleCrypto is not available.
 *
 * @param {string} input - The string to hash
 * @returns {Promise<string>} A promise that resolves to the hexadecimal hash string
 */
export async function generateHash(input: string): Promise<string> {
  // Check if SubtleCrypto is available
  if (window.crypto && window.crypto.subtle) {
    try {
      // Convert the input string to an array buffer
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      // Generate the SHA-256 hash
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      
      // Convert the hash to a hexadecimal string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      
      return hashHex;
    } catch (e) {
      // Fall back to simpler hash if SubtleCrypto fails
      return fallbackHash(input);
    }
  } else {
    // Use fallback if SubtleCrypto is not available
    return fallbackHash(input);
  }
}

/**
 * A simple fallback hash function for environments where SubtleCrypto is not available.
 * This is not cryptographically secure but provides a reasonable distribution.
 *
 * @param {string} input - The string to hash
 * @returns {string} A hexadecimal hash string
 */
function fallbackHash(input: string): string {
  let hash = 0;
  
  if (input.length === 0) {
    return '0';
  }
  
  // Simple string hash algorithm
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Create a more complex hash by iterating multiple times
  let result = Math.abs(hash).toString(16);
  
  // Pad the result to ensure consistent length
  while (result.length < 16) {
    result = '0' + result;
  }
  
  return result;
}
