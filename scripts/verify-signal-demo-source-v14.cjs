const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const SOURCE_PATH = path.join(ROOT, 'assets', 'images', 'signal-demo-poster.webp.b64');
const EXPECTED_GIT_BLOB_SHA1 = '0bcb8cd7a4a22584eac808909d1465f0f3922b0b';
const EXPECTED_SOURCE_BYTES = 114860;
const EXPECTED_WEBP_BYTES = 86144;
const EXPECTED_WIDTH = 760;
const EXPECTED_HEIGHT = 950;

function gitBlobSha1(buffer) {
  return crypto.createHash('sha1')
    .update(Buffer.from(`blob ${buffer.length}\0`, 'utf8'))
    .update(buffer)
    .digest('hex');
}

function readVp8Dimensions(buffer) {
  const signature = Buffer.from([0x9d, 0x01, 0x2a]);
  const index = buffer.indexOf(signature);
  if (index < 0 || index + 7 > buffer.length) {
    throw new Error('[signal-demo-v14] VP8 frame signature not found.');
  }
  return {
    width: buffer.readUInt16LE(index + 3) & 0x3fff,
    height: buffer.readUInt16LE(index + 5) & 0x3fff,
  };
}

function verifySource() {
  if (!fs.existsSync(SOURCE_PATH)) {
    throw new Error(`[signal-demo-v14] Missing exact demo source: ${SOURCE_PATH}`);
  }

  const raw = fs.readFileSync(SOURCE_PATH);
  if (raw.length !== EXPECTED_SOURCE_BYTES) {
    throw new Error(`[signal-demo-v14] Source byte count mismatch. Expected ${EXPECTED_SOURCE_BYTES}, found ${raw.length}.`);
  }

  const gitHash = gitBlobSha1(raw);
  if (gitHash !== EXPECTED_GIT_BLOB_SHA1) {
    throw new Error(`[signal-demo-v14] Source Git blob mismatch. Expected ${EXPECTED_GIT_BLOB_SHA1}, found ${gitHash}.`);
  }

  const encoded = raw.toString('utf8');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
    throw new Error('[signal-demo-v14] Exact demo source is not canonical Base64 text.');
  }

  const poster = Buffer.from(encoded, 'base64');
  if (poster.length !== EXPECTED_WEBP_BYTES) {
    throw new Error(`[signal-demo-v14] Poster byte count mismatch. Expected ${EXPECTED_WEBP_BYTES}, found ${poster.length}.`);
  }
  if (poster.subarray(0, 4).toString('ascii') !== 'RIFF' || poster.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error('[signal-demo-v14] Exact demo source does not decode to a WebP container.');
  }

  const { width, height } = readVp8Dimensions(poster);
  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    throw new Error(`[signal-demo-v14] Poster dimensions mismatch. Expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}, found ${width}x${height}.`);
  }

  return { poster, gitHash, width, height };
}

if (require.main === module) {
  const result = verifySource();
  console.log(`[signal-demo-v14] Verified exact demo source: Git blob ${result.gitHash}, ${result.poster.length} bytes, ${result.width}x${result.height}.`);
}

module.exports = { verifySource };
