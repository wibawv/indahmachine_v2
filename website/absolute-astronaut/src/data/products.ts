import raw from "./products.json";

export type Product = {
  id: string;
  name: string;
  family: "Alternator" | "Electric Motor" | "Power Press";
  series: string;
  model: string | null;
  description: string;
  technical_specifications: Record<string, unknown>;
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

export const seriesListingProducts: Product[] = (() => {
  const byKey = new Map<string, Product[]>();
  for (const p of products) {
    const key = `${p.family}|${p.series}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(p);
  }
  const familyOrder = new Map(families.map((f, i) => [f, i] as const));
  const rows = [...byKey.values()].map(pickSeriesListingProduct);
  rows.sort((a, b) => {
    const oa = familyOrder.get(a.family) ?? 999;
    const ob = familyOrder.get(b.family) ?? 999;
    if (oa !== ob) return oa - ob;
    return a.series.localeCompare(b.series);
  });
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

/**
 * Spec keys that have at least two distinct values across the child models —
 * i.e. the columns worth showing in a comparison table.
 */
export function getVaryingSpecKeys(children: Product[]): string[] {
  if (children.length < 2) return [];
  const allKeys = [...new Set(children.flatMap((c) => Object.keys(c.technical_specifications)))];
  return allKeys.filter((key) => {
    const values = children
      .map((c) => c.technical_specifications[key])
      .filter((v) => v !== undefined && v !== null);
    if (values.length < 2) return false;
    const first = JSON.stringify(values[0]);
    return values.some((v) => JSON.stringify(v) !== first);
  });
}

