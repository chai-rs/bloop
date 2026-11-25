---
name: external-contract
description: Record which outside systems this work depends on and what happens when they go down, into docs/external/<name>/README.md. Called by plan. Use when a change depends on a third party or another team's API, or when the user says external contract, we call their API.
---

# external-contract

The second half of step 4 in box 3 Planning. You record the things **we do not own**.

## Tell the two apart first

| | Owner | Who handles it |
| --- | --- | --- |
| The contract **we give** others, the API we serve | us | `/bloop:contract`, changing `openapi.yaml` as the first commit. Not this skill |
| The contract **others give** us, the API we call | them | **this skill**, writing `docs/external/<name>/` |

Confuse these and you will edit `openapi.yaml` for something you do not own, which changes nothing about their system.

One piece of work can be both at once.

## What to do

1. Work out which systems outside this repo this work has to call. If there are none, report that and stop
2. For each one, check whether `docs/external/<name>/` already exists
3. **It does not**: copy `templates/external/README.md` and fill it in
4. **It does**: read it first. If it is complete and still accurate, change nothing and report which one you used. If this work uses an endpoint that is not listed, add only that row. **Never rewrite the whole file**, and always report what you changed
5. In `## Context` of `spec.md`, say which systems this work depends on, pointing at the folders

## Four things `README.md` must have

Missing any one of them means it is not finished.

1. **Owner**, which team or company, and how to reach them
2. **What we use**, which endpoints or topics, and for what
3. **What we cannot rely on**, written as checkable statements, not feelings
4. **What we do when it is down**, how many retries, what the user sees, where our data is left

Items 3 and 4 are why this file exists. With only 1 and 2 it is a copy of their README.

## A copy of their spec

If they publish a spec as a file, an `openapi.yaml` or a callback document, put a copy beside `README.md` and note which version it is and when it was pulled.

**Never edit a file that is theirs.** A copy is a copy. When they change it, pull it again and read the diff. Editing the copy destroys the record of which version the code was written against.

## Done when

* Every system this work depends on has its own folder with a `README.md` carrying all four sections
* `## Context` in `spec.md` points at those folders
* Any change to an existing file has been reported
