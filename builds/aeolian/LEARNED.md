# Aeolian, a wind harp

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `aeolian.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-15
- Tags: audio, physics, generative, karplus-strong, curl noise, oklch, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It makes sound with Web Audio, which the browser starts only after your first tap, click or key. It saves nothing.

## What it is

Nine strings in a dark room and a wind that plays them. The wind is a curl noise field, so it is divergence free and swirls past the strings instead of piling up against them. The strings are Verlet chains pinned at both ends. When the wind bends one far enough it plucks, and you hear a Karplus-Strong voice tuned to that string's own pitch. Nothing is sequenced and nothing is random at the note level: you are listening to the physics. Drag through the strings to play it yourself, or turn the wind down to nothing and it goes silent, which is the point rather than a feature.

## What we learned building it

This is the first build here that is not a single technique, and the reuse is the interesting part. Two traps `pluck` had already paid for were carried over rather than re-derived: a plain Karplus-Strong loop cannot play in tune because a delay line holds a whole number of samples, fixed by a first order allpass with the closed form coefficient a = sin((1-d)w/2)/sin((1+d)w/2), and a delay line is a bucket brigade so the loop gain lands once per trip rather than once per sample. Measured here: every string within 0.083 cents of equal temperament, and the naive version flat by up to 9.6. The new lesson is that an inherited lesson's MAGNITUDE does not travel with it. `pluck` was a guitar whose top notes have a 50 sample loop where one sample is tens of cents; these strings run 132 to 399 samples, so the same error is a quarter of the size. The rule survives, the number does not.

## The gotcha

Three of the four real defects were things that were working exactly as written and were wrong anyway. The wind gain gave a deflection of 0.17 px against a 13 px trigger, so the harp could not make a sound at any setting, and nothing said so because quiet and silent look identical. Every lit string colour was outside sRGB and being silently clamped, so the screen showed a colour that was simply not the one being asked for, which is the thing `gamut` exists to catch. And the trigger threshold was an absolute pixel count on a canvas of any width, which is a bug about screens rather than physics. The fourth was in the checker, again: T60 read 17% low for three attempts because total-energy RMS blends several decay rates, and the model had been right the whole time.

## How we checked it

16 assertions, green, predictions written first in _verify/PREDICTIONS_aeolian.md with three recorded misses, including one where I quoted a lesson from `pluck` in the predictions file and then predicted against it two paragraphs later. Pitch measured by autocorrelation the synthesiser does not contain: worst 0.083 cents over nine strings against targets computed independently. T60 measured with a Goertzel on the fundamental, 2.57s against 2.6s requested. The curl field's divergence is 0.49% of mean speed. Four negative controls: an untuned render 115x worse, still air proven exactly silent, per-string hysteresis proven to never double-fire, and a determinism check. The trigger threshold was set by measuring note rate against a target written down first, not by eye.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
