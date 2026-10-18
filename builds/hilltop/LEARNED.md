# Hilltop, a bright little tower defence

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `hilltop.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-23
- Tags: game, tower defence, strategy, canvas, touch, keyboard, web audio
- Who made it: Amy, our AI helper (an AI, not a person), built it because we asked for it. People decided it should be made and approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It makes sound with Web Audio, which the browser starts only after your first tap, click or key. Anything it saves (progress, scores or settings) stays in your own browser's localStorage and is never sent anywhere.

## What it is

A single-file canvas tower defence game. Three maps (Gentle, Tricky, Tough), twenty waves each, twenty lives on the hill. Four towers with separate jobs: Popper (rapid single target), Plopper (slow lobbed splash that aims ahead of its target), Fizzer (a pulse that slows everything in range) and Zinger (long range sniper that picks the toughest creature and pierces armour). Each upgrades twice and sells for 70 percent. Six creatures: Hopper, Zippy (fast), Shellback (armoured), Nibbler (swarm), Mender (heals friends nearby) and Big Bun (boss on waves 10 and 20). Next wave button with an early-call bonus, 1x/2x/3x speed, tap or keyboard controls, and a portrait phone layout that turns the map sideways so cells stay about 38 px. Best score and furthest wave per map are kept in localStorage. ?preview=1 runs the same autopilot as an attract demo.

## What we learned building it

Keeping every rule in one pure block with no DOM paid off twice: node could unit test it directly by slicing the block out of the HTML, and the same autopilot could be played headless on all three maps in well under a second each. That turned balancing into measurement. The first autopilot built a new level-1 tower almost every wave and lost at wave 20 on the first two maps and wave 12 on the third. Capping the tower count at 3 plus 0.45 per wave, so spare coins go to upgrades, took it to wins on the first two maps. Windy Ridge then became a real hard map: at 1.5x hp the autopilot falls on wave 20. Portrait support came from a single world-to-screen transform (rotate 90 degrees when the stage is taller than wide) used for drawing, taps and arrow keys alike, rather than a second layout.

## The gotcha

The preview check caught a localStorage write in preview mode: boot called setMute(muted) to sync the button, and setMute always saved the mute key. The fix was a persist flag that only the M key and the mute button set, and it is never honoured in preview. A smaller one: the title screen runs a demo game behind the card, and at first the real HUD showed that demo's coins and a 'Next wave +5' button under the title. The HUD and panel now stay hidden (visibility, so the layout doesn't jump) until a game starts.

## How we checked it

node test_logic.js: 76 passed, 0 failed (pathing on all 3 maps, targeting, damage, economy, waves, autopilot). Headless autopilot: map 1 won with 12 lives, map 2 won with 3 lives, map 3 lost at wave 20. node check_ui.js (Playwright, system Chrome): 38/38 checks passed. At 1280x720 by keyboard: 1+arrows+Enter builds, Enter opens the build menu and 2 builds, N starts a wave, creatures move and score rises, Enter on a tower plus U upgrades, P and Space pause and resume, blur pauses, Escape is not preventDefault-ed, M mutes, calling all waves undefended reaches game over, best score is saved, Enter restarts. At 390x844 (touch, mobile): the title card fits, the board is rotated with 38.2 px cells and fully on screen, tap grass then tap card builds, an armed card plus a tap places a tower, tap tower then Sell refunds 35 of 50, Start wave moves creatures, the page never scrolls, taps reach game over, and Play again restarts. With a localStorage that throws, the game still starts. Preview at 600x300: two frames 3 s apart differ, no UI chrome visible, still running after 30 s at wave 3 with 4 towers (no natural game over in 30 s), a game over forced through the test hook restarts the demo on the next map within 3.5 s, and nothing is written to localStorage. Zero page or console errors in every run. Screenshots reviewed: desktop and phone title, mid-game and game over, the tower menu, and preview frames.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
