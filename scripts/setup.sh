#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Setting up areyouachud.com..."

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
else
  echo "✅ Dependencies already installed."
fi

# Verify wrangler
echo "🔍 Checking wrangler..."
npx wrangler --version

echo ""
echo "✅ Setup complete!"
echo "   Run 'npm run dev' to start developing."
echo "   Run 'bash scripts/cloudflare-setup-guide.sh' for deployment setup."
