# How bloop writes code

Applies during box 4 Build, and any other time someone writes code on behalf of this project.

**Source** ponytail v5.3.3 <https://github.com/DietrichGebert/ponytail> MIT, rewritten in our own words.

---

## The one principle

**Make the smallest change that fully solves the problem.**

Be lazy about the **solution**, never about the **work**. The second half matters as much as the first. The work includes every caller, test and fixture your change breaks. Skipping those is leaving a mess, not writing less code.

## Before you write

List every place the change has to reach. **Five kinds**: callers · tests · fixtures · config · exports

`## Context` in `spec.md` already lists them. If that list is incomplete, tell `build` the plan needs fixing. Do not quietly fill the gap yourself.

## The ladder

Take the first option that fully solves it. You do not have to reach the bottom.

1. **Does it need to exist?** Cut anything nobody asked for, and say in one line what you cut
2. **Does this repo already have it?** A helper, component, service or pattern. Use it the way the surrounding code uses it. `## Context` already names which one. **This step is binding, not advice**
3. **Does the language or platform provide it?** Use that, unless the project has its own. The house component beats the native widget
4. **Does an installed dependency provide it?** Use it. Never add a dependency for a few lines
5. **Can it be one line a reader understands at a glance?** But a one-liner that needs decoding is not short
6. Otherwise, the least code that works

## Never add

* An abstraction, wrapper, type conversion, option, config, boilerplate, or "for later" code nobody asked for
* A value stored in some shape other than the one the platform already hands you
* A change to the structure the repo uses. Keep its layers, interfaces and conventions
* A guard that hides the symptom instead of fixing the cause

## Never cut

Validation at trust boundaries · error handling that prevents data loss · security · accessibility · the calibration real hardware needs · anything the user asked for

## Smaller rules

* **Fixing a bug**: grep every caller of the function you are about to touch, then fix the root cause once, in the shared code
* Code you move or merge keeps its error handling and validation
* Between two options of equal size, take the one that is correct on edge cases
* New non-trivial logic, meaning a branch, a loop, a parser, money, security, or a whole new script or app, needs a check of its own. Trivial changes do not

## Build the lever

**Work you are about to do by hand for the third time becomes a script instead.** A sweep across many call sites, a check you keep re-running, a migration repeated per file: write the tool, run the tool, and leave the tool behind. The tool is what a reviewer can rerun, and a sentence in a report is not.

Any script that ships with the work has to carry three things.

1. **`--dry-run`**, printing what it would do and changing nothing. Anything that writes needs a way to look first
2. **JSON on stdout** when the output is for another program, with the human summary on stderr, so it can be piped without being parsed by guesswork
3. **A real exit code**, 0 for pass and non-zero for fail, so `checks.sh` and CI can use it without reading its text

bloop's own `bin/detect`, `bin/job`, `bin/work`, `bin/gate` and `bin/trust` follow this, and they are the reason three skills give the same answer about the same repo.

A script that only reads needs no `--dry-run`, because reading is already the safe look. `bin/work` and `bin/gate` are the two that write, so those two carry the flag.

**Do not build the lever for something you will do once.** The rule is about repetition, not about ceremony.

## Comments

Write only the **why the code cannot show, in one line**. The full rules are in `${CLAUDE_PLUGIN_ROOT}/references/comment-rules.md`, and `clean-comment` inspects them before every commit.

## The `shortcut:` marker

A deliberate shortcut that knows its own ceiling leaves a comment in this shape.

```go
// shortcut: handles up to 100 items per order, switch to batch insert above that
```

**Only a complete marker survives**: it names both the ceiling and the trigger to revisit, separated by a comma. An incomplete one is an excuse. `clean-comment` deletes those, and `checks.sh` enforces the shape.

This marker survives strict comment rules because its shape is machine-checkable. It is not prose that needs judgement, it is data that can be enforced.
