import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const page = (filePath: string) => path.resolve(__dirname, filePath);

/**
 * Build-time HTML polish.
 *
 * Keep runtime scripts lean:
 * - detail-navigation.js: only previous/next + footer fallback on detail pages.
 * - seo-enhancements.js: schema/FAQ/performance safety layer while static pages mature.
 *
 * Heavy animation libraries are deferred so mobile rendering starts earlier.
 */
const htmlEnhancementInjector = (): Plugin => ({
  name: 'nrs-html-enhancement-injector',
  transformIndexHtml(html) {
    let output = html
      .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/gsap\.min\.js"><\/script>/g, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>')
      .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/ScrollTrigger\.min\.js"><\/script>/g, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>');

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
