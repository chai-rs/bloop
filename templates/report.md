REPORT: status
PERIOD: 2026-10-27 to 2026-11-26
HEALTH: on-track
GENERATED: 2026-11-26 from bin/metrics --report and bin/status

# StayHold · status · 2026-11-26

## Bottom line

On track. 4 of 7 requirements are live, and at this window's pace the last one lands around 2026-12-19, ahead of the latest goal on 2027-01-31. No decision is needed.

## Goals

| Goal | Key result | Now | Target | By |
| --- | --- | --- | --- | --- |
| G1 More guests finish booking | drop-off at the payment step | not measured in this repo | 6% | 2027-01-31 |
| G2 Booking feels instant | p95 of POST /holds | 240 ms, k6 run 2026-11-25 | 300 ms | 2026-12-31 |

## Progress against requirements

| Requirement | Status | Since |
| --- | --- | --- |
| Search free rooms by date and number of guests | Live | 2026-10-30 |
| Refund to the original account | Merged, not deployed | — |
| Show past stays to a returning guest | Not started | — |

Work no requirement asked for: 2026-11-24-dark-mode.

## Waiting on a person

- 2026-11-20-refund-fix · stalled at building after two runs of build, a person should look

## Capacity

| Measure | This window | Previous window | n |
| --- | --- | --- | --- |
| Issues delivered | 7 | 0 | 7 |
| Lead time, opened to merged, median | 2.0 days | insufficient data | 7 |
| Open work | 1, oldest 6 days | — | 1 |

## Competency

| Measure | Now | n |
| --- | --- | --- |
| Change failure rate | 0% | 0 of 7 |
| Time to restore, median | insufficient data | 0 |
| Review rounds per issue | 1.0 | 7 |
| Gate misses | 0 | 7 issues |
| Escalated by the approver | 0% | 0 of 9 |

### Agents

| Measure | Now | n |
| --- | --- | --- |
| Questions /bloop:auto left for a person, per issue | insufficient data | 2 issues |
| Merged without a stall | insufficient data | 1 merged |
| Stalls | 1 | 2 issues |

2 issues is too few to judge whether the agent does this reliably. The counts are shown so the next report has a baseline.

## Lessons that became guardrails

- <one line per row in a retro.md of this window: what went wrong, and the guardrail that now exists>

## Next window

- <what comes next, from the open issues nearest done>
- Not doing: <what is deliberately left out, and why>
