// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// GitHub Actions sets ASTRO_SITE / ASTRO_BASE for Pages (user site vs project site).
const site = process.env.ASTRO_SITE || 'https://www.indahmachine.com';
const base = process.env.ASTRO_BASE || '/';

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});