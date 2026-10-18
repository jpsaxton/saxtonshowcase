# Pluck, a Karplus-Strong string lab

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `pluck.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-24
- Tags: audio, dsp, web audio, synthesis, instrument, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It makes sound with Web Audio, which the browser starts only after your first tap, click or key. It saves nothing.

## What it is

A playable six string instrument where every note comes out of one short loop: a ring buffer, a filter, and a feedback path. Click the fretboard, play the keyboard, or strum a chord, and watch the loop buffer itself while the note rings, starting as a jagged burst of noise and getting rounded off a little more on every trip around until only the fundamental is left. Knobs for excitation, brightness, decay, pick position and sign coherence, plus a switch between a properly tuned loop and the naive one so you can hear what the tuning filter is worth.

## What we learned building it

A plain Karplus-Strong loop cannot play in tune, because a delay line holds a whole number of samples and the pitches it can make are therefore sample rate over N. The fix is a first order allpass in the loop supplying the leftover fraction, with an exact coefficient rather than the usual low frequency approximation. Two harder lessons came out of being wrong: a delay line is a bucket brigade, so a loop gain lands once per trip around the buffer and not once per elapsed sample, and setting an allpass coefficient to zero does not switch the filter off, it turns it into an extra sample of delay.

## The gotcha

Both of those bugs had the code and my own closed form agreeing with each other, because both carried the same wrong model. The decay one then hid behind a NaN: the check compared a measured value that was NaN against a prediction, every comparison came back false, and the gate reported a zero percent gap. A false pass concealing a real defect, in the one place built to catch it.

## How we checked it

Pitch measured on all 78 notes of the fretboard by two independent estimators that the synthesiser does not contain, autocorrelation and a windowed DFT: worst error 0.27 cents, median 0.057, the two agreeing within 0.25 cents everywhere. Notch depth, decay rate against a closed form, reproducibility, and the drum mode all measured off the raw samples. Three negative controls plus a blank canvas control confirm the checkers fail on a broken build. 70 assertions across two suites, predictions written first in PREDICTIONS_pluck.md, receipts in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
