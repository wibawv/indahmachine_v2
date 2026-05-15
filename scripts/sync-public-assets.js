const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT_DIR, "website", "absolute-astronaut", "public");

function syncAssetDir(relName) {
  const src = path.join(ROOT_DIR, relName);
  const dest = path.join(PUBLIC, relName);

  if (!fs.existsSync(src)) {
    console.error("sync-public-assets: missing source directory:", src);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log("sync-public-assets:", src, "->", dest);
}

// Mirror specific PDFs into public/Doc/ so legacy URLs like
//   https://indahmachine.com/Doc/Power_Press.pdf
// (recorded in the historical Search Console export) still resolve to the
// real PDF content with a 200. Avoids dangling "Crawled - currently not
// indexed" entries for the old `/Doc/*.pdf` paths while we wait for Google to
// recrawl. Each entry maps a public/Doc/<name> target to its raw_catalog source.
function syncLegacyPdfAliases() {
  const aliases = {
    "Power_Press.pdf": "Power_Press.pdf",
    "ucw_alternator.pdf": "ucw_alternator.pdf",
    "Brushless_Alt.pdf": "Brushless_Alt.pdf",
    "yptz_yptq_series.pdf": "yptz_yptq_series.pdf",
    "tzh-n_alternator.pdf": "tzh-n_alternator.pdf",
    "YJS.pdf": "YJS.pdf",
  };
  const destDir = path.join(PUBLIC, "Doc");
  fs.mkdirSync(destDir, { recursive: true });
  for (const [destName, srcName] of Object.entries(aliases)) {
    const src = path.join(ROOT_DIR, "raw_catalog", srcName);
    const dest = path.join(destDir, destName);
    if (!fs.existsSync(src)) {
      console.error("sync-public-assets: missing legacy PDF source:", src);
      process.exit(1);
    }
    fs.copyFileSync(src, dest);
    console.log("sync-public-assets:", src, "->", dest);
  }
}

syncAssetDir("base44_product_image");
syncAssetDir("raw_catalog");
syncLegacyPdfAliases();
