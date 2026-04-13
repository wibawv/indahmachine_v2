const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT_DIR, "products.json");
const IMAGE_DIR = path.join(ROOT_DIR, "base44_product_image");
const PDF_DIR = path.join(ROOT_DIR, "raw_catalog");

function fileExistsSafe(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function validate() {
  const raw = fs.readFileSync(PRODUCTS_PATH, "utf8");
  const products = JSON.parse(raw);

  const errors = [];
  const ids = new Set();
  const modelsBySeries = new Map();

  for (const p of products) {
    const ctx = `id=${p.id || "(no id)"}, series=${p.series || "(no series)"}`;

    if (!p.id) errors.push(`${ctx}: missing id`);
    if (!p.name) errors.push(`${ctx}: missing name`);
    if (!p.family) errors.push(`${ctx}: missing family`);
    if (!p.series) errors.push(`${ctx}: missing series`);

    if (
      !p.technical_specifications ||
      Object.keys(p.technical_specifications).length === 0
    ) {
      errors.push(`${ctx}: missing or empty technical_specifications`);
    }

    if (!p.image_path) {
      errors.push(`${ctx}: missing image_path`);
    } else {
      const imgFull = path.join(ROOT_DIR, p.image_path);
      if (!fileExistsSafe(imgFull)) {
        errors.push(`${ctx}: image_path does not exist on disk (${p.image_path})`);
      }
    }

    if (p.series === "Y/YR") {
      if (p.pdf_path) {
        errors.push(`${ctx}: Y/YR should not have pdf_path, but has ${p.pdf_path}`);
      }
    } else {
      if (!p.pdf_path) {
        errors.push(`${ctx}: missing pdf_path (required for all non Y/YR products)`);
      } else {
        const pdfFull = path.join(ROOT_DIR, p.pdf_path);
        if (!fileExistsSafe(pdfFull)) {
          errors.push(`${ctx}: pdf_path does not exist on disk (${p.pdf_path})`);
        }
      }
    }

    if (ids.has(p.id)) {
      errors.push(`${ctx}: duplicate id`);
    } else if (p.id) {
      ids.add(p.id);
    }

    if (p.series && p.model) {
      const key = p.series;
      if (!modelsBySeries.has(key)) modelsBySeries.set(key, new Set());
      const set = modelsBySeries.get(key);
      if (set.has(p.model)) {
        errors.push(`${ctx}: duplicate model '${p.model}' within series '${p.series}'`);
      } else {
        set.add(p.model);
      }
    }
  }

  if (errors.length === 0) {
    console.log("OK: products.json passed validation.");
  } else {
    console.error(`products.json has ${errors.length} validation issue(s):`);
    for (const e of errors) console.error(" - " + e);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  validate();
}

