
import sharp from 'sharp';
import fs from 'fs';

async function verifyAssets() {
  const files = [
    'public/icon-192.png',
    'public/icon-512.png',
    'public/icon-maskable-512.png',
    'public/favicon.ico'
  ];

  for (const file of files) {
    console.log(`Verifying: ${file}`);
    
    // 1. Read first 16 bytes
    const buffer = fs.readFileSync(file);
    const hex = buffer.slice(0, 16).toString('hex').match(/../g).join(' ');
    console.log(`  Hex: ${hex.toUpperCase()}`);

    // 2. Verify with sharp
    try {
      const metadata = await sharp(file).metadata();
      console.log(`  Format: ${metadata.format}`);
      console.log(`  Size: ${metadata.width}x${metadata.height}`);
      console.log(`  Status: VALID`);
    } catch (e) {
      console.log(`  Status: INVALID - ${e.message}`);
    }
    console.log('-------------------');
  }
}

verifyAssets().catch(console.error);
