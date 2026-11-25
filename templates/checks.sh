#!/bin/sh
# bloop:managed checks
#
# The one gate for this project. Dev machines and CI call this same file.
# If CI runs anything that is not in here, the local = CI promise is broken.
#
#   ./checks.sh         static + unit + component   every slice, must run offline
#   ./checks.sh --e2e   adds the E2E smoke test      before merging
#
# The dependency audit is not here: it needs the network, and its result changes
# on its own even when the code does not.
set -eu

MODE="${1:-}"

step() { printf '\n==> %s\n' "$1"; }

# guardrails replaces every bloop_todo line with a real command.
# A line left behind fails loudly right there instead of passing in silence.
bloop_todo() {
  printf 'checks.sh has no command filled in for step %s\n' "$1" >&2
  exit 1
}

step "format"
bloop_todo format

step "lint"
bloop_todo lint

step "typecheck"
bloop_todo typecheck

step "boundary"
bloop_todo boundary

step "unit"
bloop_todo unit

# The component step is frontend only. Delete it on a backend project.
step "component"
bloop_todo component

# A shortcut marker has to be complete: a ceiling and a trigger to revisit, comma separated.
# An incomplete one is an excuse, not a debt with a due date.
step "shortcut marker"
BAD=$(grep -rnE '(#|//|/\*) ?shortcut:' . \
  --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.worktrees 2>/dev/null \
  | grep -vE 'shortcut:[^,]+,' || :)
if [ -n "$BAD" ]; then
  printf 'shortcut markers with no trigger to revisit:\n%s\n' "$BAD" >&2
  printf 'the correct shape is  shortcut: <ceiling>, <when to revisit>\n' >&2
  exit 1
fi

if [ "$MODE" = "--e2e" ]; then
  step "e2e smoke"
  bloop_todo e2e
fi

printf '\nall checks passed\n'
# bloop:end checks
