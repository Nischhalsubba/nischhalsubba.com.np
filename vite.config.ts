import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      build: {
        rollupOptions: {
          input: {
            index: path.resolve(__dirname, 'index.html'),
            about: path.resolve(__dirname, 'about.html'),
            blog: path.resolve(__dirname, 'blog.html'),
            blogDetail: path.resolve(__dirname, 'blog-detail.html'),
            blogWeb3Ux: path.resolve(__dirname, 'blog-web3-ux.html'),
            contact: path.resolve(__dirname, 'contact.html'),
            products: path.resolve(__dirname, 'products.html'),
            projects: path.resolve(__dirname, 'projects.html'),
            projectDetail: path.resolve(__dirname, 'project-detail.html'),
            projectYarsha: path.resolve(__dirname, 'project-yarsha.html'),
            projectJeweltrek: path.resolve(__dirname, 'project-jeweltrek.html'),
            projectArchive: path.resolve(__dirname, 'project-archive.html')
          }
        }
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
