// Script to move moov atom to beginning of MP4 for web streaming (faststart)
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'public', 'video-promocional-curcuma.mp4');
const outputFile = path.join(__dirname, 'public', 'video-optimized.mp4');

const buf = fs.readFileSync(inputFile);

// Find all atoms/boxes
function findAtoms(buffer) {
  const atoms = [];
  let offset = 0;
  while (offset < buffer.length - 8) {
    const size = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    if (size < 8 || offset + size > buffer.length) break;
    atoms.push({ type, offset, size });
    offset += size;
  }
  return atoms;
}

const atoms = findAtoms(buf);
console.log('Found atoms:', atoms.map(a => `${a.type}(${a.size}B@${a.offset})`).join(', '));

const ftyp = atoms.find(a => a.type === 'ftyp');
const moov = atoms.find(a => a.type === 'moov');
const mdat = atoms.find(a => a.type === 'mdat');

if (!ftyp || !moov || !mdat) {
  console.error('Missing required atoms');
  process.exit(1);
}

if (moov.offset < mdat.offset) {
  console.log('moov is already before mdat - file is already optimized for web!');
  process.exit(0);
}

console.log(`Moving moov (${moov.size}B) before mdat...`);

// Build new file: ftyp + moov (with adjusted offsets) + everything else
const ftypData = buf.slice(ftyp.offset, ftyp.offset + ftyp.size);
const moovData = Buffer.from(buf.slice(moov.offset, moov.offset + moov.size));

// We need to adjust chunk offsets in moov by the amount moov moved
const moovShift = moov.offset - (ftyp.offset + ftyp.size);

// Adjust stco (32-bit) and co64 (64-bit) chunk offset tables
function adjustOffsets(moovBuf, shift) {
  function findBoxes(buffer, boxType, start, end) {
    const results = [];
    let pos = start;
    while (pos < end - 8) {
      const sz = buffer.readUInt32BE(pos);
      const tp = buffer.toString('ascii', pos + 4, pos + 8);
      if (sz < 8) break;
      if (tp === boxType) results.push({ offset: pos, size: sz });
      // Recurse into container boxes
      if (['moov','trak','mdia','minf','stbl','edts','udta','dinf'].includes(tp)) {
        results.push(...findBoxes(buffer, boxType, pos + 8, pos + sz));
      }
      pos += sz;
    }
    return results;
  }
  
  // Fix stco boxes (32-bit offsets)
  const stcoBoxes = findBoxes(moovBuf, 'stco', 0, moovBuf.length);
  for (const box of stcoBoxes) {
    const entryCount = moovBuf.readUInt32BE(box.offset + 12);
    for (let i = 0; i < entryCount; i++) {
      const pos = box.offset + 16 + i * 4;
      const val = moovBuf.readUInt32BE(pos);
      moovBuf.writeUInt32BE(val + shift, pos);
    }
    console.log(`  Adjusted ${entryCount} stco entries`);
  }
  
  // Fix co64 boxes (64-bit offsets)
  const co64Boxes = findBoxes(moovBuf, 'co64', 0, moovBuf.length);
  for (const box of co64Boxes) {
    const entryCount = moovBuf.readUInt32BE(box.offset + 12);
    for (let i = 0; i < entryCount; i++) {
      const pos = box.offset + 16 + i * 8;
      const hi = moovBuf.readUInt32BE(pos);
      const lo = moovBuf.readUInt32BE(pos + 4);
      const val = hi * 0x100000000 + lo + shift;
      moovBuf.writeUInt32BE(Math.floor(val / 0x100000000), pos);
      moovBuf.writeUInt32BE(val >>> 0, pos + 4);
    }
    console.log(`  Adjusted ${entryCount} co64 entries`);
  }
}

adjustOffsets(moovData, -moovShift);

// Reconstruct: ftyp + moov + rest (excluding original moov)
const parts = [ftypData, moovData];
for (const atom of atoms) {
  if (atom.type !== 'ftyp' && atom.type !== 'moov') {
    parts.push(buf.slice(atom.offset, atom.offset + atom.size));
  }
}

const result = Buffer.concat(parts);
fs.writeFileSync(outputFile, result);
console.log(`Done! Wrote ${result.length} bytes to ${outputFile}`);
console.log('New atom order:', findAtoms(result).map(a => a.type).join(', '));
