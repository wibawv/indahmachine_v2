export function formatSpecValue(value: unknown): string {
  if (value === null || value === undefined) return "–";
  if (Array.isArray(value)) return value.map(formatSpecValue).join(", ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${formatSpecValue(v)}`)
      .join(" · ");
  }
  return String(value);
}
