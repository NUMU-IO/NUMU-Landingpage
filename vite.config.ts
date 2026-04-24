import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

// CSP is delivered as an HTTP response header from nginx (see
// NUMU-api/docker/nginx/nginx.conf → `set $landing_csp`). Don't emit a
// <meta http-equiv="Content-Security-Policy"> here — two sources drift apart
// and browsers intersect them, so the stricter one wins and you lose headers
// like `frame-ancestors` that can only be set via HTTP header.

export default defineConfig(({ mode }) => ({
  server: {
    port: 3090,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://numueg.app',
        changeOrigin: true,
        cookieDomainRewrite: '',
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map((cookie: string) =>
                cookie
                  .replace(/;\s*Secure/gi, '')
                  .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
              );
            }
          });
        },
      },
    },
  },
  plugins: [
    react(),
    // Pre-compress assets with Brotli (best) and gzip (fallback)
    ...(mode === 'production' ? [
      viteCompression({ algorithm: 'brotliCompress', threshold: 1024 }),
      viteCompression({ algorithm: 'gzip', threshold: 1024 }),
    ] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['debugger'] : [],
    pure: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
  },
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@sentry')) return 'sentry';
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
}));
