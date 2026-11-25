---
name: prototyping
description: Write throwaway code to answer one open question, never merged, then record what was learned in spec.md. Called by plan, and usable from box 4 Build. Use when unsure whether an approach works, or when the user says prototype, spike, let us try it first.
---

# prototyping

Step 3 of box 3 Planning. Called when a decision is stuck on a question that gets answered by trying, not by thinking.

**What you produce is knowledge, not code.** The code gets thrown away.

## When to call this

| Situation | Prototype? |
| --- | --- |
| Unsure whether this library can do this | Yes |
| Unsure what their API actually returns | Yes |
| Unsure whether it is fast enough | Yes, go measure |
| Unsure what shape the design should take | Sketch types and signatures and typecheck them. No full prototype needed |
| Unsure what people want | No. That belongs to `restate`. Go ask them |
| You want to start writing the real code | No. That is box 4 Build |

## Rules

1. **One question per prototype.** Write the question down before you start. If you cannot write it, you do not yet know what you are testing
2. **Put a limit on it.** If you run out of time without an answer, stop and report that you have no answer. No answer is also a result
3. **Never merge it.** This code does not reach main and does not enter a PR
4. **Never keep the code.** Delete it once you have the answer. Code written in a hurry gets picked up and used when it was never meant to be
5. **Never edit files the repo actually uses.** If touching the real thing is the only way to try it, try it in a separate file and delete it
6. **It does not have to be pretty.** A good prototype is the one that answers fastest, not the one that is clean

## What to record

Write `## Prototype` in `spec.md`, four lines.

```markdown
## Prototype

- Question to answer: <...>
- What was tried: <...>
- Result: <...>
- Code thrown away, never merged
```

**You may write only this section of `spec.md`.** The rest has owners.

If the result changes the plan, tell `plan` that `write-spec` has to redo `## Context`. Do not edit it yourself.

## Done when

* The question is answered, or time ran out and you reported having no answer
* The code is deleted
* `## Prototype` in `spec.md` has all four lines
