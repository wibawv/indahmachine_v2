---
name: indah-product-image
description: Create polished Indah Machine website product images from catalog PDFs, scanned catalog pages, supplier photos, or rough product references. Use when a user asks to cut out, isolate, clean up, crop, enhance, regenerate, or make a website/product image for Indah Machine products such as motors, alternators, presses, and industrial equipment, especially when source images have catalog text, logos, gray bands, scan artifacts, rough cutout edges, or low-resolution product art.
---

# Indah Product Image

## Goal

Produce a website-ready product image for this project with minimum user back-and-forth:

- clean white ecommerce background by default
- product centered on a square canvas
- no catalog text, logos, page graphics, gray diagonal bands, watermarks, or cutout artifacts
- preserve the real product when extraction is good; regenerate from reference when scan/cutout quality is not good enough

## Project Conventions

- Put final assets in `base44_product_image/`.
- Use stable names like `<product_slug>_product.png`; for YJS specifically use `base44_product_image/yjs_motor_product.png`.
- Preserve original source files such as PDFs and raw JPGs unless the user explicitly asks to delete them.
- Keep temporary/generated attempts out of the final folder, or delete them after the user picks a keeper.
- For website images, prefer `1000x1000` or larger square PNG with pure white background unless the user requests transparency.

## Workflow

1. Inspect the source first.
   - For PDFs, use `scripts/extract_first_page_image.py` to extract the embedded first-page image before trying screenshots or low-res thumbnails.
   - View the extracted image and identify the product, background obstacles, and whether any product edges overlap a gray band or white paper.

2. Decide extraction vs regeneration.
   - Use extraction only when the product boundary is clear and no important pale/low-contrast parts will be lost.
   - Use regeneration when the source has scan blur, rough edges, missing contours, difficult background overlap, or repeated manual mask failures.
   - If the user says "do not recreate/redraw/regenerate," stay with extraction and tell them any quality limits.
   - If the user says "make it nicely" or accepts regeneration, use the image generation tool with the source as a design reference.

3. For extraction.
   - Build a mask at source resolution and validate on both checkerboard and white previews.
   - Do not rely only on color thresholds for pale metal parts; preserve important product areas spatially.
   - On a final white-background image, it is acceptable for tiny white-paper remnants to blend into the white canvas, but gray band remnants must be removed.
   - Check the top housing, left top body, front shaft, and right-side edge carefully; these were failure points in the YJS exercise.

4. For regeneration.
   - Use the source image only as a reference for product design, proportions, angle, colors, labels, housing, feet, shaft, and major features.
   - Prompt for a clean realistic product photo/render on pure white background.
   - Explicitly forbid catalog page text, logos, gray diagonal bands, watermarks, rough cutout edges, missing parts, extra cables, and incorrect product shape.
   - Save the chosen generated image into `base44_product_image/`; do not leave the keeper only under `.codex/generated_images`.

5. Validate before final.
   - View the final image.
   - Confirm the product is not cut off.
   - Confirm background corners are pure white for white-background output.
   - Confirm no old cutout artifacts remain on right edges, top housing, front shaft, or base feet.
   - If the user picks a keeper and asks to delete attempts, keep original raw sources and delete only generated/intermediate attempts.

## References

- Use `references/regeneration-prompt.md` when writing prompts for generated product images.
- Use `scripts/extract_first_page_image.py` for PDF first-page image extraction.
