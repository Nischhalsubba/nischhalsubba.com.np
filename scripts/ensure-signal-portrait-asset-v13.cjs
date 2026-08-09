// Legacy build-stage compatibility shim.
// The production hero installs the uploaded Signal over Noise demo through the pure-code v16 installer.
// Keep this filename because scripts/build-dist.cjs still calls the historical v13 stage.
require('./ensure-signal-demo-hero-v16.cjs');
