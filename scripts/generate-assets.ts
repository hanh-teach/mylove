
import sharp from 'sharp';
import fs from 'fs';

async function generateAssets() {
  const input = 'src/assets/images/app_icon_heart_1785146128787.jpg';

  // 1. icon-192.png (any)
  await sharp(input).resize(192, 192).toFile('public/icon-192.png');

  // 2. icon-512.png (any)
  await sharp(input).resize(512, 512).toFile('public/icon-512.png');

  // 3. icon-maskable-512.png (maskable)
  // Add 10% transparent padding on all sides to create safe zone (total 20% reduction in size)
  const size = 512;
  const padding = Math.floor(size * 0.1);
  const innerSize = size - (padding * 2);
  
  await sharp(input)
    .resize(innerSize, innerSize)
    .extend({ 
        top: padding, 
        bottom: padding, 
        left: padding, 
        right: padding, 
        background: { r: 255, g: 255, b: 255, alpha: 1 } 
    })
    .toFile('public/icon-maskable-512.png');

  // 4. favicon.ico (32x32 PNG)
  await sharp(input).resize(32, 32).png().toFile('public/favicon.ico');

  console.log('All assets generated successfully');
}

generateAssets().catch(console.error);
