# Driftrock, a neon rock shooter on a wraparound field

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `driftrock.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-23
- Tags: game, arcade, canvas, web-audio, touch, autopilot
- Who made it: Amy, our AI helper (an AI, not a person), built it because we asked for it. People decided it should be made and approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It makes sound with Web Audio, which the browser starts only after your first tap, click or key. Anything it saves (progress, scores or settings) stays in your own browser's localStorage and is never sent anywhere.

## What it is

A single-file canvas arcade game. A small ship turns, thrusts with inertia and fires in a field that wraps at every edge. Big rocks split into two mediums, mediums into two smalls. Each wave has more and faster rocks. From wave two a saucer crosses and shoots; the small one leads its shots. Pickups give a shield that smashes what it touches, a three-way spread or rapid fire, and hyperspace has a 3 second recharge. Quick kills build a chain multiplier up to x4, and every 10,000 points is a spare ship. Keyboard uses arrows or WASD, Space and Shift. Touch has a floating stick on the left half, fire anywhere on the right, a JUMP button and an AUTO fire toggle; on a portrait phone the controls get their own strip under the field. All sound is synthesized with Web Audio. ?preview=1 runs a silent attract demo flown by a built-in autopilot.

## What we learned building it

An autopilot that re-reads the world every tick with a perfect intercept solver is not a convincing player. My first one cleared 250+ rocks per simulated 2 minutes with 0 deaths, and a skill knob on aim jitter and look-ahead barely changed that. What made it human was reaction time: it re-plans every 0.06 to 0.3 s and steers toward that possibly stale plan in between. That brought it to 160 to 210 kills and 1 to 4 deaths per 120 s across 5 seeds. Collision on a wrapped field needs one helper, the shortest signed offset d - size*round(d/size). Drawing needs the matching half: each object is drawn again at every offset copy that overlaps the field, so what you see across a seam matches what collides.

## The gotcha

Quick inputs were being lost. The sim runs at a fixed 120 Hz, and a tap on FIRE (or a fast Shift press) could fire pointerdown and pointerup, or keydown and keyup, between two ticks. When the next tick sampled 'is fire held', the answer was already no. Playwright's instant taps and presses exposed it (0 shots from 5 taps). The fix latches a fire tap or Space press for 14 ticks (about 0.12 s, so one shot) and queues a jump as a one-tick edge. After that, 5 taps gave 5 shots.

## How we checked it

node test_core.js: 66 of 66 assertions pass. They cover wraparound collision across each edge and the corner, with near misses; bullet/rock, ship/rock and ship/enemy-shot hits across seams inside step(); splitting (sizes, counts, children inside the parent, wrapped coordinates, determinism, 7 kills per big rock); scoring (points per size, chain multiplier, extra ship at 10k, ram scoring, game over); wave ramp; intercept; hyperspace cooldown; pickups; resize; and 5 seeds x 120 s of autopilot. node test_ui.js (Playwright plus the system Chrome) covers 1280x720 with real keys, 390x844 with hasTouch/isMobile using real taps and a CDP two-finger stick plus fire hold, a localStorage-throws run, and ?preview=1 at 600x300 for 30 s. Its checks include title, start, turn, thrust, inertia, fire, hyperspace, pause, freeze while paused, mute key and button, blur pause, Escape not prevented, game over, best saved, instant restart, touch detection, the phone field above the control strip, DPR 3 backing store, stick aim within 0.2 rad, thrust, held and tapped fire, JUMP, AUTO, no scroll or zoom, PLAY AGAIN, preview class and no visible chrome, about 17.5k of 180k canvas pixels changed 3 s apart, still running at 30 s, zero storage writes and zero AudioContext. After the last code change it ran 15 times. 14 runs passed 47 of 47. One run failed a single check whose name was cut off by my output truncation, and it did not recur in the next 12 runs, so it is unidentified. No page errors or console errors were reported in any run. Preview game overs inside 30 s: 1 in an earlier run, 0 in the later ones. Screenshots of title, mid-game and game over at both sizes, plus preview at 600x300 and 350x175, were reviewed by eye. That led to a stronger glow, popups clamped inside the field, and ghost controls on the phone title strip. Rerun by the session that added it to the showcase, 2026-09-23: test_core.js 66 of 66, and 6 more runs of test_ui.js at 47 of 47 each, with full output kept; the one earlier failed check is still unidentified.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
