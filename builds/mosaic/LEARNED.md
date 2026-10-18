# Mosaic, three ways to fill a rectangle

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `mosaic.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-23
- Tags: treemap, layout, algorithm, data toy, this repository, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

The same 108 files packed into the same rectangle three different ways, side by side, with the aspect ratio of every tile measured underneath. Every tile is a real file in this folder: thirty-two builds and the sixty-three checkers that guard them, sized by lines or bytes as they sit on disk, grouped by lane or by month. Slice and dice keeps your order and makes tiles you cannot click. Strip keeps your order and does much better. Squarified sorts descending and wins every statistic, and the picture it draws of this folder is the point: thirteen of thirty-two builds are physics and simulation, and almost all of that is September. The counts on the page are computed from the data rather than typed, because the first draft said 102 and was wrong within the hour.

## What we learned building it

The whole of the squarified algorithm is worst(): given the areas in a row and the length of the side they sit on, return the worst aspect ratio, then keep adding while that number falls and close the row the moment it rises. The famous part is a greedy stopping rule, not a search. It buys its squares with order, and has to: the rule only behaves if the big tiles are placed while there is still room to place them well, so a squarified treemap cannot be read left to right. Measured here, it takes the median tile from 88.34:1 to 1.10:1 against slice and dice, 80 times better, and it is the only one of the three that produces no tiles thinner than a pixel.

## The gotcha

Eight things I got wrong and had to withdraw after measuring, and they are one mistake repeated: a number measured once, written down as though it were a property. Five of the eight are that exact mistake, committed inside the build whose whole purpose is making it visible. The area scale I wrote into the code as a trap is algebraically invariant and the broken variant reproduces the layout to 5.6e-12. The worst nested tiles are not inherited from thin parents; all of them are the smallest member of a group with a 25x spread of sizes. My own extractor invented an orphan checker by parsing the README's worked examples. The generator measured the very file it injects into, so the page's record of its own size was stale the instant it was written. One assertion hard-coded the leaf count, another forbade an exact zero, a third tested for a literal "13", and the function whose entire job is computing the page's counts opened with the typed words "Thirty builds" while correctly computing every percentage around it. The two rendering defects were both the layout being right and the picture being wrong: a blank preview card, and every tile under a pixel painted four times too wide because CSS floors a border-box element at the width of its own padding.

## How we checked it

70 assertions across two suites, 32 on the layout and 38 driven only through real clicks, a real pointer and three real viewports down to phone width, plus 10 pre-registered predictions graded 8 hit and 2 missed, and both misses are recorded rather than fixed by moving the bound. Predictions written in PREDICTIONS_mosaic.md before the dataset script ran. Area conservation holds to 8.8e-16, all three layouts are byte-identical on a second run, the generator iterates to a fixed point before it will write, and the UI suite re-measures the aspect ratios off getBoundingClientRect so the browser checks the build rather than the build checking itself. Nine negative controls, each required to fire.

## Since then

The folder its tiles describe is the one Amy builds in, as it stood the day she made it, not this download; the checkers it counts stay in our repository.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
