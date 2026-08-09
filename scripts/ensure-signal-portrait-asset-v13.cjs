// Legacy build-stage compatibility shim.
// The production hero now installs the exact uploaded Signal over Noise demo through v14.
// Keep this filename because scripts/build-dist.cjs still calls the historical v13 stage.
require('./ensure-signal-demo-hero-v14.cjs');
