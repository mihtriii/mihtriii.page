#!/usr/bin/env bash
set -euo pipefail

# Sets the custom domain (CNAME) for a repo's GitHub Pages site and commits public/CNAME.
# Requirements: gh CLI authenticated, env OWNER, REPO, DOMAIN
# Optional: BRANCH (default main)

need() { [ -n "${!1:-}" ] || { echo "Missing env: $1"; exit 1; }; }
need OWNER; need REPO; need DOMAIN;
BRANCH=${BRANCH:-main}

echo "# Writing public/CNAME -> $DOMAIN"
mkdir -p public
printf "%s\n" "$DOMAIN" > public/CNAME

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git add public/CNAME
  if ! git diff --cached --quiet; then
    git commit -m "chore(pages): set CNAME to $DOMAIN"
  fi
else
  echo "Warning: not a git repo; skipping commit"
fi

echo "# Setting Pages CNAME via API"
gh api -X PUT \
  -H 'Accept: application/vnd.github+json' \
  "/repos/$OWNER/$REPO/pages" \
  -f cname="$DOMAIN" >/dev/null

echo "# Triggering deploy (push)"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git push origin "$BRANCH" || true
fi

echo "Done. Check: https://github.com/$OWNER/$REPO/settings/pages"

