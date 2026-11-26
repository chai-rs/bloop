---
name: rule
description: Adds a project rule such as "never call the database from a handler" or "never use fmt.Println", enforced by the strongest tool that can check it - the project's own linter, a boundary rule, ast-grep, or AGENTS.md when no machine can - and proves it works by showing a bad example fail and a good example pass. Use when the user says add a rule, never write code like this, forbid, ban, enforce, or when build, review or retro turns a correction into a guardrail.
---

# rule

**This skill belongs to no box.** It turns something a person said once into something the gate says every time.

**Output** `.bloop/rules/<id>/`, holding `rule.md`, a bad and a good example, and `proof.md` · the rule in the tool that enforces it · a line in `AGENTS.md`

## Standing rules

1. **A rule nobody has seen fail does not count.** Every machine-checked rule is proven by `bin/rule-check`: its bad example fails the check, its good example passes. Until then its `STATUS` is `unproven` and `AGENTS.md` says so
2. **Take the strongest rung that can hold the rule**, in the order below, and say why each stronger one does not fit
3. **Use the project's own tools before adding one.** A new tool is a new dependency for everyone. Ask before adding it, and name the install
4. **Show every config change as a diff and ask before writing it.** Lint and boundary config apply to the whole team. Protected paths in `.claude/settings.json` wait for the user to edit them
5. **Never weaken another rule to make this one pass**, and never change what an example shows to make a proof pass. An example that does not compile is broken, not a finding: rewrite it with what the project already depends on, and keep it showing the same thing
6. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
7. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Step 1 · Pin the rule down

Write it as one sentence a reviewer could check: "Handlers never import the db package, they call a service", not "keep handlers clean".

Then get two examples, from the user, or drafted from real code in the repo and shown for a yes:

* **bad**: the smallest code that breaks the rule
* **good**: the smallest code that does the same job and keeps it, using only what the project already depends on. A good example that imports something missing from `go.mod` or `package.json` fails its proof for the wrong reason

Ask where the rule applies: the whole repo, or a path such as `internal/http/**`.

## Step 2 · Choose the rung

| # | Rung | Fits when | Examples |
| --- | --- | --- | --- |
| 1 | **Make it impossible** | A type, a package boundary or an API shape can stop the code from compiling | An unexported constructor, a port interface the handler gets instead of the db |
| 2 | **Boundary rule** | It forbids an import or a dependency between parts | Go: depguard. TypeScript: `no-restricted-imports` in ESLint or Biome, dependency-cruiser for layering those cannot express. Python: ruff `TID251` |
| 3 | **Lint rule** | It forbids a call, an identifier or a small pattern | Go: forbidigo with `analyze-types: true`. TypeScript: `no-restricted-syntax`, a Biome GritQL plugin. Python: ruff banned-api, `T201` |
| 4 | **Structural rule** | A code shape the project's linter cannot express | ast-grep: a YAML rule, run by `ast-grep scan` |
| 5 | **A test** | It is about behaviour, not shape | A unit or integration test in the project's runner |
| 6 | **Text only** | No machine can judge it, such as naming or design taste | `ENFORCED-BY: agents-md`. A person checks it in review |

Rung 1 changes code and belongs to an issue: say so, and open one through `/bloop:backlog` instead of doing it here. For rung 6, consider a path-scoped `.claude/rules/<name>.md` as well, which loads only when matching files are touched.

## Step 3 · Write it

1. **The id**: `R<n>-<slug>`, the next number after the highest in `.bloop/rules/`, the slug lowercase English
2. **The folder**: copy `${CLAUDE_PLUGIN_ROOT}/templates/rule.md` to `.bloop/rules/<id>/rule.md` and fill every header line
3. **The examples**, under `bad/` and `good/`:

   | Tool | How the examples are stored | `CHECK` |
   | --- | --- | --- |
   | golangci-lint | Real `.go` files, each folder its own package. `./...` skips folders that start with a dot, so they never reach the main gate. A path-scoped rule's `files` glob must also cover `**/.bloop/rules/<id>/**` | `golangci-lint run --enable-only <linter> ./{dir}/...` |
   | ESLint, Biome | `.txt` files, so no other tool picks them up. The check pipes them in under a path inside the rule's scope | `npx eslint --stdin --stdin-filename src/app/api/x/route.ts < {path}` |
   | ruff | `.txt` files | `ruff check --select <code> --stdin-filename app/x.py < {path}` |
   | ast-grep | Files with the real extension, which ast-grep needs to pick the language. If the project's `tsconfig.json` or test runner globs dot-folders, exclude `.bloop/` there | `ast-grep scan --rule <rule file> {path}`, which exits 1 when an error-severity rule matches. Also write the rule's own `rule-tests/` file from the same two examples, so `ast-grep test` keeps proving it. Not yet tried on a real project: check the first one by hand |

   `{path}` is the example file and `{dir}` its folder, relative to the repo root.
4. **The config**: add the rule to `WHERE`, as a diff the user approved. Name the rule after the id, such as a depguard rule `no-db-in-handler`, so the two can be found from each other. When the tool is new to the project, `checks.sh` needs a step that runs it: show that diff too
5. **Text-only rules** skip examples and config. `rule.md` holds the sentence and the why

## Step 4 · Prove it

```bash
"$CLAUDE_PLUGIN_ROOT/bin/rule-check" <id>
```

It runs `CHECK` on the bad example, expecting a failure, and on the good one, expecting a pass. It writes `proof.md`: when it ran, a summary, and what the tool printed for each example. It sets `STATUS` and `PROVEN-AT`.

| Result | What to do |
| --- | --- |
| `proven` | Go on |
| The bad example passed | The rule does not catch what it is meant to. Fix the rule, not the example |
| The good example failed | The rule flags correct code. Narrow it |
| Exit code 127 or 126 | The tool is not installed. Say what to install, and stop until it is |

## Step 5 · Look at the code already there

Run the tool over the rule's whole scope, the way `checks.sh` will. Existing code that breaks the rule turns `checks.sh` red for everyone.

| Found | What to do |
| --- | --- |
| Nothing | Write "None" under `## Existing violations` |
| Some | Show the count and the first few places. Ask whether to fix them first, through an issue from `/bloop:backlog`, or exclude them by path with a `shortcut:` marker naming when they get fixed. Never turn the rule on with `checks.sh` red |

## Step 6 · Tell agents

```bash
"$CLAUDE_PLUGIN_ROOT/bin/rule-check" --agents
```

It rebuilds the rules block in `AGENTS.md` from every `rule.md`, so an agent reads each rule and what enforces it before writing code.

## Report

**Rule added** `<id>` · `<tool>` · `STATUS: proven`

| Group | What you got |
| --- | --- |
| Rule | the sentence, and where it applies |
| Enforced by | the tool and the file, and why no stronger rung fit |
| Proof | bad exit `<n>`, good exit 0, at `<time>`, in `proof.md` |
| Existing code | none, or the count and what happens to them |

**Next** commit the rule folder, the config change and `AGENTS.md` together

## Re-proving

`bin/rule-check --all` proves every machine-checked rule again. Run it after upgrading a linter or changing its config: a rule that silently stopped biting is worse than no rule. `/bloop:doctor` reports rules that are not proven.

## Done when

* `rule.md` has every header line, and `STATUS` is `proven` or `text-only`
* `proof.md` shows the bad example failing and the good one passing
* `checks.sh` is green on the code already there
* `AGENTS.md` lists the rule
