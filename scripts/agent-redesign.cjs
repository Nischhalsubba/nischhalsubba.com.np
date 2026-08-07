const fs = require('node:fs');
const path = require('node:path');
const parts = [1, 2, 3].map((part) => path.join(__dirname, `agent-redesign-part-${part}.cjsfrag`));
if (parts.some((file) => !fs.existsSync(file))) throw new Error('[agent-redesign] source fragments are missing');
const source = parts.map((file) => fs.readFileSync(file, 'utf8')).join('');
new Function('require', '__dirname', '__filename', source)(require, __dirname, __filename);
