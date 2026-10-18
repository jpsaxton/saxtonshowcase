# Brickfall, a bright brick breaker

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `brickfall.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-23
- Tags: game, arcade, brick breaker, canvas, web audio, touch
- Who made it: Amy, our AI helper (an AI, not a person), built it because we asked for it. People decided it should be made and approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It makes sound with Web Audio, which the browser starts only after your first tap, click or key. Anything it saves (progress, scores or settings) stays in your own browser's localStorage and is never sent anywhere.

## What it is

A brick breaker in one HTML file. Twelve hand-designed levels that get harder: more hits needed, steel bricks that never break and bend the play into pinball, a faster ball and a slightly narrower paddle each level, and a faster second lap once all twelve are cleared. Bricks take one to four hits, and white pips show how many are left. One brick in seven or so drops a capsule: wider paddle, multi-ball, slow ball, an auto-firing laser, catch (the ball sticks until released) or an extra life. Where the ball lands on the paddle sets the rebound angle. Three lives, the best score kept locally, synthesized sound, and an autopilot that plays behind the title card and in the 2:1 preview.

## What we learned building it

Resolving the ball one axis at a time (move on x, fix any overlap, then move on y) in sub-steps of half a radius made the collision code short and gave a clean yes or no: over 40 runs at the top speed of 672 units a second, the ball never finished a step inside a brick. One field shape did not suit both uses. The portrait 480x640 field plays well on a phone and a desktop, but in a 2:1 preview card it shrank to a strip, so preview mode uses its own 720x360 field and the same levels. A reachability flood fill over the level strings, with steel as the only wall, checks every level for sealed-in bricks before anyone plays it.

## The gotcha

The first preview looked lifeless. Bricks were 13 units tall at 0.83 scale, so the pips and cracks vanished, and the ball was slowed to 0.8x, so the demo scored only 290 points in 30 seconds and two frames three seconds apart differed in just 89 sampled channels. Taller preview bricks (18), full ball speed and a higher capsule rate in preview only raised that to 1320 points and 1018 differing channels. Separately, the steel bricks were first drawn in a dark purple next to periwinkle two-hit bricks and looked too alike in screenshots. They were repainted silver with dark rivets.

## How we checked it

Playwright driving the installed headless Chrome: 119 of 119 checks passed with zero page or console errors. 81 in-page logic and physics checks: level widths, known cells, fit and reachability for all 12 levels plus a negative control, paddle angles, prediction against brute force (300 cases, worst error 8e-10), brick and steel hits, scoring, tunnelling (0 of 4796 steps inside a brick), speed and slope held. 19 desktop 1280x720 checks with real keys and mouse, through game over and restart. 11 phone 390x844 checks with real taps and a CDP touch drag, no page scroll, through game over and restart. 6 preview checks at 600x300 and 350x175: frames differ, no chrome, running after 30 s, no storage writes. The autopilot did not lose a game in those 30 s. A separate run forced its last ball out and confirmed it restarted on its own. 2 checks with localStorage throwing. Screenshots reviewed at both sizes.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
