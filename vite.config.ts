import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Injects Content-Security-Policy meta tag only in production builds.
 * In dev mode, Vite's HMR requires inline scripts and cross-port API calls which CSP would block.
 */
function vitePluginCSP(): Plugin {
  return {
    name: 'numu-csp',
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html; // skip in dev
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
          // Strip Secure flag from cookies so they work on http://localhost
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
  plugins: [react(), vitePluginCSP()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['debugger'] : [],
    pure: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
  },
}));
