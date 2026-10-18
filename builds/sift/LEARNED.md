# Sift, a diff bench that never leaves the page

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `sift.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-08-29
- Tags: tool, diff, myers, algorithm, text, privacy, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

Paste two versions of anything into the two panes and get a real diff: side by side or unified, line level with word level highlighting inside the lines that changed, long unchanged stretches folded away until you click them, and a unified patch you can copy out. Ignore whitespace and ignore case are one click each. The difference engine is Myers' algorithm written from the paper rather than pulled from a library, and a switch in the toolbar runs either the basic greedy search or the linear space version, with the cost of each on screen: edit distance, points visited against the theoretical bound, milliseconds, and how many frontier vectors the engine had to keep. The point of it is the thing it does not do: the usual way to compare two versions of a private document is to paste both of them into somebody else's website.

## What we learned building it

Four things, none of them the thing I expected to learn. The identity D = N + M - 2L, edit distance against longest common subsequence, is exact, so a slow O(NM) dynamic programme can grade the fast search cell for cell; every property that caught anything here came from two unrelated methods disagreeing. The linear space version's overlap test is asymmetric in the parity of delta = N - M, and the reverse sweep has to be guarded on k - delta rather than k + delta, which I predicted in writing I would get backwards and then did. And the folklore about minimal diffs being unreadable does not apply to this formulation: real differs run a compaction pass to slide each block of changes as low as it will legally go, I built that pass expecting it to matter, and it moved nothing on 400 generated cases or 12 hand built ones, because the snake consumes matching lines before charging any edit and the tie-break leans toward consuming the old text, so the block already lands as late as it can.

## The gotcha

The worst bug was not in the algorithm and every algorithm test passed straight through it. Lines are interned to integers before diffing, for speed, and the first version interned each pane with its own fresh map, so line 1 of the before text and line 1 of the after text were both id 0 and therefore equal whatever they actually said. The whole engine suite is clean on that build, because those tests hand the engine raw arrays and never come through the interner. The one check that asked the finished page for a patch and tried to replay it caught it in one run. The second bug came from looking at a screenshot rather than from an assertion, for the third time in this folder: the unified view printed one gutter column carrying before-numbers on some rows and after-numbers on others, which reads 11, 13, 12, 13, 16 down the page.

## How we checked it

80 assertions across two suites, 38 on the engines and 42 end to end through real typing, clicks, selects and keyboard shortcuts. Three independent graders run over 400 generated cases and both engines: the script is replayed with two cursors to rebuild the target, the edit distance is checked against an independent dynamic programming LCS, and the two engines are required to agree. The end to end suite rebuilds both texts and both gutter columns out of the DOM and compares them to the textareas, because auditing a generator does not audit its rendering. Four negative controls, all required to fail, including a valid but non-minimal script that applies perfectly and must be caught by the distance identity alone. Predictions were written before the checker existed in _verify/PREDICTIONS_sift.md and graded honestly, including one miss, in _verify/RESULTS.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
