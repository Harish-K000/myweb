import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/sequence');
const FRAME_COUNT = 120;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Generating ${FRAME_COUNT} placeholder frames in ${OUTPUT_DIR}...`);

for (let i = 1; i <= FRAME_COUNT; i++) {
  const frameNum = String(i).padStart(3, '0');

  const h = 1080;
  const w = 1920;

  // Create a moving gradient or text to visualize usage
  const progress = i / FRAME_COUNT;
  const color = Math.floor(progress * 255);
  const colorHex = `rgb(${color}, ${100}, ${255 - color})`;

  const svgContent = `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#050814" />
  <rect x="${(progress * w / 2) + w / 4}" y="${h / 2 - 100}" width="200" height="200" fill="${colorHex}" rx="20" />
  <text x="50" y="100" font-family="Arial" font-size="60" fill="white">Frame ${frameNum}</text>
  <text x="50" y="200" font-family="Arial" font-size="40" fill="#666">Scroll Progress: ${(progress * 100).toFixed(0)}%</text>
  <text x="50" y="300" font-family="Arial" font-size="30" fill="#444">Cinematic Placeholder</text>
</svg>
`;

  // Write as .svg
  fs.writeFileSync(path.join(OUTPUT_DIR, `frame-${frameNum}.svg`), svgContent);
}

console.log('Done.');
