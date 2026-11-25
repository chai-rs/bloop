RUN: 2026-11-25T10:00:00Z
TARGET: pkg/order
WORKERS: 4
CASES: 240
FOUND: 2

## Who attacked what

One row per worker, so a reader can see which angles were covered and which were not.

| dimension | cases | verdict |
| --- | --- | --- |
| payload | 80 | ISSUES |
| sequence | 60 | PASS |
| concurrency | 60 | ISSUES |
| resource | 40 | PASS |
| ui | 0 | skipped, this package has no interface |

## What was fed in

Per worker, the shapes it produced. Someone has to be able to repeat this.

* **payload** · empty and whitespace · 0, -1, max int, one past the limit · combining marks, right-to-left text, emoji · 10k characters in every string field
* **sequence** · pay before place · cancel twice · ship a cancelled order
* **concurrency** · two callers paying one order at once · two writers on the same stock counter
* **resource** · 10,000 lines in one order · a payment gateway that never answers

## Found

One per finding. Each carries the exact input, so a person can reproduce it without asking this file's author.

1. `pkg/order/total.go:61` — a quantity of 0 produces a negative total.
   Dimension: payload
   Input: `{"sku":"A","qty":0,"price":100}`
   Command: `go test ./pkg/order -run TestFuzzCase1`
   Result: `total = -100, want 0`
   Issue opened: `2026-11-25-zero-qty-negative-total`

2. `pkg/order/stock.go:88` — two concurrent payments both pass the stock check.
   Dimension: concurrency
   Input: two `Pay(order)` calls on the last unit in stock
   Command: `go test ./pkg/order -run TestFuzzRaceStock -race`
   Result: stock reaches -1
   Issue opened: `2026-11-25-double-pay-oversells`

## Not covered

What was never attacked, and why. **A dimension that was skipped matters as much as the ones that ran.**

- `ui`: this package has no interface, so no worker was sent
- payloads that need a real payment gateway: the sandbox was not reachable
