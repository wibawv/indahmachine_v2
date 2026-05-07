const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const ROOT_DIR = path.resolve(__dirname, "..");
const PRODUCT_INPUT_DIR = path.join(ROOT_DIR, "product_input");
const OUTPUT_PATH = path.join(ROOT_DIR, "products.json");

// Map CSV category -> canonical family label
const FAMILY_MAP = {
  alternator: "Alternator",
  electric_motor: "Electric Motor",
  power_press: "Power Press",
};

// Map series/family -> local asset filenames (from rule file)
const ASSET_MAP = {
  // Alternators
  UCW: {
    family: "Alternator",
    image: "ucw_alternator.png",
    pdf: "ucw_alternator.pdf",
  },
  TZH: {
    family: "Alternator",
    image: "tzh_alternator.png",
    pdf: "tzh_alternator.pdf",
  },
  "TZH-N": {
    family: "Alternator",
    image: "tzh_n_alternator.png",
    pdf: "tzh-n_alternator.pdf",
  },
  T2W3: {
    family: "Alternator",
    image: "t2w3_alternator.png",
    pdf: "t2w3_alternator.pdf",
  },
  "T2W3-N": {
    family: "Alternator",
    image: "t2w3n_alternator.png",
    pdf: "t2w3-n_alternator_v2.pdf",
  },
  "T2W3-N-ALT": {
    family: "Alternator",
    image: "t2w3n_alternator.png",
    pdf: "t2w3-n_alternator_v2.pdf",
  },
  "Mecc Alte": {
    family: "Alternator",
    image: "meccalte_alternator.png",
    pdf: "meccalte_alternator.pdf",
  },
  Brushless: {
    family: "Alternator",
    image: "alternator_icon.webp",
    pdf: "Brushless_Alt.pdf",
  },
  // Electric motors
  "MECC Y2/Y23": {
    family: "Electric Motor",
    image: "mecc_motor.png",
    pdf: "mecc_motor.pdf",
  },
  YJS: {
    family: "Electric Motor",
    image: "electric-motor-icon.avif",
    pdf: "YJS.pdf",
  },
  "Y/YR": {
    family: "Electric Motor",
    image: "electric-motor-icon.avif",
    pdf: null, // no PDF — handled specially when building product
  },
  "YPTZ/YPTQ": {
    family: "Electric Motor",
    image: "electric-motor-icon.avif",
    pdf: "yptz_yptq_series.pdf",
  },
  // Power press
  "J23/JC23": {
    family: "Power Press",
    image: "j23_incline_power_press.png",
    pdf: "Power_Press.pdf",
  },
};

// Only keep rows for expected product series
const EXPECTED_SERIES = new Set([
  // Alternators
  "UCW",
  "TZH",
  "TZH-N",
  "T2W3",
  "T2W3-N",
  "Mecc Alte",
  "Brushless",
  // Electric motors
  "MECC Y2/Y23",
  "YJS",
  "Y/YR",
  "YPTZ/YPTQ",
  // Power press
  "J23/JC23",
]);

function normalizeTechnicalSpecs(raw) {
  if (!raw || !raw.trim()) return {};
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    return {};
  }

  const result = { ...obj };

  // Canonical key is `kW` (active power). Migrate legacy CSV key `kW/kVA`.
  if ("kW/kVA" in result) {
    if (!("kW" in result) || result.kW == null) {
      result.kW = result["kW/kVA"];
    }
    delete result["kW/kVA"];
  }

  return result;
}

function deriveId(row) {
  if (row.id && row.id.trim()) return row.id.trim();
  const parts = [
    row.series || "",
    row.model || "",
    row.name || "",
  ]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return parts || `product-${Math.random().toString(36).slice(2, 10)}`;
}

function getAssetInfo(row) {
  const series = (row.series || "").trim();
  const category = (row.category || "").trim();

  const asset = ASSET_MAP[series] || null;
  const family =
    (asset && asset.family) || FAMILY_MAP[category] || row.family || null;

  let image_path = null;
  let pdf_path = null;

  if (asset) {
    if (asset.image) {
      image_path = path.posix.join("base44_product_image", asset.image);
    }
    if (asset.pdf) {
      pdf_path = path.posix.join("raw_catalog", asset.pdf);
    }
  }

  return { family, image_path, pdf_path };
}

async function readCsvFile(filePath) {
  const records = [];
  const parser = fs
    .createReadStream(filePath)
    .pipe(
      parse({
        columns: true,
        trim: true,
      })
    );

  for await (const record of parser) {
    records.push(record);
  }
  return records;
}

async function loadAllCsvs() {
  const entries = await fs.promises.readdir(PRODUCT_INPUT_DIR);
  const csvFiles = entries.filter((f) => f.toLowerCase().endsWith(".csv"));

  const all = [];
  for (const file of csvFiles) {
    const fullPath = path.join(PRODUCT_INPUT_DIR, file);
    const rows = await readCsvFile(fullPath);
    all.push(...rows);
  }
  return all;
}

async function buildProducts() {
  const rows = await loadAllCsvs();

  const filteredRows = rows.filter((row) =>
    EXPECTED_SERIES.has((row.series || "").trim())
  );

  const seenCombo = new Set();
  const products = [];

  for (const row of filteredRows) {
    const comboKey = `${(row.series || "").trim()}::${(row.model || "").trim()}`;
    if (comboKey !== "::") {
      if (seenCombo.has(comboKey)) {
        continue;
      }
      seenCombo.add(comboKey);
    }
    const { family, image_path, pdf_path } = getAssetInfo(row);
    const technical_specifications = normalizeTechnicalSpecs(
      row.technical_specifications || ""
    );

    let features = [];
    if (row.features && row.features.trim()) {
      try {
        features = JSON.parse(row.features);
      } catch {
        features = [row.features];
      }
    }

    let applications = [];
    if (row.applications && row.applications.trim()) {
      try {
        applications = JSON.parse(row.applications);
      } catch {
        applications = [row.applications];
      }
    }

    const product = {
      id: deriveId(row),
      name: row.name || "",
      family,
      series: row.series || "",
      model: row.model || null,
      description: row.description || "",
      technical_specifications,
      features,
      applications,
      image_path,
    };

    if (pdf_path && product.series !== "Y/YR") {
      product.pdf_path = pdf_path;
    }

    products.push(product);
  }

  return products;
}

async function main() {
  try {
    const products = await buildProducts();
    await fs.promises.writeFile(
      OUTPUT_PATH,
      JSON.stringify(products, null, 2),
      "utf8"
    );
    console.log(`Wrote ${products.length} products to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error("Failed to build products.json", err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

