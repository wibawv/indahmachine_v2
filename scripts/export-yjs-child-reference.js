const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const OCR_JSON = path.join(ROOT_DIR, "product_input", "yjs_ocr_lines.json");
const WEBSITE_PRODUCTS_JSON = path.join(
  ROOT_DIR,
  "website",
  "absolute-astronaut",
  "src",
  "data",
  "products.json"
);
const OUT_DIR = path.join(ROOT_DIR, "product_reference", "electric_motors");
const SOURCE_PDF = "website/absolute-astronaut/public/raw_catalog/YJS.pdf";
const SOURCE_OCR = "product_input/yjs_ocr_lines.json";
const SOURCE_PAGES = "product_input/yjs_pages/page_*.png";

const CHILD_CSV = path.join(OUT_DIR, "yjs_child_models.csv");
const CHILD_JSON = path.join(OUT_DIR, "yjs_child_models.json");
const CROSSCHECK_CSV = path.join(OUT_DIR, "yjs_pdf_crosscheck.csv");
const README = path.join(OUT_DIR, "README.md");

const MODEL_RE = /\bYJS\s*(\d+[A-Z]?)-(\d+)\b/i;
const OUTPUT_RE = /^\(?\d+(?:\.\d+)?\)?$/;
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/wibawv/indahmachine/master";

const PAGE_SECTIONS = {
  2: { voltage: "380 V", table: "table 3", pages: "PDF page 2; product_input/yjs_pages/page_02.png" },
  3: { voltage: "380 V", table: "continued table 3", pages: "PDF page 3; product_input/yjs_pages/page_03.png" },
  5: { voltage: "6000 V", table: "table 6", pages: "PDF page 5; product_input/yjs_pages/page_05.png" },
  6: { voltage: "6000 V", table: "continued table 6", pages: "PDF page 6; product_input/yjs_pages/page_06.png" },
  8: { voltage: "10000 V", table: "table 10", pages: "PDF page 8; product_input/yjs_pages/page_08.png" },
  9: { voltage: "10000 V", table: "continued table 10", pages: "PDF page 9; product_input/yjs_pages/page_09.png" },
};

const SYNC_SPEED_BY_POLE = {
  2: 3000,
  4: 1500,
  6: 1000,
  8: 750,
  10: 600,
};

const SPEED_RANGES_BY_POLE = {
  2: [2900, 3000],
  4: [1450, 1500],
  6: [970, 1000],
  8: [730, 750],
  10: [580, 600],
};

const OUTPUT_RANGES_BY_VOLTAGE = {
  "380 V": [45, 630],
  "6000 V": [220, 1600],
  "10000 V": [220, 1400],
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function csvEscape(value) {
  if (value === undefined || value === null) return "";
  const text = Array.isArray(value) || typeof value === "object"
    ? JSON.stringify(value)
    : String(value);
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(filePath, rows, headers) {
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")),
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function normalizeModel(raw) {
  const match = String(raw || "").match(MODEL_RE);
  if (!match) return null;
  return `YJS${match[1].toUpperCase()}-${match[2]}`;
}

function parseModel(model) {
  const match = model.match(MODEL_RE);
  return {
    frameNo: match[1].toUpperCase(),
    poles: Number(match[2]),
  };
}

function cleanNumberToken(text) {
  const normalized = String(text || "").trim().replace(/[()]/g, "");
  if (!OUTPUT_RE.test(String(text || "").trim())) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined))]
    .sort((a, b) => {
      if (typeof a === "number" && typeof b === "number") return a - b;
      return String(a).localeCompare(String(b));
    });
}

function scalarIfSingle(values) {
  return values.length === 1 ? values[0] : "";
}

function valuesNearOccurrences(lines, occurrenceIndexes, windowSize = 18) {
  const values = [];
  for (const index of occurrenceIndexes) {
    const start = Math.max(0, index - windowSize);
    const end = Math.min(lines.length, index + windowSize + 1);
    for (let i = start; i < end; i += 1) {
      if (i === index) continue;
      const num = cleanNumberToken(lines[i].text);
      if (num !== null) values.push(num);
    }
  }
  return values;
}

function candidateNumbers(values, predicate) {
  return uniqueSorted(values.filter(predicate));
}

function currentRangeForVoltage(voltage) {
  if (voltage === "380 V") return [100, 1200];
  if (voltage === "6000 V") return [25, 160];
  return [15, 100];
}

function buildProducts(lines, parent) {
  const groups = new Map();

  lines.forEach((line, index) => {
    const section = PAGE_SECTIONS[line.page];
    if (!section) return;
    const model = normalizeModel(line.text);
    if (!model) return;
    const key = `${section.voltage}|${model}`;
    if (!groups.has(key)) {
      groups.set(key, {
        model,
        voltage: section.voltage,
        pages: new Set(),
        tables: new Set(),
        occurrenceIndexes: [],
      });
    }
    const group = groups.get(key);
    group.pages.add(section.pages);
    group.tables.add(section.table);
    group.occurrenceIndexes.push(index);
  });

  return [...groups.values()]
    .sort((a, b) => {
      const voltageOrder = ["380 V", "6000 V", "10000 V"];
      const voltageDelta = voltageOrder.indexOf(a.voltage) - voltageOrder.indexOf(b.voltage);
      if (voltageDelta !== 0) return voltageDelta;
      const aParsed = parseModel(a.model);
      const bParsed = parseModel(b.model);
      const frameDelta = aParsed.frameNo.localeCompare(bParsed.frameNo, undefined, { numeric: true });
      if (frameDelta !== 0) return frameDelta;
      return aParsed.poles - bParsed.poles;
    })
    .map((group) => toReferenceProduct(lines, group, parent));
}

function toReferenceProduct(lines, group, parent) {
  const { frameNo, poles } = parseModel(group.model);
  const nearby = valuesNearOccurrences(lines, group.occurrenceIndexes);
  const [kwMin, kwMax] = OUTPUT_RANGES_BY_VOLTAGE[group.voltage];
  const [currentMin, currentMax] = currentRangeForVoltage(group.voltage);
  const [speedMin, speedMax] = SPEED_RANGES_BY_POLE[poles] || [0, 0];

  const kwCandidates = candidateNumbers(
    nearby,
    (value) => Number.isInteger(value) && value >= kwMin && value <= kwMax
  );
  const speedCandidates = candidateNumbers(
    nearby,
    (value) => Number.isInteger(value) && value >= speedMin && value <= speedMax
  );
  const efficiencyCandidates = candidateNumbers(
    nearby,
    (value) => value >= 90 && value <= 97 && !Number.isInteger(value)
  );
  const currentCandidates = candidateNumbers(
    nearby,
    (value) => value >= currentMin && value <= currentMax && value !== SYNC_SPEED_BY_POLE[poles]
  );
  const powerFactorCandidates = candidateNumbers(
    nearby,
    (value) => value >= 0.7 && value <= 0.93
  );
  const startingCurrentRatioCandidates = candidateNumbers(
    nearby,
    (value) => value >= 4 && value <= 8
  );
  const torqueRatioCandidates = candidateNumbers(
    nearby,
    (value) => value >= 1.1 && value <= 2.5
  );
  const weightCandidates = candidateNumbers(
    nearby,
    (value) => Number.isInteger(value) && value >= 1000 && value <= 8000
  );
  const inertiaCandidates = candidateNumbers(
    nearby,
    (value) => value >= 10 && value <= 2200 && value < 3000
  );

  const idFrame = frameNo.toLowerCase();
  const voltageId = group.voltage.replace(/\s+/g, "").toLowerCase();
  const id = `yjs_${voltageId}_${idFrame}_${poles}p`;
  const imagePath = parent.image_path || "";
  const pdfPath = parent.pdf_path || "raw_catalog/YJS.pdf";
  const sourcePages = [...group.pages].join("; ");

  return {
    id,
    name: `YJS ${frameNo} ${poles}-Pole Compact Three-Phase Asynchronous Motor (${group.voltage})`,
    category: "electric_motor",
    family: parent.family || "Electric Motor",
    series: parent.series || "YJS",
    model: group.model,
    frame_no: frameNo,
    rated_voltage: group.voltage,
    poles,
    kw: scalarIfSingle(kwCandidates),
    rated_speed_rpm: scalarIfSingle(speedCandidates),
    efficiency: scalarIfSingle(efficiencyCandidates),
    current: scalarIfSingle(currentCandidates),
    power_factor: scalarIfSingle(powerFactorCandidates),
    starting_current_ratio: scalarIfSingle(startingCurrentRatioCandidates),
    starting_torque_ratio: "",
    max_torque_ratio: "",
    weight_kg: scalarIfSingle(weightCandidates),
    load_moment_of_inertia: scalarIfSingle(inertiaCandidates),
    image_path: imagePath,
    image_url: imagePath ? `${GITHUB_RAW_BASE}/images/${imagePath}` : "",
    pdf_path: pdfPath,
    pdf_url: `${GITHUB_RAW_BASE}/Doc/YJS.pdf`,
    description: parent.description || "",
    technical_specifications: {
      "Product Type": "Compact IP54 three-phase cage induction motor",
      "Frame No": frameNo,
      "Rated Voltage": group.voltage,
      "Poles": poles,
      "Synchronous Speed (r/min)": SYNC_SPEED_BY_POLE[poles] || "",
      "kW": scalarIfSingle(kwCandidates),
      "Rated Speed (r/min)": scalarIfSingle(speedCandidates),
      "Efficiency (%)": scalarIfSingle(efficiencyCandidates),
      "Current (A)": scalarIfSingle(currentCandidates),
      "Power Factor": scalarIfSingle(powerFactorCandidates),
      "Starting Current Ratio (Ist/In)": scalarIfSingle(startingCurrentRatioCandidates),
      "Starting/Max Torque Ratio Candidates": torqueRatioCandidates,
      "Weight (kg)": scalarIfSingle(weightCandidates),
      "Load Moment of Inertia Candidates": inertiaCandidates,
      "OCR Candidate kW Values": kwCandidates,
      "OCR Candidate Rated Speeds": speedCandidates,
      "OCR Candidate Efficiencies": efficiencyCandidates,
      "OCR Candidate Currents": currentCandidates,
      "OCR Candidate Power Factors": powerFactorCandidates,
      "OCR Candidate Weights": weightCandidates,
      "Review Status": "needs_review",
    },
    dimension_specifications: {
      "Frame No": frameNo,
      "Rated Voltage": group.voltage,
      "Note": "Refer to YJS catalog outline and installation dimension pages for voltage/frame-specific dimensions.",
    },
    features: parent.features || [],
    applications: parent.applications || [],
    source_pdf: SOURCE_PDF,
    source_pages: sourcePages,
    source_tables: [...group.tables].join("; "),
    check_status: "needs_review",
    notes: "OCR found this YJS model in the voltage-specific technical data pages. Dense numeric table alignment is reviewable; scalar fields are only filled when the OCR candidate set has a single value.",
  };
}

function toFlatCsvRow(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    series: product.series,
    model: product.model,
    frame_no: product.frame_no,
    rated_voltage: product.rated_voltage,
    poles: product.poles,
    kw: product.kw,
    rated_speed_rpm: product.rated_speed_rpm,
    efficiency: product.efficiency,
    current: product.current,
    power_factor: product.power_factor,
    starting_current_ratio: product.starting_current_ratio,
    starting_torque_ratio: product.starting_torque_ratio,
    max_torque_ratio: product.max_torque_ratio,
    weight_kg: product.weight_kg,
    load_moment_of_inertia: product.load_moment_of_inertia,
    image_path: product.image_path,
    image_url: product.image_url,
    pdf_path: product.pdf_path,
    pdf_url: product.pdf_url,
    description: product.description,
    technical_specifications: product.technical_specifications,
    dimension_specifications: product.dimension_specifications,
    features: product.features,
    applications: product.applications,
    source_pages: product.source_pages,
    check_status: product.check_status,
    notes: product.notes,
  };
}

function buildCrosscheck(product) {
  const candidateSummary = [
    `kW candidates: ${product.technical_specifications["OCR Candidate kW Values"].join(", ") || "none"}`,
    `speed candidates: ${product.technical_specifications["OCR Candidate Rated Speeds"].join(", ") || "none"}`,
    "manual page-image review required before treating dense-table values as verified",
  ].join("; ");

  return {
    model: product.model,
    frame_no: product.frame_no,
    rated_voltage: product.rated_voltage,
    poles: product.poles,
    kw: product.kw,
    rated_speed_rpm: product.rated_speed_rpm,
    source_pdf: product.source_pdf,
    source_page: product.source_pages,
    check_status: product.check_status,
    notes: candidateSummary,
  };
}

function writeReadme(childCount, crosscheckRows) {
  const needsReview = crosscheckRows.filter((r) => r.check_status === "needs_review").length;
  const verified = crosscheckRows.filter((r) => r.check_status === "verified").length;
  const mismatch = crosscheckRows.filter((r) => r.check_status === "mismatch").length;

  const content = `# Electric Motor Product References

This folder contains durable reference exports for electric motor child models.

## MECC Y2/Y23 Files

- \`mecc_y2_y23_child_models.csv\` - spreadsheet-friendly MECC child model export with key technical fields flattened.
- \`mecc_y2_y23_child_models.json\` - build-friendly MECC child model export with nested specs, dimensions, features, and applications preserved as JSON.
- \`mecc_y2_y23_pdf_crosscheck.csv\` - per-model MECC PDF/OCR traceability report.

## YJS Files

- \`yjs_child_models.csv\` - spreadsheet-friendly YJS model export with voltage, frame, pole, OCR-derived candidate values, and trace fields.
- \`yjs_child_models.json\` - build-friendly YJS model export with shared parent copy plus nested OCR candidate specs.
- \`yjs_pdf_crosscheck.csv\` - per-model YJS PDF/OCR traceability report.

## YJS Sources

- Source PDF: \`${SOURCE_PDF}\`
- OCR text: \`${SOURCE_OCR}\`
- OCR/reference page images: \`${SOURCE_PAGES}\`
- Parent product copy: \`website/absolute-astronaut/src/data/products.json\` (\`yjs_parent\`)

## YJS Row Counts

- Child model rows: ${childCount}
- Cross-check rows: ${crosscheckRows.length}
- Verified rows: ${verified}
- Needs-review rows: ${needsReview}
- Mismatch rows: ${mismatch}

## YJS Cross-Check Notes

The YJS catalog is scanned and the technical tables are dense. The exporter identifies model labels by voltage-specific technical-data pages and captures nearby OCR numeric candidates for kW, speed, efficiency, current, power factor, torque ratios, weight, and inertia.

All YJS rows are currently marked \`needs_review\`. Scalar technical fields are filled only when the OCR candidate set has one value; otherwise the candidate values remain in \`technical_specifications\` and the row should be checked against the page image before publication.

MECC rows are left as previously exported reference data. YJS rows are reference artifacts only and are not merged into the live website product catalog by this exporter.
`;

  fs.writeFileSync(README, content, "utf8");
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const lines = readJson(OCR_JSON);
  const products = readJson(WEBSITE_PRODUCTS_JSON);
  const parent = products.find((product) => product.id === "yjs_parent");
  if (!parent) throw new Error("Could not find yjs_parent in website products data.");

  const childProducts = buildProducts(lines, parent);
  const crosscheckRows = childProducts.map(buildCrosscheck);

  writeCsv(CHILD_CSV, childProducts.map(toFlatCsvRow), [
    "id",
    "name",
    "category",
    "series",
    "model",
    "frame_no",
    "rated_voltage",
    "poles",
    "kw",
    "rated_speed_rpm",
    "efficiency",
    "current",
    "power_factor",
    "starting_current_ratio",
    "starting_torque_ratio",
    "max_torque_ratio",
    "weight_kg",
    "load_moment_of_inertia",
    "image_path",
    "image_url",
    "pdf_path",
    "pdf_url",
    "description",
    "technical_specifications",
    "dimension_specifications",
    "features",
    "applications",
    "source_pages",
    "check_status",
    "notes",
  ]);

  fs.writeFileSync(CHILD_JSON, `${JSON.stringify(childProducts, null, 2)}\n`, "utf8");

  writeCsv(CROSSCHECK_CSV, crosscheckRows, [
    "model",
    "frame_no",
    "rated_voltage",
    "poles",
    "kw",
    "rated_speed_rpm",
    "source_pdf",
    "source_page",
    "check_status",
    "notes",
  ]);

  writeReadme(childProducts.length, crosscheckRows);

  console.log(`Wrote ${childProducts.length} child models to ${CHILD_CSV}`);
  console.log(`Wrote ${childProducts.length} child models to ${CHILD_JSON}`);
  console.log(`Wrote ${crosscheckRows.length} cross-check rows to ${CROSSCHECK_CSV}`);
  console.log(`Wrote ${README}`);
}

if (require.main === module) {
  main();
}
