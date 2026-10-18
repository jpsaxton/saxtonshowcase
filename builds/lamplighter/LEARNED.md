# Lamplighter

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `lamplighter.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-13
- Tags: game, platformer, game feel, physics, playable
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

A small, gentle platformer. You carry a flame through dark rooms and light lanterns, and the light each one throws actually reveals the geometry around it, so a room you have finished looks nothing like the room you walked into. Five rooms, no enemies, no lives, no score, and falling off just puts you back at the start. Underneath it the jump is not tuned by hand: you give it a height and a time to the top and the gravity and launch speed are solved from those. Open the feel panel and you can switch the solver to the textbook formula and watch the flame stop reaching the line it asked for.

## What we learned building it

The kinematics every platformer tutorial prints, v0 = 2h/t and g = 2h/t^2, are a CONTINUOUS time result, and a game running a fixed timestep does not reach h. With N = t/dt steps to the apex, semi-implicit Euler lands at exactly h*(N-1)/N, so the jump undershoots by exactly 1/N, and the error depends only on how many steps the jump takes and not at all on the height. At a 0.4 s apex that is 4.17 percent; at 0.1 s it is 16.7 percent, more than half a tile, which is the difference between a level being possible and not. Swapping the two integration lines around overshoots by exactly 1/N instead, same size, opposite sign. The fix is a literal off-by-one inside a formula that is printed correctly everywhere: a fixed timestep needs v0 = 2h/((N-1)*dt), not 2h/(N*dt). Also learned that the fall multiplier does not engage on the first frame after the apex, because at that instant the velocity is zero rather than positive.

## The gotcha

Three of my measurements were wrong in ways that made the BUILD look wrong, and the first one I acted on. The apex finder used a bare >= 0 on a velocity that lands at 1e-13 rather than zero, so it reported the N=24 apex one step late while getting N=12 and N=6 right, which is the worst kind of instrument: correct most of the time. The descent was timed by interpolating the crossing of the launch height, which is also the floor, so it interpolated against a value the landing collision had clamped. On the strength of those two I declared a prediction that had actually PASSED a failure, and wrote a confident paragraph explaining the failure, before fixing the instruments and finding it was inside tolerance all along. The reachability prover earned its keep the same night: it found that one room had no spawn marker at all, which the engine had been silently defaulting to the top-left corner, and that another room's platforms were four tiles apart when the jump clears three.

## How we checked it

104 assertions across two suites, green, with six negative controls that are all required to fail and all failing. The apex law is confirmed to twelve decimal places at three separate values of N, in both integrator orderings, and the relative error is shown to be independent of the requested height. Every number was hand derived from the recurrence and committed to _verify/PREDICTIONS_lamplighter.md before the game existed; two of the thirteen predictions missed and are recorded as misses rather than edited away. Solvability is not eyeballed: a breadth-first search over the real physics proves every lantern in all five rooms is reachable and exports a per-frame clear script, which is then replayed from a fresh engine and must reproduce the clear. Receipts in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
