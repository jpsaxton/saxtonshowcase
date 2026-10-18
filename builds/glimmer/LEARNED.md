# Glimmer, a match three puzzle

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `glimmer.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-23
- Tags: game, puzzle, match three, canvas, web audio, touch, keyboard
- Who made it: Amy, our AI helper (an AI, not a person), built it because we asked for it. People decided it should be made and approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It makes sound with Web Audio, which the browser starts only after your first tap, click or key. Anything it saves (progress, scores or settings) stays in your own browser's localStorage and is never sent anywhere.

## What it is

An 8 by 8 match three on canvas with six gems that each have their own shape as well as their own colour (star, heart, triangle, hexagon, diamond, circle). Only swaps that make a line are allowed; bad ones bounce back. A line of four makes a Blaster that clears its row or column, a line of five makes a Prism that clears a whole colour when swapped, and every cascade step raises the score multiplier. Twelve levels each have a target and a move budget, leftover moves pay a bonus, the board reshuffles itself when stuck, and two gems pulse as a hint after five idle seconds. Drag, tap tap, or arrows and Enter. Sound is synthesized and the best score is kept locally. With ?preview=1 an autopilot glides a cursor to the best legal swap and plays silently forever.

## What we learned building it

Keeping the board logic in one DOM-free block between two comment markers meant node could load the same code the page runs, with no copy to drift. Tuning by feel would have been wrong: my first level table asked for 5,000 points in 16 moves, and a simulation of the greedy bot showed it averages about 138 points a move, so the last level was out of reach for everyone. Playing 400 seeds per level with a random bot and the greedy bot gave a curve that runs from 98% to 13% clears for the random bot and 100% to 50% for the greedy one. Blasters and Prisms clear a set of cells and not a line, so one breadth-first expansion that lets each special fire once handles chains, a Prism caught by a Blaster, and two Prisms swapped together, with no special cases.

## The gotcha

The first desktop screenshot showed the title's demo board pushed to the right, because the landscape layout keeps a slot for the score panel even on the title screen, where no panel is drawn. The fix was to centre the board when the title is showing and to redo the layout when a game starts. Two false failures also came from my own tests, not the game. A fixture I thought held a vertical three actually held a four (the stripe pattern put another matching gem below it), and a forced game over in preview landed during a level clear banner, so the next level reset the move budget I had just set. The fixture was corrected, and the test now waits for an idle board before forcing the game over.

## How we checked it

node core.test.js: 47 passed, 0 failed (matching, specials, chains, cascade scored x2, no-moves board agreed by an independent brute force, shuffle, 300 fresh boards, 2,400 move autopilot soak with 0 illegal and 0 holes). node mutate.js: 4 of 4 planted bugs caught. node ui.test.js in headless Chrome: 46 passed, 0 failed. It covers 1280x720 keyboard and mouse (21 checks: start with Enter, bounce on an illegal swap, keyboard, drag and click swaps score, hint, P, Space, blur, M, game over, localStorage best, restart, level advance, Escape not prevented), 390x844 at DPR 3 with touch (15 checks: tap start, tap tap and CDP touch drag score, no scroll or zoom, mute and pause buttons, visibilitychange pause, game over, tap restart), localStorage throwing (1), and preview at 600x300 and 350x175 (9 checks: frames differ 3 s apart, no chrome pixels in the margin, 0 localStorage keys, no AudioContext, legal swaps only, 0 errors). Zero page or console errors in every context. In the 30 s natural preview run the autopilot reached level 2 or 3 and did not hit a game over; a forced game over proved it restarts itself. File is 69,198 bytes.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
