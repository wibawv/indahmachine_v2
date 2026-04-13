import type { Product } from "../data/products";
import { siteUrl } from "./siteUrl";

export function trimMetaDescription(text: string, max = 158): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 3).trimEnd()}...`;
}

export function productMetaDescription(product: Product, lang: "en" | "id"): string {
  const d = product.description.replace(/\s+/g, " ").trim();
  if (lang === "en") {
    const bits =
      product.family === "Alternator"
        ? `${product.name} — alternator for generators and genset applications. ${d} Indah Machine, Medan; industrial distributor serving Jakarta, Surabaya, and Indonesia. Contact for quote.`
        : product.family === "Electric Motor"
          ? `${product.name} — electric motor distributor Indonesia. ${d} Indah Machine, Medan; motor listrik and industrial motors nationwide. Contact for quote.`
          : `${product.name} — power press from Indah Machine, Medan. ${d} Serving industrial customers across Indonesia. Contact for quote.`;
    return trimMetaDescription(bits);
  }
  const bits =
    product.family === "Alternator"
      ? `${product.name} — alternator untuk generator dan genset. ${d} Indah Machine, Medan; distributor mesin industri ke Jakarta, Surabaya, dan seluruh Indonesia. Minta penawaran.`
      : product.family === "Electric Motor"
        ? `${product.name} — elektrik motor distributor Indonesia. ${d} Indah Machine, Medan; motor listrik untuk industri. Hubungi kami untuk penawaran.`
        : `${product.name} — power press dari Indah Machine, Medan. ${d} Melayani pelanggan industri di Indonesia. Minta penawaran.`;
  return trimMetaDescription(bits);
}

export function productJsonLd(product: Product, site: URL): object {
  const img = product.image_path.replace(/^\/+/, "");
  const imageUrl = new URL(siteUrl(img), site).href;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: trimMetaDescription(product.description, 300),
    image: imageUrl,
    brand: { "@type": "Brand", name: "Indah Machine" },
    category: product.family,
  };
}

export function localBusinessJsonLd(site: URL): object {
  const url = new URL(import.meta.env.BASE_URL, site).href;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Indah Machine",
    url,
    email: "indahmachine@gmail.com",
    telephone: ["+6285348674326", "+62816306825"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jln. Mangkubumi No. 12",
      addressLocality: "Medan",
      postalCode: "20151",
      addressRegion: "North Sumatra",
      addressCountry: "ID",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  site: URL
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(siteUrl(it.path.replace(/^\/+/, "")), site).href,
    })),
  };
}
