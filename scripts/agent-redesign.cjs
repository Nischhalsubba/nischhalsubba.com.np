const fs = require('node:fs');
const path = require('node:path');
const parts = [1, 2, 3].map((part) => path.join(__dirname, `agent-redesign-part-${part}.cjsfrag`));
if (parts.some((file) => !fs.existsSync(file))) throw new Error('[agent-redesign] source fragments are missing');
const source = parts.map((file) => fs.readFileSync(file, 'utf8')).join('');
new Function('require', '__dirname', '__filename', source)(require, __dirname, __filename);

const repositoryRoot = path.join(__dirname, '..');
const dist = path.join(repositoryRoot, 'dist');
const agentRuntimePath = path.join(dist, 'src', 'scripts', 'features', 'agent-portfolio.js');
const runtimeEntryPath = path.join(dist, 'script.js');
const compatStylePath = path.join(repositoryRoot, 'src', 'styles', 'agent-compat.cssfrag');
const distStylePath = path.join(dist, 'style.css');

if (!fs.existsSync(agentRuntimePath) || !fs.existsSync(runtimeEntryPath)) {
  throw new Error('[agent-redesign] copied runtime files are missing');
}

let agentRuntime = fs.readFileSync(agentRuntimePath, 'utf8');
agentRuntime = agentRuntime
  .replace(/\n  setupThemeToggle\(\);/, '')
  .replace(/\n  setupMobileNavigation\(\);/, '');
fs.writeFileSync(agentRuntimePath, agentRuntime, 'utf8');

fs.writeFileSync(runtimeEntryPath, "import './src/scripts/agent-main.js';\n", 'utf8');

if (!fs.existsSync(compatStylePath) || !fs.existsSync(distStylePath)) {
  throw new Error('[agent-redesign] compatibility stylesheet target is missing');
}
fs.appendFileSync(distStylePath, `\n${fs.readFileSync(compatStylePath, 'utf8')}\n`, 'utf8');
