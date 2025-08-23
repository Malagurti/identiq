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

// Mock Canvas API for testing environment
class MockCanvasRenderingContext2D {
  constructor() {
    this.fillStyle = '#000000';
    this.strokeStyle = '#000000';
    this.lineWidth = 1;
    this.font = '12px Arial';
    this.textBaseline = 'top';
    this.fillRect = jest.fn();
    this.fillText = jest.fn();
    this.beginPath = jest.fn();
    this.arc = jest.fn();
    this.fill = jest.fn();
    this.moveTo = jest.fn();
    this.bezierCurveTo = jest.fn();
    this.stroke = jest.fn();
    this.createLinearGradient = jest.fn(() => ({
      addColorStop: jest.fn()
    }));
  }
}

class MockCanvas {
  constructor() {
    this.width = 300;
    this.height = 150;
    this.getContext = jest.fn((type) => {
      if (type === '2d') {
        return new MockCanvasRenderingContext2D();
      }
      return null;
    });
    this.toDataURL = jest.fn(() => 'data:image/png;base64,mock-canvas-data');
  }
}

// Mock document.createElement for canvas
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
  if (tagName.toLowerCase() === 'canvas') {
    return new MockCanvas();
  }
  return originalCreateElement.call(this, tagName);
};

// Mock HTMLCanvasElement.prototype.getContext
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function(type) {
    if (type === '2d') {
      return new MockCanvasRenderingContext2D();
    }
    return null;
  };
}
