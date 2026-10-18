# Cloth, a Verlet sandbox

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `cloth.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-19
- Tags: physics, simulation, verlet, canvas, toy, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

Five hanging things made of nothing but points and sticks: a gathered curtain, a banner in the wind, a sagging net, a suspension span and a rack of ropes. Grab any of it and swing it, take the scissors to it and watch the severed half peel away and fall, pin or unpin a point, turn the wind up until threads start giving way. Threads are coloured by strain, so pulling one corner lights the load path all the way back to the pins. No lab, no step button, no proof panel: this one is for playing with, and the whole verification lives in _verify/ instead of on screen.

## What we learned building it

Position Verlet plus Gauss-Seidel constraint relaxation is the standard recipe and both of its famous shortcuts cost more than I thought. The line everyone writes to start a particle at rest, prev = current, hands the first step a whole a*dt^2 where it should get half of one, so the particle runs permanently AHEAD of the truth by a*dt*t/2. I predicted the right magnitude and the wrong direction. Damping written as one multiply per step is a frame-rate dial: halve the timestep and the decay over the same simulated second gets squared. And a relaxation sweep carries a disturbance the whole way downstream in array order but exactly one stick upstream per pass, so the same solver moves 19 points or 2 depending only on which end you tugged.

## The gotcha

Three of my seven pre-registered predictions missed, which is the highest rate in this folder so far and the reason the file is worth reading. The sign of the start-up offset was backwards. A tug on the point next to a PINNED anchor turned out to move exactly one point rather than all nineteen, because a pinned end absorbs the whole correction and puts its neighbour back where it started. And constraint projection is not energy neutral: a pendulum with damping switched off still bleeds amplitude, which drags the 90 degree period 5 percent short at dt=1/240. I had written down that I did not know the sign of that drift. It loses, and the loss falls with the timestep, so it is discretisation rather than a bug. The checker also found a real defect: the scissors used four endpoint distances to decide what a stroke touched, and two segments that CROSS have all four of those well above zero, so a clean stroke through a row of threads cut nothing at all. Two more came out of the checker rather than out of looking at the thing: the number keys silently stopped switching scenes after any button click, and the suspension span built itself a 0.19 px thread that blew past its own tear threshold the instant anything moved.

## How we checked it

78 assertions across two suites, 43 on the physics and 35 end to end through real presses, drags, keys and slider events. Free fall is matched to a closed form at three timesteps, and the corrected start lands on the exact answer to within 4e-14 relative, which is float noise and nothing else. Constraint propagation is asserted as exact integer counts. The pendulum is checked against 2*pi*sqrt(L/g) over a census of all 18 lengths from 60 to 400 px, worst error 0.047 percent, and the large-angle error is shown converging 5.01 to 1.61 to 0.43 percent as the timestep shrinks. Six negative controls, including the shipped integrate() mechanically mutated through toString to use dt where it should use dt squared, relaxOnce deleted from the live prototype, and a positive control proving the pixel probe is not a constant no. Predictions written first in PREDICTIONS_cloth.md, graded honestly in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
