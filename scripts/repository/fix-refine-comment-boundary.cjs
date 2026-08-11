const fs = require('node:fs');
const path = require('node:path');

/**
 * @fileoverview Temporary repair for the one-shot semantic documentation refinement.
 * Purpose: Replace regex-based generated-comment removal with TypeScript lexical scanning so comment-like text inside strings, templates, and regex literals is never mistaken for documentation.
 * Responsibilities:
 * - Remove the temporary refinement script's generated-contract regex declaration.
 * - Inject scanner-based removal that recognizes only actual multiline comment tokens.
 * - Fail when the expected refinement function cannot be located.
 * Execution context: Node.js inside the temporary PR refinement workflow.
 * Connected files:
 * - scripts/repository/refine-code-documentation.cjs
 * Maintenance: Temporary helper; removed before the refinement commit is published.
 */

const target = path.resolve(__dirname, 'refine-code-documentation.cjs');

/**
 * Function contract: main
 * Purpose: Patch the temporary refinement script so generated function/callback contracts are removed from lexical comment tokens rather than source-text patterns.
 * Inputs: None; operates on the known temporary refinement script.
 * Side effects: Rewrites the temporary refinement script in the workflow checkout.
 * Returns: Undefined; throws when the expected declaration/function boundary is missing.
 */
function main() {
  let source = fs.readFileSync(target, 'utf8');
  source = source.replace(/^const GENERATED_CONTRACT_RE = .*;\n/m, '');

  const start = source.indexOf('function stripGeneratedDocumentation(file, source) {');
  const endMarker = '\n/**\n * Creates a detailed file header from final-tree ownership and dependency information.';
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) {
    throw new Error('Could not locate stripGeneratedDocumentation boundaries in refine-code-documentation.cjs');
  }

  const replacement = `function removeGeneratedFunctionContracts(file, source) {
  if (!FUNCTION_EXTENSIONS.has(path.extname(file).toLowerCase())) return source;

  const languageVariant = file.endsWith('.jsx') || file.endsWith('.tsx')
    ? ts.LanguageVariant.JSX
    : ts.LanguageVariant.Standard;
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, languageVariant, source);
  const ranges = [];

  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
    if (scanner.getToken() !== ts.SyntaxKind.MultiLineCommentTrivia) continue;
    const rangeStart = scanner.getTokenPos();
    const rangeEnd = scanner.getTextPos();
    const comment = source.slice(rangeStart, rangeEnd);
    if (comment.includes('Function contract:') || comment.includes('Callback contract:')) {
      let removeEnd = rangeEnd;
      while (removeEnd < source.length && /\\s/.test(source[removeEnd])) removeEnd += 1;
      ranges.push([rangeStart, removeEnd]);
    }
  }

  let output = source;
  for (const [rangeStart, rangeEnd] of ranges.reverse()) {
    output = output.slice(0, rangeStart) + output.slice(rangeEnd);
  }
  return output;
}

function stripGeneratedDocumentation(file, source) {
  let output = removeGeneratedFunctionContracts(file, source);
  const extension = path.extname(file).toLowerCase();

  if (extension === '.html') {
    output = output.replace(/^(<!DOCTYPE html>\\s*)?<!--[\\s\\S]{0,7000}?@fileoverview[\\s\\S]{0,7000}?-->\\s*/i, (whole, doctype) => doctype || '');
  } else {
    const headerMatch = output.slice(0, 12000).match(/\\/\\*\\*[\\s\\S]*?@fileoverview[\\s\\S]*?\\*\\/\\s*/);
    if (headerMatch && headerMatch.index !== undefined && headerMatch.index < 2000) {
      output = output.slice(0, headerMatch.index) + output.slice(headerMatch.index + headerMatch[0].length);
    }
  }

  return output;
}
`;

  source = source.slice(0, start) + replacement + source.slice(end);
  fs.writeFileSync(target, source, 'utf8');
  console.log('[code-doc-refine] Switched generated-contract cleanup to TypeScript lexical comment scanning.');
}

main();
