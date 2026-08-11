const { cleanRootSources } = require('./source-layout.cjs');

const count = cleanRootSources();
console.log(`[repository] Removed ${count} materialized compatibility source file(s) from repository root.`);
