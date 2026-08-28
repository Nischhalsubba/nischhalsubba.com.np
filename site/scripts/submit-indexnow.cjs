/**
 * @fileoverview scripts/submit-indexnow.cjs
 * Purpose: Notify IndexNow participants only after the canonical production host is live.
 * Responsibilities:
 * - Verify the public IndexNow key file before submitting any URLs.
 * - Read canonical URLs from the live sitemap instead of guessing routes.
 * - Submit one bounded batch to the global IndexNow endpoint.
 * - Fail clearly on invalid ownership, sitemap, or API responses so CI can surface diagnostics.
 * Execution context: GitHub Actions after production verification or a manual operator retry.
 * Connected files:
 * - config/search-discovery.json
 * - .github/workflows/indexnow.yml
 * - scripts/finalize-search-discovery-v31.cjs
 * Maintenance: Keep network submission out of the production build. IndexNow responses confirm receipt, not indexing or ranking.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'config', 'search-discovery.json'), 'utf8'));
const site = (process.argv[2] || config.site).replace(/\/$/, '');
const key = config.indexNow.key;
const keyUrl = `${site}/${key}.txt`;
const sitemapUrl = `${site}/sitemap.xml`;

/**
 * Function contract: decodeXml
 * Purpose: Decode the XML entities that may occur inside sitemap location values.
 * Inputs: `value` - XML text content.
 * Side effects: None.
 * Returns: Decoded URL string.
 */
function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/**
 * Function contract: getText
 * Purpose: Fetch a required public text resource with bounded network time.
 * Inputs: `url` - absolute URL.
 * Side effects: Performs an HTTPS request.
 * Returns: Response body text.
 */
async function getText(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'nischhalsubba-indexnow/1.0' } });
  if (!response.ok) throw new Error(`GET ${url} returned HTTP ${response.status}`);
  return response.text();
}

/**
 * Function contract: main
 * Purpose: Verify production ownership and submit canonical sitemap URLs to IndexNow.
 * Inputs: CLI production site URL or configured default.
 * Side effects: Performs live HTTPS requests and writes console diagnostics.
 * Returns: Promise resolved after an accepted IndexNow response.
 */
async function main() {
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) throw new Error('Configured IndexNow key has an invalid format');
  if (new URL(site).host !== new URL(config.site).host) throw new Error(`Refusing to submit unexpected host: ${site}`);

  const liveKey = (await getText(keyUrl)).trim();
  if (liveKey !== key) throw new Error(`IndexNow ownership check failed at ${keyUrl}`);

  const sitemap = await getText(sitemapUrl);
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map(
    /** Callback contract: Convert one sitemap location match into a decoded canonical URL. Inputs: `match` Side effects: None. Returns: Decoded absolute URL. */
    (match) => decodeXml(match[1].trim()),
  );
  const uniqueUrls = [...new Set(urls)];
  if (!uniqueUrls.length) throw new Error('Live sitemap contains no canonical URLs');
  if (uniqueUrls.length > 10000) throw new Error(`Live sitemap exceeds IndexNow batch limit: ${uniqueUrls.length}`);
  for (const url of uniqueUrls) {
    if (new URL(url).host !== new URL(site).host) throw new Error(`Sitemap URL belongs to another host: ${url}`);
    if (url.endsWith('.html')) throw new Error(`Sitemap exposes non-canonical .html URL: ${url}`);
  }

  const payload = {
    host: new URL(site).host,
    key,
    keyLocation: keyUrl,
    urlList: uniqueUrls,
  };
  const response = await fetch(config.indexNow.endpoint, {
    method: 'POST',
    signal: AbortSignal.timeout(20000),
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'nischhalsubba-indexnow/1.0',
    },
    body: JSON.stringify(payload),
  });

  if (![200, 202].includes(response.status)) {
    const body = (await response.text()).slice(0, 1000);
    throw new Error(`IndexNow returned HTTP ${response.status}${body ? `: ${body}` : ''}`);
  }
  console.log(`[indexnow] Submitted ${uniqueUrls.length} canonical URLs from ${sitemapUrl}; response HTTP ${response.status}.`);
}

main().catch(
  /** Callback contract: Report a failed ownership, sitemap, or IndexNow request and terminate CI with a failure code. Inputs: `error` Side effects: Writes stderr and exits process. Returns: Nothing. */
  (error) => {
    console.error(`[indexnow] ${error.message}`);
    process.exit(1);
  },
);
