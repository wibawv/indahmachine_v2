# Regeneration Prompt Pattern

Use this when extraction/cutout quality is not good enough and the user permits regeneration.

```text
Use case: product-mockup
Asset type: ecommerce website product image for Indah Machine
Primary request: Regenerate a clean, professional product image of <PRODUCT> using the provided reference image as the design source.
Input image role: reference for product shape, orientation, proportions, main features, color family, labels, housing, mounting feet, and visible mechanical details.
Scene/backdrop: pure white seamless background, no catalog page, no gray diagonal band, no text, no logo, no watermark.
Subject: <PRODUCT DESCRIPTION>, matching the reference angle and major features.
Style/medium: realistic clean product photography / high-quality ecommerce catalog render, crisp but natural, not cartoon, not illustration.
Composition/framing: centered on a square canvas, 3/4 product angle like the reference, full product visible, no parts cut off.
Lighting/mood: soft even studio lighting, balanced contrast, polished professional look.
Materials/textures: realistic industrial metal finish; preserve the source color family unless the user asks for a color change.
Constraints: keep close to the reference design and color; make the product complete and clean; no page text, brand logos, Chinese text, English catalog title, hands, tools, or packaging.
Avoid: rough cutout edges, missing top housing, jagged right edge, blurry scan artifacts, oversaturated colors, incorrect product shape, extra cables, extra components.
```

For YJS motors, describe the product as:

```text
YJS Series compact 3-phase asynchronous motor / alternator, light teal-gray metal body, ribbed cylindrical housing, circular front flange, dark blue-black shaft, top terminal box, base mounting feet, small yellow/orange labels.
```
