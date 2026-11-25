---
name: interview
description: Interview the user in rounds to sharpen a request before an issue is opened or an FR is added. Asks a round at a time with a progress badge. Use when a request is too vague to act on, before creating an issue from a new intent, or when the user says interview me, pin this down.
---

# interview

Called by `backlog` and `restate`. It also runs on its own.

**The goal is to sharpen the request until it matches what the user actually wants, not to fill in every field.** A question whose answer does not change what gets built is a question not worth asking.

**Output** a block of conclusions handed back to whoever called you. **This skill writes no files.** The caller writes them.

## Standing rules

1. **Ask when the answer changes the work.** If every answer leads to the same thing, do not ask
2. **Actually ask when something is ambiguous.** Never guess and quietly move on. This is the most commonly missed rule
3. **Never ask what you can find out.** Anything readable from the repo, `ARCHITECTURE.md`, `openapi.yaml`, or by running a command, go find it. Finding facts is the agent's job. Deciding is the user's
4. **One question, one subject.** Never join two questions with "and"
5. **No leading questions.** Ask "can coupons stack?", not "coupons probably cannot stack, right?"
6. **Breadth before depth.** Do not sink into one topic while whole areas stay untouched

## Choosing the questions

Rank candidates by one thing: **how much does the answer change what we build?**

| A question like this | Ask it? |
| --- | --- |
| One answer gives one thing, another gives something entirely different | Yes, this is the most valuable kind |
| Every answer gives the same thing, differing only in detail that can change later | No. Record an assumption instead |
| Answerable from code or docs in the repo | No. Go read it |
| Asked to complete a form | No |

## Rounds

The **frontier** is every question whose prerequisites are already settled, so it can be asked now without guessing at an answer you have not heard.

Ask the whole frontier in one round. A question whose answer depends on another question still open this round waits for the next round.

When the user answers, the tree reshapes. Recompute the frontier and ask the next round.

### Budget

* **At most 4 questions per round.** More than that is a wall
* **At most 3 rounds.** Still unclear after that means the request is too big to sharpen by asking. Stop, write what you still do not know as assumptions, and hand it to a human
* The budget stretches if the user asks for it

### Format

The top line of every round says what has been settled, so nobody has to scroll up.

> **Round 2 of 3** · settled: coupons discount the whole bill · the platform issues them
>
> ---
>
> **(1/3) Can coupons stack?**
>
> One per order, or several combined? This decides whether discount calculation is a single function or a loop, and whether we need a guard against discounting below zero.
>
> ➡️ **Recommended** one per order, because `pkg/order` already prices as a single lump. Supporting several means reworking the pricing order.
>
> ---
>
> **(2/3) Is a coupon tied to one person or usable by anyone?**
>
> ...
>
> ➡️ **Recommended** ...

`(1/3)` is the position within **this round**, not within the whole interview, because the total is not knowable yet. The tree is not fully open. **Never invent a total to make it look tidy.**

Every question carries a recommended answer with a reason citing something real in the repo, not an opinion. That lets the user reply "go with that" quickly.

## When it ends

It ends when one of these happens.

* The frontier is empty. Nothing is still being guessed at
* Three rounds are up. What remains becomes assumptions
* The user says that is enough

Then summarise as one block.

> **What I understand**
>
> | Subject | Settled as | From |
> | --- | --- | --- |
> | Discount scope | the whole bill | user, round 1 |
> | Who issues coupons | the platform | user, round 1 |
> | Stacking | one per order | user accepted the recommendation |
> | Expiry | yes, checked at use | **assumption**, never asked |
>
> **Still unknown** what is open, and what it costs to be wrong

Assumptions have to be visibly separate from what the user said. A later reader has to be able to tell a real answer from something the agent filled in.

## Never

| Never | Why |
| --- | --- |
| Write files | The caller owns the files. One file, one owner |
| Keep asking after the user says enough | More questions become an obstacle |
| Claim you understand while holding unmentioned assumptions | They find out when the work is finished, which is the most expensive moment |
| Rewrite the user's answer until it means something else | Summarise, never reinterpret |
