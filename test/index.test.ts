import { generate } from '../src/index';
import { getBasicMetrics } from '../src/modules/basic';
import { getCanvasFingerprint } from '../src/modules/canvas';
import { generateHash } from '../src/modules/hash';

// Mock the modules
jest.mock('../src/modules/basic', () => ({
  getBasicMetrics: jest.fn()
}));

jest.mock('../src/modules/canvas', () => ({
  getCanvasFingerprint: jest.fn()
}));

jest.mock('../src/modules/hash', () => ({
  generateHash: jest.fn()
}));

describe('Identiq Main Module', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (getBasicMetrics as jest.Mock).mockReturnValue({
      screenResolution: '1920x1080',
      language: 'en-US',
      timezoneOffset: -180,
      colorDepth: 24
    });
    
    (getCanvasFingerprint as jest.Mock).mockReturnValue('mocked-canvas-data');
    (generateHash as jest.Mock).mockResolvedValue('mocked-hash-value');
  });

  test('should generate fingerprint with default options', async () => {
    const result = await generate();
    
    // Check that all modules were called
    expect(getBasicMetrics).toHaveBeenCalled();
    expect(getCanvasFingerprint).toHaveBeenCalled();
    expect(generateHash).toHaveBeenCalled();
    
    // Check that generateHash was called with the expected data
    const expectedData = JSON.stringify({
      basic: {
        screenResolution: '1920x1080',
        language: 'en-US',
        timezoneOffset: -180,
        colorDepth: 24
      },
      canvas: 'mocked-canvas-data'
    });
    
    expect(generateHash).toHaveBeenCalledWith(expectedData);
    expect(result).toBe('mocked-hash-value');
  });

  test('should respect useCanvas option when false', async () => {
    await generate({ useCanvas: false });
    
    // Canvas fingerprinting should not be called
    expect(getCanvasFingerprint).not.toHaveBeenCalled();
    
    // Check that generateHash was called with expected data (no canvas)
    const expectedData = JSON.stringify({
      basic: {
        screenResolution: '1920x1080',
        language: 'en-US',
        timezoneOffset: -180,
        colorDepth: 24
      },
      canvas: ''
    });
    
    expect(generateHash).toHaveBeenCalledWith(expectedData);
  });

  test('should merge user options with defaults', async () => {
    // First call with default options
    await generate();
    expect(getCanvasFingerprint).toHaveBeenCalled();
    jest.clearAllMocks();
    
    // Call with custom options
    await generate({ useCanvas: false });
    expect(getCanvasFingerprint).not.toHaveBeenCalled();
    
    // Reset and call with default options again
    jest.clearAllMocks();
    await generate({});
    expect(getCanvasFingerprint).toHaveBeenCalled();
  });
});
