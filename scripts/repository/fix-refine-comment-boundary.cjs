const fs = require('node:fs');
const path = require('node:path');

/**
 * @fileoverview Temporary repair for the one-shot semantic documentation refinement.
 * Purpose: Restrict generated-contract removal to a single JSDoc block so imports/constants between the file header and first function are never consumed.
 * Responsibilities:
 * - Replace only the temporary refinement script's overly broad generated-contract regex.
 * - Fail if the expected declaration is absent so the migration cannot silently use an unknown refinement implementation.
 * Execution context: Node.js inside the temporary PR refinement workflow.
 * Connected files:
 * - scripts/repository/refine-code-documentation.cjs
 * Maintenance: Temporary helper; removed before the refinement commit is published.
 */

const target = path.resolve(__dirname, 'refine-code-documentation.cjs');

/**
 * Function contract: main
 * Purpose: Replace the broad cross-comment regex with a block-bounded expression that cannot cross a closing `*/` marker.
 * Inputs: None; operates on the known temporary refinement script.
 * Side effects: Rewrites the temporary refinement script in the workflow checkout.
 * Returns: Undefined; throws when the expected declaration is missing.
 */
function main() {
  const beforePattern = /^const GENERATED_CONTRACT_RE = .*;$/m;
  let source = fs.readFileSync(target, 'utf8');
  if (!beforePattern.test(source)) {
    throw new Error('Could not locate GENERATED_CONTRACT_RE in refine-code-documentation.cjs');
  }

  const replacement = String.raw`const GENERATED_CONTRACT_RE = /\/\*\*(?:(?!\*\/)[\s\S])*(?:Function contract|Callback contract):(?:(?!\*\/)[\s\S])*\*\/\s*/g;`;
  source = source.replace(beforePattern, replacement);
  fs.writeFileSync(target, source, 'utf8');
  console.log('[code-doc-refine] Restricted generated-contract cleanup to individual JSDoc blocks.');
}

main();
