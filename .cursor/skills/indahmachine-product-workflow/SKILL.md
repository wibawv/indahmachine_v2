---
name: indahmachine-product-workflow
description: Step-by-step workflows for the Indah Machine website — ingesting product data from PDFs/CSVs, running the data quality gate, and performing EN→ID translation QA. Use when adding or updating product data, validating product records before publishing, checking for broken asset links, or reviewing Indonesian translations for the website.
---

# Indah Machine Product Workflow

Actionable workflows for product data and translation tasks. For static reference (asset filenames, contact info, design rules) see the project rule file.

---

## Workflow 1: Ingest Product Data

Use when adding a new product or updating existing specs.

**Step 1 — Extract from PDF (source of truth)**
- Read the relevant PDF in `raw_catalog/`
- Extract: model names, power ratings, voltage, frequency, RPM, and any other technical specs
- Do not rely on `product_input/` CSVs alone — cross-check every value against the PDF

**Step 2 — Build the product record**
```json
{
  "id": "unique-slug",
  "name": "Full Product Name",
  "family": "Alternator | Electric Motor | Power Press",
  "series": "e.g. UCW",
  "technical_specifications": { "kW/kVA": "...", "Voltage": "...", "Frequency": "...", "RPM": "..." },
  "image_path": "base44_product_image/filename.ext",
  "pdf_path": "raw_catalog/filename.pdf"
}
```
- Omit `pdf_path` only for Y/YR series
- Use normalized technical keys: `kW/kVA`, `Voltage`, `Frequency`, `RPM`
- Never include `dimension_specifications` in the website data

**Step 3 — Map assets**
Match asset filenames from the project rule's Asset Mapping table. All assets must be locally committed — no external URLs.

**Step 4 — Run the quality gate** (see Workflow 2)

---

## Workflow 2: Data Quality Gate

Run this checklist before every publish. Block release on any failure.

```
Quality Gate Checklist:
- [ ] Every product has: id, name, family, series, technical_specifications, image_path
- [ ] Every product has pdf_path EXCEPT Y/YR series
- [ ] No duplicate id values across all products
- [ ] No duplicate model values within the same series
- [ ] All image_path values resolve to existing local files
- [ ] All pdf_path values resolve to existing local files
- [ ] Technical keys use normalized names (kW/kVA, Voltage, Frequency, RPM)
- [ ] No dimension_specifications rendered on any page
- [ ] No external GitHub raw or Supabase URLs in asset paths
```

If a check fails, fix it before proceeding. Do not publish with known gate failures.

---

## Workflow 3: Translation QA (EN → ID)

Use after auto-translating with `scripts/translate-to-id.js`.

**Review priority (high → low):**
1. Home, About, Contact pages
2. Product family pages
3. Product detail pages

**Per-page checklist:**
```
- [ ] Technical units preserved exactly: kW, kVA, V, Hz, RPM (never translated)
- [ ] Product names and model numbers unchanged (UCW, TZH, J23, etc.)
- [ ] CTA wording: "Hubungi Kami untuk Penawaran" (Contact for Quote equivalent)
- [ ] Y/YR page shows: "Katalog tersedia berdasarkan permintaan" + WhatsApp/contact CTA
- [ ] No pricing language introduced (no price list policy)
- [ ] Terminology consistent across all pages (pick one term, use it throughout)
```

**Common mistranslations to watch:**
- `kVA` must not become `kilovolt-ampere` (keep abbreviation)
- `RPM` must not become `putaran per menit` (keep abbreviation)
- "Request Quote" → "Minta Penawaran" (preferred) or "Hubungi untuk Harga"
