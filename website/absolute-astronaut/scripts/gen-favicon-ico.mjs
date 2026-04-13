import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pngPath = path.join(__dirname, "../public/base44_product_image/IMC_Logo.png");
const outPath = path.join(__dirname, "../public/favicon.ico");

const sizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  sizes.map((size) =>
    sharp(pngPath)
      .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer(),
  ),
);

const buf = await pngToIco(pngBuffers);
fs.writeFileSync(outPath, buf);
