/* ============================================
   ARE YOU A CHUD? — Application Logic
   ============================================ */

(function () {
  'use strict';

  // ---- Constants ----
  const INITIAL_CHUD_CHANCE = 0.50;
  const REROLL_CHUD_CHANCE = 0.75;
  const HARD_PITY_THRESHOLD = 50;
  const SPIN_DURATION_MS = 3500;
  const SLOT_ITEMS_COUNT = 8;
  const LS_KEY_REROLL = 'chud_reroll_count';

  // ---- DOM refs ----
  const $ = (sel) => document.querySelector(sel);
  const startOverlay = $('#startOverlay');
  const startBtn = $('#startBtn');
  const mainContent = $('#mainContent');
  const slotMachine = $('#slotMachine');
  const slotReel = $('#slotReel');
  const slotLabel = slotMachine.querySelector('.slot-label');
  const resultContainer = $('#resultContainer');
  const resultText = $('#resultText');
  const tauntText = $('#tauntText');
  const rerollBtn = $('#rerollBtn');
  const shareTwitter = $('#shareTwitter');
  const shareCopy = $('#shareCopy');
  const muteBtn = $('#muteBtn');
  const bgLayer = $('#bgLayer');

  // ---- State ----
  let rerollCount = parseInt(localStorage.getItem(LS_KEY_REROLL) || '0', 10);
  let isSpinning = false;
  let currentResult = null; // true = chud, false = not chud

  // ---- Audio Manager ----
  const AudioManager = {
    ctx: null,
    enabled: true,
    buffers: {},
    sources: [],
    bgMusic: null,
    bgGain: null,
    BG_VOLUME: 0.15,

    async init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
      await this.loadAll();
      this.startBgMusic();
    },

    async loadAll() {
      const sounds = {
        spin: '/assets/sounds/spin.mp3',
        chud: '/assets/sounds/chud.mp3',
        notchud: '/assets/sounds/notchud.mp3',
        click: '/assets/sounds/click.mp3',
        bg: '/assets/sounds/bg.mp3',
      };
      for (const [name, url] of Object.entries(sounds)) {
        try {
          const resp = await fetch(url);
          if (!resp.ok) continue;
          const buf = await resp.arrayBuffer();
          this.buffers[name] = await this.ctx.decodeAudioData(buf);
        } catch (e) {
          // Sound files may not exist yet (placeholder)
        }
      }
    },

    startBgMusic() {
      if (!this.ctx || !this.buffers.bg) return;
      this.bgGain = this.ctx.createGain();
      this.bgGain.gain.value = this.BG_VOLUME;
      this.bgGain.connect(this.ctx.destination);

      this.bgMusic = this.ctx.createBufferSource();
      this.bgMusic.buffer = this.buffers.bg;
      this.bgMusic.loop = true;
      this.bgMusic.connect(this.bgGain);
      this.bgMusic.start(0);
    },

    pauseBg() {
      if (this.bgGain) {
        this.bgGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      }
    },

    resumeBg() {
      if (this.bgGain && this.enabled) {
        this.bgGain.gain.setTargetAtTime(this.BG_VOLUME, this.ctx.currentTime, 0.3);
      }
    },

    play(name) {
      if (!this.enabled || !this.ctx || !this.buffers[name]) return null;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      this.pauseBg();

      const source = this.ctx.createBufferSource();
      source.buffer = this.buffers[name];
      source.connect(this.ctx.destination);
      source.start(0);
      this.sources.push(source);

      // Resume bg music when this sound ends
      source.onended = () => {
        this.sources = this.sources.filter(s => s !== source);
        if (this.sources.length === 0) this.resumeBg();
      };

      return source;
    },

    stopAll() {
      this.sources.forEach(s => { try { s.stop(); } catch(e) {} });
      this.sources = [];
    },

    toggle() {
      this.enabled = !this.enabled;
      document.body.classList.toggle('muted', !this.enabled);
      if (!this.enabled) {
        this.stopAll();
        this.pauseBg();
      } else {
        this.resumeBg();
      }
    }
  };

  // ---- RNG ----
  function rollChud(isReroll) {
    if (isReroll && rerollCount >= HARD_PITY_THRESHOLD) return false;
    const chance = isReroll ? REROLL_CHUD_CHANCE : INITIAL_CHUD_CHANCE;
    return Math.random() < chance;
  }

  // ---- Taunting Messages ----
  function getTaunt(count) {
    if (count === 0) return '';
    if (count <= 5) return `Rerolled ${count} time${count > 1 ? 's' : ''}...`;
    if (count <= 15) return `Rerolled ${count} times. Cope harder.`;
    if (count <= 30) return `Rerolled ${count} times. Down bad.`;
    if (count <= 49) return `Rerolled ${count} times. Truly desperate.`;
    if (count === 50) return `Rerolled 50 times. Fine. You win. (Hard pity)`;
    return `Rerolled ${count} times. You already won, what are you doing?`;
  }

  // ---- Helpers ----
  function getSlotItemHeight() {
    const val = getComputedStyle(document.documentElement).getPropertyValue('--slot-height').trim();
    return parseInt(val, 10) || 100;
  }

  // ---- Slot Machine Animation ----
  function spinSlotMachine(targetIsChud) {
    return new Promise((resolve) => {
      isSpinning = true;
      rerollBtn.disabled = true;

      // Reset classes
      slotMachine.classList.remove('revealed', 'result-chud', 'result-chad', 'hidden');
      slotMachine.classList.add('spinning');
      resultContainer.classList.remove('visible');
      slotLabel.classList.remove('hidden');
      slotLabel.textContent = 'DETERMINING YOUR STATUS...';
      bgLayer.classList.remove('visible', 'chud', 'chad');

      // Target slot index: chud items are at 0,2,4,6 — chad items at 1,3,5,7
      // We want to land on the last pair for smoothness
      const itemH = getSlotItemHeight();
      const targetIndex = targetIsChud ? 6 : 7;
      const targetY = -(targetIndex * itemH);

      // Total distance: multiple full cycles + target position
      const fullCycles = 4;
      const totalDistance = (fullCycles * SLOT_ITEMS_COUNT * itemH) + Math.abs(targetY);

      const startTime = performance.now();
      let spinSound = AudioManager.play('spin');

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / SPIN_DURATION_MS, 1);

        // Easing: fast start, slow end (cubic ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentDistance = eased * totalDistance;

        // Convert to position within the reel (wrapping)
        const reelLength = SLOT_ITEMS_COUNT * itemH;
        const currentY = -(currentDistance % reelLength);

        slotReel.style.transform = `translateY(${currentY}px)`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Snap to exact target
          slotReel.style.transform = `translateY(${targetY}px)`;
          onSpinComplete(targetIsChud);
          resolve();
        }
      }

      // Start off-screen and begin
      slotReel.style.transform = 'translateY(0)';
      requestAnimationFrame(animate);
    });
  }

  function onSpinComplete(isChud) {
    isSpinning = false;
    currentResult = isChud;

    // Update slot machine state
    slotMachine.classList.remove('spinning');
    slotMachine.classList.add('revealed');
    slotMachine.classList.add(isChud ? 'result-chud' : 'result-chad');
    slotLabel.classList.add('hidden');

    // Screen shake
    slotMachine.classList.add('shake');
    setTimeout(() => slotMachine.classList.remove('shake'), 500);

    // Play result sound
    AudioManager.stopAll();
    AudioManager.play(isChud ? 'chud' : 'notchud');

    // Show background image
    bgLayer.className = 'bg-layer visible ' + (isChud ? 'chud' : 'chad');

    // Show result text
    resultText.textContent = isChud ? 'YOU ARE A CHUD' : "YOU AREN'T A CHUD";
    resultText.className = 'result-text ' + (isChud ? 'chud' : 'chad');
    tauntText.textContent = getTaunt(rerollCount);

    // Reveal result container
    setTimeout(() => {
      resultContainer.classList.add('visible');
      rerollBtn.disabled = false;
    }, 200);

    // Analytics
    trackEvent('chud_roll', {
      result: isChud ? 'chud' : 'not_chud',
      roll_type: rerollCount === 0 ? 'initial' : 'reroll',
      reroll_count: rerollCount,
    });

    if (rerollCount === HARD_PITY_THRESHOLD) {
      trackEvent('hard_pity', { reroll_count: HARD_PITY_THRESHOLD });
    }
  }

  // ---- Event Handlers ----
  async function handleStart() {
    // Disable button and show loading state
    startBtn.disabled = true;
    startBtn.classList.add('loading');
    const btnText = startBtn.querySelector('.start-btn-text');
    const btnSub = startBtn.querySelector('.start-btn-sub');
    btnText.textContent = 'LOADING...';
    btnSub.textContent = 'preparing your fate';

    await AudioManager.init();

    startOverlay.classList.add('hidden');
    mainContent.classList.add('visible');

    // Initial roll: 50/50
    const isChud = rollChud(false);
    spinSlotMachine(isChud);
  }

  function handleReroll() {
    if (isSpinning) return;

    AudioManager.play('spin');
    rerollCount++;
    localStorage.setItem(LS_KEY_REROLL, rerollCount.toString());

    const isChud = rollChud(true);
    spinSlotMachine(isChud);
  }

  function handleShareTwitter() {
    if (currentResult === null) return;
    const text = currentResult
      ? "I just found out I'm a CHUD 😱\n🎰 Find out yours:"
      : "I just found out I'm NOT a chud 😎\n🎰 Find out yours:";
    const url = 'https://areyouachud.com';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    );
    trackEvent('share', { method: 'twitter' });
  }

  function handleCopyLink() {
    navigator.clipboard.writeText('https://areyouachud.com').then(() => {
      shareCopy.classList.add('copied');
      const original = shareCopy.querySelector('svg').nextSibling;
      const textNode = shareCopy.lastChild;
      textNode.textContent = ' COPIED!';
      setTimeout(() => {
        shareCopy.classList.remove('copied');
        textNode.textContent = ' COPY LINK';
      }, 2000);
    });
    trackEvent('share', { method: 'copy_link' });
  }

  function handleMuteToggle() {
    AudioManager.toggle();
  }

  // ---- Analytics Helper ----
  function trackEvent(name, params) {
    if (typeof gtag === 'function') {
      gtag('event', name, params);
    }
  }

  // ---- Preload Images ----
  function preloadImages() {
    const imgs = ['/assets/images/soyjak.webp', '/assets/images/gigachad.webp'];
    imgs.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  // ---- PWA Service Worker ----
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }

  // ---- Init ----
  function init() {
    preloadImages();
    registerSW();

    startBtn.addEventListener('click', handleStart);
    rerollBtn.addEventListener('click', handleReroll);
    shareTwitter.addEventListener('click', handleShareTwitter);
    shareCopy.addEventListener('click', handleCopyLink);
    muteBtn.addEventListener('click', handleMuteToggle);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!startOverlay.classList.contains('hidden')) {
          e.preventDefault();
          handleStart();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
