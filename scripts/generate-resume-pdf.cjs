/**
 * @fileoverview scripts/generate-resume-pdf.cjs
 * Purpose: Generate or assemble generate resume pdf deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - docs/build-pipeline.md
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.resolve(__dirname, '..', 'dist', 'assets', 'resume.pdf');

const pages = [
  [
    'Nischhal Raj Subba',
    'Senior UI/Product Designer | Consumer Mobile Apps + Design Systems',
    'hinischalsubba@gmail.com | +9779842552348 | Lalitpur (Kathmandu Valley), Nepal',
    'https://nischhalsubba.com.np',
    '',
    'SUMMARY',
    'Senior UI/Product Designer with 6+ years of experience designing consumer mobile apps, product-led experiences, and scalable design systems. Strong in original visual direction, high-fidelity mobile UI, component systems, interactive prototypes, and developer-ready handoffs. Comfortable working directly with founders and product teams to turn early-stage ideas into polished, usable, and emotionally clear digital products.',
    '',
    'PROFILES',
    'Twitter: imnischhal | Instagram: nischhalsubba | Uxcel: Uxcel | Github: Nischhal | Dribbble: Nischhal | Behance: Nischhal',
    '',
    'SKILLS',
    'Product Design (UI/UX): flows, IA, interaction design, high-fidelity UI',
    'Design Systems: components, patterns, scalable consistency',
    'Enterprise & Dashboard UX: data-heavy screens, workflows, internal tools',
    'Prototyping: interactive, state-complete prototypes for validation',
    'Developer Handoff & Design QA: specs, build reviews, UI consistency',
    'Cross-functional Collaboration: PM/engineering alignment, reviews, iteration',
    '',
    'EDUCATION',
    'University of Wolverhampton - BA (Hons) Business Management, 2014-2018',
    'Completed a BA (Hons) Business Management with a focus on business fundamentals that support product thinking: research, planning, communication, and execution.',
    '',
    'AWARDS',
    'Ranked #1 Designer - Uxcel Global Rankings 2024, Dec 2024',
    '#1 Product Designer - Uxcel Global Rankings 2024, Dec 2024',
    'Top 10 Product Designer - Uxcel Global Rankings 2023, Dec 2023'
  ],
  [
    'PROJECTS',
    '',
    'MAS DataHub - Enterprise Data Integration Platform, Oct 2025 to Dec 2025',
    '- Designed workflow-heavy UX for enterprise data integration and automation.',
    '- Established layout patterns for complex screens: navigation, tables, panels, and system states.',
    '- Delivered high-fidelity prototypes and UI specifications to support consistent implementation.',
    'https://masdatahub.com/',
    '',
    'Yarsha - Web3 Chat + Transfers, Mar 2024 to Feb 2025',
    '- Designed messaging and transfer flows under Web3 constraints: wallet connection, trust, and clarity.',
    '- Defined key product rules and UX constraints, including developer/bot creation as web-only.',
    '- Supported store-readiness UX by improving permission guidance and purpose clarity.',
    'https://play.google.com/store/apps/details?id=com.mokshya.yarsha&pcampaignid=web_share',
    '',
    'Morajaa - Consulting Website + Lead Collection Flow, Jan 2025 to Jul 2025',
    '- Designed structured page architecture for service and sector detail pages using reusable sections.',
    '- Created a segmented Get in Touch experience to route visitors into the right inquiry path.',
    '- Wrote clear, action-driven microcopy aligned with government/procurement-focused positioning.',
    'https://www.morajaa.net/',
    '',
    'Zapp Today - Delivery + Scheduling Mobile App, Jun 2020 to Jan 2021',
    '- Owned the mobile app UX/UI end-to-end for iOS and Android.',
    '- Defined core user flow with client alignment, translating it into wireframes and final UI.',
    '- Conducted competitive benchmarking and remote research via Google Forms.',
    '- Took the product from wireframes to final UI through launch.',
    'https://zapp.today/',
    '',
    'CERTIFICATIONS',
    'UI Designer - Uxcel, Jan 23 2025',
    'Product Designer - Uxcel, Dec 1 2024',
    'UX Designer - Uxcel, Dec 2 2024',
    'UX Writer - Uxcel, Jan 21 2025',
    'UX Researcher - Uxcel, Dec 10 2024'
  ],
  [
    'EXPERIENCE',
    '',
    'Idealaya - Product Designer, Remote/Kathmandu, Aug 2025 to Dec 2025',
    '- Led UI/UX for enterprise web software, prioritizing clarity, consistency, and scalable patterns.',
    '- Delivered high-fidelity prototypes and implementation-ready UI specifications for web experiences.',
    '- Built and maintained a design system to standardize components and improve cross-screen consistency.',
    'https://www.idealaya.com/',
    '',
    'Mokshya Protocol - Product Designer, Remote/Lalitpur, Mar 2024 to Jul 2025',
    '- Designed Web3 UI for a decentralized product, balancing usability with Web3-native interactions.',
    '- Built interactive prototypes for key workflows and validation-focused flows to reduce ambiguity.',
    '- Iterated based on feedback to improve usability and support retention-focused improvements.',
    'http://mokshya.io/',
    '',
    'Tegzy - Lead User Experience Designer, Remote/Australia, Feb 2023 to Nov 2023',
    '- Built and scaled a design system to improve dev/design handoff quality and designer onboarding.',
    '- Standardized reusable components and UX patterns to increase consistency across screens.',
    'http://tegzy.com.au/',
    '',
    'ESR Tech - Senior UI/UX Designer, Remote/Kathmandu, Oct 2021 to Feb 2023',
    '- Designed dashboard UX for an internal tool with a focus on usability and information clarity.',
    '- Contributed to product work, including Jeweltrek and the ESR Tech website.',
    'https://esrtech.io/',
    '',
    'ThemeGrill - Senior UI/UX Designer, Remote/Kathmandu, Apr 2021 to Sep 2021',
    '- Developed reusable UI components to improve consistency and design efficiency.',
    '- Designed interactive prototypes to test and refine concepts before implementation.',
    'https://themegrill.com/'
  ],
  [
    'EXPERIENCE CONTINUED',
    '',
    'Gurzu - UI/UX Designer, Onsite/Lalitpur, Jul 2019 to Jan 2021',
    '- Worked with clients to align UX/UI work with business objectives and priorities.',
    '- Designed and prototyped new product ideas to accelerate early testing and validation.',
    '- Improved existing interfaces to enhance usability and efficiency.',
    'https://gurzu.com/',
    '',
    'Diagonal Softwares - User Experience Designer, Part-time/Germany, Apr 2019 to Sep 2020',
    '- Designed interfaces aligned with brand identity and market needs.',
    '- Collaborated cross-functionally to deliver cohesive end-to-end experiences.',
    'http://diagonal.software/',
    '',
    'REFERENCES',
    'Nitesh Raj Khanal - Full Stack & Mobile Developer | MERN | TypeScript | Next.js | React Native | SwiftUI | Web3',
    'https://www.neetesh.me/',
    '',
    'Axmin Shrestha - Senior Full-Stack Software Engineer | Typescript | React.js/Next.js',
    '',
    'Nirajan Dahal - Product Manager | Project Manager | Scrum Master',
    'https://www.linkedin.com/in/nirajandahal/',
    '',
    'LANGUAGES',
    'English - Professional working proficiency',
    'Nepali - Native'
  ]
];

/**
 * Function contract: escapePdfText
 * Purpose: Implement the escape pdf text responsibility owned by the generate resume pdf repository tool.
 * Inputs: `text`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function escapePdfText(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Function contract: wrapLine
 * Purpose: Implement the wrap line responsibility owned by the generate resume pdf repository tool.
 * Inputs: `text`: input consumed by this operation; `maxChars`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Array containing the values selected or transformed by this function.
 */
function wrapLine(text, maxChars = 92) {
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }

  if (line) lines.push(line);
  return lines;
}

/**
 * Function contract: buildPageContent
 * Purpose: Creates build page content from the supplied inputs and repository state.
 * Inputs: lines, pageIndex.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: buildPageContent
 * Purpose: Build page content from the supplied inputs in the form expected by downstream generate resume pdf repository tool consumers.
 * Inputs: `lines`: input consumed by this operation; `pageIndex`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function buildPageContent(lines, pageIndex) {
  let y = 780;
  const commands = ['BT', '/F1 10 Tf', '1 0 0 1 54 780 Tm', '14 TL'];

  for (const rawLine of lines) {
    const isTitle = pageIndex === 0 && rawLine === 'Nischhal Raj Subba';
    const isHeading = rawLine === rawLine.toUpperCase() && rawLine.trim() && rawLine.length < 28;
    const wrapped = rawLine ? wrapLine(rawLine, isTitle ? 50 : 92) : [''];

    for (const line of wrapped) {
      if (isTitle) commands.push('/F2 22 Tf');
      else if (isHeading) commands.push('/F2 11 Tf');
      else commands.push('/F1 10 Tf');

      commands.push(`1 0 0 1 54 ${y} Tm`);
      commands.push(`(${escapePdfText(line)}) Tj`);
      y -= isTitle ? 24 : isHeading ? 18 : 14;
    }
  }

  commands.push('ET');
  return commands.join('\n');
}

/**
 * Function contract: createPdf
 * Purpose: Creates create pdf from the supplied inputs and repository state.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: createPdf
 * Purpose: Build pdf from the supplied inputs in the form expected by downstream generate resume pdf repository tool consumers.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function createPdf() {
  const objects = [];
  /**
   * Function contract: add
   * Purpose: Implements the add responsibility for this module.
   * Inputs: body.
   * Side effects: no obvious external side effect beyond invoked dependencies.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: add
   * Purpose: Implement the add responsibility owned by the generate resume pdf repository tool.
   * Inputs: `body`: input consumed by this operation
   * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
   * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
   */
  const add = (body) => {
    objects.push(body);
    return objects.length;
  };

  const pageRefs = [];
  const fontRegular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const fontBold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  for (let index = 0; index < pages.length; index += 1) {
    const content = buildPageContent(pages[index], index);
    const contentRef = add(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
    const pageRef = add(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentRef} 0 R >>`);
    pageRefs.push(pageRef);
  }

  const pagesRef = add(`<< /Type /Pages /Kids [${pageRefs.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `ref`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (ref) => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`);
  const catalogRef = add(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);

  for (const pageRef of pageRefs) {
    objects[pageRef - 1] = objects[pageRef - 1].replace('/Parent 0 0 R', `/Parent ${pagesRef} 0 R`);
  }

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogRef} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return pdf;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, createPdf(), 'binary');
console.log(`Generated resume PDF at ${path.relative(path.resolve(__dirname, '..'), outputPath)}`);
