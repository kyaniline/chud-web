#!/usr/bin/env bash
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ☁️  Cloudflare Setup Guide for areyouachud.com"
echo "════════════════════════════════════════════════════════════"
echo ""

# Step 1
echo -e "${CYAN}STEP 1: Create a Cloudflare Account${NC}"
echo "  → Go to: https://dash.cloudflare.com/sign-up"
echo "  → Sign up with email, verify, and add a payment method."
echo ""
read -p "  Have you completed this step? [y/n]: " step1
if [[ "$step1" != "y" ]]; then echo "  Come back when ready!"; exit 0; fi
echo -e "${GREEN}  ✅ Done${NC}"
echo ""

# Step 2
echo -e "${CYAN}STEP 2: Purchase the Domain${NC}"
echo "  → Dashboard → Domain Registration → Register a new domain"
echo "  → Search: areyouachud.com"
echo "  → Purchase (~\$9.77/year at Cloudflare at-cost pricing)"
echo ""
read -p "  Have you purchased areyouachud.com? [y/n]: " step2
if [[ "$step2" != "y" ]]; then echo "  Come back when ready!"; exit 0; fi
echo -e "${GREEN}  ✅ Done${NC}"
echo ""

# Step 3
echo -e "${CYAN}STEP 3: Get Your Account ID${NC}"
echo "  → Dashboard URL looks like: https://dash.cloudflare.com/<ACCOUNT_ID>/..."
echo "  → Or: any domain → Overview → right sidebar → 'Account ID'"
echo ""
read -p "  Paste your Account ID here: " account_id
if [[ -z "$account_id" ]]; then echo "  Account ID required!"; exit 1; fi
echo -e "${GREEN}  ✅ Account ID: $account_id${NC}"
echo ""

# Step 4
echo -e "${CYAN}STEP 4: Authenticate Wrangler${NC}"
echo "  This will open your browser for OAuth login."
echo ""
read -p "  Ready to authenticate? [y/n]: " step4
if [[ "$step4" == "y" ]]; then
  npx wrangler login
  echo -e "${GREEN}  ✅ Authenticated${NC}"
else
  echo "  Skipped. You can run 'npx wrangler login' later."
fi
echo ""

# Step 5
echo -e "${CYAN}STEP 5: Create Cloudflare Pages Project${NC}"
echo "  → Dashboard → Workers & Pages → Create → Pages"
echo "  → Choose 'Direct Upload' or 'Connect to Git'"
echo "  → Project name: areyouachud"
echo ""
read -p "  Have you created the Pages project? [y/n]: " step5
if [[ "$step5" != "y" ]]; then echo "  Come back when ready!"; exit 0; fi
echo -e "${GREEN}  ✅ Done${NC}"
echo ""

# Step 6
echo -e "${CYAN}STEP 6: Add Custom Domain${NC}"
echo "  → Pages project → Custom domains → Add domain"
echo "  → Enter: areyouachud.com"
echo "  → Cloudflare will auto-configure DNS since the domain is on Cloudflare."
echo ""
read -p "  Have you added the custom domain? [y/n]: " step6
if [[ "$step6" != "y" ]]; then echo "  Come back when ready!"; exit 0; fi
echo -e "${GREEN}  ✅ Done${NC}"
echo ""

# Step 7
echo -e "${CYAN}STEP 7: Create API Token (for GitHub Actions CI/CD)${NC}"
echo "  → My Profile → API Tokens → Create Token"
echo "  → Use template: 'Edit Cloudflare Workers'"
echo "  → Or custom: Account → Cloudflare Pages: Edit"
echo "  → Copy the token (you'll only see it once!)"
echo ""
read -p "  Paste your API Token here: " api_token
if [[ -z "$api_token" ]]; then echo "  API Token required for CI/CD!"; exit 1; fi
echo -e "${GREEN}  ✅ Token saved (not stored — add to GitHub secrets next)${NC}"
echo ""

# Step 8
echo -e "${CYAN}STEP 8: Add GitHub Secrets${NC}"
echo "  → GitHub repo → Settings → Secrets and variables → Actions"
echo "  → Add these repository secrets:"
echo ""
echo -e "  ${YELLOW}CLOUDFLARE_ACCOUNT_ID${NC} = $account_id"
echo -e "  ${YELLOW}CLOUDFLARE_API_TOKEN${NC}  = (the token you just created)"
echo ""
read -p "  Have you added both secrets to GitHub? [y/n]: " step8
if [[ "$step8" != "y" ]]; then echo "  Come back when ready!"; exit 0; fi
echo -e "${GREEN}  ✅ Done${NC}"
echo ""

# Test deploy
echo -e "${CYAN}STEP 9: Test Deployment${NC}"
echo "  Let's do a test deploy to verify everything works."
echo ""
read -p "  Deploy now? [y/n]: " step9
if [[ "$step9" == "y" ]]; then
  echo "  Deploying..."
  npx wrangler pages deploy . --project-name=areyouachud --branch=main
  echo ""
  echo -e "${GREEN}  ✅ Deployed! Visit https://areyouachud.com${NC}"
else
  echo "  You can deploy later with: npm run deploy"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}🎉 Setup complete! Your CI/CD pipeline is ready.${NC}"
echo "  Push to 'main' → auto-deploys to areyouachud.com"
echo "  Open a PR → preview URL generated automatically"
echo "════════════════════════════════════════════════════════════"
echo ""
