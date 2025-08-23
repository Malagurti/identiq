/**
 * An object containing all basic (low-cost) metrics collected from the browser.
 */
export interface BasicMetrics {
  readonly screenResolution: string;
  readonly language: string;
  readonly timezoneOffset: number;
  readonly colorDepth: number;
  readonly hardwareConcurrency?: number;
  readonly plugins?: readonly string[];
  readonly userAgent: string;
  readonly platform: string;
  readonly vendor: string;
  readonly colorScheme: string;
}

/**
 * Internal interface for building metrics without readonly constraints
 * @internal
 */
export interface MutableBasicMetrics {
  screenResolution: string;
  language: string;
  timezoneOffset: number;
  colorDepth: number;
  hardwareConcurrency?: number;
  plugins?: string[];
  userAgent: string;
  platform: string;
  vendor: string;
  colorScheme: string;
}

/**
 * Configuration options for the fingerprint generation function.
 * This allows consumers to enable or disable specific high-cost metrics.
 */
export interface FingerprintOptions {
  readonly useCanvas: boolean;
}

/**
 * The final fingerprint output, represented as a SHA256 hash string.
 */
export type Fingerprint = string;
