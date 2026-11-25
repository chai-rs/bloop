---
name: init
description: Opens the Architecting box of bloop. Reads what the repo already has, interviews the business and the tech stack, designs the codebase shape, writes ARCHITECTURE.md and .bloop/config.json, then hands off to contract and guardrails. Use when starting a new project, bootstrapping architecture or foundation, auditing what a repo already has, or when the user says init, start a project, set up the architecture, foundation setup.
---

# init

The first step of box 1 Architecting. You are the one who reads the repo before asking anything.

**Output** `ARCHITECTURE.md` · the directory shape · `.bloop/config.json`, then calls `contract` and `guardrails`

## Standing rules

1. **Read before asking.** Never ask what `bin/detect` already answers. When it found something, ask one confirming question instead
2. **Ask with options.** Every question that picks a tool offers choices that actually run on this stack, says which one is recommended and why, and leaves room to type something else. Never ask into empty space
3. **One question at a time.** Wait for the answer before the next one
4. **Only ask approval for what is expensive to undo.** The skeleton and the contract need a human. Config, lint, CI and hooks you just write, because one command removes them
5. **Language**: talk to the user in the language the user writes in. Everything written to disk is English
6. **Report format**: reports and menus are markdown, never inside a code block. Read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report

## Step 0 · Detect

Run

```bash
"$CLAUDE_PLUGIN_ROOT/bin/detect"
```

If `$CLAUDE_PLUGIN_ROOT` is empty, find `bin/detect` inside the `bloop` plugin folder.

Report four lines to the user. Never paste the whole JSON.

- **repo** `<language>` + `<framework>` using `<packageManager>`
- **already there** the lint, typecheck, unit and ci it found, separated by ·
- **missing** `<missing>`, separated by ·
- **starting at** `<stage>`

Then branch on `stage`.

| stage | What to do |
| --- | --- |
| `architecting:init` | Continue to step 1 |
| `architecting:contract` | Say init is already done, then call the `contract` skill |
| `architecting:guardrails` | Say contract is already done, then call the `guardrails` skill |
| `ready` | Report that everything is set up, ask which part to update, then call the matching skill |

## Step 1 · Interview the business

Ask in this order, one at a time. Skip anything the user already answered.

1. **business** who does this system make money for, or create value for, and how
2. **scope** what v1 does and what it **does not** do. Ask for both sides
3. **dataflow** where things come in, what they pass through, where they go
4. **modules** what the pieces are, and which data each one owns
5. **functional requirements** what the system must be able to do, as a list
6. **non-functional requirements** offer starting numbers to choose from: latency p95, concurrent users, RPO/RTO, data regulation
7. **tech stack** confirm what detect found. On an empty repo, offer two or three paths with reasons

## Step 2 · Confirm the kind of project

`kindGuess` from detect is the starting point. Ask one confirming question.

**This repo looks like `<kindGuess>`, is that right?**

| # | Option |
| --- | --- |
| 1 | Yes |
| 2 | backend |
| 3 | frontend |
| 4 | fullstack |

The answer decides which set of questions `contract` asks.

## Step 3 · Design the codebase shape (needs human approval)

If this session has the `pstack:architect` skill, let it do the design and present the result in the same shape.

The default is DDD + hexagonal + functional programming.

```
src/
  domain/        business rules only, imports nothing from outside
  application/   use cases that compose the domain
  port/          interfaces the application declares it needs
  adapter/       the real thing talking to db, http, queue, implementing the ports
```

If the stack cannot take this shape, such as the Next.js app router or Django, do not force it. Offer the closest shape and record in `ARCHITECTURE.md` why it is not the default.

Show the full tree for approval before creating anything. Create one example file per layer, enough for lint and typecheck to run. No real logic.

### Record it as an ADR

Once the shape is approved, write `docs/adr/0001-codebase-shape.md` from `templates/adr.md`.

`ARCHITECTURE.md` says what the shape **is**. An ADR says **when it was decided, by whom, and what was rejected**. The first gets edited over and over until the reasoning is gone. The second is append-only, so a year from now somebody can see that the alternative was considered and why it lost.

`## Status` is `Accepted`, dated, with the name of whoever approved it. **An agent never writes a name there.** If a human has not approved, the status is `Proposed`.

Number them in order. An ADR is never edited after it is accepted: a later decision gets a new file and marks the old one `Superseded by ADR-NNNN`.

## Step 4 · Write things

1. `ARCHITECTURE.md` from `templates/ARCHITECTURE.md`, filled in with the answers from steps 1 to 3. Never leave a placeholder behind
2. The directory shape that was approved
3. `.bloop/config.json`, new, holding only these three sections. The other two skills add their own

```json
{
  "version": 1,
  "project": { "kind": "backend | frontend | fullstack" },
  "architecture": { "style": "ddd-hexagonal-fp", "boundaryRuleConfig": null }
}
```

**Never put a secret in `.bloop/config.json`.** This file enters git. Tokens live in environment variables.
**Never put human-facing prose in this file.** Business, scope, dataflow and FR/NFR live in `ARCHITECTURE.md`. This file holds only what a script or hook reads at runtime.

## Step 5 · Hand off

Call the `contract` skill, then `guardrails`. Do not ask whether to continue, because all three are the same box. But tell the user which step you are moving to.

## Step 6 · Run one issue through, end to end

**`checks.sh` passing proves the gate works. It does not prove the loop works.** Before this box closes, take one small issue the whole way and watch it land.

1. Open a throwaway issue with `/bloop:backlog`, something genuinely small, such as a README line or one log message
2. Run `/bloop:restate`, then `/bloop:plan`, then `/bloop:build`, then `/bloop:review`
3. Watch for the things that only break in a real run: `$CLAUDE_PLUGIN_ROOT` not resolving, `bin/work` failing on a repo with no commits, a protected path blocking a write, a skill writing into a section that is not its own
4. When it reaches box 6 Deliver, **delete the branch, the worktree and the issue folder.** This was a rehearsal, not work
5. If it stops somewhere, that is the finding. Fix it, then run it again from the start

Tell the user before you begin, because it creates a branch and runs the gate several times. **If they decline, skip it and record in the closing report that the loop has never been run end to end.** Do not pretend the box is finished when only its first half has been tested.

## Step 7 · Leaving the box

Run `bin/detect` again. If `stage` is not `ready`, say plainly what is still missing. Never call it done.

Close with the shape in `references/report-style.md`, under reporting at the end of a box.

**Box 1 Architecting · done** `stage: ready` · `./checks.sh` ✓ · one issue ran end to end ✓

| Group | What you got |
| --- | --- |
| Contract | the documents and contract actually written |
| Code | the directory shape and example files |
| Gate | `checks.sh` and whatever guardrails set up |
| bloop | `.bloop/`, `.claude/`, and `docs/adr/0001` |

**Skipped** what the user chose to skip, and what skipping it costs
**Next** `/bloop:restate` to pull an issue in

Group by purpose. Never list file names in one long run.
