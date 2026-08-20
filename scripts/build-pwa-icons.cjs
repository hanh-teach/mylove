const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function buildPwaIcons() {
  const srcImage = path.join(__dirname, '../src/assets/images/pwa_heart_icon_1784439703568.jpg');
  const publicDir = path.join(__dirname, '../public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating high-resolution PWA heart icons from:', srcImage);

  // 1. Create a 512x512 crisp white square icon with rounded heart centered
  // Heart image is resized to 380x380 (leaving 66px padding around on white background)
  const heartBuffer = await sharp(srcImage)
    .resize(380, 380, { fit: 'contain' })
    .toBuffer();

  // Create base 512x512 image on white background
  const base512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    {
      input: heartBuffer,
      top: 66,
      left: 66
    }
  ])
  .png()
  .toBuffer();

  // Save 512x512
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), base512);

  // Save 192x192
  const base192 = await sharp(base512)
    .resize(192, 192)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), base192);

  // Save Apple Touch Icon 180x180
  const appleTouch = await sharp(base512)
    .resize(180, 180)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon-precomposed.png'), appleTouch);

  // Save Maskable Icon (safe area padding: heart size 330x330 centered)
  const maskableHeartBuffer = await sharp(srcImage)
    .resize(330, 330, { fit: 'contain' })
    .toBuffer();

  const maskable512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
  .composite([
    {
      input: maskableHeartBuffer,
      top: 91,
      left: 91
    }
  ])
  .png()
  .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), maskable512);

  // Save favicon.png (64x64) and favicon.ico
  const favicon64 = await sharp(base512)
    .resize(64, 64)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), favicon64);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon64);

  // 2. Create manifest.json
  const manifestContent = {
    short_name: "NoteMe",
    name: "NoteMe Workspace - Sáng Tạo & Kỷ Niệm",
    description: "Ứng dụng sáng tạo thiệp, video lãng mạn và lưu giữ kỷ niệm tình yêu.",
    icons: [
      {
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192"
      },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512"
      },
      {
        src: "/icon-maskable-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable"
      },
      {
        src: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180"
      }
    ],
    start_url: "/",
    background_color: "#ffffff",
    theme_color: "#f43f5e",
    display: "standalone",
    orientation: "portrait",
    scope: "/"
  };

  fs.writeFileSync(
    path.join(publicDir, 'manifest.json'),
    JSON.stringify(manifestContent, null, 2),
    'utf8'
  );

  console.log('PWA icons and manifest.json generated successfully!');
}

buildPwaIcons().catch(err => {
  console.error('Error building PWA icons:', err);
  process.exit(1);
});
