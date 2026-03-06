# 🎰 Are You a Chud?

buh

**Live:** [areyouachud.com](https://areyouachud.com) *(coming soon)*

---

## How It Works

1. **Visit the site** → click "FIND OUT"
2. **Slot machine spins** for 3.5 seconds with a deceleration ease-out
3. **Result revealed** with background image, sound effect, and screen shake:
   - 🔴 **"YOU ARE A CHUD"** — soyjak background, ominous sound
   - 🟡 **"YOU AREN'T A CHUD"** — gigachad background, triumphant sound
4. **Reroll** to try again — but the odds get worse

### The Odds

| Roll | Chud Chance | Not Chud Chance |
|------|-------------|-----------------|
| Initial visit | 50% | 50% |
| Every reroll | 75% | 25% |
| 50th reroll | 0% (hard pity) | 100% |

A reroll counter tracks how many times you've tried, with escalating taunting messages.

---

## Features

- **Slot machine animation** — vertical reel with blur, deceleration, and screen shake on reveal
- **Sound effects** — spin sound, result sounds, background music that auto-ducks during SFX
- **Meme backgrounds** — soyjak (chud) and gigachad (not chud) with dark overlay
- **Reroll system** — worse odds, taunting counter, hard pity at 50
- **Social sharing** — share your result on X/Twitter or copy the link
- **PWA** — installable on mobile, works offline
- **Dark/edgy aesthetic** — noise texture, bold typography, red/gold accents
- **Fully responsive** — phone, tablet, and desktop
- **Mute toggle** — because sometimes you're at work

---

## Tech Stack

Pure static site — no frameworks, no build step, no backend.

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Audio | Web Audio API |
| Font | [Anton](https://fonts.google.com/specimen/Anton) (Google Fonts) |
| PWA | Service Worker + Web App Manifest |
| Analytics | Google Analytics 4 (optional) |
| Hosting | Cloudflare Pages (free) |
| CI/CD | GitHub Actions |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start local dev server
./dev.sh start          # → http://localhost:8788

# Stop / restart
./dev.sh stop
./dev.sh restart
```

---

## Project Structure

```
├── index.html              Main page
├── styles.css              Dark theme, slot machine, responsive layout
├── app.js                  RNG, animation, audio manager, sharing
├── manifest.json           PWA manifest
├── sw.js                   Service worker (cache-first, offline fallback)
├── dev.sh                  Dev server start/stop/restart
├── wrangler.toml           Cloudflare Pages config
├── assets/
│   ├── images/             Soyjak, gigachad, PWA icons, OG preview
│   └── sounds/             Spin, chud, notchud, click, bg music
├── scripts/
│   ├── deploy.sh           Deploy to production
│   ├── deploy-preview.sh   Deploy preview branch
│   └── cloudflare-setup-guide.sh  Interactive Cloudflare walkthrough
└── docs/
    ├── requirements.md     Full requirements specification
    └── plan.md             Implementation plan & status
```

---

## Deployment

Hosted on **Cloudflare Pages** with automatic deploys via GitHub Actions.

```bash
# First-time setup (interactive guide)
bash scripts/cloudflare-setup-guide.sh

# Manual deploy
npm run deploy              # Production
npm run deploy:preview      # Preview branch
```

Every push to `main` auto-deploys to production. Pull requests get preview URLs.

**Total hosting cost: ~$9.77/year** (domain registration only — hosting is free).

---

## Customization

### Replace Images
Drop your own files into `assets/images/`:
- `soyjak.webp` — shown when result is "chud"
- `gigachad.webp` — shown when result is "not chud"

### Replace Sounds
Drop your own files into `assets/sounds/`:
- `spin.mp3` — plays during the slot machine roll
- `chud.mp3` — plays on "you are a chud" result
- `notchud.mp3` — plays on "you aren't a chud" result
- `bg.mp3` — background music loop (plays at low volume, auto-ducks during SFX)

### Enable Analytics
Uncomment the GA4 snippet in `index.html` and replace `G-XXXXXXXXXX` with your measurement ID.

---

## License

This project is for entertainment purposes. Meme responsibly.
