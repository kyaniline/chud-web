#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-preview}"
echo "🔮 Deploying preview (branch: $BRANCH)..."
npx wrangler pages deploy . --project-name=areyouachud --branch="$BRANCH"
echo "✅ Preview deploy complete → https://$BRANCH.areyouachud.pages.dev"
