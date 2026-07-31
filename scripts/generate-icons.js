const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.join(__dirname, '../app/icon.svg');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function pngToIco(pngBuffer, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 = ICO)
  header.writeUInt16LE(1, 4); // Number of images (1)

  const entry = Buffer.alloc(16);
  entry.writeUInt8(width >= 256 ? 0 : width, 0);
  entry.writeUInt8(height >= 256 ? 0 : height, 1);
  entry.writeUInt8(0, 2); // Color palette (0 = no palette)
  entry.writeUInt8(0, 3); // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel (32)
  entry.writeUInt32LE(pngBuffer.length, 8); // Image data size
  entry.writeUInt32LE(22, 12); // Image data offset (6 header + 16 entry = 22)

  return Buffer.concat([header, entry, pngBuffer]);
}

async function main() {
  try {
    console.log('Generating icons from', svgPath);

    // 1. Copy SVG to public/icon.svg
    fs.copyFileSync(svgPath, path.join(publicDir, 'icon.svg'));
    console.log('✓ Copied icon.svg to public/');

    // 2. Generate PNGs of various sizes
    const sizes = {
      'icon-192.png': 192,
      'icon-512.png': 512,
      'apple-touch-icon.png': 180,
      'favicon.png': 48,
    };

    for (const [filename, size] of Object.entries(sizes)) {
      const outputPath = path.join(publicDir, filename);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${filename} (${size}x${size})`);
    }

    // 3. Generate favicon.ico (48x48 png inside ico)
    const png48Buffer = await sharp(svgPath)
      .resize(48, 48)
      .png()
      .toBuffer();
    
    const icoBuffer = pngToIco(png48Buffer, 48, 48);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
    console.log('✓ Generated favicon.ico (48x48)');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();
