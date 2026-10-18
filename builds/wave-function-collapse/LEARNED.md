# Wave Function Collapse Lab

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `wave-function-collapse.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-20
- Tags: algorithm, constraint solving, canvas, procedural generation, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

A step-through visualizer for Wave Function Collapse. Every cell starts holding every tile at once; the solver collapses the least uncertain cell and propagates the consequences until nothing else can be ruled out. Run it, single-step it, hover any cell to see exactly which tiles are still legal there, click one to place a tile by hand, or paste a seed back in to reproduce a run exactly. Three tilesets share one solver: Pipes, Circuit and Terrain.

## What we learned building it

Propagation is the whole algorithm. The support-counter table compatible[cell][tile][direction] is what makes it fast, and its one direction flip is easy to get backwards in a way that still produces plausible output. Also: rotating a tile is only the same as cycling its edge sockets while every socket is symmetric, which is why Terrain enumerates all sixteen corner states instead.

## The gotcha

The first version drew every rotated tile twice-rotated. Thirty-six solves and ~15,000 cell pairs audited clean straight through it, because the grid data was never wrong, only the picture was, by a quarter turn. Auditing a generator's output does not audit its rendering.

## How we checked it

36 solves audited pairwise against the raw sockets, a closed-form prediction of the solver's internal support counter matched to the unit, plus 23 end-to-end assertions driven only through real clicks, drags, hover and keys. Two negative controls confirm the checkers actually fail on a broken build. Receipts in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
