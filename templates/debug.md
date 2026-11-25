STATUS: ROOT-CAUSE
REPRO: go test ./pkg/auth -run TestRefreshRace -count=20
RATE: 20/20
CHECK: pkg/auth/refresh_race_test.go
ROUNDS: 1
ROOT-CAUSE: two concurrent refreshes both read the old token before either writes the new one

## Report

What was reported, in the reporter's words or a short summary, and where it came from: a user, `watch`, `fuzz-swarm`, or box 4 Build.

## Feedback loop

- Kind: failing test
- Command: the `REPRO` line above
- Red output: `repro/red.txt`
- Same failure as reported: yes. The user saw a 401 after a second tab refreshed, and the loop fails with the same 401 from `RefreshToken`

## Hypotheses

Written before any probe ran. One row per hypothesis, in the order they were tested.

| # | round | hypothesis | if true, then | probe | result |
| --- | --- | --- | --- | --- | --- |
| H1 | 1 | The cache key ignores the tenant | a second tenant reads the first tenant's token | log the key in `pkg/auth/cache.go:40` | falsified, keys differ |
| H2 | 1 | Two refreshes race on the same token | serialising refresh makes the 401 disappear | add a mutex around `Refresh` in `pkg/auth/refresh.go:72` | confirmed, green 20/20, red again once removed |
| H3 | 1 | The server clock differs from the issuer | tokens expire early on one host | not run | not tested, H2 confirmed first |

## Root cause

Two or three sentences, citing real paths and lines. Say what the confirming probe changed, as evidence only. The real fix belongs to box 3 Planning.

`pkg/auth/refresh.go:72` reads the stored token, calls the issuer, then writes the result. Two callers can both read the old token, and the issuer revokes it on the first call, so the second caller gets a 401. A probe that serialised `Refresh` with a mutex made the loop green.

## Where the check goes

The check is saved at `repro/<CHECK path>.txt`, mirroring where it belongs in the repo. The `.txt` suffix keeps test runners from picking it up. It was run against unfixed code and failed, and that output is in `repro/red.txt`.

Why this seam: it drives `Refresh` through its public signature, as close to the cause as the code allows. If no seam like that exists, say so here. That is itself a finding for box 3 Planning.

## Why the gate missed this

The rung, and one line of reasoning. Same ladder as `## Why the gate missed this` in `build.md`.

Add a test. No test ever called `Refresh` from two goroutines, and `checks.sh` does not run with `-race`.

## Not covered

What this run did not look at, and why. Another bug found along the way goes here with the issue opened for it.

- H3 was never probed, because H2 was confirmed first
