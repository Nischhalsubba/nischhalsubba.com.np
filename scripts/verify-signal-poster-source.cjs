const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const partsDir = path.join(root, 'assets', 'images', 'signal-demo-poster-v4.parts');
const EXPECTED_POSTER_BYTES = 65112;
const EXPECTED_POSTER_SHA256 = '0ad9e8d745adb38217dd9c148860e27ef8d118531fd31d96362ce0987513bae6';
const EXPECTED_PARTS = [
  ['part-00.b64part', 20000, '869a076d3b463d2823fca6d0073cfa2eeaf8ba61aacfb26ea9c51de739074d96'],
  ['part-01a.b64part', 5000, 'cc254ea7188655a80fb7bec8ee5306bddb4a81e5c95bec5b1965703059c97cea'],
  ['part-01b.b64part', 5000, '176038e88f3f2ea45bf8237c6d4ee2a8d9104f223af8fb55c4db1140f33ab279'],
  ['part-01c.b64part', 5000, 'dd21a44ff88e972eadaf954f7d6af38febd5b14e2a00d8b8d96cf6ea9cc2cf0e'],
  ['part-01d.b64part', 5000, 'ccf74dc825122fe9d1384ce5d541a6df9e30ab6d0a565b15afb0b7190e641d58'],
  ['part-02.b64part', 20000, '0867cb199892652ad88595dbda25495b676098aa171263dea2726d85ed5538ac'],
  ['part-03a.b64part', 5000, '0bbbf59bfc74bb919de9e9573c38f440d98cacf3f4cf689e02f3b82eb1731463'],
  ['part-03b.b64part', 5000, 'cc7331f1330dc36cef196c2c516d3d72492b9542f1540bc493e9a27732775d7e'],
  ['part-03c.b64part', 5000, '86b4085bf87a3f104508f484f0dfde87c264463497d1da916a9a0bc9cc229861'],
  ['part-03d.b64part', 5000, '4322b74815e268bdc3d24e16a14f6a6ef950cbde173c413eee259dcc3c40f60b'],
  ['part-04a.b64part', 5000, 'cdb80dc1ae132b463a9c0472680cc4288f2819e0ee1e4b1bc800b66a73e24848'],
  ['part-04b.b64part', 1816, '03750b04c44530bddc52e676252573c1f2aeae8209d2be4d8883e4f1c04c7a7b'],
];

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

if (!fs.existsSync(partsDir)) {
  throw new Error(`[signal-source-preflight] Missing ${partsDir}`);
}

const discovered = fs.readdirSync(partsDir)
  .filter((name) => name.endsWith('.b64part'))
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
const expectedNames = EXPECTED_PARTS.map(([name]) => name)
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
if (JSON.stringify(discovered) !== JSON.stringify(expectedNames)) {
  throw new Error(`[signal-source-preflight] Segment set mismatch. Expected ${expectedNames.join(', ')}, found ${discovered.join(', ')}.`);
}

const encoded = EXPECTED_PARTS.map(([name, expectedChars, expectedHash]) => {
  const value = fs.readFileSync(path.join(partsDir, name), 'utf8').replace(/\s+/g, '');
  if (value.length !== expectedChars) {
    throw new Error(`[signal-source-preflight] ${name} character count mismatch. Expected ${expectedChars}, found ${value.length}.`);
  }
  const actualHash = sha256(value);
  if (actualHash !== expectedHash) {
    throw new Error(`[signal-source-preflight] ${name} checksum mismatch. Expected ${expectedHash}, found ${actualHash}.`);
  }
  return value;
}).join('');

const poster = Buffer.from(encoded, 'base64');
if (poster.length !== EXPECTED_POSTER_BYTES) {
  throw new Error(`[signal-source-preflight] Poster byte count mismatch. Expected ${EXPECTED_POSTER_BYTES}, found ${poster.length}.`);
}
const posterHash = sha256(poster);
if (posterHash !== EXPECTED_POSTER_SHA256) {
  throw new Error(`[signal-source-preflight] Poster checksum mismatch. Expected ${EXPECTED_POSTER_SHA256}, found ${posterHash}.`);
}
if (poster.subarray(0, 4).toString('ascii') !== 'RIFF' || poster.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('[signal-source-preflight] Verified bytes are not a WebP container.');
}

console.log(`[signal-source-preflight] Verified ${EXPECTED_PARTS.length} segments, ${poster.length} bytes, SHA-256 ${posterHash}.`);
