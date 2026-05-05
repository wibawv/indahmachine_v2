# Electric Motor Product References

This folder contains durable reference exports for electric motor child models.

## MECC Y2/Y23 Files

- `mecc_y2_y23_child_models.csv` - spreadsheet-friendly MECC child model export with key technical fields flattened.
- `mecc_y2_y23_child_models.json` - build-friendly MECC child model export with nested specs, dimensions, features, and applications preserved as JSON.
- `mecc_y2_y23_pdf_crosscheck.csv` - per-model MECC PDF/OCR traceability report.

## YJS Files

- `yjs_child_models.csv` - spreadsheet-friendly YJS model export with voltage, frame, pole, OCR-derived candidate values, and trace fields.
- `yjs_child_models.json` - build-friendly YJS model export with shared parent copy plus nested OCR candidate specs.
- `yjs_pdf_crosscheck.csv` - per-model YJS PDF/OCR traceability report.

## YJS Sources

- Source PDF: `website/absolute-astronaut/public/raw_catalog/YJS.pdf`
- OCR text: `product_input/yjs_ocr_lines.json`
- OCR/reference page images: `product_input/yjs_pages/page_*.png`
- Parent product copy: `website/absolute-astronaut/src/data/products.json` (`yjs_parent`)

## YJS Row Counts

- Child model rows: 60
- Cross-check rows: 60
- Verified rows: 0
- Needs-review rows: 60
- Mismatch rows: 0

## YJS Cross-Check Notes

The YJS catalog is scanned and the technical tables are dense. The exporter identifies model labels by voltage-specific technical-data pages and captures nearby OCR numeric candidates for kW, speed, efficiency, current, power factor, torque ratios, weight, and inertia.

All YJS rows are currently marked `needs_review`. Scalar technical fields are filled only when the OCR candidate set has one value; otherwise the candidate values remain in `technical_specifications` and the row should be checked against the page image before publication.

MECC rows are left as previously exported reference data. YJS rows are reference artifacts only and are not merged into the live website product catalog by this exporter.
