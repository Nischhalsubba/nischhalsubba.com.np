const { syncRootSources } = require('./source-layout.cjs');

const count = syncRootSources();
console.log(`[repository] Synced ${count} changed compatibility source file(s) back into src/.`);
