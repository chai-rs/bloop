# Writing files so they can be rewritten

`guardrails` gets called again and again over a project's life. A rerun has to leave the same state behind, not three layers of stacked config.

## Markers

Anything guardrails writes into a file that already holds somebody else's content gets wrapped in markers.

```
# bloop:managed pre-commit
...what bloop wrote...
# bloop:end pre-commit
```

The comment syntax follows the file's language: `#` for yaml, toml and sh · `//` for js, ts and json5 · `<!-- -->` for markdown.

`<key>` is a short name unique within that file, such as `pre-commit`, `checks-job`, `boundary-rules`.

## Rerun rules

| What you find | What to do |
| --- | --- |
| No file | Create it from the template |
| File with a marker for this key | Replace only what sits between the markers. Never touch anything outside them |
| File with no marker, but something already doing the same job | **Never overwrite.** Show the user what is already there and ask whether bloop should take it over |
| File with no marker and nothing conflicting | Append a new block with markers |

## Files that need no markers

Files bloop owns entirely can be rewritten whole.

`.dependency-cruiser.cjs` · `checks.sh` · `.gitleaks.toml` · `.github/workflows/checks.yml` · `.github/workflows/audit.yml` · `.bloop/issues/README.md`

But if one of those already existed before bloop arrived, treat it as somebody else's and use the table above.

## `.bloop/config.json`

bloop owns the whole file, but three skills write different sections.

* `init` writes `version`, `project`, `architecture`
* `contract` writes `contract`
* `guardrails` writes the rest

Always read the existing file first and change only your own keys. Never overwrite the whole file from a template, because that erases the other skills' sections.

## Reporting

At the end of a run, say three things.

1. Which files were created
2. Which blocks were replaced, in which files
3. Where you found existing unmarked content, and left it alone
