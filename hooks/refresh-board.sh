#!/bin/sh
# bloop · refresh the board when the state may have moved
#
# Runs after a tool call and before each prompt. Does nothing unless a board
# already exists, so a repo that never asked for one never gets one.
#
# Before each prompt it always refreshes, because a person may have pulled,
# merged or switched branch in a terminal since the last turn. After a tool call
# it refreshes only when the call could have changed an issue's files.
#
# The rebuild runs in the background. bin/job takes over a second on a large
# backlog, and nobody should wait that long for their prompt to be sent.
set -u

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
[ -d "$ROOT/.bloop/board" ] || exit 0

JOB="${CLAUDE_PLUGIN_ROOT:-}/bin/job"
[ -x "$JOB" ] || exit 0

INPUT=$(cat)
case "$INPUT" in
  *'"hook_event_name":"UserPromptSubmit"'*|*'"hook_event_name": "UserPromptSubmit"'*) ;;
  *'.bloop/'*) ;;
  *'git pull'*|*'git merge'*|*'git checkout'*|*'git switch'*|*'git rebase'*|*'git reset'*|*'git stash'*|*'git revert'*) ;;
  *'bin/archive'*|*'bin/ship'*) ;;
  *) exit 0 ;;
esac

# The lock lives in the git dir, so it can never land in a commit, and outside
# the board, because a rebuild deletes every empty folder inside the board.
GITDIR=$(cd "$ROOT" && git rev-parse --absolute-git-dir 2>/dev/null) || exit 0
LOCK="$GITDIR/bloop-board.lock"
AGAIN="$GITDIR/bloop-board.again"

# A rebuild killed mid-way leaves its lock behind. One older than a minute is dead.
[ -d "$LOCK" ] && [ -n "$(find "$LOCK" -maxdepth 0 -mmin +1 2>/dev/null)" ] && rmdir "$LOCK" 2>/dev/null

(
  # Someone is already rebuilding. Ask them to go round once more, then leave.
  mkdir "$LOCK" 2>/dev/null || { : > "$AGAIN"; exit 0; }
  trap 'rmdir "$LOCK" 2>/dev/null' EXIT
  while :; do
    rm -f "$AGAIN"
    # A board that fails to rebuild is stale, not broken. Never surface it.
    "$JOB" --board >/dev/null 2>&1
    [ -e "$AGAIN" ] || break
  done
) </dev/null >/dev/null 2>&1 &

exit 0
