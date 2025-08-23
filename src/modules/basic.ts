import { BasicMetrics, MutableBasicMetrics } from '../types.js';

/**
 * Collects basic browser metrics that are low-cost to obtain.
 * These include screen resolution, language, timezone, color depth, and hardware concurrency.
 * 
 * @returns {BasicMetrics} An object containing the collected basic metrics.
 */
export function getBasicMetrics(): BasicMetrics {
  // Collect base metrics
  const baseMetrics = {
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    timezoneOffset: new Date().getTimezoneOffset(),
    colorDepth: window.screen.colorDepth
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
