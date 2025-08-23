import { getBasicMetrics } from './modules/basic';
import { getCanvasFingerprint } from './modules/canvas';
import { generateHash } from './modules/hash';
import type { Fingerprint, FingerprintOptions } from './types';

/**
 * Default options for fingerprint generation.
 */
const DEFAULT_OPTIONS: Readonly<FingerprintOptions> = {
  useCanvas: true
};

/**
 * Generates a unique browser fingerprint based on the provided options.
 * Combines various browser characteristics into a single hash value.
 *
 * @param {Partial<FingerprintOptions>} options - Configuration to customize fingerprint sources.
 * @returns {Promise<Fingerprint>} A Promise that resolves to the SHA256 fingerprint hash.
 */
export async function generate(options: Partial<FingerprintOptions> = {}): Promise<Fingerprint> {
  // Merge provided options with defaults
  const finalOptions: FingerprintOptions = { ...DEFAULT_OPTIONS, ...options };

  // Collect all data points
  const components = {
    basic: getBasicMetrics(),
    canvas: finalOptions.useCanvas ? getCanvasFingerprint() : ''
  };

  // Create a stable data string from the components
  const dataString = JSON.stringify(components);

  // Hash the final string to produce the fingerprint
  const hash = await generateHash(dataString);

  return hash;
}

/**
 * Main export of the keyprint library.
 */
export default {
  generate,
  // Export individual modules for advanced usage
  modules: {
    getBasicMetrics,
    getCanvasFingerprint,
    generateHash
  }
};
