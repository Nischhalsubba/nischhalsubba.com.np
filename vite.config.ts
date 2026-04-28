import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const page = (filePath: string) => path.resolve(__dirname, filePath);

const globalEnhancementInjector = (): Plugin => ({
  name: 'inject-global-enhancement-scripts',
  transformIndexHtml(html) {
    let output = html;
    if (!output.includes('/detail-navigation.js')) {
      output = output.replace('</body>', '  <script src="/detail-navigation.js?v=20260428" defer></script>\n  </body>');
    }
    if (!output.includes('/seo-enhancements.js')) {
      output = output.replace('</body>', '  <script src="/seo-enhancements.js?v=20260428" defer></script>\n  </body>');
    }
    if (!output.includes('/site-polish.js')) {
      output = output.replace('</body>', '  <script src="/site-polish.js?v=20260428" defer></script>\n  </body>');
    }
    if (!output.includes('/portfolio-improvements.js')) {
      output = output.replace('</body>', '  <script src="/portfolio-improvements.js?v=20260428" defer></script>\n  </body>');
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
          products: page('products.html'),
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
    plugins: [globalEnhancementInjector()],
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
