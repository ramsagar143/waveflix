import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pre-build generation of icons in the public directory from app/icon.svg
const svgPath = path.join(__dirname, 'app/icon.svg');
const publicDir = path.join(__dirname, 'public');

if (fs.existsSync(svgPath)) {
  try {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 1. Copy SVG icons to public/ (modern, crisp vector format)
    fs.copyFileSync(svgPath, path.join(publicDir, 'icon.svg'));
    fs.copyFileSync(svgPath, path.join(publicDir, 'favicon.svg'));
    console.log('✓ Next.js Config: Copied SVG icons to public/ directory');

    // 2. Generate PNGs and ICO using sharp if available
    try {
      const sharp = (await import('sharp')).default;
      
      const pngSizes = {
        'icon-192.png': 192,
        'icon-512.png': 512,
        'apple-touch-icon.png': 180,
        'favicon.png': 48,
      };

      for (const [filename, size] of Object.entries(pngSizes)) {
        const outputPath = path.join(publicDir, filename);
        await sharp(svgPath)
          .resize(size, size)
          .png()
          .toFile(outputPath);
      }

      // Generate a valid favicon.ico containing a 48x48 PNG
      const png48Buffer = await sharp(svgPath)
        .resize(48, 48)
        .png()
        .toBuffer();

      const header = Buffer.alloc(6);
      header.writeUInt16LE(0, 0); // Reserved
      header.writeUInt16LE(1, 2); // Type (1 = ICO)
      header.writeUInt16LE(1, 4); // Number of images (1)

      const entry = Buffer.alloc(16);
      entry.writeUInt8(48, 0); // Width
      entry.writeUInt8(48, 1); // Height
      entry.writeUInt8(0, 2); // Color palette
      entry.writeUInt8(0, 3); // Reserved
      entry.writeUInt16LE(1, 4); // Color planes
      entry.writeUInt16LE(32, 6); // Bits per pixel (32)
      entry.writeUInt32LE(png48Buffer.length, 8); // Size of image data
      entry.writeUInt32LE(22, 12); // Offset (6 header + 16 entry = 22)

      const icoBuffer = Buffer.concat([header, entry, png48Buffer]);
      fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
      
      console.log('✓ Next.js Config: Successfully generated PNG and ICO icons in public/ directory');
    } catch (sharpError) {
      console.warn('⚠ Next.js Config: sharp not available or failed to load. Skipping PNG/ICO generation. (SVG icons are still copied):', sharpError.message);
    }
  } catch (error) {
    console.error('✗ Next.js Config: Failed to generate/copy icons:', error);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Netlify pe output: standalone mat karo — plugin handle karta hai
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.(svg|png|jpg|jpeg|webp|avif|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
