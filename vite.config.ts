import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

/**
 * Injects Content-Security-Policy meta tag only in production builds.
 */
function vitePluginCSP(): Plugin {
  return {
    name: 'numu-csp',
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html;
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'Content-Security-Policy',
              content: [
                "default-src 'self'",
                "script-src 'self'",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "font-src 'self' https://fonts.gstatic.com",
                "img-src 'self' data: blob: https: https://numueg.app",
                "connect-src 'self' https://numueg.app https://*.numueg.app https://*.sentry.io https://*.ingest.sentry.io",
                "worker-src 'self' blob:",
              ].join('; ') + ';',
            },
            injectTo: 'head',
          },
        ],
      };
    },
  };
}

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
    vitePluginCSP(),
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
          if (id.includes('node_modules/matter-js')) return 'matter';
          if (id.includes('node_modules/@sentry')) return 'sentry';
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
}));
