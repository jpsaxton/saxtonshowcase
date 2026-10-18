# Swept, a shared-worktree commit check

Notes from the Saxton Showcase, written for an AI helper as much as for a person. Hand this file to your agent along with `swept.html`, the build itself, and it gets what we learned without having to rebuild it to find out.

- Built: 2026-09-10
- Tags: git, tool, concurrency, parser, self-verifying, interactive
- Who made it: Amy, our AI helper (an AI, not a person), built it as one of her learning builds; she picks most of those herself, to learn something. People approved putting it on the shelf. In the notes below, "I" is Amy, and a "session" is one of her working runs.
- The build: one self-contained HTML file. Open it in a current browser; it needs no install, no account and no internet. It saves nothing.

## What it is

There are two ways to make a commit and they are opposites. A bare git commit writes the INDEX. A pathspec commit writes the WORKING TREE of the paths you name. In a tree several sessions share, one of them takes somebody else's work along with it, and which one depends entirely on the state of the tree rather than on which you typed. Paste your git status --porcelain, tick what you meant to commit, and this says which form is safe, names the exact paths that make the other one unsafe, and hands you the git diff that shows what you are actually about to write. Ten worked examples are built in, so it explores with no repository open.

## What we learned building it

The two columns of git status --porcelain ARE the two axes of the safety question, which is why the answer is decidable from the text alone with no attribution needed: X is the index against HEAD, Y is the working tree against the index, a selected path with a dirty Y is what makes the pathspec form unsafe, and an unselected path with a set X is what makes the bare form unsafe. Also that a space forces git to quote a path, which is exactly what makes splitting a rename on the arrow safe, and that non-ASCII arrives octal escaped inside those quotes as bytes rather than characters.

## The gotcha

The prediction that mattered was wrong, and the measurement caught it. I predicted the two states porcelain could not tell apart would both read MM. They do not: once another session STAGES into a file you are also committing, the tree and index agree again, so it reads M and a space, indistinguishable from your own ordinary staged work, and no commit form excludes their hunk. So the tool has a real blind spot, it is one case wide, the suite asserts it as a declared blind spot rather than papering it, and the page raises a warning there instead of a green verdict. Separately, a button labelled select all tracked would silently clear the lot when everything was already ticked. The engine suite could never have found that: the code did exactly what it said and the LABEL was the thing that was wrong.

## How we checked it

129 assertions across two suites, green. The engine is checked against measured_matrix.json, which is what real git 2.43.0 actually did in thirteen throwaway repositories, never against a prose restatement: eleven of the thirteen agree exactly and the other two are the declared blind spot. The parser is checked against real porcelain bytes covering spaces, doubled spaces, an embedded quote, a tab, a non-ASCII octal escape, a rename, and a path that itself contains the rename arrow. Five negative controls all required to fail and all failing, including an index-only engine that calls the swept case safe and an octal decoder that returns mojibake. 85 of the assertions are driven end to end through real clicks, real typing and the real buttons. Receipts in _verify/RESULTS.md, predictions written first in _verify/PREDICTIONS_swept.md.

## About these notes

The four sections above are copied word for word from the build's own record; the "Who made it" and "The build" lines at the top were added on 2026-10-18 so a reader knows who "I" is and what the file needs. The numbers describe the checks run when the build was made; they were not re-run on this copy unless a section says so. Test files and prediction files named above live in our repository, not in this download.

Copyright (c) 2026 Amelia Saxton. MIT License; see LICENSE, or the notice at the top of the game file.
