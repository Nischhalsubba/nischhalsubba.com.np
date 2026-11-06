/**
 * @fileoverview Independently captured public-site media.
 * Purpose: Render real current-site evidence separately from historical Figma contributions.
 * Responsibilities: Resolve reviewed captures, preserve full originals, and emit responsive images with provenance captions.
 * Execution context: Final portfolio installers and editorial renderer.
 * Connected files: src/content/public-site-captures.json; editorial/render.cjs; workspace-visuals.cjs.
 * Maintenance: Only add reviewed owner-authorized captures; never infer historical authorship from a current website.
 */
const captures = require('../src/content/public-site-captures.json');
/** Function contract: escape
 * Purpose: Encode capture attributes and captions. Inputs: text. Side effects: none. Returns: escaped text.
 */
function escape(text) { return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'); }
/** Function contract: forRoute
 * Purpose: Resolve a canonical project capture. Inputs: route or URL. Side effects: none. Returns: capture or undefined.
 */
function forRoute(href) {
 const route = new URL(href, 'https://portfolio.invalid').pathname.replace(/\.html$/, '');
 return captures.find(/** Callback contract: Match the canonical capture route. Inputs: record. Side effects: none. Returns: route equality. */ capture => capture.route === route);
}
/** Function contract: byId
 * Purpose: Resolve an explicitly selected source record without silently substituting a different image.
 * Inputs: source ID. Side effects: none. Returns: capture; throws for unknown IDs.
 */
function byId(id) { const capture = captures.find(/** Callback contract: Match the selected source identity. Inputs: record. Side effects: none. Returns: ID equality. */ record => record.id === id); if (!capture) throw Error('Unknown public source image: ' + id); return capture; }
/** Function contract: forPreview
 * Purpose: Keep references from displacing authored project previews when explicitly scoped to case context.
 * Inputs: canonical destination. Side effects: none. Returns: preview-approved record or undefined.
 */
function forPreview(href) { const capture = forRoute(href); return capture?.useAsPreview === false ? undefined : capture; }
/** Function contract: picture
 * Purpose: Preserve complete reviewed screen or component composition in responsive codecs. Inputs: capture and decorative flag. Side effects: none. Returns: picture markup.
 */
function picture(capture, decorative = false) {
 const largest = capture.variants.at(-1);
 const srcset = capture.variants.map(/** Callback contract: Render a responsive source descriptor. Inputs: variant. Side effects: none. Returns: URL and pixel width. */ variant => `${escape(variant.src)} ${variant.width}w`).join(', ');
 return `<picture><source type="image/webp" srcset="${srcset}" sizes="(max-width:720px) 100vw, 1000px"><img data-public-source-image="${escape(capture.id)}" src="${escape(capture.socialSrc)}" width="${largest.width}" height="${largest.height}" alt="${decorative ? '' : escape(capture.alt)}" loading="lazy" decoding="async"></picture>`;
}
/** Function contract: figure
 * Purpose: Show current-site evidence with an uncropped original and source link. Inputs: capture. Side effects: none. Returns: accessible figure markup.
 */
function figure(capture) {
 const width = Number(capture.displayMaxWidth);
 const frameStyle = Number.isFinite(width) && width > 0 ? ` style="max-width:${width}px;margin-inline:auto"` : '';
 return `<figure class="agent-case-cover" data-site-capture="${escape(capture.id)}"${frameStyle}>${picture(capture)}<figcaption>${escape(capture.caption)}</figcaption></figure><ul><li><a href="${escape(capture.fullOriginal)}" target="_blank" rel="noopener noreferrer">${escape(capture.originalLinkLabel || 'Open the complete original page capture')}</a></li><li><a href="${escape(capture.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(capture.sourceLinkLabel || 'Visit the public demo')}</a></li>${capture.referenceUrl ? `<li><a href="${escape(capture.referenceUrl)}" target="_blank" rel="noopener noreferrer">${escape(capture.referenceLabel || 'View the supporting source')}</a></li>` : ''}${capture.licenseUrl ? `<li><a href="${escape(capture.licenseUrl)}">Source license (${escape(capture.license)})</a></li>` : ''}${capture.noticeUrl ? `<li><a href="${escape(capture.noticeUrl)}">Source credit and processing notice</a></li>` : ''}</ul>`;
}
module.exports = { captures, forRoute, byId, forPreview, picture, figure };
