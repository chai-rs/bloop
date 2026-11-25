# How to print reports and menus

One rule: **reports and menus must never sit inside a code block.**

Two reasons. Claude Code renders markdown already, so a table wraps inside its own cells and the columns survive a narrow terminal. And aligning columns with spaces breaks for any non-Latin script, because glyph widths differ, so counting spaces never lands right.

Keep code blocks for three things only: a command the user runs themselves, real file content you are about to write, and raw output from a tool.

File names, commands and config keys get single backticks, like `checks.sh`. They do not need a block.

---

## Asking with a menu

Bold heading, then a three-column table. The recommended option is bold and ends with `← recommended`. The reason always lives in the right column, never appended to the name.

> **Question 4 · API preview**
>
> | # | Option | Why |
> | --- | --- | --- |
> | 1 | **Scalar** ← recommended | Good-looking, fires requests from the same page, mounts as one route in Fiber at `/docs` |
> | 2 | Bruno | Stores requests as files in the repo, grows into integration tests |
> | 3 | Swagger UI | The standard, most people have seen it |
> | 4 | Skip | Add it later, the writes are idempotent anyway |
>
> Answer with a number, or type something else.

Ask one question per message, one table per question. Never fire three tables at once.

## Asking with checkboxes

Use an `On` column holding ✓ or ✗ instead of markdown checkboxes.

> | On | Hook | What it does |
> | --- | --- | --- |
> | ✓ | `PreToolUse` | Blocks edits to protected paths |
> | ✗ | `Stop` | The plugin owns this one, do not set it twice |

## Reporting detection at the start of a box

Four bullets. Never paste the whole JSON.

> - **repo** Go 1.23 + Fiber using `go mod`
> - **already there** `golangci-lint` · unit tests · GitHub Actions
> - **missing** `ARCHITECTURE.md` · `openapi.yaml` · `checks.sh`
> - **starting at** `architecting:contract`

## Reporting at the end of a box

Bold heading with the stage and the gate result, then a grouped table, then two closing lines.

> **Box 1 Architecting · done** `stage: ready` · `./checks.sh` ✓ · `--e2e` ✓
>
> | Group | What you got |
> | --- | --- |
> | Contract | `ARCHITECTURE.md` `AGENTS.md` `openapi.yaml` · `docs/` FR, NFR, data-model |
> | Code | 59 Go files with a first test |
> | Gate | `checks.sh` `.golangci.yml` `lefthook.yml` · `.github/workflows/` checks, audit |
> | bloop | `.bloop/config.json` `flags.json` · `.claude/settings.json` + 3 hooks |
>
> **Skipped** component tests · E2E deferred to M4
> **Next** `/bloop:restate` to pull an issue in

Group by purpose, not by the order you wrote things. A long run of file names crammed into one cell is unreadable.

## Shared symbols

| Mark | When |
| --- | --- |
| ✓ | Passed, or switched on |
| ✗ | Failed, or switched off |
| · | Separates items in the same group |
| ← recommended | The option bloop suggests |

## Language

Talk to the user in the language the user writes in. **Everything written to disk is English**: file contents, headings, identifiers, commit messages. If the user asks for another language in their files, follow that instead.
