const { materializeRootSources } = require('./source-layout.cjs');

const count = materializeRootSources();
console.log(`[repository] Materialized ${count} compatibility source file(s) at repository root.`);
