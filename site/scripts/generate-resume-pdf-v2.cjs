/**
 * @fileoverview scripts/generate-resume-pdf-v2.cjs
 * Purpose: Generate or assemble generate resume pdf v2 deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const profile = JSON.parse(fs.readFileSync(path.join(root, 'config', 'professional-profile.json'), 'utf8'));
const outputPath = path.join(root, 'dist', 'assets', 'resume.pdf');

const lines = [];

/**
 * Function contract: add
 * Purpose: Implement the add responsibility owned by the generate resume pdf v2 repository tool.
 * Inputs: `items`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed expression result consumed by the enclosing operation.
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
  ...profile.skills.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (item) => `- ${item}`),
  '',
  'SELECTED WORK',
  ...profile.projects.flatMap(   /** Callback contract: Perform the local callback step required by the immediately enclosing generate resume pdf v2 repository tool operation. Inputs: `project` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (project) => [project.name, `- ${project.summary}`]),
  '',
  'EXPERIENCE',
  ...profile.experience.flatMap(   /** Callback contract: Perform the local callback step required by the immediately enclosing generate resume pdf v2 repository tool operation. Inputs: `job` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (job) => [
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
 * Purpose: Implement the wrap line responsibility owned by the generate resume pdf v2 repository tool.
 * Inputs: `text`, `maxChars`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Implement the escape pdf text responsibility owned by the generate resume pdf v2 repository tool.
 * Inputs: `text`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function escapePdfText(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}



/**
 * Function contract: isHeading
 * Purpose: Determine whether heading satisfies the condition represented by this generate resume pdf v2 repository tool.
 * Inputs: `line`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether heading satisfies the documented condition.
 */
function isHeading(line) {
  return ['SUMMARY', 'CORE SKILLS', 'SELECTED WORK', 'EXPERIENCE', 'EDUCATION', 'CERTIFICATIONS', 'PROFILES'].includes(line);
}



/**
 * Function contract: paginate
 * Purpose: Implement the paginate responsibility owned by the generate resume pdf v2 repository tool.
 * Inputs: `source`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function paginate(source) {
  const pages = [];
  let page = [];
  let used = 0;
  const pageBudget = 47;
  source.forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `line`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (line, index) => {
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
 * Purpose: Build page content from the supplied inputs in the form expected by downstream generate resume pdf v2 repository tool consumers.
 * Inputs: `pageLines`, `pageIndex`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Build pdf from the supplied inputs in the form expected by downstream generate resume pdf v2 repository tool consumers.
 * Inputs: `pages`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function createPdf(pages) {
  const objects = [];
  
  
  /**
   * Function contract: push
   * Purpose: Implement the push responsibility owned by the generate resume pdf v2 repository tool.
   * Inputs: `body`
   * Side effects: No direct external side effect beyond invoked dependencies.
   * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
  const pagesRef = push(`<< /Type /Pages /Kids [${pageRefs.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `ref` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (ref) => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`);
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
