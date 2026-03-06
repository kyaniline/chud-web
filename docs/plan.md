# areyouachud.com — Implementation Plan

**Version:** 1.0
**Date:** 2026-03-06
**Reference:** [docs/requirements.md](./requirements.md)

---

## Approach

Build the site incrementally in 10 phases, each producing a testable artifact. The site is a single-page static PWA (HTML/CSS/JS) deployed to Cloudflare Pages via GitHub Actions. Each phase ends with a local test checkpoint before proceeding.

---

## Image & Sound Asset Sources

### Images (Placeholders — User Will Provide Final Versions)

| Asset | Recommended Source | URL | Notes |
|-------|-------------------|-----|-------|
| Soyjak (pointing, transparent PNG) | PNGmart | https://www.pngmart.com/files/23/Soyjak-PNG-HD.png | Classic pointing soyjak, transparent background, high-res |
| Soyjak (alt — two soyjaks) | Imgflip | https://imgflip.com/memetemplate/343196326/Two-Soyjacks-Transparent | 2048x1620, transparent |
| Gigachad (classic B&W) | Meme Arsenal | https://images.meme-arsenal.com/a19b4fa5a9e35fcd2879f38d81313c44.jpg | Classic Ernest Khalimov pose |
| Gigachad (alt — front face) | WallpaperAccess | https://wallpaperaccess.com/giga-chad | Multiple high-res options |

> **Action for user:** Download your preferred images and drop them into `assets/images/` as `soyjak.webp` and `gigachad.webp`. We'll use the placeholder URLs during development.

### Sound Effects (Royalty-Free)

| Sound | Source | URL | License |
|-------|--------|-----|---------|
| Slot machine spin | Mixkit | https://mixkit.co/free-sound-effects/slot-machine/ | Free, no attribution |
| Sad trombone (chud) | Mixkit | https://mixkit.co/free-sound-effects/sad/ | Free, no attribution |
| Triumphant fanfare (not chud) | Mixkit | https://mixkit.co/free-sound-effects/win/ | Free, no attribution |
| Button click | Mixkit | https://mixkit.co/free-sound-effects/click/ | Free, no attribution |
| Alt: Slot pack | Freesound (lukaso) | https://freesound.org/people/lukaso/packs/4497/ | CC0 / CC-BY |
| Alt: Casino sounds | Pixabay | https://pixabay.com/sound-effects/search/slot%20machine/ | Pixabay License (free) |

---

## Cloudflare Automation Analysis

### What CAN Be Automated

| Task | Tool | Automation Level |
|------|------|-----------------|
| Local dev server | `wrangler dev` | ✅ Fully automated |
| Deploy to Cloudflare Pages | `wrangler pages deploy` | ✅ Fully automated |
| CI/CD on git push | GitHub Actions + `cloudflare/pages-action` | ✅ Fully automated |
| DNS record management | Cloudflare REST API | ✅ Fully automated (after domain exists) |
| Preview deployments (per PR) | GitHub Actions + Cloudflare Pages | ✅ Fully automated |
| SSL certificate provisioning | Cloudflare (automatic) | ✅ Fully automated |
| Cache purging | Cloudflare API | ✅ Scriptable |

### What CANNOT Be Automated (Manual Steps)

| Task | Why | One-Time? |
|------|-----|-----------|
| Create Cloudflare account | Requires email verification, payment method | Yes |
| Purchase `areyouachud.com` domain | No Cloudflare API for domain purchase | Yes |
| Create Cloudflare API token | Dashboard-only, for security | Yes |
| Initial Cloudflare Pages project creation | One-time dashboard setup | Yes |
| Add custom domain to Pages project | Dashboard step (point domain → project) | Yes |
| Add GitHub secrets | GitHub UI required | Yes |

### Automation Scripts We'll Create

| Script | Purpose |
|--------|---------|
| `scripts/setup.sh` | Install dependencies, authenticate wrangler, validate config |
| `scripts/dev.sh` | Start local dev server with live reload |
| `scripts/deploy.sh` | Manual deploy to Cloudflare Pages (production) |
| `scripts/deploy-preview.sh` | Deploy a preview version |
| `.github/workflows/deploy.yml` | Auto-deploy on push to `main`; preview on PR |
| `scripts/cloudflare-setup-guide.sh` | Interactive walkthrough of manual Cloudflare steps |

---

## Phase Plan

---

### Phase 0: Project Scaffolding & Tooling
**Goal:** Runnable project skeleton with dev tooling.
**Test:** `npm run dev` serves a blank page at localhost.

#### Tasks
1. Initialize git repo (`git init`)
2. Create `package.json` with scripts:
   - `dev` — local dev server (`wrangler pages dev .`)
   - `deploy` — deploy to production
   - `deploy:preview` — deploy preview
3. Install `wrangler` as a dev dependency
4. Create file structure:
   ```
   areyouachud.com/
   ├── index.html
   ├── styles.css
   ├── app.js
   ├── manifest.json          (stub)
   ├── sw.js                  (stub)
   ├── wrangler.toml          (Cloudflare config)
   ├── package.json
   ├── .gitignore
   ├── assets/
   │   ├── images/            (placeholder images)
   │   └── sounds/            (placeholder sounds)
   ├── scripts/
   │   ├── setup.sh
   │   ├── dev.sh
   │   ├── deploy.sh
   │   ├── deploy-preview.sh
   │   └── cloudflare-setup-guide.sh
   ├── .github/
   │   └── workflows/
   │       └── deploy.yml
   └── docs/
       ├── requirements.md
       └── plan.md
   ```
5. Create `wrangler.toml` with Pages project config
6. Create `.gitignore` (node_modules, .wrangler, etc.)
7. Create `scripts/dev.sh` — starts `wrangler pages dev .`

#### Test Checkpoint
```bash
npm install
npm run dev
# → Visit http://localhost:8788 → see blank page
```

---

### Phase 1: Core Layout & Dark Theme
**Goal:** Styled dark page with centered content area, responsive layout, typography.
**Test:** Page loads with dark theme, looks correct on mobile and desktop.

#### Tasks
1. `index.html` — HTML5 boilerplate with:
   - Viewport meta tag
   - Link to `styles.css` and `app.js`
   - Semantic structure: `<main>` with slot machine container, result area, reroll button, share buttons
   - Placeholder text: site title "ARE YOU A CHUD?"
2. `styles.css` — Dark theme foundation:
   - CSS custom properties for color system:
     - `--bg: #0a0a0a`, `--text: #f0f0f0`
     - `--chud-red: #ff2222`, `--chud-dark: #1a0000`
     - `--chad-gold: #ffd700`, `--chad-dark: #1a1500`
   - Body: dark background, noise texture overlay (CSS-generated)
   - Typography: Google Fonts — "Anton" or "Bebas Neue" (bold, condensed, uppercase)
   - Full-viewport height layout (`min-height: 100dvh`)
   - Centered flexbox column
   - Reroll button styling (large, dark, glowing border)
   - Mobile-first responsive breakpoints
3. Basic responsive behavior (320px → 1440px+)

#### Test Checkpoint
```bash
npm run dev
# → Dark themed page with title text, styled button, responsive on resize
```

---

### Phase 2: Slot Machine Animation
**Goal:** Working slot machine animation that spins and lands on a result.
**Test:** Page load triggers slot animation; it decelerates and stops on "CHUD" or "NOT CHUD" text.

#### Tasks
1. HTML structure for slot reel:
   ```html
   <div class="slot-machine">
     <div class="slot-window">
       <div class="slot-reel">
         <div class="slot-item">YOU ARE A CHUD</div>
         <div class="slot-item">YOU AREN'T A CHUD</div>
         <!-- repeated for seamless loop -->
       </div>
     </div>
   </div>
   ```
2. CSS for slot machine:
   - Fixed-height window with `overflow: hidden`
   - Reel: vertical strip, animated via `transform: translateY()`
   - Blur filter during spin (`filter: blur(4px)` → `blur(0)`)
   - Glow/border effect on the slot window
   - Screen shake keyframe animation on reveal
3. JavaScript animation controller (`app.js`):
   - `spinSlotMachine(targetResult)` function
   - Easing: fast start → gradual deceleration → snap to result
   - Duration: ~3.5 seconds
   - Uses `requestAnimationFrame` for smooth performance
   - Callback on animation complete (to trigger result display)
4. Temporary: hardcoded result for testing

#### Test Checkpoint
```bash
npm run dev
# → Slot machine spins on page load, decelerates, lands on a result
# → Blur clears, screen shakes subtly on reveal
```

---

### Phase 3: Core Logic — RNG, Reroll & Pity System
**Goal:** Full game logic: initial roll (50/50), reroll (75/25), counter, taunting, hard pity at 50.
**Test:** Click reroll repeatedly; verify odds shift, counter increments, pity triggers at 50.

#### Tasks
1. RNG system:
   ```javascript
   function rollChud(isReroll = false, rerollCount = 0) {
     if (isReroll && rerollCount >= 50) return false; // pity: not a chud
     const chudChance = isReroll ? 0.75 : 0.50;
     return Math.random() < chudChance;
   }
   ```
2. State management:
   - `currentResult` (boolean: true = chud)
   - `rerollCount` (integer, stored in `localStorage`)
   - `isFirstVisit` (boolean)
3. Reroll button:
   - On click: increment counter → recalculate result → re-trigger slot animation
   - Disabled during animation (prevent spam)
4. Reroll counter display with taunting messages:
   ```javascript
   function getTaunt(count) {
     if (count === 0) return '';
     if (count <= 5) return `Rerolled ${count} time${count > 1 ? 's' : ''}...`;
     if (count <= 15) return `Rerolled ${count} times. Cope harder.`;
     if (count <= 30) return `Rerolled ${count} times. Down bad.`;
     if (count <= 49) return `Rerolled ${count} times. Truly desperate.`;
     if (count === 50) return `Rerolled 50 times. Fine. You win. (Hard pity)`;
     return `Rerolled ${count} times. You already won, what are you doing?`;
   }
   ```
5. Result display function:
   - Updates text, background, color scheme based on result
   - Shows/hides appropriate background image (Phase 4)

#### Test Checkpoint
```bash
npm run dev
# → Initial load: 50/50 result after animation
# → Click reroll: animation replays, new result (75/25)
# → Counter increments with taunting text
# → At reroll 50: guaranteed "not a chud" + pity message
# → Verify in console: Math.random distribution
```

---

### Phase 4: Image Integration
**Goal:** Soyjak and Gigachad background images appear based on result.
**Test:** "Chud" result shows soyjak bg; "Not chud" shows gigachad bg, with dark overlay for readability.

#### Tasks
1. Download placeholder images:
   - Soyjak → `assets/images/soyjak.webp`
   - Gigachad → `assets/images/gigachad.webp`
   - (Convert to WebP for performance; keep PNG fallbacks)
2. CSS background image system:
   - `.result-bg` — absolutely positioned, full-screen, with dark overlay
   - Transition: fade in (opacity 0 → 1) on result reveal
   - `background-size: cover; background-position: center;`
   - Dark overlay: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85))`
3. JS: switch background class based on result
   ```javascript
   document.body.classList.toggle('result-chud', isChud);
   document.body.classList.toggle('result-chad', !isChud);
   ```
4. Image preloading (load both images on page load to avoid delay on reveal)

#### Test Checkpoint
```bash
npm run dev
# → Chud result: soyjak fades in as background, red-tinted overlay
# → Not-chud result: gigachad fades in, gold-tinted overlay
# → Images preloaded (no flash on first reveal)
```

---

### Phase 5: Sound Effects
**Goal:** Audio plays for spinning, result reveal, and button clicks.
**Test:** Sounds play on interaction; mute button works; no autoplay issues.

#### Tasks
1. Download sounds from Mixkit/Pixabay → `assets/sounds/`:
   - `spin.mp3` (slot machine reel spinning, ~3s)
   - `chud.mp3` (sad trombone / dramatic sting, ~2s)
   - `notchud.mp3` (fanfare / triumphant sound, ~2s)
   - `click.mp3` (mechanical click, <1s)
2. Audio manager module:
   ```javascript
   const AudioManager = {
     enabled: true,
     sounds: {},
     init() { /* preload Audio objects */ },
     play(name) { /* play if enabled, clone for overlapping */ },
     toggle() { /* mute/unmute */ }
   };
   ```
3. Browser autoplay policy handling:
   - Audio context created on first user interaction
   - Initial page shows "CLICK TO BEGIN" overlay → enables audio + starts animation
   - This also solves the "animation on visit" UX (user clicks → slot starts)
4. Mute/unmute toggle button (speaker icon, top-right corner)
5. Wire sounds to events:
   - Page start click → `spin.mp3` plays during animation
   - Result: chud → `chud.mp3`
   - Result: not chud → `notchud.mp3`
   - Reroll click → `click.mp3` + `spin.mp3`

#### Test Checkpoint
```bash
npm run dev
# → Click to start → spin sound plays during animation
# → Result sound plays on reveal
# → Reroll plays click + spin
# → Mute toggle works (icon changes, sounds stop/resume)
# → No console errors about autoplay
```

---

### Phase 6: Social Sharing & Open Graph Meta Tags
**Goal:** Share buttons work; link previews look good on Twitter/X and other platforms.
**Test:** Twitter share opens pre-filled tweet; copy button works; OG tags validate.

#### Tasks
1. Share buttons (below result, after reveal):
   - **Share on X/Twitter:**
     ```javascript
     const tweet = encodeURIComponent(
       `I just found out I'm ${isChud ? 'a CHUD 😱' : 'NOT a chud 😎'}!\n🎰 Find out yours: areyouachud.com`
     );
     window.open(`https://twitter.com/intent/tweet?text=${tweet}`);
     ```
   - **Copy Link:**
     ```javascript
     navigator.clipboard.writeText('https://areyouachud.com');
     // Show "Copied!" tooltip for 2s
     ```
2. Button styling: dark theme, icon + text, hover effects
3. Open Graph / Twitter Card meta tags in `<head>`:
   ```html
   <meta property="og:title" content="Are You a Chud?" />
   <meta property="og:description" content="Roll the dice. Find out if you're a chud. 🎰" />
   <meta property="og:image" content="https://areyouachud.com/assets/images/og-preview.png" />
   <meta property="og:url" content="https://areyouachud.com" />
   <meta property="og:type" content="website" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content="Are You a Chud?" />
   <meta name="twitter:description" content="Roll the dice. Find out if you're a chud. 🎰" />
   <meta name="twitter:image" content="https://areyouachud.com/assets/images/og-preview.png" />
   ```
4. Create placeholder `og-preview.png` (1200×630) — dark themed with "ARE YOU A CHUD?" text

#### Test Checkpoint
```bash
npm run dev
# → Share on X opens tweet compose with correct text
# → Copy link copies URL, shows "Copied!" feedback
# → Validate OG tags: https://www.opengraph.xyz/ (after deploy)
```

---

### Phase 7: PWA — Manifest & Service Worker
**Goal:** Site installable on mobile; works offline with cached assets.
**Test:** "Install app" prompt appears on mobile; offline mode shows cached page.

#### Tasks
1. `manifest.json`:
   ```json
   {
     "name": "Are You a Chud?",
     "short_name": "Chud Check",
     "description": "Find out if you're a chud. 🎰",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#0a0a0a",
     "theme_color": "#0a0a0a",
     "icons": [
       { "src": "/assets/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/assets/images/icon-512.png", "sizes": "512x512", "type": "image/png" }
     ]
   }
   ```
2. `sw.js` — Service Worker:
   - Cache strategy: cache-first for static assets (HTML, CSS, JS, images, sounds)
   - Version-based cache busting
   - Offline fallback: serve cached `index.html`
   - Cache assets on install event
3. Register service worker in `app.js`:
   ```javascript
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js');
   }
   ```
4. Create placeholder icons: `icon-192.png`, `icon-512.png`
5. Add `<link rel="manifest" href="/manifest.json">` and theme-color meta tag

#### Test Checkpoint
```bash
npm run dev
# → Chrome DevTools > Application > Manifest: valid
# → Service Worker: registered, caching assets
# → Lighthouse PWA audit: installable
# → Disable network in DevTools: page still loads from cache
```

---

### Phase 8: Analytics (Google Analytics 4)
**Goal:** Track page views, results, rerolls, and shares.
**Test:** Events appear in GA4 Realtime view.

#### Tasks
1. Add GA4 snippet to `<head>` (using measurement ID placeholder):
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```
2. Custom events:
   ```javascript
   gtag('event', 'chud_roll', { result: isChud ? 'chud' : 'not_chud', roll_type: 'initial' });
   gtag('event', 'reroll', { reroll_count: rerollCount, result: isChud ? 'chud' : 'not_chud' });
   gtag('event', 'share', { method: 'twitter' }); // or 'copy_link'
   gtag('event', 'hard_pity', { reroll_count: 50 });
   ```
3. Respect Do Not Track header (optional, good practice)
4. Cookie consent consideration (note in code comments for EU compliance)

#### Test Checkpoint
```bash
npm run dev
# → Open GA4 Realtime dashboard
# → Visit site, roll, reroll, share → events appear in real-time
# → No console errors
```

---

### Phase 9: Cloudflare Setup & Deployment Automation
**Goal:** Site live at areyouachud.com with automated CI/CD.
**Test:** `git push` to `main` → site auto-deploys to production; PR → preview URL.

#### Tasks

##### 9A: Manual Setup Steps (guided by `scripts/cloudflare-setup-guide.sh`)

The setup guide script will walk through these steps interactively:

1. **Create Cloudflare account:**
   - Go to https://dash.cloudflare.com/sign-up
   - Verify email, add payment method (for domain purchase)

2. **Purchase domain:**
   - Dashboard → Domain Registration → Register a new domain
   - Search "areyouachud.com" → Purchase (~$9.77/year)

3. **Create Cloudflare Pages project:**
   - Dashboard → Workers & Pages → Create → Pages → Direct Upload (or connect GitHub)
   - Project name: `areyouachud`

4. **Add custom domain:**
   - Pages project → Custom domains → Add `areyouachud.com`
   - Cloudflare auto-configures DNS (since domain is on Cloudflare)

5. **Create API token:**
   - My Profile → API Tokens → Create Token
   - Template: "Edit Cloudflare Workers" (or custom with Pages:Edit permission)
   - Copy token

6. **Create GitHub repo & add secrets:**
   - Create repo on GitHub (e.g., `yourusername/areyouachud.com`)
   - Settings → Secrets → Add:
     - `CLOUDFLARE_API_TOKEN`
     - `CLOUDFLARE_ACCOUNT_ID`

7. **Get Account ID:**
   - Dashboard URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/...`
   - Or: Dashboard → any domain → Overview → right sidebar → Account ID

##### 9B: Automation Scripts

**`scripts/setup.sh`:**
```bash
#!/bin/bash
# Install dependencies, verify wrangler, check config
npm install
npx wrangler --version
echo "✅ Setup complete. Run 'npm run dev' to start developing."
```

**`scripts/deploy.sh`:**
```bash
#!/bin/bash
# Deploy to Cloudflare Pages (production)
npx wrangler pages deploy . --project-name=areyouachud --branch=main
```

**`scripts/deploy-preview.sh`:**
```bash
#!/bin/bash
# Deploy preview (non-production)
BRANCH=${1:-preview}
npx wrangler pages deploy . --project-name=areyouachud --branch=$BRANCH
echo "Preview URL will be: https://$BRANCH.areyouachud.pages.dev"
```

**`scripts/cloudflare-setup-guide.sh`:**
```bash
#!/bin/bash
# Interactive guide that walks through each manual step,
# pauses for user confirmation, and validates each step
# (e.g., "Have you created your Cloudflare account? [y/n]")
# After each step, attempts to validate via wrangler/API where possible
```

##### 9C: GitHub Actions CI/CD

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: areyouachud
          directory: .
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

#### Test Checkpoint
```bash
# Local deploy test:
npm run deploy
# → Site live at areyouachud.pages.dev

# CI/CD test:
git add -A && git commit -m "Initial deployment" && git push
# → GitHub Actions runs → site deploys to areyouachud.com

# PR preview:
git checkout -b test-pr && git push
# → Preview URL generated in PR comment
```

---

### Phase 10: Polish, Testing & Launch
**Goal:** Production-ready, performant, cross-browser tested.
**Test:** Lighthouse 90+ on all categories; works on all target browsers.

#### Tasks
1. **Performance optimization:**
   - Compress images to WebP (target <200KB each)
   - Minify CSS/JS (or use Cloudflare auto-minification)
   - Add `loading="lazy"` for non-critical images
   - Preload critical assets (`<link rel="preload">`)
   - Verify total page weight < 2MB
2. **Cross-browser testing:**
   - Chrome, Firefox, Safari, Edge (desktop)
   - Chrome Android, Safari iOS (mobile)
   - Test PWA install on Android + iOS
3. **Accessibility basics:**
   - Keyboard navigation for reroll/share buttons
   - Reduced motion: `@media (prefers-reduced-motion: reduce)` — skip animations
   - ARIA labels for interactive elements
4. **Lighthouse audit:**
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+
   - PWA: installable
5. **Favicon:**
   - Generate from app icon: favicon.ico, apple-touch-icon.png
6. **Final QA:**
   - All animation states work
   - Reroll counter persists across page reloads
   - Hard pity triggers correctly
   - Sounds play/mute correctly
   - Share buttons produce correct output
   - OG preview validates

#### Test Checkpoint
```bash
# Lighthouse CLI:
npx lighthouse https://areyouachud.com --view

# Manual testing matrix:
# ✅ Chrome desktop
# ✅ Firefox desktop
# ✅ Safari desktop
# ✅ Edge desktop
# ✅ Chrome Android
# ✅ Safari iOS
# ✅ PWA install (Android)
# ✅ PWA install (iOS)
```

---

## Dependency Chain

```
Phase 0 (Scaffolding)
  └─→ Phase 1 (Layout & Theme)
        └─→ Phase 2 (Slot Animation)
              └─→ Phase 3 (RNG & Reroll Logic)
                    ├─→ Phase 4 (Images)
                    ├─→ Phase 5 (Sound)
                    └─→ Phase 6 (Sharing)
                          └─→ Phase 7 (PWA)
                                └─→ Phase 8 (Analytics)
                                      └─→ Phase 9 (Cloudflare & Deploy)
                                            └─→ Phase 10 (Polish & Launch)
```

**Phases 4, 5, and 6 can be done in parallel** since they're independent features that plug into the Phase 3 result system.

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| User images not provided | Blocks Phase 4 polish | Use placeholder images; site works without them |
| areyouachud.com gets bought before purchase | High | Purchase domain ASAP (Phase 9A step 2) |
| Browser autoplay restrictions | Medium | "Click to begin" overlay gates all audio |
| GA4 blocked by ad blockers | Low | Analytics is supplementary; site works without it |
| Large image files hurt performance | Medium | Compress to WebP, lazy load, set size budgets |

---

## Quick Start Commands

```bash
# After cloning:
npm install                   # Install wrangler
npm run dev                   # Local dev server at localhost:8788
npm run deploy                # Deploy to production
npm run deploy:preview        # Deploy preview branch

# First-time Cloudflare setup:
bash scripts/cloudflare-setup-guide.sh
```
