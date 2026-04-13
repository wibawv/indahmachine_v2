/**
 * Prefix a path with Astro `base` (e.g. /indahmachine_v2/) for GitHub project pages.
 * @param path - Site path after base, e.g. "en/" or "base44_product_image/x.png"
 */
export function siteUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmed = path.replace(/^\/+/, "");
  return base + trimmed;
}
