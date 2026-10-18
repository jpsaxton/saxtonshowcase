# Cron Almanac

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `cron-almanac.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-01
- Tags: tool, cron, scheduling, time zones, daylight saving, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

Paste a five field cron expression, pick a zone, and see a whole year at once as a 12 by 31 ribbon. It reads the expression back in plain English, lists the next fires in both the chosen zone and UTC, and then does the part nobody does by hand: it finds the two days a year where the schedule is a lie. A cron expression names a WALL CLOCK time, and wall clock time is neither complete nor unique, so a 02:30 job simply does not run on the spring forward day and a 01:30 job has two candidate instants on the fall back day. It also lints against the two systems of record it was built from, which disagree with each other, and it ships with example schedules only.

## What we learned building it

The day of month and day of week OR rule is real, and vixie's man page does not describe vixie's code. crontab.5 says the OR applies when both fields "are not *", but entry.c sets the flag on the field's FIRST CHARACTER (if (ch == '*') e->flags |= DOM_STAR) and cron.c branches on (DOM_STAR|DOW_STAR) ? (dom && dow) : (dom || dow). So */2 restricts the days and still counts as a star, flipping OR back to AND. Implement the sentence and you write a different program: measured here at 212 fires a year against vixie's 26. Also learned that converting a wall clock time to an instant needs no library but does need a round trip, because the only way to know a time does not exist is to convert back and find you got a different one; and that GitHub's documented behaviour for the deleted hour (advance to the next valid time) is not the daemon's, which just misses the fire.

## The gotcha

The engine was right first time and every one of the six real defects was somewhere no prediction had been registered. Two lints fired on every expression because * expanded to the widest value the field ACCEPTS rather than what a star MEANS. A CSS rule aimed at the legend swatches also matched the legend's own text labels and squashed each to 13px, which looked exactly like an overlap bug. A leap day schedule was reported as never firing because the reachability probe sampled 2026, 2027 and 2030, none of them leap years. The preview card left an empty input box behind and pushed December out of the card's 2:1 window, which is the exact failure the folder's own preview contract warns about in writing. Four of the six came from looking at a screenshot after the assertions had gone green.

## How we checked it

139 assertions across two suites, 83 on the engine and 56 driven only through real typing, clicks, hovers and select changes. The fire counts are checked against an independent brute force written in the checker that walks all 525,600 minutes of a year, a different traversal from the build's field jumping search. The daylight saving transitions are derived twice with no shared code, once from the IANA data by binary searching the offset and once from the statutory rule with raw epoch arithmetic, and they agree. A third implementation, the program a careful reader of the man page would write, is included to measure how far the OR rule trap diverges. Seven negative controls, all required to fail: an always AND matcher, a step read from zero, a single pass wall clock converter that calls a deleted time valid, a blank canvas, an empty page, a page carrying the preview class with nothing drawn, and the man page reading itself. Every measured value passes a finite() guard first, because the 2026-08-24 build hid a real bug behind a gate that compared against NaN. Predictions written before the checker existed: 17 hit, 1 missed, graded in _verify/PREDICTIONS_cron-almanac.md.

## Since then

For publication this copy's default schedule and time zone were changed to generic examples (default input 30 4 1,15 * 5; default zone the visitor's own, with the preview fixed to Europe/London). The 83 engine checks still pass on it; some of the 56 interface checks assert the old default schedule and no longer match this copy.

## About these notes

The four sections above are copied from the build's own record, word for word except for 1 passage generalised for publication; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
