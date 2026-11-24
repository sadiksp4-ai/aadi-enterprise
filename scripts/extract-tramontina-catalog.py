"""
Convert the Tramontina catalogue PDF into WebP page images and a JSON index.

Usage:
    python scripts/extract-tramontina-catalog.py
    python scripts/extract-tramontina-catalog.py "path/to/catalogue.pdf"

Outputs (relative to the repo root):
    public/catalogs/tramontina/pages/page-001.webp, page-002.webp, ...
    public/catalogs/tramontina/index.json
"""

import json
import re
import sys
from pathlib import Path

import pymupdf
from PIL import Image

DEFAULT_PDF = "../gitignore/Tramontina Catalougue May.pdf"
DPI = 150
WEBP_QUALITY = 82
# Tramontina product codes appear in the PDF text layer in two formats:
#   - 8 digits, e.g. 98051029 or 24000103 (cookware, knives, utensils)
#   - 5/3 digits with a slash, e.g. 22902/105 (legacy/other lines)
# 6-digit numbers printed beside "7891112" are EAN-13 barcode suffixes, not SKUs.
SKU_PATTERNS = [
    re.compile(r"(?<![\d/])\d{8}(?![\d/])"),
    re.compile(r"(?<![\d/])\d{5}/\d{3}(?![\d/])"),
]

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "public" / "catalogs" / "tramontina"
PAGES_DIR = OUT_DIR / "pages"
INDEX_PATH = OUT_DIR / "index.json"
WEB_BASE = "/catalogs/tramontina/pages"


def main() -> None:
    pdf_arg = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_PDF
    pdf_path = (REPO_ROOT / pdf_arg).resolve() if not Path(pdf_arg).is_absolute() else Path(pdf_arg)
    if not pdf_path.exists():
        raise SystemExit(f"PDF not found: {pdf_path}")

    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    scale = DPI / 72.0
    matrix = pymupdf.Matrix(scale, scale)

    pages = []
    with pymupdf.open(pdf_path) as doc:
        total = doc.page_count
        print(f"Opened {pdf_path.name}: {total} pages")

        for index in range(total):
            page = doc[index]
            number = index + 1
            name = f"page-{number:03d}.webp"

            pix = page.get_pixmap(matrix=matrix, alpha=False)
            img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            img.save(PAGES_DIR / name, "WEBP", quality=WEBP_QUALITY, method=6)

            text = page.get_text("text")
            clean_text = re.sub(r"[ \t]+", " ", text).strip()
            skus = sorted({sku for pattern in SKU_PATTERNS for sku in pattern.findall(clean_text)})

            pages.append(
                {
                    "page": number,
                    "image": f"{WEB_BASE}/{name}",
                    "skus": skus,
                    "text": clean_text,
                }
            )

            if number % 10 == 0 or number == total:
                print(f"  {number}/{total} pages rendered")

    unique_skus = {sku for entry in pages for sku in entry["skus"]}
    pages_with_skus = sum(1 for entry in pages if entry["skus"])
    print(f"SKUs: {len(unique_skus)} unique across {pages_with_skus} pages")
    if not unique_skus:
        print("Warning: no SKUs found in the text layer; OCR may be required for image-only tables.")

    index_doc = {"totalPages": total, "pages": pages}
    INDEX_PATH.write_text(json.dumps(index_doc, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {INDEX_PATH.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
