import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * SITE_BASE  the path the site is served from ('/repo/' on github.io project pages, '/' on a custom domain)
 * SITE_URL   the full public address, used for canonical and social-share URLs and the sitemap
 * VITE_REPO_URL  the GitHub repository the site links to; when unset the site hides its GitHub links
 */
const BASE = process.env.SITE_BASE ?? '/Build365-site/';
const SITE_URL = (process.env.SITE_URL ?? `https://kamal007olica.github.io${BASE}`).replace(/\/?$/, '/');

/** Fills %SITE_URL% in index.html and writes robots.txt and sitemap.xml with the real address. */
function siteFiles(): Plugin {
  return {
    name: 'site-files',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n` });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}</loc><priority>1.0</priority></url>\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), siteFiles()],
  server: { port: 5180 },
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022', chunkSizeWarningLimit: 700 },
});
