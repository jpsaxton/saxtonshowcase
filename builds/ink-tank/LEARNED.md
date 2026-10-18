# Ink Tank, a stable fluids sandbox

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `ink-tank.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-20
- Tags: fluid dynamics, simulation, canvas, numerical methods, toy, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

A tank of fluid you drag your finger through. There is no particle system and no painting: the colour is three scalar fields being carried by a velocity field that gets solved back to incompressible sixty times a second, using Jos Stam's Stable Fluids. Four views of the same instant are on a switch, so you can look at the dye, or at the velocity moving it, or at the pressure the solver invents to stop the water compressing, or at the divergence it has not finished removing. A stats strip reads out what the solver actually achieved this frame rather than what it was asked to do, and the sweeps slider is wired straight to it.

## What we learned building it

Twenty iterations is a look, not a solve: on a smooth field Stam's default cuts peak divergence 1.247x, where 200 sweeps get 15.53x and 2000 get 222.9x. The projection is also blind to half of what it is asked to remove, because a central-difference divergence composed with a central-difference gradient is the Laplacian on a grid of spacing 2h while the solve inverts the compact five-point one; a checkerboard velocity measures a divergence of exactly zero and a checkerboard pressure produces a correction of exactly zero. And the dye blob that seems to evaporate is really spiralling in: the backtrace leaves the circle along the tangent rather than the arc, contracting the field by (1 + dtheta^2/2)^n, which predicts a mass loss of 15.165 percent against 15.164 measured.

## The gotcha

Four of eleven pre-registered predictions were wrong, and both actual defects were in the verification rather than the solver. A negative control biased a bilinear weight and then set the other to one minus it, so the weights still summed to one, nothing broke, and it reported worst 0.000e+0, which is character for character what a perfect pass reports. In the UI suite a control painted its fixture with an inline script that never ran, so it was rejecting a blank canvas instead of the dark one it named, passing while testing nothing; it surfaced only because a second control demanded a canvas be ACCEPTED. Separately the stats strip shipped a readout whose label and measurement disagreed, showing divergence rising across a step on a correct solver, and a screenshot caught it because no assertion was looking at it.

## How we checked it

60 assertions across two suites, 34 on the physics and 26 driven only through real drags, clicks, keys and slider events. Predictions written in PREDICTIONS_ink-tank.md before the solver existed; four missed and each miss is graded with its root cause rather than edited away. Closed-form checks the solver never sees: the recovered pressure correlates 0.9999898 with the analytic potential, a projected composite field matches its analytic divergence-free part to 1.17 percent, a non-sinusoidal stream function shows third-order truncation at 6.54x and 7.26x per grid doubling, and the rotation mass loss matches a derived contraction law at two different step counts. Six negative controls, every one required to fail, including two that were found to be inert and fixed. Receipts in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
