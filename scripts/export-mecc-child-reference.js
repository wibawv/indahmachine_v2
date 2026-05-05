const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const ROOT_DIR = path.resolve(__dirname, "..");
const SOURCE_CSV = path.join(
  ROOT_DIR,
  "product_input",
  "mecc_parent_and_models_base44_updated.csv"
);
const OCR_JSON = path.join(ROOT_DIR, "tmp_mecc_ocr.json");
const OUT_DIR = path.join(ROOT_DIR, "product_reference", "electric_motors");
const SOURCE_PDF = "raw_catalog/mecc_motor.pdf";

const CHILD_CSV = path.join(OUT_DIR, "mecc_y2_y23_child_models.csv");
const CHILD_JSON = path.join(OUT_DIR, "mecc_y2_y23_child_models.json");
const CROSSCHECK_CSV = path.join(OUT_DIR, "mecc_y2_y23_pdf_crosscheck.csv");
const README = path.join(OUT_DIR, "README.md");

const POLE_SOURCE_PAGES = {
  2: "2",
  4: "2",
  6: "3",
  8: "3",
  10: "3",
};

const PDF_SYNCHRONOUS_SPEED_BY_POLE = {
  2: 3000,
  4: 1500,
  6: 1000,
  8: 750,
  10: 600,
};

function parseJsonField(raw, fallback) {
  if (!raw || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function readRows() {
  const raw = fs.readFileSync(SOURCE_CSV, "utf8");
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function csvEscape(value) {
  if (value === undefined || value === null) return "";
  const text = Array.isArray(value) || typeof value === "object"
    ? JSON.stringify(value)
    : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function writeCsv(filePath, rows, headers) {
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")),
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function normalizeNumber(value) {
  if (value === undefined || value === null || value === "") return "";
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  return Number.isInteger(num) ? String(num) : String(num);
}

function numberTokenVariants(value) {
  const normalized = normalizeNumber(value);
  if (!normalized) return [];
  const variants = new Set([normalized]);
  if (normalized.includes(".")) {
    variants.add(normalized.replace(/^0\./, "."));
    variants.add(normalized.replace(".", ":"));
    variants.add(normalized.replace(".", ""));
  } else {
    variants.add(`${normalized}.0`);
  }
  return [...variants];
}

function normalizeToken(text) {
  return String(text || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/O/g, "0");
}

function loadOcrPages() {
  if (!fs.existsSync(OCR_JSON)) return {};
  const raw = JSON.parse(fs.readFileSync(OCR_JSON, "utf8"));
  const pages = {};
  for (const [page, tokens] of Object.entries(raw)) {
    pages[page] = tokens.map((token) => String(token));
  }
  return pages;
}

function pageHasToken(tokens, expected) {
  const target = normalizeToken(expected);
  return tokens.some((token) => normalizeToken(token) === target);
}

function pageHasNumber(tokens, expected, { allowContains = false } = {}) {
  const variants = numberTokenVariants(expected).map(normalizeToken);
  return tokens.some((token) => {
    const normalized = normalizeToken(token);
    return variants.some((variant) =>
      allowContains ? normalized.includes(variant) : normalized === variant
    );
  });
}

function pageHasSynchronousSection(tokens, speed) {
  if (!speed) return false;
  const target = normalizeToken(`Synchronous${speed}`);
  return tokens.some((token) => normalizeToken(token).includes(target));
}

function toReferenceProduct(row) {
  const technical = parseJsonField(row.technical_specifications, {});
  const dimensions = parseJsonField(row.dimension_specifications, {});
  const features = parseJsonField(row.features, []);
  const applications = parseJsonField(row.applications, []);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    series: row.series,
    model: row.model,
    image_url: row.image_url,
    pdf_url: row.pdf_url,
    description: row.description,
    technical_specifications: technical,
    dimension_specifications: dimensions,
    features,
    applications,
    created_date: row.created_date,
    updated_date: row.updated_date,
    created_by_id: row.created_by_id,
    created_by: row.created_by,
    is_sample: row.is_sample || "",
  };
}

function toFlatCsvRow(product) {
  const specs = product.technical_specifications || {};
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    series: product.series,
    model: product.model,
    frame_no: specs["Frame No"] || "",
    poles: specs.Poles || "",
    kw: specs.kW || "",
    rpm_50hz: specs["Rated RPM (50Hz)"] || "",
    rpm_60hz: specs["Rated RPM (60Hz)"] || "",
    voltage_options: specs["Voltage Options"] || "",
    frequency: specs.Frequency || "",
    mounting: specs.Mounting || "",
    image_url: product.image_url,
    pdf_url: product.pdf_url,
    description: product.description,
    technical_specifications: product.technical_specifications,
    dimension_specifications: product.dimension_specifications,
    features: product.features,
    applications: product.applications,
  };
}

function buildCrosscheck(product, ocrPages) {
  const specs = product.technical_specifications || {};
  const poles = specs.Poles;
  const sourcePage = POLE_SOURCE_PAGES[poles] || "";
  const tokens = ocrPages[sourcePage] || [];
  const frameNo = specs["Frame No"] || "";
  const kw = specs.kW;
  const rpm50 = specs["Rated RPM (50Hz)"];
  const rpm60 = specs["Rated RPM (60Hz)"];
  const synchronousSpeed = PDF_SYNCHRONOUS_SPEED_BY_POLE[poles] || "";

  const frameFound = sourcePage ? pageHasToken(tokens, frameNo) : false;
  const kwFound = sourcePage ? pageHasNumber(tokens, kw) : false;
  const poleSectionFound = sourcePage
    ? pageHasSynchronousSection(tokens, synchronousSpeed)
    : false;

  const notes = [];
  if (frameFound && kwFound && poleSectionFound) {
    notes.push("Frame, kW, and pole section found in OCR text for the mapped PDF page.");
  } else {
    if (!frameFound) notes.push("Frame number was not confidently found in OCR text.");
    if (!kwFound) notes.push("kW value was not confidently found in OCR text.");
    if (!poleSectionFound) notes.push("Pole/synchronous-speed section was not confidently found in OCR text.");
  }

  notes.push(
    `CSV rpm_50hz=${rpm50} and rpm_60hz=${rpm60}; PDF rating table shows frame-specific full-load RPM values, so RPM must be manually reviewed before treating these as exact catalog speeds.`
  );

  return {
    model: product.model,
    frame_no: frameNo,
    poles,
    kw,
    rpm_50hz: rpm50,
    rpm_60hz: rpm60,
    source_pdf: SOURCE_PDF,
    source_pages: sourcePage ? `PDF page ${sourcePage}; pdf_extract_jpeg/mecc_motor_page-${sourcePage.padStart(4, "0")}.jpg` : "",
    check_status: "needs_review",
    notes: notes.join(" "),
  };
}

function writeReadme(childCount, crosscheckRows) {
  const needsReview = crosscheckRows.filter((r) => r.check_status === "needs_review").length;
  const mismatch = crosscheckRows.filter((r) => r.check_status === "mismatch").length;
  const verified = crosscheckRows.filter((r) => r.check_status === "verified").length;

  const content = `# MECC Y2/Y23 Child Product Reference

This folder is a durable reference export for MECC Y2/Y23 electric motor child models.

## Files

- \`mecc_y2_y23_child_models.csv\` - spreadsheet-friendly child model export with key technical fields flattened.
- \`mecc_y2_y23_child_models.json\` - build-friendly child model export with nested specs, dimensions, features, and applications preserved as JSON.
- \`mecc_y2_y23_pdf_crosscheck.csv\` - per-model PDF/OCR traceability report.

## Sources

- Source PDF: \`${SOURCE_PDF}\`
- Source extraction CSV: \`product_input/mecc_parent_and_models_base44_updated.csv\`
- OCR/reference page images: \`pdf_extract_jpeg/mecc_motor_page-*.jpg\`
- OCR text used by the exporter: \`tmp_mecc_ocr.json\`

## Row Counts

- Child model rows: ${childCount}
- Cross-check rows: ${crosscheckRows.length}
- Verified rows: ${verified}
- Needs-review rows: ${needsReview}
- Mismatch rows: ${mismatch}

## Cross-Check Notes

The cross-check report maps each model to the catalog rating page by pole count and checks whether the frame number, kW value, and pole/synchronous-speed section appear in the OCR text for that page.

All rows are currently marked \`needs_review\` because the extracted CSV stores simplified nominal RPM by pole count, while the PDF rating table shows frame-specific full-load RPM values. The export preserves the source CSV values and does not silently rewrite them.

YJS child models are intentionally not included yet. The current YJS extraction artifacts are OCR staging files and need a separate structured cleanup pass before they should become reference data.
`;

  fs.writeFileSync(README, content, "utf8");
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const rows = readRows();
  const childRows = rows.filter((row) => row.model && row.model.trim());
  const products = childRows.map(toReferenceProduct);
  const ocrPages = loadOcrPages();
  const crosscheckRows = products.map((product) => buildCrosscheck(product, ocrPages));

  writeCsv(CHILD_CSV, products.map(toFlatCsvRow), [
    "id",
    "name",
    "category",
    "series",
    "model",
    "frame_no",
    "poles",
    "kw",
    "rpm_50hz",
    "rpm_60hz",
    "voltage_options",
    "frequency",
    "mounting",
    "image_url",
    "pdf_url",
    "description",
    "technical_specifications",
    "dimension_specifications",
    "features",
    "applications",
  ]);

  fs.writeFileSync(CHILD_JSON, `${JSON.stringify(products, null, 2)}\n`, "utf8");

  writeCsv(CROSSCHECK_CSV, crosscheckRows, [
    "model",
    "frame_no",
    "poles",
    "kw",
    "rpm_50hz",
    "rpm_60hz",
    "source_pdf",
    "source_pages",
    "check_status",
    "notes",
  ]);

  writeReadme(products.length, crosscheckRows);

  console.log(`Wrote ${products.length} child models to ${CHILD_CSV}`);
  console.log(`Wrote ${products.length} child models to ${CHILD_JSON}`);
  console.log(`Wrote ${crosscheckRows.length} cross-check rows to ${CROSSCHECK_CSV}`);
  console.log(`Wrote ${README}`);
}

if (require.main === module) {
  main();
}
