// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import productsData from './src/data/products.json' with { type: 'json' };

// GitHub Actions sets ASTRO_SITE / ASTRO_BASE for Pages (user site vs project site).
const site = process.env.ASTRO_SITE || 'https://indahmachine.com';
const base = process.env.ASTRO_BASE || '/';

// Mirror the logic in src/data/products.ts so the sitemap filter keeps only the
// canonical, indexable product URLs (one per family/series). All child model
// pages remain reachable but get `noindex,follow` at render time so we don't
// ask Google to index dozens of near-duplicate variants.
function pickSeriesListingProduct(group) {
  if (group.length === 1) return group[0];
  const withParentId = group.find((p) => p.id.includes('_parent'));
  if (withParentId) return withParentId;
  const nullModel = group.filter((p) => p.model === null);
  if (nullModel.length === 1) return nullModel[0];
  const seriesNamed = group.find((p) => /\bSeries\b/i.test(p.name));
  return seriesNamed ?? group[0];
}

function buildSeriesListingProductIds(products) {
  const byKey = new Map();
  for (const p of products) {
    const key = `${p.family}|${p.series}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(p);
  }
  const ids = new Set();
  for (const group of byKey.values()) {
    ids.add(pickSeriesListingProduct(group).id);
  }
  return ids;
}

const seriesListingProductIds = buildSeriesListingProductIds(productsData);

const PRODUCT_DETAIL_PATH = /\/(en|id)\/products\/([^/]+)\/?$/;
const LEGACY_BRIDGE_PATHS = /\/(Product|PowerPresses)\/?$/;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => {
        if (LEGACY_BRIDGE_PATHS.test(page)) return false;
        const match = page.match(PRODUCT_DETAIL_PATH);
        if (!match) return true;
        const productId = match[2];
        return seriesListingProductIds.has(productId);
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});