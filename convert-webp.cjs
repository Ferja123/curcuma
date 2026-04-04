const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const pngs = fs.readdirSync(publicDir).filter(f => f.endsWith('.png'));

console.log(`Found ${pngs.length} PNG files to convert.\n`);

// Check if sharp is available, if not install it
try {
  require.resolve('sharp');
} catch (e) {
  console.log('Installing sharp for WebP conversion...');
  execSync('npm install sharp --no-save', { cwd: __dirname, stdio: 'inherit' });
}

const sharp = require('sharp');

async function convertAll() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const png of pngs) {
    const inputPath = path.join(publicDir, png);
    const outputPath = path.join(publicDir, png.replace('.png', '.webp'));
    
    const beforeSize = fs.statSync(inputPath).size;
    totalBefore += beforeSize;

    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const afterSize = fs.statSync(outputPath).size;
      totalAfter += afterSize;
      
      const savings = Math.round((1 - afterSize / beforeSize) * 100);
      console.log(`✓ ${png} → ${png.replace('.png', '.webp')} (${Math.round(beforeSize/1024)}KB → ${Math.round(afterSize/1024)}KB, -${savings}%)`);
    } catch (err) {
      console.log(`✗ ${png} failed: ${err.message}`);
    }
  }

  console.log(`\nTotal: ${Math.round(totalBefore/1024/1024)}MB → ${Math.round(totalAfter/1024/1024)}MB (saved ${Math.round((totalBefore - totalAfter)/1024/1024)}MB)`);
}

convertAll();
