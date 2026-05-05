#!/usr/bin/env python3
"""Extract the first embedded image from the first page of a PDF."""

from __future__ import annotations

import argparse
from pathlib import Path

from pypdf import PdfReader


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Extract the first embedded image from page 1 of a PDF."
    )
    parser.add_argument("pdf", type=Path, help="Input PDF path")
    parser.add_argument(
        "--out",
        type=Path,
        required=True,
        help="Output image path, for example base44_product_image/yjs_page1.jpg",
    )
    args = parser.parse_args()

    reader = PdfReader(str(args.pdf))
    if not reader.pages:
        raise SystemExit(f"No pages found: {args.pdf}")

    images = list(reader.pages[0].images)
    if not images:
        raise SystemExit(f"No embedded images found on page 1: {args.pdf}")

    image = images[0]
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_bytes(image.data)
    print(args.out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
