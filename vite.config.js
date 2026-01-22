import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';

// Plugin to copy CSS files to dist (preserves paths for legacy references)
function copyCssPlugin() {
  return {
    name: 'copy-css',
    writeBundle() {
      const cssDir = resolve(__dirname, 'src/css');
      const cssDestDir = resolve(__dirname, 'dist/src/css');

      if (!existsSync(cssDestDir)) {
        mkdirSync(cssDestDir, { recursive: true });
      }

      if (existsSync(cssDir)) {
        readdirSync(cssDir).forEach((file) => {
          if (file.endsWith('.css')) {
            copyFileSync(resolve(cssDir, file), resolve(cssDestDir, file));
          }
        });
      }
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
  plugins: [copyCssPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@js': resolve(__dirname, 'src/js'),
      '@css': resolve(__dirname, 'src/css'),
      '@data': resolve(__dirname, 'src/data'),
    },
  },
});
