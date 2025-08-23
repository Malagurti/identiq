# KeyprintJS Demo

This is a simple demo page for testing the KeyprintJS library.

## Running the Demo

To run the demo, follow these steps:

1. Build the library:
   ```bash
   pnpm build
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

## Demo Features

The demo page includes:
- A simple button to generate a fingerprint
- Display of the generated fingerprint hash
- Error handling

## Usage Examples

The demo demonstrates two ways to use the KeyprintJS library:

1. **ES Module Import (Active)** - Using `import` to load the ESM version:
   ```javascript
   import keyprint from './lib/index.esm.js';
   
   // Use the library
   const fingerprint = await keyprint.generate();
   ```

2. **IIFE Bundle (Commented)** - Using the global variable from the IIFE bundle:
   ```html
   <script src="./lib/keyprint.min.js"></script>
   <script>
     // The library is available as a global variable
     const fingerprint = await keyprint.generate();
   </script>
   ```

These examples reflect how a real user would integrate the library in their projects.

## Development with Auto-Rebuild

If you want to make changes to the library and see them reflected immediately:

```bash
pnpm dev:watch
```

This will start Rollup in watch mode and the development server simultaneously.