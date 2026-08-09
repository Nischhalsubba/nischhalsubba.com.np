const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'assets', 'images', 'hero-uploaded-dark.parts');
const chunkNames = ['part-00a.b64', 'part-00b.b64', 'part-00c.b64', 'part-00d.b64'];
const restored = Buffer.from(chunkNames
  .map((name) => fs.readFileSync(path.join(sourceDir, name), 'utf8').replace(/\s+/g, ''))
  .join(''), 'utf8');
const sourceHash = crypto.createHash('sha1')
  .update(Buffer.from(`blob ${restored.length}\0`, 'utf8'))
  .update(restored)
  .digest('hex');
if (restored.length !== 16000 || sourceHash !== '1f96ecf6774900e004bebc7bbcc27ddc2ad61a7c') {
  throw new Error(`[uploaded-hero-v18] Dark source chunk verification failed: ${restored.length} bytes, ${sourceHash}.`);
}
fs.writeFileSync(path.join(sourceDir, 'part-00.b64'), restored);
require('./finalize-signal-reference-visual-v18-core.cjs');
