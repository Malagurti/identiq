/**
 * Generates a fingerprint using the browser's Canvas API.
 * It draws a specific set of graphics and text, which varies based on
 * hardware and software, and returns a base64 representation of the image.
 * Returns an empty string if the canvas context cannot be obtained.
 *
 * @returns {string} The base64-encoded PNG data URL.
 */
export function getCanvasFingerprint(): string {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 150;

  // Get the rendering context
  const ctx = canvas.getContext('2d');

  // Type guard to ensure context is not null
  if (!ctx) {
    return '';
  }

  // Fill background
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  ctx.fillStyle = '#36c';
  ctx.font = '18px Arial';
  ctx.textBaseline = 'top';
  ctx.fillText('IdentiqJS Canvas Fingerprint', 10, 10);

  // Draw shapes with different styles
  // Circle
  ctx.beginPath();
  ctx.arc(50, 80, 25, 0, Math.PI * 2, true);
  ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
  ctx.fill();

  // Rectangle with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, 'blue');
  gradient.addColorStop(1, 'green');
  ctx.fillStyle = gradient;
  ctx.fillRect(100, 80, 150, 40);

  // Draw emoji (high entropy source)
  ctx.fillStyle = '#000';
  ctx.font = '24px Arial';
  ctx.fillText('🔑👆', 260, 120);

  // Add some random curves
  ctx.beginPath();
  ctx.moveTo(10, 140);
  ctx.bezierCurveTo(50, 100, 150, 120, 290, 140);
  ctx.strokeStyle = 'purple';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Convert canvas to data URL
  try {
    return canvas.toDataURL('image/png');
  } catch (e) {
    // Handle potential security exceptions
    return '';
  }
}
