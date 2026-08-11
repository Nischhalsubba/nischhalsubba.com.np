/**
 * @fileoverview scripts/finalize-signal-reference-visual.cjs
 * Purpose: Apply the finalize signal reference visual production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/finalize-signal-reference-visual-v18-core.cjs
 * - scripts/finalize-signal-story-v23.cjs
 * - scripts/finalize-signal-typography-v24.cjs
 * - scripts/build-dist.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'assets', 'images', 'hero-original-v19.parts');
const temporaryTargets = ['part-01.b64', 'part-02.b64'];
const originals = new Map(temporaryTargets.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `name`. Side effects: reads filesystem state. Returns: computed value consumed by the enclosing operation. */ (name) => {
  const file = path.join(sourceDir, name);
  return [name, fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null];
}));

/**
 * Function contract: restore
 * Purpose: Apply module behavior consistently while preserving the surrounding finalize signal reference visual repository tool contract.
 * Inputs: `targetName`: input consumed by this operation; `chunkNames`: input consumed by this operation; `expectedBytes`: input consumed by this operation; `expectedHash`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function restore(targetName, chunkNames, expectedBytes, expectedHash) {
  const restored = chunkNames
    .map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `name`. Side effects: reads filesystem state. Returns: computed expression result consumed by the enclosing operation. */ (name) => fs.readFileSync(path.join(sourceDir, name), 'utf8').replace(/\s+/g, ''))
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
/**
 * Function contract: restoreTrackedSources
 * Purpose: Apply tracked sources consistently while preserving the surrounding finalize signal reference visual repository tool contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
