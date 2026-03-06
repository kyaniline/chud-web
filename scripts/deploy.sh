#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Deploying to production (main branch)..."
npx wrangler pages deploy . --project-name=areyouachud --branch=main
echo "✅ Production deploy complete → https://areyouachud.com"
