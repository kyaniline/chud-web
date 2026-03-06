# areyouachud.com — Requirements Document

**Version:** 1.0
**Date:** 2026-03-06

---

## 1. Overview

**areyouachud.com** is a humorous single-page website that determines whether a visitor is "a chud" or "not a chud" via a randomized slot-machine reveal animation. The site features a dark/edgy aesthetic, meme imagery, sound effects, a reroll mechanic with escalating odds, and social sharing.

---

## 2. Domain & Hosting

### 2.1 Domain Availability

✅ **areyouachud.com is AVAILABLE** (confirmed via WHOIS on 2026-03-06).

### 2.2 Cheapest Domain Registration Options

| Registrar         | First-Year Price | Renewal Price | Notes                                   |
|-------------------|-----------------|---------------|-----------------------------------------|
| Hostinger         | ~$0.99–$1.99    | ~$15.99       | Requires multi-year purchase            |
| Cloudflare        | ~$9.77          | ~$9.77        | At-cost pricing, no markup on renewals  |
| Namecheap         | ~$6.79          | ~$14.58       | Frequent promo pricing                  |
| Porkbun           | ~$11.08         | ~$11.08       | Transparent pricing                     |
| GoDaddy           | ~$4.99          | ~$22.99       | Cheap first year, expensive renewals    |

**Recommendation:** **Cloudflare Registrar** — $9.77/year at-cost with no renewal markup. This also integrates perfectly with Cloudflare Pages for free hosting (see below).

### 2.3 Cheapest Hosting Options (All Free Tier)

| Platform          | Free Tier            | Custom Domain | SSL  | CDN  | Best For                     |
|-------------------|---------------------|---------------|------|------|------------------------------|
| Cloudflare Pages  | Unlimited sites     | ✅            | ✅   | ✅   | Edge performance + security  |
| GitHub Pages      | Unlimited (public)  | ✅            | ✅   | ✅   | Simple static sites          |
| Netlify           | 100 GB BW/month     | ✅            | ✅   | ✅   | Feature-rich, easy deploy    |
| Vercel            | Unlimited static    | ✅            | ✅   | ✅   | Framework-oriented           |

**Recommendation:** **Cloudflare Pages** — free hosting with global CDN, DDoS protection, and seamless integration if the domain is registered on Cloudflare. Total annual cost: **~$9.77/year** (domain only).

### 2.4 Deployment Strategy

**Cheapest path to production:**

1. Register `areyouachud.com` on **Cloudflare Registrar** (~$9.77/year)
2. Host on **Cloudflare Pages** (free)
3. Connect a **GitHub repository** for automatic deployments on push
4. Total cost: **~$9.77/year** (domain registration only)

---

## 3. Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Markup        | HTML5                               |
| Styling       | CSS3 (with CSS animations/transitions) |
| Logic         | Vanilla JavaScript (ES6+)           |
| PWA           | Service Worker + Web App Manifest   |
| Analytics     | Google Analytics 4 or Plausible     |
| Sound         | Web Audio API / HTML5 `<audio>`     |
| Hosting       | Cloudflare Pages (static)           |
| Domain        | Cloudflare Registrar                |

No build tools, bundlers, or frameworks required. Pure static HTML/CSS/JS.

---

## 4. Core Features

### 4.1 The Chud Roll — Initial Visit

- On page load, the user sees a **slot-machine style animation** that spins for **3–4 seconds** before landing on a result.
- **Initial odds:** 50% "You are a chud" / 50% "You aren't a chud"
- The result is determined at page load (pre-calculated) but hidden behind the animation.

### 4.2 Result Display

#### "You Are a Chud" Result
- Large, bold text: **"YOU ARE A CHUD"**
- Background: User-provided **soyjak image** (full-screen or prominent placement)
- Color scheme: Red/dark tones — ominous, mocking
- Sound effect: Sad/dramatic failure sound (e.g., sad trombone, dramatic sting)

#### "You Aren't a Chud" Result
- Large, bold text: **"YOU AREN'T A CHUD"**
- Background: User-provided **gigachad image** (full-screen or prominent placement)
- Color scheme: Gold/dark tones — triumphant, glorious
- Sound effect: Triumphant/victorious sound (e.g., airhorn, epic win fanfare)

### 4.3 Reroll Mechanic

- A **"REROLL"** button appears after the initial result is revealed.
- Reroll odds: **75% chud / 25% not chud** (worse than initial roll).
- Each reroll triggers the slot-machine animation again.
- A **reroll counter** is displayed: e.g., *"You've rerolled X times"* with escalating taunting messages.
- **Hard pity system:** At exactly **50 rerolls**, the result is **guaranteed "You aren't a chud"** regardless of RNG.
- Reroll count persists in `localStorage` for the session (resets on browser close or can persist — TBD).

### 4.4 Reroll Counter Taunting Messages (Examples)

| Rerolls | Message Example                                    |
|---------|---------------------------------------------------|
| 1–5     | "Rerolled {n} time(s)..."                          |
| 6–15    | "Rerolled {n} times. Cope harder."                 |
| 16–30   | "Rerolled {n} times. Down bad."                    |
| 31–49   | "Rerolled {n} times. Truly desperate."             |
| 50      | "Rerolled 50 times. Fine. You win. (Hard pity)"   |

*(Exact copy to be finalized.)*

---

## 5. Animation & Visual Design

### 5.1 Slot Machine Animation

- **Style:** Vertical slot reel that spins through alternating "CHUD" / "NOT CHUD" text (or emoji/icons).
- **Duration:** 3–4 seconds of spinning, with a deceleration ease-out before landing.
- **Visual feedback:** Blur effect while spinning, sharpening on reveal.
- **Optional:** Screen shake or flash effect on result land.

### 5.2 Overall Aesthetic

- **Theme:** Dark / edgy
- **Background:** Dark (#0a0a0a or similar), with subtle texture or noise overlay.
- **Typography:** Bold, condensed, uppercase — impactful display font (e.g., Impact, Anton, or a similar web font).
- **Accent colors:**
  - Chud result: Red (#ff2222) / dark red palette
  - Not-chud result: Gold (#ffd700) / dark gold palette
- **Layout:** Centered, single-column, full-viewport height sections.
- **Images:** Soyjak and Gigachad used as background images with dark overlay for text readability.

### 5.3 Responsive / Mobile Design

- Fully responsive across phone, tablet, and desktop.
- Touch-friendly reroll button (minimum 48px tap target).
- Images scale appropriately on all screen sizes.
- PWA: installable on mobile home screens with app icon and splash screen.

---

## 6. Sound Design

| Event                    | Sound                                         |
|--------------------------|-----------------------------------------------|
| Slot machine spinning    | Rapid clicking/ticking (mechanical reel sound) |
| Result: Chud             | Sad trombone / dramatic failure sting          |
| Result: Not a Chud       | Triumphant fanfare / airhorn                   |
| Reroll button click      | Mechanical click / lever pull                  |

- Sounds should be short (1–3 seconds max).
- **Audio must be user-initiated** (browsers block autoplay). The first interaction (click anywhere / "Start" button) enables audio.
- Volume control or mute toggle available.
- Use royalty-free sound effects (freesound.org, mixkit.co, or similar).

---

## 7. Social Sharing

- After result reveal, display share buttons:
  - **Twitter/X:** Pre-filled tweet — *"I just found out I'm [a chud / NOT a chud]! 🎰 Find out yours: areyouachud.com"*
  - **Copy Link:** Copies `areyouachud.com` to clipboard with a "Copied!" tooltip.
- Optional: Open Graph / Twitter Card meta tags for link previews with a branded preview image.

---

## 8. PWA (Progressive Web App)

- **Web App Manifest** (`manifest.json`):
  - App name: "Are You a Chud?"
  - Short name: "Chud Check"
  - Theme color: Dark (#0a0a0a)
  - Background color: Dark (#0a0a0a)
  - Display: standalone
  - Icons: App icon in multiple sizes (192x192, 512x512)
- **Service Worker:**
  - Cache static assets for offline access.
  - Offline fallback page: "Can't check chud status offline. Try again with internet."
- **Install prompt:** "Add to Home Screen" banner on mobile.

---

## 9. Analytics

- **Google Analytics 4** (free) or **Plausible** (self-hosted free / $9/mo hosted).
- Track:
  - Page views
  - Unique visitors
  - Result distribution (custom events: `chud_result` / `not_chud_result`)
  - Reroll count (custom event: `reroll` with count parameter)
  - Share button clicks (custom event: `share_twitter` / `share_copy`)
- **Recommendation:** GA4 for free, or Plausible self-hosted if privacy is a concern.

---

## 10. User-Provided Assets

The following assets must be provided by the site owner before deployment:

| Asset              | Format          | Usage                          | Status   |
|--------------------|----------------|--------------------------------|----------|
| Soyjak image       | PNG/WebP/JPG   | Background for "chud" result   | Pending  |
| Gigachad image     | PNG/WebP/JPG   | Background for "not chud" result | Pending |
| App icon           | PNG (512x512)  | PWA icon / favicon             | Pending  |
| OG preview image   | PNG (1200x630) | Social media link previews     | Pending  |

---

## 11. File Structure

```
areyouachud.com/
├── index.html              # Main page
├── styles.css              # All styles
├── app.js                  # Core logic (RNG, animation, reroll, sharing)
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── assets/
│   ├── images/
│   │   ├── soyjak.webp     # User-provided
│   │   ├── gigachad.webp   # User-provided
│   │   ├── icon-192.png    # PWA icon
│   │   ├── icon-512.png    # PWA icon
│   │   └── og-preview.png  # Social media preview
│   └── sounds/
│       ├── spin.mp3        # Slot machine spinning
│       ├── chud.mp3        # Sad result sound
│       ├── notchud.mp3     # Triumphant result sound
│       └── click.mp3       # Button click
├── docs/
│   └── requirements.md     # This document
└── README.md               # Setup & deployment instructions
```

---

## 12. Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+
- Mobile Chrome (Android)
- Mobile Safari (iOS)

---

## 13. Performance Targets

- **First Contentful Paint:** < 1 second
- **Largest Contentful Paint:** < 2.5 seconds
- **Total page weight:** < 2 MB (optimize images)
- **Lighthouse score:** 90+ across all categories

---

## 14. Privacy & Legal

- No personal data collected beyond standard analytics.
- Cookie consent banner if using GA4 (required in EU).
- No server-side data storage.
- All RNG is client-side (no server calls).

---

## 15. Future Considerations (Out of Scope for V1)

- Global leaderboard / live stats counter (requires backend)
- Additional meme outcomes beyond chud/not-chud
- Daily streak tracking
- Custom themes or "chud personalities"
- Multiplayer mode ("challenge a friend")

---

## 16. Summary of Costs

| Item                       | Cost           | Frequency |
|---------------------------|----------------|-----------|
| Domain (Cloudflare)        | ~$9.77         | Per year  |
| Hosting (Cloudflare Pages) | Free           | —         |
| SSL Certificate            | Free           | —         |
| Analytics (GA4)            | Free           | —         |
| Sound effects (royalty-free)| Free          | —         |
| **Total**                  | **~$9.77/year**| —         |
