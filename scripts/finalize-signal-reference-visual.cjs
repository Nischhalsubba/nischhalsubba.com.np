/**
 * @fileoverview scripts/finalize-signal-reference-visual.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for finalize signal reference visual.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'assets', 'images', 'hero-original-v19.parts');
const temporaryTargets = ['part-01.b64', 'part-02.b64'];
const originals = new Map(temporaryTargets.map(/** Callback contract: Processes the callback step for temporary targets without leaking orchestration details to the caller. Inputs: name. Side effects: may read or write repository/filesystem state. Returns a value to the invoking API. */ (name) => {
  const file = path.join(sourceDir, name);
  return [name, fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null];
}));

/**
 * Function contract: restore
 * Purpose: Implements the restore responsibility for this module.
 * Inputs: targetName, chunkNames, expectedBytes, expectedHash.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function restore(targetName, chunkNames, expectedBytes, expectedHash) {
  const restored = chunkNames
    .map(/** Callback contract: Processes the callback step for chunk names without leaking orchestration details to the caller. Inputs: name. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (name) => fs.readFileSync(path.join(sourceDir, name), 'utf8').replace(/\s+/g, ''))
    .join('');
  const hash = crypto.createHash('sha256').update(restored, 'utf8').digest('hex');
  if (restored.length !== expectedBytes || hash !== expectedHash) {
    throw new Error(`[hero-photo-v19] ${targetName} reconstruction failed: ${restored.length} bytes, ${hash}.`);
  }
  fs.writeFileSync(path.join(sourceDir, targetName), restored, 'utf8');
}

/**
 * Function contract: restoreTrackedSources
 * Purpose: Implements the restore tracked sources responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function restoreTrackedSources() {
  for (const [name, original] of originals) {
    const file = path.join(sourceDir, name);
    if (original === null) {
      if (fs.existsSync(file)) fs.rmSync(file);
    } else {
      fs.writeFileSync(file, original, 'utf8');
    }
  }
}

try {
  restore('part-01.b64', ['part-01a.b64', 'part-01b.b64'], 10000, '2a5b8f04acf317ba11c6d4dd734ab11c7d225bdeb954acebe6a700afb3f246eb');
  restore('part-02.b64', ['part-02a.b64', 'part-02b1.b64', 'part-02b2a.b64', 'part-02b2b1.b64', 'part-02b2b2.b64'], 10000, 'f98e9990e4acc7adaaa90e01f835d4166156423c0ecdf8e0ac61175c9cec9287');

  require('./finalize-signal-reference-visual-v18-core.cjs');
  require('./finalize-signal-story-v23.cjs');
  require('./finalize-signal-typography-v24.cjs');
} finally {
  restoreTrackedSources();
}
