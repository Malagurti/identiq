import fs from 'fs';
import path from 'path';

// Ensure the lib directory exists
const libDir = path.join(process.cwd(), 'examples', 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

// Copy the library files
const distDir = path.join(process.cwd(), 'dist');
const files = ['keyprint.min.js', 'index.esm.js', 'index.js'];

files.forEach(file => {
  const sourcePath = path.join(distDir, file);
  const destPath = path.join(libDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to examples/lib/`);
  } else {
    console.warn(`Warning: ${file} not found in dist/`);
  }
});

console.log('Library files copied successfully!');
