const fs = require('fs');
const path = require('path');

const files = [
  'src/components/InteractiveVideo.tsx',
  'src/components/HeroSection.tsx',
  'src/components/FAQ.tsx',
  'src/components/BiologicalAnalysis.tsx',
];

files.forEach(f => {
  const fp = path.join(__dirname, f);
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  c = c.replace(/\s*data-aos="[^"]*"/g, '');
  c = c.replace(/\s*data-aos-delay="[^"]*"/g, '');
  c = c.replace(/\s*data-aos-delay=\{[^}]*\}/g, '');
  c = c.replace(/\s*data-aos-offset="[^"]*"/g, '');
  fs.writeFileSync(fp, c);
  console.log(`Cleaned: ${f}`);
});

console.log('All residual data-aos removed.');
