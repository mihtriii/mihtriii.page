import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0B09"/>
      <stop offset="100%" stop-color="#131310"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8C96A"/>
      <stop offset="50%" stop-color="#C9A84C"/>
      <stop offset="100%" stop-color="#8B7234"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)"/>
  <rect x="16" y="16" width="480" height="480" rx="112" fill="none" stroke="url(#gold)" stroke-width="10"/>
  <text x="256" y="300" font-family="Georgia, serif" font-size="200" font-weight="700" text-anchor="middle" fill="url(#gold)" letter-spacing="-6">NT</text>
</svg>`;

await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/assets/icon-192.png');
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/assets/icon-512.png');
console.log('Icons generated');