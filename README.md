# IdentiqJS

A lightweight and efficient browser fingerprinting library that combines basic data collection methods with Canvas Fingerprinting.

## Installation

```bash
# Using npm
npm install identiq

# Using yarn
yarn add identiq

# Using pnpm
pnpm add identiq
```

## Basic Usage

### Via ES Module import

```typescript
import identiq from 'identiq';

// Generate fingerprint with default options
identiq.generate().then(fingerprint => {
  console.log('Fingerprint:', fingerprint);
});

// Generate fingerprint without Canvas (lighter, less precise)
identiq.generate({ useCanvas: false }).then(fingerprint => {
  console.log('Basic fingerprint:', fingerprint);
});
```

### Via script tag

```html
<script src="https://unpkg.com/identiq/dist/identiq.min.js"></script>
<script>
  identiq.generate().then(function(fingerprint) {
    console.log('Fingerprint:', fingerprint);
  });
</script>
```

## API

### `generate(options?: Partial<FingerprintOptions>): Promise<string>`

Generates a unique browser fingerprint based on the provided options.

#### Options

| Option | Type | Default | Description |
|-------|------|--------|-----------|
| `useCanvas` | `boolean` | `true` | Enables or disables Canvas Fingerprinting. Disabling this makes the fingerprint less unique but more privacy-friendly. |

The library automatically collects all available metrics without requiring additional configuration.

### Advanced Usage

You can also access individual modules for custom usage:

```typescript
import identiq from 'identiq';

// Access individual modules
const basicMetrics = identiq.modules.getBasicMetrics();
console.log('Basic metrics:', basicMetrics);
// Example output:
// {
//   screenResolution: "1920x1080",
//   language: "en-US",
//   timezoneOffset: -180,
//   colorDepth: 24,
//   hardwareConcurrency: 8,
//   userAgent: "Mozilla/5.0...",
//   platform: "Win32",
//   vendor: "Google Inc.",
//   colorScheme: "dark"
// }

const canvasData = identiq.modules.getCanvasFingerprint();
console.log('Canvas data:', canvasData.substring(0, 50) + '...');

// Generate custom hash
identiq.modules.generateHash('custom data').then(hash => {
  console.log('Custom hash:', hash);
});
```

## Data Sources Used

- **Basic Metrics**:
  - Screen resolution
  - Browser language
  - Timezone
  - Color depth
  - CPU cores (when available)
  - Browser plugins (when available)
  - User agent
  - Platform
  - Browser vendor
  - Color scheme preference (light/dark)

- **Canvas Fingerprinting**:
  - Text rendering
  - Geometric shape rendering
  - Color gradients
  - Emojis

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 IdentiqJS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```