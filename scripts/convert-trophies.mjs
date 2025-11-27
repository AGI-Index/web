import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceDir = '/home/simyung/PRJ/popup/src/assets';
const targetDir = '/home/simyung/PRJ/agiindex/public/trophies';

// Trophy image mapping
const trophyMapping = {
  'a641eb3000408c1028e26826a2b837b0caa7e509.png': 'trophy-1-first-vote.webp',
  '1d643b34f98db5fac8433c823cb96101926e9db4.png': 'trophy-2-five-votes.webp',
  'cfec74abf3429426e04dd8a7752906e5f9df56f0.png': 'trophy-3-first-question.webp',
  '6797b2bb3ea029de065720d0c4d1be2590d3496d.png': 'trophy-4-ten-votes.webp',
  'c28f06edecefaf486cbf55616889d5bf87940a5a.png': 'trophy-5-three-questions.webp',
};

async function convertImages() {
  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const [sourceName, targetName] of Object.entries(trophyMapping)) {
    const sourcePath = path.join(sourceDir, sourceName);
    const targetPath = path.join(targetDir, targetName);

    if (!fs.existsSync(sourcePath)) {
      console.log(`Source file not found: ${sourcePath}`);
      continue;
    }

    try {
      await sharp(sourcePath)
        .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 85 })
        .toFile(targetPath);

      const stats = fs.statSync(targetPath);
      console.log(`Converted: ${sourceName} -> ${targetName} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`Error converting ${sourceName}:`, error.message);
    }
  }

  console.log('\nDone!');
}

convertImages();
