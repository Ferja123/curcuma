const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const before = (content.match(/data-aos/g) || []).length;
  
  // Remove data-aos="..." attributes
  content = content.replace(/\s*data-aos="[^"]*"/g, '');
  // Remove data-aos-delay="..." attributes  
  content = content.replace(/\s*data-aos-delay="[^"]*"/g, '');
  // Remove data-aos-offset="..." attributes
  content = content.replace(/\s*data-aos-offset="[^"]*"/g, '');
  
  const after = (content.match(/data-aos/g) || []).length;
  fs.writeFileSync(filePath, content);
  console.log(`${path.basename(filePath)}: removed ${before - after} data-aos attrs (${before} -> ${after})`);
}

// Clean all component files
cleanFile(path.join(srcDir, 'App.tsx'));
cleanFile(path.join(srcDir, 'components', 'BiologicalAnalysis.tsx'));
cleanFile(path.join(srcDir, 'components', 'FAQ.tsx'));
cleanFile(path.join(srcDir, 'components', 'Header.tsx'));
cleanFile(path.join(srcDir, 'components', 'CommentsSection.tsx'));
cleanFile(path.join(srcDir, 'components', 'EditableCarousel.tsx'));
cleanFile(path.join(srcDir, 'components', 'EditableImage.tsx'));

// Also remove the AOS comment line
let app = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf8');
app = app.replace('// AOS removed - using native CSS scroll animations for stability\n', '');
app = app.replace('// AOS removed - using native CSS scroll animations for stability\r\n', '');
fs.writeFileSync(path.join(srcDir, 'App.tsx'), app);

console.log('\nDone! All data-aos attributes removed.');
