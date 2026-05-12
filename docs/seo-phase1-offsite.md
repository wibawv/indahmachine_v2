# SEO Phase 1 — Off-Site Checklist

This is the off-site companion to the on-site Phase 1 work shipped in this commit. None of these items are code; they are external accounts and submissions that help Google discover, verify, and understand the pages we just built.

Recommended order: do Search Console first, then complete the remaining items as business details become available.

---

## 1. Google Search Console

Without this, you cannot see how Google indexes the site or which queries it ranks for.

1. Go to https://search.google.com/search-console.
2. Use the existing **Domain property** for `indahmachine.com` as the primary property. This covers `http`, `https`, `www`, and non-`www` variants.
3. Confirm the canonical host is the HTTPS apex domain: `https://indahmachine.com`.
   - GitHub Pages custom domain should be set to `indahmachine.com`.
   - `website/absolute-astronaut/public/CNAME` should contain exactly `indahmachine.com`.
   - DNS should send `indahmachine.com` to GitHub Pages and `www.indahmachine.com` to the same GitHub Pages site so GitHub can redirect `www` to the apex host.
4. Keep the URL-prefix properties for `https://www.indahmachine.com/` and `http://www.indahmachine.com/` if they are already verified; they are useful for exact-URL inspection, but the domain property should be the main reporting view.
5. Submit the sitemap in the `indahmachine.com` domain property: paste `https://indahmachine.com/sitemap-index.xml` in **Sitemaps**.
6. Confirm the sitemap and canonical URLs point to the HTTPS apex version you want Google to index, currently `https://indahmachine.com/...`.
7. If adding a new URL-prefix property later, choose **URL prefix** and enter the exact HTTPS origin (`https://indahmachine.com`). Use HTML file verification if DNS verification is not available.

Google indexing can take a few days to several weeks, and some changes may take several months to fully show in Search. Use the **URL Inspection** tool to request indexing for high-priority pages (`/en/` homepage, `/id/` homepage, `/id/genset-medan/`, `/id/genset-jakarta/`, `/id/genset-surabaya/`), then reassess performance after a few weeks.

---

## 2. Google Business Profile (GBP)

Start with the verified Medan HQ listing. Only create separate Jakarta or Surabaya listings if those locations are real, staffed or otherwise eligible under Google Business Profile rules, and can receive verification at an accurate public business address.

For each listing:

- **Business name**: `Indah Machine`
- **Categories** (primary first):
  1. Generator dealer
  2. Electric motor manufacturer
  3. Industrial equipment supplier
- **Website**: `https://indahmachine.com`
- **Phone**: `+62 853-4867-4326` (or location-specific if different)
- **Hours**: business hours, accurate

### Medan HQ (do this first)

- **Address**: `Jln. Mangkubumi No. 12, Medan 20151, North Sumatra, Indonesia`
- This should match the canonical address format in the `LocalBusiness` JSON-LD in `website/absolute-astronaut/src/utils/seo.ts`.

### Jakarta warehouse (only if eligible)

- **Address**: `<full street address>, Jakarta, DKI Jakarta, Indonesia`
- Once you have the full address, also update the `jakarta` entry in `businessLocations` in `seo.ts` to add `streetAddress` and `postalCode`. This makes the site data more specific and consistent with the public listing.

### Surabaya warehouse (only if eligible)

- **Address**: `<full street address>, Surabaya, East Java, Indonesia`
- Same as above — update the `surabaya` entry in `businessLocations` once you have the full address.

GBP verification is usually by postcard (5-14 days). Until verified, listings don't appear publicly.

---

## 3. Indonesian directories (NAP-consistent submissions)

Pick the top ones first. Submit only to reputable directories and supplier portals where a real buyer might discover the business. Use the same canonical NAP format as the GBP listing for that city.

| Directory | Priority | Notes |
|---|---|---|
| Indotrading | High | Largest Indonesian B2B directory; can list per city |
| IndoNetwork | High | Industrial supplier focus |
| Yellow Pages Indonesia | Medium | General; supports multiple locations |
| KADIN (Chamber of Commerce) | Medium | Membership-based; strong authority signal |
| Alibaba | Low for ID-search SEO | Higher value for export inquiries |

Tracking: keep a simple spreadsheet — `directory | url | listing date | listing URL | status`.

---

## 4. NAP consistency rules

NAP = Name, Address, Phone. Consistent business information helps users and search engines understand that citations refer to the same company and location.

- The `LocalBusiness` JSON-LD in `src/utils/seo.ts` is the source of truth.
- Every directory listing, GBP listing, social profile, and supplier portal should use the same canonical format:
  - `Indah Machine`
  - `Jln. Mangkubumi No. 12, Medan 20151, North Sumatra, Indonesia`
  - `+62 853-4867-4326`
- Minor variations like "Jl." vs "Jln." may not break recognition, but they create avoidable ambiguity. Pick one form and stick with it.

---

## 5. Action items still pending

- [ ] Confirm whether the **Jakarta warehouse** is eligible for its own GBP listing. If yes, collect full street address + phone and update `businessLocations.jakarta` in `src/utils/seo.ts`.
- [ ] Same for the **Surabaya warehouse**.
- [ ] Submit `sitemap-index.xml` to Bing Webmaster Tools as well — small extra reach for free.

---

## 6. Realistic timeline

- Day 1: GBP Medan + GSC + sitemap submission
- Week 1: Indotrading + IndoNetwork listings
- Week 2-3: Verify Jakarta + Surabaya only if they are eligible for their own GBP listings
- Month 1-2: First useful Search Console data for impressions, indexed pages, and long-tail queries such as `genset medan`, `alternator indonesia`, and `motor listrik distributor`
- Month 3-6: Iterate based on Search Console query/page data; page 1 visibility is possible for niche city+noun terms but not guaranteed

This file is a snapshot — update it as listings are submitted and verified.
