/**
 * @fileoverview scripts/generate-resume-pdf-v2.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for generate resume pdf v2.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const profile = JSON.parse(fs.readFileSync(path.join(root, 'config', 'professional-profile.json'), 'utf8'));
const outputPath = path.join(root, 'dist', 'assets', 'resume.pdf');

const lines = [];
/**
 * Function contract: add
 * Purpose: Implements the add responsibility for this module.
 * Inputs: items.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
const add = (...items) => lines.push(...items);
add(
  profile.name,
  profile.title,
  `${profile.location} | Remote-friendly`,
  `${profile.email} | ${profile.website}`,
  '',
  'SUMMARY',
  profile.summary,
  '',
  'CORE SKILLS',
  ...profile.skills.map(/** Callback contract: Processes the callback step for profile.skills without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => `- ${item}`),
  '',
  'SELECTED WORK',
  ...profile.projects.flatMap(/** Callback contract: Processes the callback step for profile.projects without leaking orchestration details to the caller. Inputs: project. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (project) => [project.name, `- ${project.summary}`]),
  '',
  'EXPERIENCE',
  ...profile.experience.flatMap(/** Callback contract: Processes the callback step for profile.experience without leaking orchestration details to the caller. Inputs: job. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (job) => [
    `${job.company} | ${job.role} | ${job.dates}`,
    `- ${job.summary}`,
  ]),
  '',
  'EDUCATION',
  ...profile.education,
  '',
  'CERTIFICATIONS',
  ...profile.certifications,
  '',
  'PROFILES',
  `LinkedIn: ${profile.profiles.linkedin}`,
  `Behance: ${profile.profiles.behance}`,
  `GitHub: ${profile.profiles.github}`,
  `Uxcel: ${profile.profiles.uxcel}`,
);

/**
 * Function contract: wrapLine
 * Purpose: Implements the wrap line responsibility for this module.
 * Inputs: text, maxChars.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function wrapLine(text, maxChars = 92) {
  const value = String(text || '');
  if (!value) return [''];
  if (value.length <= maxChars) return [value];
  const words = value.split(/\s+/);
  const result = [];
  let current = '';
  for (const word of words) {
    const next = `${current} ${word}`.trim();
    if (next.length > maxChars && current) {
      result.push(current);
      current = word;
    } else current = next;
  }
  if (current) result.push(current);
  return result;
}

/**
 * Function contract: escapePdfText
 * Purpose: Implements the escape pdf text responsibility for this module.
 * Inputs: text.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function escapePdfText(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Function contract: isHeading
 * Purpose: Implements the is heading responsibility for this module.
 * Inputs: line.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function isHeading(line) {
  return ['SUMMARY', 'CORE SKILLS', 'SELECTED WORK', 'EXPERIENCE', 'EDUCATION', 'CERTIFICATIONS', 'PROFILES'].includes(line);
}

/**
 * Function contract: paginate
 * Purpose: Implements the paginate responsibility for this module.
 * Inputs: source.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function paginate(source) {
  const pages = [];
  let page = [];
  let used = 0;
  const pageBudget = 47;
  source.forEach(/** Callback contract: Processes the callback step for source without leaking orchestration details to the caller. Inputs: line, index. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (line, index) => {
    const wrapped = wrapLine(line, index === 0 ? 46 : 92);
    const cost = wrapped.length + (isHeading(line) ? 1 : 0);
    if (page.length && used + cost > pageBudget) {
      pages.push(page);
      page = [];
      used = 0;
    }
    page.push(line);
    used += cost;
  });
  if (page.length) pages.push(page);
  return pages;
}

/**
 * Function contract: buildPageContent
 * Purpose: Creates build page content from the supplied inputs and repository state.
 * Inputs: pageLines, pageIndex.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function buildPageContent(pageLines, pageIndex) {
  let y = 760;
  const commands = ['BT', '/F1 9.5 Tf', '13.2 TL'];
  for (let index = 0; index < pageLines.length; index += 1) {
    const raw = pageLines[index];
    const title = pageIndex === 0 && index === 0;
    const subtitle = pageIndex === 0 && index === 1;
    const heading = isHeading(raw);
    const wrapped = wrapLine(raw, title ? 46 : 92);
    if (heading && y < 735) y -= 5;
    for (const line of wrapped) {
      if (title) commands.push('/F2 22 Tf');
      else if (subtitle) commands.push('/F2 12 Tf');
      else if (heading) commands.push('/F2 10.5 Tf');
      else if (raw && !raw.startsWith('-') && !raw.includes('http') && raw.length < 72 && /\|/.test(raw)) commands.push('/F2 9.5 Tf');
      else commands.push('/F1 9.5 Tf');
      commands.push(`1 0 0 1 50 ${y} Tm`);
      commands.push(`(${escapePdfText(line)}) Tj`);
      y -= title ? 26 : subtitle ? 18 : heading ? 17 : 13.2;
    }
    if (!raw) y -= 4;
  }
  commands.push('ET');
  return commands.join('\n');
}

/**
 * Function contract: createPdf
 * Purpose: Creates create pdf from the supplied inputs and repository state.
 * Inputs: pages.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function createPdf(pages) {
  const objects = [];
  /**
   * Function contract: push
   * Purpose: Implements the push responsibility for this module.
   * Inputs: body.
   * Side effects: no obvious external side effect beyond invoked dependencies.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  const push = (body) => { objects.push(body); return objects.length; };
  const regular = push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const bold = push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageRefs = [];
  for (let i = 0; i < pages.length; i += 1) {
    const content = buildPageContent(pages[i], i);
    const contentRef = push(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
    const pageRef = push(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> >> /Contents ${contentRef} 0 R >>`);
    pageRefs.push(pageRef);
  }
  const pagesRef = push(`<< /Type /Pages /Kids [${pageRefs.map(/** Callback contract: Processes the callback step for page refs without leaking orchestration details to the caller. Inputs: ref. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (ref) => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`);
  const catalogRef = push(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);
  for (const ref of pageRefs) objects[ref - 1] = objects[ref - 1].replace('/Parent 0 0 R', `/Parent ${pagesRef} 0 R`);
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogRef} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return pdf;
}

const pages = paginate(lines);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, createPdf(pages), 'binary');
console.log(`[resume-v2] Generated aligned ${pages.length}-page resume from config/professional-profile.json.`);
