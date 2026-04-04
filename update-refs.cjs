const fs = require('fs');
const path = require('path');

const files = [
  'src/App.tsx',
  'src/components/BiologicalAnalysis.tsx',
];

files.forEach(f => {
  const fp = path.join(__dirname, f);
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  
  // Replace all .png references with .webp (but NOT in imports or non-image contexts)
  c = c.replace(/\/user_avatar_(\d+)\.png/g, '/user_avatar_$1.webp');
  c = c.replace(/\/impact_joint_health\.png/g, '/impact_joint_health.webp');
  c = c.replace(/\/impact_ingredients_burst\.png/g, '/impact_ingredients_burst.webp');
  c = c.replace(/\/trust_badges_ref\.png/g, '/trust_badges_ref.webp');
  c = c.replace(/\/trust_badges_impact\.png/g, '/trust_badges_impact.webp');
  c = c.replace(/\/hero-image-1\.png/g, '/hero-image-1.webp');
  
  fs.writeFileSync(fp, c);
  console.log(`Updated: ${f}`);
});

console.log('All PNG references updated to WebP.');
