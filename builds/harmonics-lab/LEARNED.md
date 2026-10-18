# Harmonics Lab

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `harmonics-lab.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-23
- Tags: web audio, additive synthesis, fourier, sound, self-verifying, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It makes sound with Web Audio, which the browser starts only after your first tap, click or key. It saves nothing.

## What it is

An additive synthesis bench: sixteen sliders, one per harmonic, so dragging them is writing a Fourier series by hand. Hold the drone with space and paint the bars while it sounds. Presets load the exact classical coefficients for a sawtooth, a square, a triangle and an impulse, and a partial limit lets you watch a shape assemble out of nothing but sine waves. The Prove it panel renders the same patch through a real OfflineAudioContext and compares the returned samples against the curve on screen, so the toy audits its own picture in front of you.

## What we learned building it

Four things, all measured rather than remembered. createPeriodicWave is x(t) = sum real[k]cos(2 pi k t) + imag[k]sin(2 pi k t), both terms positive, index 0 ignored. The engine NORMALIZES a periodic wave unless you pass disableNormalization, so a lone sine asked for at 0.25 comes back at a peak of 1.0 and the sliders stop meaning anything. Phase is nearly inaudible and violently visible: random phase on a sawtooth destroys the ramp and moves the spectrum not at all. And Gibbs overshoot never shrinks, converging on (2/pi)*Si(pi) = 1.178980 times the half jump for every finite partial count.

## The gotcha

Both real bites landed in the verifier, not the build. The canvas audit read the grey zero line as part of the curve, because clearRect leaves a canvas transparent rather than painting the CSS background, so a 55% alpha grey stroke reads back at near full strength: one stray pixel per column, up to 36 px of error. Then a stubborn 2 px residual turned out to track the local slope at a ratio of 1.00, which is a horizontal half-pixel offset and not a drawing fault, because a 2 px stroke lays ink in more than one column. Asserting an exact y per column would have been asserting a guess about Skia's coverage rule.

## How we checked it

88 assertions across two suites, 28 on theory and the audio engine and 60 end to end through real drags, clicks, focus and keypresses. The Gibbs overshoot is predicted in closed form and matched to five decimal places. Every preset's rendered audio is compared to the drawn curve sample by sample (worst 0.00016). Six negative controls, all required to fail: an inverted sine term, one harmonic halved, a mirrored curve, a curve 25% too short, a curve slid 6 px, and the platform's own normalization turned back on. One bug was found by looking at a screenshot rather than by an assertion, a stale verdict left on screen after the patch changed, and it now has a test. Receipts in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
