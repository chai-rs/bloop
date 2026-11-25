#!/bin/sh
# bloop · SessionStart
#
# Tells the agent which stage this repo is at and what work is outstanding.
# A repo that does not use bloop stays silent and injects nothing.
set -u

ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
[ -d "$ROOT/.bloop" ] || exit 0

DETECT="${CLAUDE_PLUGIN_ROOT:-}/bin/detect"
[ -x "$DETECT" ] || exit 0

BRIEF=$("$DETECT" --brief 2>/dev/null) || exit 0

printf 'this repo uses the bloop SDLC\n%s\n' "$BRIEF"

JOB="${CLAUDE_PLUGIN_ROOT:-}/bin/job"
if [ -x "$JOB" ]; then
  # exit 2 means the provider is not local, which is fine, just nothing to report
  JOBS=$("$JOB" --brief 2>/dev/null) && printf '%s\n' "$JOBS"
  # Refresh the board only where someone already built one. A hook that creates
  # folders and edits .gitignore on its own would surprise people.
  [ -d "$ROOT/.bloop/board" ] && "$JOB" --board >/dev/null 2>&1
fi

printf 'rules live in AGENTS.md and ARCHITECTURE.md. run ./checks.sh before calling anything done\n'
