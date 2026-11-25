# AGENTS.md

<!-- bloop:managed agents -->
Rules an agent reads before touching this repo. People can read them too.

## Read these first

1. `ARCHITECTURE.md` business, scope, modules, the shape of the codebase
2. `openapi.yaml` the real API contract, not one inferred from the code
3. `.bloop/config.json` the tools this project uses

## Every time

- Run `./checks.sh` before calling anything done. Never report a pass you did not run
- Work one slice at a time. A slice is something that can merge into main on its own
- An unfinished slice on main sits behind a feature flag declared in `flags.json`
- Change the contract before the code that follows it, always

## Never

- Never change `openapi.yaml` without human approval. It is a promise to other people
- Never edit generated files. Fix the source and regenerate
- Never skip a layer. `adapter` → `port` → `application` → `domain`, one direction only
- Never use `--no-verify`. If a hook is too slow to live with, fix the hook instead of bypassing it
- Never hand-write a type that can be generated from openapi

## Dependency direction

```
adapter  →  port  →  application  →  domain
```

`domain` imports nothing but the standard library. `.dependency-cruiser.cjs` enforces it and `./checks.sh` runs it.

## When you are stuck

If requirements contradict each other, or the contract does not cover the case in front of you, stop and ask. Do not guess and keep writing.
<!-- bloop:end agents -->
