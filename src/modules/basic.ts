import { BasicMetrics, MutableBasicMetrics } from '../types.js';

/**
 * Detects the user's preferred color scheme (light or dark).
 *
 * @returns {string} The detected color scheme ('light', 'dark', or 'no-preference').
 */
function detectColorScheme(): string {
  if (!window.matchMedia) {
    return 'not-supported';
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'no-preference';
}

/**
 * Collects basic browser metrics that are low-cost to obtain.
 * These include screen resolution, language, timezone, color depth, hardware concurrency,
 * user agent, platform, vendor, and color scheme preference.
 *
 * @returns {BasicMetrics} An object containing the collected basic metrics.
 */
export function getBasicMetrics(): BasicMetrics {
  // Collect base metrics
  const baseMetrics = {
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    timezoneOffset: new Date().getTimezoneOffset(),
    colorDepth: window.screen.colorDepth,
    userAgent: navigator.userAgent,
    platform: navigator.platform || 'unknown',
    vendor: navigator.vendor || 'unknown',
    colorScheme: detectColorScheme()
  };

  // Prepare optional metrics
  const optionalMetrics: Partial<MutableBasicMetrics> = {};

  // Add optional hardware concurrency if available
  if (navigator.hardwareConcurrency !== undefined) {
    optionalMetrics.hardwareConcurrency = navigator.hardwareConcurrency;
  }

  // Add plugins if available
  if (navigator.plugins && navigator.plugins.length > 0) {
    const pluginList: string[] = [];

    for (let i = 0; i < navigator.plugins.length; i++) {
      const plugin = navigator.plugins[i];
      pluginList.push(plugin.name);
    }

    optionalMetrics.plugins = pluginList;
  }

  // Combine base and optional metrics
  const metrics: BasicMetrics = {
    ...baseMetrics,
    ...optionalMetrics
  };

  return metrics;
}
