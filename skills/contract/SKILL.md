---
name: contract
description: Create or change a project's contract in bloop. Builds openapi.yaml from an interview, sets up an API preview, writes the data model and external contracts, generates types for the frontend, and sets up DESIGN.md and storybook. Use when creating or changing an API contract, openapi spec, data model or external contract, or when the user says contract, edit openapi, add an endpoint, data model.
---

# contract

The second step of box 1 Architecting. Called by `init`, or on its own to change something already set up.

**Output** `openapi.yaml` · the preview's config · `docs/data-model.md` · `docs/external/<name>/` · generated types · `DESIGN.md` and storybook on a frontend · the `contract` section of `.bloop/config.json`

Before your first menu or report, read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` in full. In short: menus and reports are markdown tables, never inside a code block.

Talk to the user in the language the user writes in. Everything written to disk is English.

## Step 0 · Detect, then pick a mode

Run `"$CLAUDE_PLUGIN_ROOT/bin/detect"` and read `kindGuess` and `contract.openapi`.

| What you find | Mode |
| --- | --- |
| No openapi | **create**, go to step 1 |
| openapi already exists | **update**, go to the update section |

With no `.bloop/config.json`, tell the user they should run `/bloop:init` first, then ask whether to continue without config.

## Create mode

### Backend and fullstack

1. **Interview the contract.** Go resource by resource: which endpoints, what they take, what they return, what errors look like. Offer common shapes instead of asking into empty space, such as cursor versus offset pagination, or an RFC 9457 error envelope versus `{ code, message }`
2. **Write `openapi.yaml`**, OpenAPI 3.1. Every schema goes in `components.schemas`, never inlined twice. Every operation needs an `operationId`, because the generator uses it to name functions
3. **Preview**, asked with options

**Which API preview?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **Scalar** ← recommended | Good-looking, fires requests from the same page, mounts as a single route |
| 2 | Bruno | Stores requests as files in the repo, grows into integration tests |
| 3 | Swagger UI | The standard, most people have seen it |
| 4 | Skip | You will be reading raw `openapi.yaml` |

Answer with a number, or type something else.

4. **`docs/data-model.md`** entities, relationships, and the invariants that must hold at all times. Write invariants as checkable statements, not loose description
5. **`docs/external/<name>/`** things another system owns and we have to trust. One folder per system, `<name>` lowercase English, such as `docs/external/stripe/`

    ```
    docs/external/
      stripe/
        README.md        what we wrote ourselves
        openapi.yaml     a copy of their spec, the version our code follows, if we have one
      bank-payment/
        README.md
        callback.md      a document they sent us, if any
    ```

    `README.md` needs four things: **owner** · **the endpoints or topics we use** · **what we cannot rely on** · **what we do when it is down**

    A folder, because a vendor's spec is usually a real file too long to cram into one markdown document, and keeping a copy records which version the code was written against, so a diff is possible when they change it.

    **Never edit a file that is theirs.** A copy is a copy. When they change it, pull it again and read the diff.

### Frontend

1. **Where is the openapi?** A path in the repo, a URL, or a git submodule. If there is none yet, say plainly that the frontend will be mocking blind
2. **Generate types** from the openapi. Recommend `openapi-typescript` for TypeScript, and write the generate command into the project
3. **`DESIGN.md`** where the current design lives. A Figma or Handdraw link is fine
4. **storybook** ask whether to set it up. If yes, set up `storybook` with the a11y addon, because box 4 Build's component tests use it

## Update mode

1. Keep the old openapi for comparison
2. Make the change the user asked for
3. **Diff it and decide whether it is breaking.** It is breaking when

   * A path or an operation disappears
   * A response field disappears
   * A new required request field appears
   * An existing field changes type
   * An enum value is removed

4. If it is breaking, **stop and get human approval.** List the diff item by item, saying who breaks. Never push it through. Once approved, record it as an ADR in `docs/adr/`, from `templates/adr.md`, because a breaking change is a decision someone will ask about later. The approver's name goes in `## Status`, and an agent never writes it
5. If it is not breaking, write it and report what changed
6. Regenerate types every time the openapi changes

## Write the config

Add the `contract` section to `.bloop/config.json`, keeping only what a script has to read.

```json
"contract": {
  "openapi": "./openapi.yaml",
  "preview": "scalar",
  "external": "./docs/external"
}
```

## Done when

* `openapi.yaml` passes an OpenAPI validator
* The generated types compile
* `docs/data-model.md` holds real content, not empty headings, and if this project depends on another system, at least one folder under `docs/external/` has a `README.md` with all four sections
* The `contract` section is in `.bloop/config.json`

Tell the user this contract becomes the first commit of every piece of work in box 3 Planning, and that a breaking change needs human approval every time.
