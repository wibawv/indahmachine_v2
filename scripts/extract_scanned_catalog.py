"""
Lightweight OCR extractor for scanned catalog PDFs.

Outputs:
- <prefix>_ocr_lines.json
- <prefix>_model_candidates.csv

Use this as a staging tool. Do not publish extracted rows
without manual validation against the PDF.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
from pathlib import Path

from PIL import Image
from pypdf import PdfReader
from rapidocr_onnxruntime import RapidOCR


MODEL_PATTERNS = [
    re.compile(r"\bECO\s*\d+[A-Z0-9-]*\b", re.IGNORECASE),
    re.compile(r"\bECP\s*\d+[A-Z0-9-]*\b", re.IGNORECASE),
    re.compile(r"\bTZH[-\s]?[A-Z0-9]+\b", re.IGNORECASE),
    re.compile(r"\bUCW[-\s]?[A-Z0-9._-]+\b", re.IGNORECASE),
]


def extract_lines(pdf_path: Path) -> list[dict]:
    reader = PdfReader(str(pdf_path))
    ocr = RapidOCR()
    rows: list[dict] = []

    for page_idx, page in enumerate(reader.pages, start=1):
        images = list(page.images)
        if not images:
            continue

        with Image.open(io.BytesIO(images[0].data)) as source_img:
            img = source_img.convert("RGB")
        temp_path = pdf_path.parent / f".tmp_ocr_page_{page_idx}.png"
        img.save(temp_path)
        img.close()

        try:
            result, _ = ocr(str(temp_path))
        finally:
            try:
                temp_path.unlink(missing_ok=True)
            except PermissionError:
                pass
        if not result:
            continue

        for item in result:
            text = (item[1] or "").strip()
            if not text:
                continue
            score = float(item[2]) if len(item) > 2 else 0.0
            rows.append({"page": page_idx, "text": text, "score": score})

    return rows


def detect_model_candidates(lines: list[dict]) -> list[dict]:
    candidates: list[dict] = []
    seen: set[tuple[int, str]] = set()

    for row in lines:
        text = row["text"]
        for pattern in MODEL_PATTERNS:
            for m in pattern.finditer(text):
                model = re.sub(r"\s+", " ", m.group(0)).strip()
                key = (row["page"], model.upper())
                if key in seen:
                    continue
                seen.add(key)
                candidates.append(
                    {
                        "page": row["page"],
                        "model_candidate": model,
                        "line_text": text,
                        "ocr_score": row["score"],
                    }
                )
    return candidates


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True, help="Absolute path to scanned PDF")
    parser.add_argument(
        "--out-prefix",
        required=True,
        help="Absolute output prefix path (without extension)",
    )
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    out_prefix = Path(args.out_prefix)
    out_prefix.parent.mkdir(parents=True, exist_ok=True)

    lines = extract_lines(pdf_path)
    candidates = detect_model_candidates(lines)

    lines_path = Path(f"{out_prefix}_ocr_lines.json")
    with open(lines_path, "w", encoding="utf-8") as f:
        json.dump(lines, f, ensure_ascii=False, indent=2)

    cand_path = Path(f"{out_prefix}_model_candidates.csv")
    with open(cand_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(
            f, fieldnames=["page", "model_candidate", "line_text", "ocr_score"]
        )
        writer.writeheader()
        writer.writerows(candidates)

    print(f"Wrote {lines_path}")
    print(f"Wrote {cand_path}")
    print("Manual QA required before product JSON updates.")


if __name__ == "__main__":
    main()
