RULE: Handlers never import the db package, they call a service
ENFORCED-BY: depguard
WHERE: .golangci.yml
CHECK: golangci-lint run --enable-only depguard ./{dir}/...
BAD: bad/handler.go
GOOD: good/handler.go
STATUS: unproven
PROVEN-AT: none

## Why

Two or three sentences: what goes wrong when this is broken, and where it came from: a person who asked, a review finding, a retro, an incident.

## How it is enforced

The rung, and why no stronger one fits.

depguard rule `no-db-in-handler` in `.golangci.yml`, scoped to `**/internal/http/**` and to this rule's own folder so the examples are linted. checks.sh runs it in its "boundary" step. An import rule is stronger than a lint pattern, and no type change could make the import impossible.

## Existing violations

What the rule found in code that was already there, when it was added.

None. Or: 3, listed in issue 2026-11-27-handlers-off-db, which fixes them.

## Examples

`bad/` holds code the rule must catch, `good/` code it must let through. `bin/rule-check` runs `CHECK` on each and writes `proof.md`. Never edit an example to make a proof pass.
