import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const page = (filePath: string) => path.resolve(__dirname, filePath);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    build: {
      rollupOptions: {
        input: {
          index: page('index.html'),
          home: page('home.html'),
          about: page('about.html'),
          contact: page('contact.html'),
          projects: page('projects.html'),
          products: page('products.html'),
          blogLegacy: page('blog.html'),
          blogIndex: page('blog/index.html'),

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
    plugins: [],
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
