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

syncAssetDir("base44_product_image");
syncAssetDir("raw_catalog");
