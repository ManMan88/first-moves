#!/usr/bin/env bash
# Downloads the Move manual into the git-ignored .cache/ and extracts its text
# for the copying check. The manual is Ableton's copyright: never commit it.
set -euo pipefail
cd "$(dirname "$0")/.."
URL="https://cdn-resources.ableton.com/resources/pdfs/move-manual/1/2025-07-25/move1-manual-en.pdf"
mkdir -p .cache
if [ ! -s .cache/move-manual.pdf ]; then
  curl -sSL -o .cache/move-manual.pdf "$URL"
fi
pdftotext -layout .cache/move-manual.pdf .cache/move-manual.txt
echo "Manual text: .cache/move-manual.txt ($(wc -l < .cache/move-manual.txt) lines)"
