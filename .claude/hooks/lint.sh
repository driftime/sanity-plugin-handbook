#!/bin/bash

formatter="./node_modules/.bin/oxfmt"
linter="./node_modules/.bin/oxlint"

file_path=$(cat | jq -r '.tool_input.file_path')
output=$("$formatter" "$file_path" && "$linter" "$file_path" 2>&1)

if [ $? -ne 0 ]; then
  jq -n --arg output "$output" '{
    decision: "block",
    reason: "Linting errors found. Fix them before continuing.",
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: $output
    }
  }'
fi

exit 0
