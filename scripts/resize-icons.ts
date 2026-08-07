
import sharp from 'sharp';
import path from 'path';

async function resizeIcons() {
  const input = 'src/assets/images/app_icon_heart_1785146128787.jpg';
  
  await sharp(input)
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');
    
  await sharp(input)
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');

  console.log('Icons resized and converted to PNG');
}

resizeIcons();
