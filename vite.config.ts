import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const page = (filePath: string) => path.resolve(__dirname, filePath);

const SITE = 'https://nischhalsubba.com.np';

const projectSeo: Record<string, {
  name: string;
  type: string;
  focus: string;
  role: string;
  related: [string, string][];
  faqs: [string, string][];
}> = {
  '/project-yarsha.html': {
    name: 'Yarsha Web3 App',
    type: 'Web3 mobile app UX case study',
    focus: 'Mobile Web3 messaging, wallet interaction, blinks, transfers, and transaction review clarity.',
    role: 'Product design for Web3 mobile flows, with emphasis on understandable wallet actions and trust-focused microcopy.',
    related: [['Web3 UX service', '/web3-ux-designer.html'], ['Web3 UX article', '/blog/blog-web3-products.html'], ['Mokshya.io case study', '/project-mokshya.html']],
    faqs: [
      ['What is Yarsha?', 'Yarsha is a mobile-first Web3 messaging experience that combines chat, blinks, wallet interaction, and transfer review.'],
      ['What was Nischhal’s role in Yarsha?', 'Nischhal designed Web3 mobile app flows focused on messaging, wallet actions, transfers, transaction review, and trust-focused microcopy.'],
      ['What UX problem did Yarsha focus on?', 'The design focused on making wallet and transfer actions easier to understand before users commit to sensitive Web3 actions.'],
      ['Why is Yarsha relevant to Web3 UX?', 'Yarsha connects messaging, wallet actions, transaction review, and status feedback in a mobile interface where trust and clarity are important.']
    ]
  },
  '/project-mokshya.html': {
    name: 'Mokshya.io',
    type: 'Web3 protocol website UX case study',
    focus: 'Web3 protocol website clarity, developer-facing storytelling, and product explanation.',
    role: 'Website design focused on hierarchy, positioning, trust, and technical explanation for a Web3 protocol product.',
    related: [['Web3 UX service', '/web3-ux-designer.html'], ['Yarsha case study', '/project-yarsha.html'], ['Web3 UX article', '/blog/blog-web3-products.html']],
    faqs: [
      ['What is Mokshya.io?', 'Mokshya.io is a Web3 protocol website project focused on clearer product explanation and developer-facing storytelling.'],
      ['What was Nischhal’s role in Mokshya.io?', 'Nischhal designed the website experience with a focus on hierarchy, trust, and clearer Web3 product communication.'],
      ['What UX challenge did the website solve?', 'The page structure helped translate a technical Web3 product into clearer sections, navigation, and calls to action.'],
      ['Why is Mokshya relevant to Web3 website UX?', 'It shows how a protocol website needs both technical credibility and simple product explanation.']
    ]
  },
  '/project-hamro-idea.html': {
    name: 'Hamro Idea',
    type: 'Software studio website and brand case study',
    focus: 'Software studio rebrand, service clarity, SEO structure, and static website implementation.',
    role: 'Brand direction, content structure, website UI, and static front-end implementation for a Nepal-based software company.',
    related: [['Website UX service', '/website-ux-design.html'], ['Service website article', '/blog/blog-service-websites.html'], ['Product Design Nepal', '/product-design-nepal.html']],
    faqs: [
      ['What is Hamro Idea?', 'Hamro Idea is a Nepal-based software development company website and rebrand project.'],
      ['What was Nischhal’s role in Hamro Idea?', 'Nischhal worked on brand direction, positioning, website design, content structure, and static front-end implementation.'],
      ['What did the redesign focus on?', 'The redesign focused on clearer service communication, SEO-friendly structure, project presentation, and conversion paths.'],
      ['Why is Hamro Idea relevant to website UX?', 'It shows how a software company website can explain services, process, credibility, and next steps more clearly.']
    ]
  },
  '/project-morajaa.html': {
    name: 'Morajaa',
    type: 'B2B consulting website UX case study',
    focus: 'B2B consulting website UX, service pages, sector pages, and segmented lead collection.',
    role: 'UX and content structure for service pages, sector pages, and guided lead flows for a consulting website.',
    related: [['Website UX service', '/website-ux-design.html'], ['Service website article', '/blog/blog-service-websites.html'], ['Hamro Idea case study', '/project-hamro-idea.html']],
    faqs: [
      ['What is Morajaa?', 'Morajaa is a B2B consulting website project focused on services, sector pages, and segmented lead collection.'],
      ['What was Nischhal’s role in Morajaa?', 'Nischhal designed service page structures, sector pages, and guided lead flows for the consulting website.'],
      ['What was the main UX challenge?', 'The challenge was presenting broad consulting services in a way that felt specific, premium, and easy to act on.'],
      ['What can Morajaa teach about B2B website UX?', 'It shows the value of clear service definitions, sector-specific pages, and inquiry flows that match visitor intent.']
    ]
  },
  '/project-pihub.html': {
    name: 'piHub',
    type: 'Fintech app UX case study',
    focus: 'Fintech workflows for investor, creditor, and admin experiences.',
    role: 'Fintech app UX around applications, verification, credit requests, and profile management.',
    related: [['Product Design Nepal', '/product-design-nepal.html'], ['UX audit service', '/ux-audit.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is piHub?', 'piHub is a fintech app experience involving investor, creditor, and admin workflows.'],
      ['What was Nischhal’s role in piHub?', 'Nischhal worked on fintech app experience around product applications, credit requests, verification, and profile workflows.'],
      ['What UX challenge did piHub involve?', 'The project required making financial tasks, verification states, and role-based workflows easier to understand.'],
      ['Why is piHub relevant to fintech UX?', 'It connects trust, clarity, form design, verification, and dashboard usability in a financial product context.']
    ]
  }
};

function makeProjectStaticSection(projectPath: string, data: typeof projectSeo[string]) {
  const faqHtml = data.faqs.map(([q, a]) => `<details class="impact-card"><summary>${q}</summary><p>${a}</p></details>`).join('');
  const relatedHtml = data.related.map(([label, url]) => `<a class="writing-item" href="${url}"><span class="w-date">Related</span><div class="w-info"><span class="w-title">${label}</span><span class="w-summary">Continue with topic-specific context for ${data.name}.</span></div><span class="w-arrow">→</span></a>`).join('');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE}/projects.html` },
          { '@type': 'ListItem', position: 3, name: data.name, item: `${SITE}${projectPath}` }
        ]
      },
      {
        '@type': 'CreativeWork',
        name: data.name,
        url: `${SITE}${projectPath}`,
        author: { '@type': 'Person', name: 'Nischhal Raj Subba', url: SITE },
        description: data.focus,
        about: [data.type, 'Product Design', 'UX Design', 'UI Design'],
        dateModified: '2026-04-29'
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
      }
    ]
  };

  return `
    <section class="section-container nrs-static-project-context">
      <p class="eyebrow">Static case study context</p>
      <h2 class="section-title">What this ${data.type} focuses on</h2>
      <div class="impact-summary-grid">
        <div class="impact-card"><span class="eyebrow">Focus</span><h3>${data.name}</h3><p>${data.focus}</p></div>
        <div class="impact-card"><span class="eyebrow">Role</span><h3>Truthful contribution</h3><p>${data.role}</p></div>
        <div class="impact-card"><span class="eyebrow">SEO note</span><h3>Subject-specific framing</h3><p>This section is rendered at build time so search engines and AI crawlers can read the project context without relying only on client-side JavaScript.</p></div>
      </div>
    </section>
    <section class="section-container nrs-static-related-links">
      <p class="eyebrow">Related paths</p>
      <h2 class="section-title">Continue with related work and writing</h2>
      <div class="writing-list">${relatedHtml}</div>
    </section>
    <section class="section-container nrs-static-faq">
      <p class="eyebrow">Frequently asked questions</p>
      <h2 class="section-title">Questions this case study answers</h2>
      <div style="display:grid;gap:16px;">${faqHtml}</div>
    </section>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  `;
}

/**
 * Build-time HTML polish.
 *
 * Heavy animation libraries are deferred so mobile rendering starts earlier.
 * Static project context/schema is injected for priority case studies so SEO does
 * not depend only on client-side JavaScript.
 */
const htmlEnhancementInjector = (): Plugin => ({
  name: 'nrs-html-enhancement-injector',
  transformIndexHtml(html, ctx) {
    let output = html
      .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/gsap\.min\.js"><\/script>/g, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>')
      .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/ScrollTrigger\.min\.js"><\/script>/g, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>');

    const projectPath = ctx.path;
    const projectData = projectSeo[projectPath];
    if (projectData && !output.includes('nrs-static-project-context')) {
      output = output.replace('</main>', `${makeProjectStaticSection(projectPath, projectData)}\n    </main>`);
    }

    if (!output.includes('/detail-navigation.js')) {
      output = output.replace('</body>', '  <script src="/detail-navigation.js?v=20260429" defer></script>\n  </body>');
    }

    if (!output.includes('/seo-enhancements.js')) {
      output = output.replace('</body>', '  <script src="/seo-enhancements.js?v=20260429" defer></script>\n  </body>');
    }

    return output;
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    build: {
      rollupOptions: {
        input: {
          index: page('index.html'),
          home: page('home.html'),
          homeV2: page('home-v2.html'),
          about: page('about.html'),
          contact: page('contact.html'),
          projects: page('projects.html'),
          blogLegacy: page('blog.html'),
          blogIndex: page('blog/index.html'),

          productDesignNepal: page('product-design-nepal.html'),
          web3UxDesigner: page('web3-ux-designer.html'),
          saasUxDesigner: page('saas-ux-designer.html'),
          websiteUxDesign: page('website-ux-design.html'),
          figmaDesignSystems: page('figma-design-systems.html'),
          uxAudit: page('ux-audit.html'),

          blogWeb3Products: page('blog/blog-web3-products.html'),
          blogGoodHandoff: page('blog/blog-good-handoff.html'),
          blogPortfolioProduct: page('blog/blog-portfolio-product.html'),
          blogServiceWebsites: page('blog/blog-service-websites.html'),
          blogGamingInterfaceClarity: page('blog/blog-gaming-interface-clarity.html'),
          blogDesignSystemsFrontEnd: page('blog/blog-design-systems-front-end.html'),

          projectYarsha: page('project-yarsha.html'),
          projectMokshya: page('project-mokshya.html'),
          projectHamroIdea: page('project-hamro-idea.html'),
          projectMorajaa: page('project-morajaa.html'),
          projectPihub: page('project-pihub.html'),
          projectMasteriyo: page('project-masteriyo.html'),
          projectZapp: page('project-zapp.html'),
          projectNeverwinterParser: page('project-neverwinter-parser.html'),
          projectOrkest: page('project-orkest.html'),
          projectSplashnode: page('project-splashnode.html'),
          projectGridLabs: page('project-grid-labs.html'),
          projectZakraFurniture: page('project-zakra-furniture.html'),
          projectDesignerex: page('project-designerex.html'),
          projectSassboilerplate: page('project-sassboilerplate.html')
        }
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    plugins: [htmlEnhancementInjector()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  };
});
