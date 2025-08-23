import { getCanvasFingerprint } from '../src/modules/canvas';

describe('Canvas Fingerprinting Module', () => {
  // Store the original document.createElement
  const originalCreateElement = document.createElement;

  afterEach(() => {
    // Restore original createElement
    document.createElement = originalCreateElement;
  });

  test('should return a non-empty string when canvas is supported', () => {
    // Mock canvas and context
    const mockContext = {
      fillStyle: '',
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      font: '',
      textBaseline: '',
      fillText: jest.fn(),
      moveTo: jest.fn(),
      bezierCurveTo: jest.fn(),
      strokeStyle: '',
      lineWidth: 0,
      stroke: jest.fn()
    };

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => mockContext),
      toDataURL: jest.fn(() => 'data:image/png;base64,mockCanvasData')
    };

    document.createElement = jest.fn(() => mockCanvas as unknown as HTMLElement);

    const result = getCanvasFingerprint();
    
    expect(result).toBeTruthy();
    expect(result).toBe('data:image/png;base64,mockCanvasData');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
  });

  test('should return an empty string when canvas context is not available', () => {
    // Mock canvas with null context
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => null),
      toDataURL: jest.fn()
    };

    document.createElement = jest.fn(() => mockCanvas as unknown as HTMLElement);

    const result = getCanvasFingerprint();
    
    expect(result).toBe('');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.toDataURL).not.toHaveBeenCalled();
  });

  test('should return an empty string when toDataURL throws an error', () => {
    // Mock canvas with context but toDataURL throws
    const mockContext = {
      fillStyle: '',
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      font: '',
      textBaseline: '',
      fillText: jest.fn(),
      moveTo: jest.fn(),
      bezierCurveTo: jest.fn(),
      strokeStyle: '',
      lineWidth: 0,
      stroke: jest.fn()
    };

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => mockContext),
      toDataURL: jest.fn(() => {
        throw new Error('Security error');
      })
    };

    document.createElement = jest.fn(() => mockCanvas as unknown as HTMLElement);

    const result = getCanvasFingerprint();
    
    expect(result).toBe('');
  });
});
