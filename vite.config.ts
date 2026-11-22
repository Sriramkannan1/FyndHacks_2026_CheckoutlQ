import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Plugin to serve live evidence reports directly in dev mode and copy during production build
const serveEvidencePlugin = (): Plugin => ({
  name: 'serve-evidence-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/evidence/')) {
        const cleanPath = req.url.split('?')[0].replace(/^\/evidence\//, '');
        const targetPath = path.resolve(__dirname, 'evidence', cleanPath);
        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
          const ext = path.extname(targetPath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            '.json': 'application/json; charset=utf-8',
            '.html': 'text/html; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.js': 'application/javascript',
            '.css': 'text/css',
          };
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          return fs.createReadStream(targetPath).pipe(res);
        }
      }
      next();
    });
  },
  closeBundle() {
    const srcDir = path.resolve(__dirname, 'evidence');
    const destDir = path.resolve(__dirname, 'dist/evidence');
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, destDir, { recursive: true, force: true });
    }
  },
});

export default defineConfig({
  plugins: [react(), serveEvidencePlugin()],
  root: 'frontend',
  publicDir: path.resolve(__dirname, 'frontend/public'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },
});
