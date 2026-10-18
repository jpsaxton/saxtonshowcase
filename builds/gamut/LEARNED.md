# Gamut, an OKLCH palette forge

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `gamut.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-03
- Tags: colour, oklch, gamut mapping, accessibility, design tokens, tool
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

Pick a hue and a chroma, get a twelve step ramp, WCAG contrast for every step, and CSS custom properties you can paste into a real page. The picture in the middle is a slice through the sRGB gamut at the hue you are on, lightness up the side and chroma across, with everything paintable painted and everything outside hatched, so dragging the hue shows you directly why a bright saturated yellow exists and a bright saturated blue does not. Three switchable answers to a colour that does not fit: hold the hue and give up saturation, do what CSS Color 4 describes, or clip. The Prove it panel asks Chromium to paint the same colours and puts its pixels next to this file's arithmetic.

## What we learned building it

getComputedStyle does NOT resolve oklch() to sRGB, it hands the oklch() straight back, so the obvious way to ask the browser for a second opinion returns your own question; the canvas rasteriser does resolve it, because an 8 bit surface leaves it no choice. The published Oklab matrices are only mutual inverses to 4e-8, since the forward and backward constants were each rounded to ten decimals on their own, and THAT rather than floating point sets the round trip floor: 1.6e-6 published against 4.3e-14 with a numerically exact inverse, a factor of 37 million. CSS Color 4's gamut mapper is allowed to drift the hue and does, 4.32 degrees on average against 0.0004 for a strict chroma reduction, because it accepts a clipped colour whenever the clipping costs less than one just noticeable difference. And the most chromatic corner of sRGB is magenta near hue 328, not blue: yellow is the BRIGHTEST corner at L 0.97 and one of the LEAST chromatic, which is the reverse of what I wrote down.

## The gotcha

The contrast table computed WCAG ratios from the unquantised float while displaying the quantised hex, so every printed number described a colour nobody would ever paste. An independent recomputation from the rendered hex found gaps up to 0.045, nine times the rounding of a two decimal display, and the page's own maths would have certified it forever. Same shape as every previous build here: the numbers were right and they were right about the wrong thing. Two more only the browser could show: the theme button did nothing at all on a light system, and one negative control could not fail because 512 colours did not contain a case where the error crossed a rounding boundary. At 2,744 it does.

## How we checked it

61 gate assertions across two suites, all green, plus 14 predictions written before a line of the build existed and graded without amendment: 3 hit, 10 missed, and the misses caused two rewrites of the build's own claims and one new feature. The independent source is Chromium's colour engine reached through the canvas rasteriser, agreeing with this file on 4,096 of 4,096 colours with a worst channel gap of zero. Five negative controls, and the probe's sensitivity is measured rather than assumed: it sees a 3e-5 relative coefficient error, the gate catches 3e-4. Also recorded, because the platform lied about it: a canvas asked for float16 reports float16 and hands back 8 bit anyway. Receipts in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
