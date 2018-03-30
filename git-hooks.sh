#!/usr/bin/env sh
# Install git hooks
# Update pre-commit hook (add run test command)

set -e

source_dir="$(pwd)/.hooks"
target_dir="./.git/hooks"
for script in $(find "${source_dir}/" -type f)
do
  shortname=$(basename "${script}")
  cp -r "${source_dir}/${shortname}" "${target_dir}/"
  chmod +x "${target_dir}/${shortname}"
done
