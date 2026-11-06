#!/usr/bin/env bash
set -euo pipefail
cd /workspace/nischhalsubba.com.np
export PATH=/workspace/.onboarding-tools/node_modules/.bin:$PATH
export CHROME_PATH=/usr/bin/chromium
mkdir -p reports/portfolio-v6/lighthouse
for mode in mobile desktop; do
  for sample in 1 2 3; do
    args=()
    if [ "$mode" = desktop ]; then args+=(--preset=desktop); fi
    node site/node_modules/lighthouse/cli/index.js http://127.0.0.1:4173/ --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' --only-categories=performance --output=json --output-path="reports/portfolio-v6/lighthouse/${mode}-${sample}.json" --quiet "${args[@]}"
  done
done
