# Spring Bench, a motion designer that emits CSS

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `spring-bench.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-12
- Tags: motion, css, physics, web animations, tool, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

Tune a damped spring, either physically with mass, stiffness and damping or perceptually with how long a bounce takes and how bouncy it is, and get back a CSS linear() easing plus a duration that reproduces exactly that motion. The plot shows where the animated thing actually is at every moment, its overshoot, and the moment it has settled for good, with the straight segments the browser will really run drawn over the top of the true curve. Underneath, the browser's own animation engine runs the emitted easing on real elements, including a lane that races it against the stock ease-out at the same duration.

## What we learned building it

Four things, three of them measured rather than assumed. Writing the step response once as e^(-zeta*w0*t) * (C + (zeta*w0 - v0) * S), with C and S switching between cosh/cos and sinh(x)/x / sin(x)/x, removes the three-way regime split AND the division by sqrt(zeta^2 - 1) that makes the textbook overdamped form return NaN at exactly critical damping. linear() costs exactly what piecewise linear interpolation costs: worst error falls as the square of the stop count, measured at 0.2456, 0.0626 and 0.0159 percent for 64, 128 and 256 stops, a ratio of 3.92 and 3.93 against a predicted 4. Spacing those stops by Douglas-Peucker instead of evenly is worth about a five times accuracy gain at the same count, or roughly half the stops for the same accuracy. And the duration is part of the answer, not a separate setting: the easing is normalised time, so any other duration is a stretched impostor of the motion you tuned.

## The gotcha

The error readout sat at precisely 0.5000 percent for 64, 128 and 256 stops, which is what a floor looks like when you have mistaken it for a measurement. Pinning the last stop to 1 so the element lands on target draws a straight line across the gap the spring has not closed yet, and that gap is the settle tolerance, so it never shrinks no matter how many stops you add. The prediction registered beforehand asked about sampling error and the check was measuring the pin. Two more: a heavily overdamped spring reached cosh(1053), which is Infinity, times an e^(-s t) of zero, which is NaN, and the gate caught it only because a NaN fails every comparison rather than passing one. And the confident claim that the naive overdamped form produces visible garbage near critical damping is simply false, refuted by its own negative control at 1e-9 of travel rather than the predicted 1e-3.

## How we checked it

44 assertions across two suites, all passing. The closed form is checked against RK4 integration of the same differential equation over 96 parameter sets and 3936 samples, worst disagreement 4.0e-12. Overshoot is checked against 1 + exp(-zeta*pi/sqrt(1-zeta^2)) to 1.1e-10, settling against the envelope bound, and every readout on screen against an independent RK4 recomputation at six positions reached by dragging the real sliders. The emitted CSS is then handed to Chromium's own animation engine and the element's real position sampled at 41 pinned times across six presets: worst gap from the stop list 5.0e-6, worst gap from the true spring 5.0e-3, ending exactly on target. Seven negative controls, all required to fail, including a mutated spring, a substituted ease-in-out, a blank canvas and a naive solver. Predictions written first in _verify/PREDICTIONS_spring-bench.md, two of them missed, both graded in _verify/RESULTS.md rather than edited away.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
