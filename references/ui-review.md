# Reviewing what is on screen

Used by the agent `reviewer-ui`. The question this lens answers is **does the thing on screen hold together, and can everyone use it.**

## Where these rules come from, and what we may not do

The sources behind this lens carry licences that stop us copying them.

| Source | Licence | What we may do |
| --- | --- | --- |
| craft.gustavofior.com | not stated | Name the idea, write the rule ourselves |
| lawsofux.com | CC BY-NC-ND 4.0 | Name the law, never copy or adapt the text |
| impeccable | Apache 2.0 | May be copied, with a NOTICE |
| oil-ui | MIT | May be copied, with attribution |

So this file names ideas and states rules in our own words. If the session has a companion skill for this lens, listed under `companions.review` in config with `lens: ui`, call it as well, on top of these rules and never instead of them. It goes deeper than this file.

## You cannot review a screen from a diff

This lens needs the screenshot that `evidence-pack` captured. If a slice changed something a person sees and there is no screenshot, **that is itself a finding**: report it and say the visual review could not be done.

Reading markup tells you what was written, never what it looks like.

---

## Severity

Same scale as the UX lens, 0 to 4, following Nielsen. 3 and 4 are `[must]`, 1 and 2 are `[should]`, 0 is not written down. A `VERDICT: CHANGES` needs at least one `[must]`.

Accessibility failures that lock someone out are 3 or 4, never a `[should]`.

---

## Typography

* Is there one type scale, or did a new size appear for this change alone?
* Do numbers that line up in a column use tabular figures, so they do not jitter?
* Is line length readable, rather than running the full width of a wide screen?
* Does text truncate predictably, or does a long name break the layout?

## Colour and contrast

* Does body text meet 4.5:1 against its background, and large text 3:1?
* Is state carried by something other than colour alone, so it survives colour blindness?
* Did this change add a colour that is not in the project's tokens?
* Does it hold up in both themes, if the project has two?

## Layout and spacing

* Does spacing come from the project's scale, or are there arbitrary pixel values?
* Do nested corners share a centre, so the inner radius is smaller than the outer?
* Does the layout survive the narrowest viewport the project supports?
* Is anything aligned by eye that should be aligned by the grid?

## Motion

* Does each animation earn its place, or is it decoration?
* Are frequent interactions instant, with movement kept for rare or spatial ones?
* Does it reuse the project's existing easings and durations, rather than new ones?
* Does it respect `prefers-reduced-motion`?

## Accessibility

* Can everything be reached and operated from the keyboard, in a sensible order?
* Is focus visible at every step?
* Do interactive elements have an accessible name, and the right role?
* Are touch targets at least 44 px?
* Is anything conveyed only by hover, which a touch device never sees?

---

## Use the project's own checks when it has them

If the project already runs an accessibility or component-pattern check, run that and quote its output, because a mechanical result is stronger evidence than reading markup. `.bloop/config.json` says what this project uses.

**Never add a dependency or a tool to make a review easier.** Without one, judge from the screenshot and the markup, and say in `## What I did not cover` which checks you could only do by eye.

## Do not review

Correctness, structure and naming belong to `reviewer-code`. Whether a flow makes sense to a person belongs to `reviewer-ux`. This lens is what is on the screen.
