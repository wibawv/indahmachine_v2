# -*- coding: utf-8 -*-
"""
Fix common UTF-8-as-Windows-1252-then-re-UTF-8 mojibake in products.json.

Run from repo root: python scripts/fix-products-mojibake.py
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = [
    ROOT / "website" / "absolute-astronaut" / "src" / "data" / "products.json",
    ROOT / "products.json",
]

# (bad_bytes, good_bytes, label) — order matters: longer/specific first
FIXES: list[tuple[bytes, bytes, str]] = [
    # U+00D7 MULTIPLICATION SIGN (C3 97) mis-decoded as Latin-1 then UTF-8:
    # Ã (C3 83) + — em dash U+2014 (E2 80 94)
    (
        b"\xc3\x83\xe2\x80\x94",
        "\u00d7".encode("utf-8"),
        "multiplication sign (× mojibake) -> U+00D7",
    ),
    # U+2011 NON-BREAKING HYPHEN (E2 80 91) mis-decoded as Win1252 then UTF-8:
    # â (C3 A2) + € (E2 82 AC) + ' U+2018 (E2 80 98)
    (
        b"\xc3\xa2\xe2\x82\xac\xe2\x80\x98",
        b"-",
        "NB hyphen (U+2011 mojibake) -> ASCII hyphen",
    ),
    # U+2212 MINUS SIGN (E2 88 92) mis-decoded then UTF-8:
    # â (C3 A2) + ˆ U+02C6 (CB 86) + ' U+2019 (E2 80 99) — displays as âˆ'
    (
        b"\xc3\xa2\xcb\x86\xe2\x80\x99",
        b"-",
        "minus sign (U+2212 mojibake) -> ASCII hyphen",
    ),
    # U+2013 EN DASH (E2 80 93) triple mojibake â€" (left double quote U+201C at end)
    (
        b"\xc3\xa2\xe2\x82\xac\xe2\x80\x9c",
        "\u2013".encode("utf-8"),
        "en dash (U+2013 mojibake) -> U+2013",
    ),
    # Already-handled in prior runs; keep idempotent
    (
        b"\xc3\x82\xc2\xb1",
        "\u00b1".encode("utf-8"),
        "plus-minus mojibake",
    ),
    (
        b"\xc3\x82\xc2\xb0",
        "\u00b0".encode("utf-8"),
        "degree mojibake",
    ),
    (
        b"\xc3\x82\xc2\xb7",
        "\u00b7".encode("utf-8"),
        "middle dot mojibake",
    ),
    (
        b"\xc3\xa2\xe2\x80\xb0\xc2\xa4",
        "\u2264".encode("utf-8"),
        "less-equal mojibake",
    ),
    (
        b"\xc3\xa2\xe2\x80\xb0\xc2\xa5",
        "\u2265".encode("utf-8"),
        "greater-equal mojibake",
    ),
]


def main() -> int:
    for fpath in FILES:
        if not fpath.is_file():
            print(f"skip (missing): {fpath}", file=sys.stderr)
            continue
        raw = fpath.read_bytes()
        total = 0
        log: list[str] = []
        for bad, good, label in FIXES:
            n = raw.count(bad)
            if n:
                raw = raw.replace(bad, good)
                total += n
                log.append(f"    {label}: {n}")
        if total:
            fpath.write_bytes(raw)
            print(f"{fpath}:")
            print("\n".join(log))
            print(f"    total: {total}\n")
        else:
            print(f"{fpath}: no fixes applied\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
