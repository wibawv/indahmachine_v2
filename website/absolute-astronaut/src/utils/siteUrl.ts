/**
 * Append a trailing slash to directory-style paths (no file extension) so
 * canonical, hreflang, og:url, and internal hrefs match the static output that
 * Astro generates with `build.format: "directory"` and the URLs the sitemap
 * emits.
 *
 * - "en/products"            -> "en/products/"
 * - "en/products?family=X"   -> "en/products/?family=X"
 * - "en/products/foo"        -> "en/products/foo/"
 * - "raw_catalog/foo.pdf"    -> unchanged (file)
 * - "favicon.ico"            -> unchanged (file)
 * - "" or already slashed    -> unchanged
 */
export function ensureTrailingSlash(path: string): string {
  const queryIdx = path.search(/[?#]/);
  const pathPart = queryIdx === -1 ? path : path.slice(0, queryIdx);
  const suffix = queryIdx === -1 ? "" : path.slice(queryIdx);
  if (!pathPart) return path;
  if (pathPart.endsWith("/")) return path;
  const lastSeg = pathPart.split("/").pop() ?? "";
  if (/\.[a-z0-9]+$/i.test(lastSeg)) return path;
  return pathPart + "/" + suffix;
}

/**
 * Prefix a path with Astro `base` (e.g. /indahmachine_v2/) for GitHub project pages.
 * Also enforces a trailing slash on directory-style URLs so internal links match
 * the static output and the generated sitemap.
 * @param path - Site path after base, e.g. "en/" or "base44_product_image/x.png"
 */
export function siteUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const trimmed = path.replace(/^\/+/, "");
  return base + ensureTrailingSlash(trimmed);
}
