import raw from "./products.json";

export type Product = {
  id: string;
  name: string;
  family: "Alternator" | "Electric Motor" | "Power Press";
  series: string;
  model: string | null;
  description: string;
  technical_specifications: Record<string, unknown>;
  catalog_ratings?: Record<string, unknown>;
  features: string[];
  applications: string[];
  image_path: string;
  pdf_path?: string;
};

export const products = raw as Product[];

export const families = ["Electric Motor", "Power Press", "Alternator"] as const;

/** One representative product per (family, series) for catalog grids — parent/overview row when available. */
function pickSeriesListingProduct(group: Product[]): Product {
  if (group.length === 1) return group[0]!;
  const withParentId = group.find((p) => p.id.includes("_parent"));
  if (withParentId) return withParentId;
  const nullModel = group.filter((p) => p.model === null);
  if (nullModel.length === 1) return nullModel[0]!;
  const seriesNamed = group.find((p) => /\bSeries\b/i.test(p.name));
  return seriesNamed ?? group[0]!;
}

export const seriesListingProductIds: Set<string> = new Set();

export function isSeriesListingProduct(productId: string): boolean {
  return seriesListingProductIds.has(productId);
}

export const seriesListingProducts: Product[] = (() => {
  const byKey = new Map<string, Product[]>();
  for (const p of products) {
    const key = `${p.family}|${p.series}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(p);
  }
  const familyOrder = new Map(families.map((f, i) => [f, i] as const));
  const alternatorSeriesListingPriority = ["UCW", "TZH", "T2W3-N"] as const;
  function getAlternatorListingRank(series: string): number {
    const idx = alternatorSeriesListingPriority.indexOf(series as typeof alternatorSeriesListingPriority[number]);
    return idx === -1 ? alternatorSeriesListingPriority.length : idx;
  }
  const rows = [...byKey.values()].map(pickSeriesListingProduct);
  rows.sort((a, b) => {
    const oa = familyOrder.get(a.family) ?? 999;
    const ob = familyOrder.get(b.family) ?? 999;
    if (oa !== ob) return oa - ob;
    if (a.family === "Alternator" && b.family === "Alternator") {
      const ra = getAlternatorListingRank(a.series);
      const rb = getAlternatorListingRank(b.series);
      if (ra !== rb) return ra - rb;
    }
    return a.series.localeCompare(b.series);
  });
  for (const r of rows) seriesListingProductIds.add(r.id);
  return rows;
})();

/** All products in the same family + series, with parent/overview rows first. */
export function getSeriesSiblings(product: Product): Product[] {
  return products
    .filter((p) => p.family === product.family && p.series === product.series)
    .sort((a, b) => {
      const aIsParent = a.model === null || a.id.includes("_parent");
      const bIsParent = b.model === null || b.id.includes("_parent");
      if (aIsParent && !bIsParent) return -1;
      if (!aIsParent && bIsParent) return 1;
      return 0;
    });
}

/**
 * Child model rows only (non-parent, non-overview) from a siblings list.
 * Used to build the series comparison table.
 */
export function getChildModels(siblings: Product[]): Product[] {
  return siblings.filter(
    (s) => s.model !== null && !s.id.includes("_parent") && !/\bSeries\b/i.test(s.name)
  );
}

const alternatorSpecPriority = [
  (key: string) => key.toLowerCase() === "kw",
  (key: string) => key.toLowerCase() === "kva",
  (key: string) => /\bcurrent\b/i.test(key),
  (key: string) => /\bspeed\b/i.test(key) || /\brpm\b/i.test(key),
  (key: string) => /\befficiency\b/i.test(key),
  (key: string) => /\bweight\b/i.test(key),
] as const;

function getAlternatorSpecRank(key: string): number {
  const rank = alternatorSpecPriority.findIndex((matches) => matches(key));
  return rank === -1 ? alternatorSpecPriority.length : rank;
}

function isPrioritizedAlternatorSpec(key: string): boolean {
  return getAlternatorSpecRank(key) < alternatorSpecPriority.length;
}

export function orderSpecKeys(product: Product, keys: string[]): string[] {
  if (product.family !== "Alternator") return keys;

  return [...keys].sort((a, b) => {
    const rankDelta = getAlternatorSpecRank(a) - getAlternatorSpecRank(b);
    if (rankDelta !== 0) return rankDelta;
    return keys.indexOf(a) - keys.indexOf(b);
  });
}

export function getOrderedSpecEntries(product: Product): [string, unknown][] {
  const specs = product.technical_specifications;
  return orderSpecKeys(product, Object.keys(specs)).map((key) => [key, specs[key]]);
}

/**
 * Spec keys that have at least two distinct values across the child models —
 * i.e. the columns worth showing in a comparison table.
 */
export function getVaryingSpecKeys(children: Product[], product?: Product): string[] {
  if (children.length < 2) return [];
  const allKeys = [...new Set(children.flatMap((c) => Object.keys(c.technical_specifications)))];
  const varyingKeys = allKeys.filter((key) => {
    if (product?.family === "Alternator" && isPrioritizedAlternatorSpec(key)) {
      return children.some((c) => c.technical_specifications[key] !== undefined);
    }

    const values = children
      .map((c) => c.technical_specifications[key])
      .filter((v) => v !== undefined && v !== null);
    if (values.length < 2) return false;
    const first = JSON.stringify(values[0]);
    return values.some((v) => JSON.stringify(v) !== first);
  });
  return product ? orderSpecKeys(product, varyingKeys) : varyingKeys;
}

