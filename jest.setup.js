// Make global available in the test environment
globalThis.global = globalThis;

// Mock TextEncoder and TextDecoder if they don't exist
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = class TextEncoder {
    encode(input) {
      return new Uint8Array(Buffer.from(input, 'utf8'));
    }
  };
}

if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = class TextDecoder {
    decode(input) {
      return Buffer.from(input).toString('utf8');
    }
  };
}
