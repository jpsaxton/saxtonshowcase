# Grainsmith, a falling sand sandbox

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `grainsmith.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-18
- Tags: cellular automata, simulation, toy, canvas, physics, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

Forty thousand cells, eleven materials, one rule each. Pick something and drag on the canvas, then let go of it. Sand piles at exactly forty five degrees, water pools and spreads, oil floats on the water without being told to, fire eats the wood and the plants, steam rises and turns back into water where it cools, and a plant left at the bottom of a pond will slowly drink the whole thing. Four scenes to start from, including an hourglass that drains through a six cell neck for about fifteen hundred steps. No goal, no score, no explainer panel: the four builds before this one were all a mechanism made steppable so it could be understood, and the playtime log said in writing that the house style needed breaking once on purpose.

## What we learned building it

Scan order IS the physics. Walk the rows top to bottom and a grain that moves down lands in a row you have not reached yet, so you process it again, and again, and it falls the whole 160 cells in a single step; walk bottom to top and rising gas does exactly the same thing upward. The general fix is neither direction, it is a per cell stamp. Second, a global random stream and an optimisation that skips work are incompatible: chunk skipping changes how many times the generator is called, so an idle corner of the world silently shifts every random decision everywhere else. Deriving each draw from a hash of position, step and seed makes skipped work genuinely free and is the only reason chunks on versus chunks off can be proven bit identical rather than merely similar. Third, and the one I did not expect, this kind of water cannot climb: local displacement gives you no pressure term, so two columns joined at the bottom never equalise. Measured at 92 cells apart.

## The gotcha

The predicted bug was real and the predicted mechanism was wrong three times running. A chunk may sleep only when a cell's failure to move is a fact about its neighbourhood, and a liquid picking one side at random made it a fact about the step counter instead. The wake then landed a step late, so a cascade of water sliding across a chunk seam stopped dead on the boundary. A gas aged without waking anything, so trapped steam froze forever with chunks on and condensed normally with chunks off. Each was found by the differential test and none by reading. Then the fix for the first one was over applied: the wake margin was widened to the distance a liquid can travel, its own negative control could no longer separate the two builds, and that is a control telling you the code it patches is doing nothing. Radius of influence is 1 here; distance travelled is 6; only one of them belongs in that constant, and the wide version cost 39% of throughput for nothing.

## How we checked it

70 assertions across two suites, green, against predictions written before the build existed: eleven hit, three missed, one flatly wrong. The load bearing check is a mass census. Every cell that changes material does so through one of nine named reactions, the simulation counts each one, and after 3,000 steps the change in every material's population has to equal its ledger inflow minus its outflow exactly, no tolerance. Movement is a swap and is invisible to that count, so a bug that duplicates or drops a cell has nowhere to hide. Plus determinism by hash 5 runs of 5, a chunks on versus chunks off differential over 6 scenarios, an angle of repose measured at 45.00 degrees against a closed form, and a render audit that places every material at a known cell and reads the canvas back, which caught ash rendering 25.7 from stone against a threshold of 25. Eight negative controls, all required to fail and all failing, and one of them had to be rewritten because a control pinned to a constant expires when the constant does. Two things were found by looking at a screenshot while every assertion was green: a campfire that burned its whole log stack in under four seconds, and a thumbnail that filled its empty half by flooding the fire out. Receipts in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
