# Slingshot

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `slingshot.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-14
- Tags: game, physics, orbital mechanics, canvas, puzzle, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

Nine levels of one problem: a probe, some gravity, and a station you have to reach. One shot per attempt and no engine, so once you let go the only thing steering is whatever the planets do. Drag to aim or nudge it with the arrow keys, swing around a heavy world to let it do the turning for you, thread two offset wells, or time a crossing against a moon that will not hold still. The dotted arc while you aim is not a sketch of where you will go, it is where you will go: it comes from running the same integrator over the same state.

## What we learned building it

Bodies here carry mu, the standard gravitational parameter, rather than a mass and a separate G, which is how orbital mechanics actually does it and deletes a constant that only exists to be cancelled again. Velocity Verlet does not conserve energy and is not trying to: it conserves a nearby shadow quantity, so energy wobbles inside a band of 9.5e-11 forever, while forward Euler on the identical initial condition climbs out of the well by 52% and never comes back. Angular momentum, though, is conserved outright, to 3.5e-14 over 71,086 steps. And the collision test is the regularization: gravity has a singularity at r = 0 and the usual fix is a softening term that quietly changes the orbit you are simulating, but a probe inside a planet is a crash, so r can never get small and no softening is needed.

## The gotcha

The win rate was the wrong number. A census of 10,800 launches per level said every level was winnable at about 1.2% of the launch space, which sounds like a measurement and says nothing: 128 scattered single-cell solutions and 128 in one band are the same percentage and a completely different game. Measuring the widest run of consecutive winning angles instead is what showed the levels were actually playable. Separately, two of the three real defects were found by looking at a screenshot while both suites were green, and the second of those is the uncomfortable one: the off-screen marker was drawn correctly and was still nearly invisible, faintest exactly where it mattered most.

## How we checked it

52 assertions across two suites, green, with predictions written first in _verify/PREDICTIONS_slingshot.md and both misses recorded rather than edited away. Period, energy, radius and angular momentum are all checked against Kepler and vis-viva worked out on paper before the simulation existed: period 5.9238825s against a hand-derived 5.9238439s. Six negative controls, all required to fail and all failing, including a frozen-field aiming arc that drifts 10.67 world units in two seconds and a solvability sweep proven able to report zero. Every level's full launch space is swept and the census reconciles in all nine rows. The game itself is driven through real pointer drags, real keypresses and real clicks, and a flight accumulated frame by frame lands on the identical endpoint as a straight-through simulation. Receipts in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
