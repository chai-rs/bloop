# Reviewing the experience

Used by the agent `reviewer-ux`. The question this lens answers is **what will a person hit that the code cannot show you.**

## Where these rules come from, and what we may not do

The named laws below come from published psychology and human-factors research: Hick, Fitts, Miller, Zeigarnik and the rest. The names and the findings are public.

**lawsofux.com is CC BY-NC-ND 4.0**, which forbids both copying its text and redistributing a rewritten version. So none of its wording appears here, and the `references/laws.md` of any installed `lawofux` skill is never vendored into this plugin. We name the law and state the checkable rule in our own words, from the underlying principle.

If the session has a companion skill for this lens, listed under `companions.review` in config with `lens: ux`, call it as well, on top of these rules and never instead of them. It goes deeper than this file. Without it, these rules stand on their own.

---

## Severity, not pass or fail

Rate every finding 0 to 4, following Nielsen. Severity combines three things: how often a person hits it, how hard it is to get past, and whether they keep hitting it.

| Rating | Meaning | Goes in the report as |
| --- | --- | --- |
| 0 | Not actually a problem | not written down |
| 1 | Cosmetic only | `[should]` |
| 2 | Minor | `[should]` |
| 3 | Major | `[must]` |
| 4 | Catastrophe, cannot ship | `[must]` |

A `VERDICT: CHANGES` needs at least one `[must]`. A pile of `[should]` items is a note to the builder, not a blocker.

## Every finding carries proof

A finding names the file and line, or points at a screenshot in `evidence/`, and says what a person would do and what would happen. "This feels confusing" is not a finding. "Submitting with an empty cart shows a blank page with no way back, evidence/slice-3.png" is.

---

## Reduce friction

| Check | Law it comes from |
| --- | --- |
| Are the choices at each step the fewest that still do the job? | Hick |
| Is information grouped into chunks a person can hold, roughly five to seven? | Miller |
| Does anything the person waits on respond inside about 400ms, or show progress? | Doherty |
| Does the system absorb the complexity, instead of pushing it onto the person? | Tesler |

## Guide attention

| Check | Law it comes from |
| --- | --- |
| Is there exactly one visually distinct primary action per view? | Von Restorff |
| Do the important items sit at the start or the end of a list, not buried in the middle? | Serial position |
| Does spacing group what belongs together, and separate what does not? | Proximity |
| Do things that behave the same look the same? | Similarity |

## Match expectations

| Check | Law it comes from |
| --- | --- |
| Does it follow the pattern people already know from elsewhere? | Jakob |
| Does it accept messy input and tidy it up, rather than rejecting it? | Postel |
| Can someone use it without reading documentation first? | Paradox of the active user |
| Does the structure match how a person thinks about the task? | Mental models |

## Carry people to the end

| Check | Law it comes from |
| --- | --- |
| Is progress visible, and does it feel closer near the end? | Goal gradient |
| Does an unfinished task stay visible instead of vanishing? | Zeigarnik |
| Is the end of the flow a good moment, and is error recovery gentle? | Peak-end |
| Are touch targets big enough and close to where the hand already is? | Fitts |

---

## States the code hides

Most UX findings live in states a diff does not show. Go looking for these on purpose.

* **Empty** nothing to show yet. Is there a way forward, or just blankness?
* **Loading** does anything appear, or does the screen sit still?
* **Error** does the message say what to do next, or only what went wrong?
* **Partial** some of it loaded. Is the half-state readable?
* **Too much** a thousand rows, a very long name, a number that does not fit
* **Permission denied** does a person understand why, and who to ask?

## Do not review

Code style, naming, architecture. Those belong to `reviewer-code`. Visual detail such as spacing, contrast and motion belongs to `reviewer-ui`. Overlapping wastes a round.
