const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'assets', 'images', 'hero-original-v19.parts');

function restore(targetName, chunkNames, expectedBytes, expectedHash) {
  const restored = chunkNames
    .map((name) => fs.readFileSync(path.join(sourceDir, name), 'utf8').replace(/\s+/g, ''))
    .join('');
  const hash = crypto.createHash('sha256').update(restored, 'utf8').digest('hex');
  if (restored.length !== expectedBytes || hash !== expectedHash) {
    throw new Error(`[hero-photo-v19] ${targetName} reconstruction failed: ${restored.length} bytes, ${hash}.`);
  }
  fs.writeFileSync(path.join(sourceDir, targetName), restored, 'utf8');
}

restore('part-01.b64', ['part-01a.b64', 'part-01b.b64'], 10000, '2a5b8f04acf317ba11c6d4dd734ab11c7d225bdeb954acebe6a700afb3f246eb');
restore('part-02.b64', ['part-02a.b64', 'part-02b1.b64', 'part-02b2a.b64', 'part-02b2b.b64'], 10000, 'f98e9990e4acc7adaaa90e01f835d4166156423c0ecdf8e0ac61175c9cec9287');

require('./finalize-signal-reference-visual-v18-core.cjs');
