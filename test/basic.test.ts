import { getBasicMetrics } from '../src/modules/basic';

describe('Basic Metrics Module', () => {
  // Store original navigator and screen properties
  const originalNavigator = globalThis.navigator;
  const originalScreen = globalThis.screen;
  let originalDate: typeof Date;

  beforeEach(() => {
    // Mock navigator and screen objects
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        language: 'en-US',
        hardwareConcurrency: 8,
        plugins: {
          length: 2,
          0: { name: 'Test Plugin 1' },
          1: { name: 'Test Plugin 2' },
          [Symbol.iterator]: function* () {
            yield { name: 'Test Plugin 1' };
            yield { name: 'Test Plugin 2' };
          }
        }
      },
      writable: true
    });

    Object.defineProperty(globalThis, 'screen', {
      value: {
        width: 1920,
        height: 1080,
        colorDepth: 24
      },
      writable: true
    });

    // Mock Date.prototype.getTimezoneOffset
    originalDate = globalThis.Date;
    globalThis.Date = class extends originalDate {
      getTimezoneOffset(): number {
        return -180; // -3 hours
      }
    } as typeof Date;
  });

  afterEach(() => {
    // Restore original objects
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      writable: true
    });
    
    Object.defineProperty(globalThis, 'screen', {
      value: originalScreen,
      writable: true
    });
    
    globalThis.Date = originalDate;
  });

  test('should return an object with all required metrics', () => {
    const metrics = getBasicMetrics();
    
    // Check that all required properties are present
    expect(metrics).toHaveProperty('screenResolution');
    expect(metrics).toHaveProperty('language');
    expect(metrics).toHaveProperty('timezoneOffset');
    expect(metrics).toHaveProperty('colorDepth');
    
    // Check the values match our mocked environment
    expect(metrics.screenResolution).toBe('1920x1080');
    expect(metrics.language).toBe('en-US');
    expect(metrics.timezoneOffset).toBe(-180);
    expect(metrics.colorDepth).toBe(24);
  });

  test('should include optional metrics when available', () => {
    const metrics = getBasicMetrics();
    
    expect(metrics.hardwareConcurrency).toBe(8);
    expect(metrics.plugins).toHaveLength(2);
    expect(metrics.plugins?.[0]).toBe('Test Plugin 1');
    expect(metrics.plugins?.[1]).toBe('Test Plugin 2');
  });

  test('should handle missing optional metrics', () => {
    // Remove optional properties
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        language: 'en-US',
        plugins: { length: 0 }
      },
      writable: true
    });
    
    const metrics = getBasicMetrics();
    
    expect(metrics.hardwareConcurrency).toBeUndefined();
    expect(metrics.plugins).toBeUndefined();
  });
});
