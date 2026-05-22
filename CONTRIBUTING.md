# 🌙 Contributing to SOMNIA
Welcome, traveler.  
If you are here, you are helping shape a dream‑like operating system — a mythic, atmospheric OS‑RPG built on ritual, resonance, and intention.

This document defines the rules, tone, and structure that keep SOMNIA coherent, calm, and alive.

---

## 🜁 Core Principles

SOMNIA is built on:
- **Intentionality** — no rushed code, no accidental complexity  
- **Atmosphere** — every element must support the dream‑OS aesthetic  
- **Consistency** — naming, structure, and tone must remain unified  
- **Modularity** — each shell is self‑contained and sacred  
- **Respect for the world** — nothing breaks immersion  

If a change disrupts the mood, tone, or sensory experience, it does not belong.

---

## 🜂 Project Setup

1. Clone the repository  
2. Serve the project locally using any static server (e.g., `npx serve`)  
3. Do not modify assets directly — all creative assets are proprietary  
4. Keep the folder structure intact (see below)

---

## 🜃 Folder Structure Rules

```text
SOMNIA/
│
├── core/                      # Shared logic, utilities, global CSS + JS
│   ├── somnia.css             # Core aesthetic rules (glow, breathing, palette)
│   ├── somnia.js              # Shared functions, transitions, rituals
│   ├── utils.js               # Helpers for shells, audio, state, timing
│   ├── onboarding.js          # The Sovereign Handshake onboarding ceremonial logic
│   └── chaos.js               # Light Chaos Mode threshold & visual intercept hooks
│
├── shells/                    # Each shell = a room in the dream-OS
│   ├── archive/               # Memory + reflection shell
│   │   ├── index.html
│   │   ├── archive.js
│   │   └── archive.css
│   │
│   ├── command/               # Covenant Command (rituals, directives)
│   │   ├── index.html
│   │   ├── command.js
│   │   └── command.css
│   │
│   ├── ledger/                # Meaning, value, consequence
│   │   ├── index.html
│   │   ├── ledger.js
│   │   └── ledger.css
│   │
│   ├── resonance/             # Ambient sound engine
│   │   ├── index.html
│   │   ├── resonance.js
│   │   └── resonance.css
│   │
│   └── services/              # Isolated database & infrastructure layers
│       └── supabase.js        # Handles multi-device license validation keys securely
│
├── assets/                    # All proprietary SOMNIA world assets
│   ├── somnia-banner.svg      # Ancient beveled gold-leaf profile banner
│   ├── audio/                 # Resonance Engine soundscapes (.mp3, .wav)
│   ├── fonts/                 # Custom serif and monospace typography
│   ├── images/                # Sigils, architectural glyphs, backgrounds
│   └── video/                 # Ritual onboarding animations, breathing loops
│
├── pwa/                       # Progressive Web App support
│   ├── manifest.json          # System display rules for fullscreen mobile immersion
│   └── service-worker.js      # Offline caching strategy for local-first operations
│
├── index.html                 # The Nexus — the master hub & desktop of SOMNIA
├── LICENSE                    # MIT for code execution, proprietary for branding/art
├── .gitignore                 # Excludes Node, environment variables, local system cache
└── README.md                  # Master documentation, world description, shell overview


### Rules:
- **Do not create new folders** without purpose  
- **Do not place files at the root** unless essential  
- **Each shell must live in its own folder**  
- **Core files must remain generic and reusable**  

---

## 🜄 Shell Creation Guidelines

Each shell is a “room” in the dream‑OS.

A shell must include:
- `index.html`  
- `shellname.css`  
- `shellname.js`  

A shell must:
- follow the SOMNIA aesthetic  
- use transitions defined in `core/somnia.js`  
- avoid inline styles  
- avoid inline scripts  
- remain calm, slow, atmospheric  

A shell **must not**:
- introduce new UI patterns  
- break the breathing rhythm  
- use harsh colors or animations  
- feel “normal” or “app‑like”  

---

## 🜅 CSS Aesthetic Rules

All CSS must:
- use palette variables  
- use breathing animations sparingly  
- use gold‑lit highlights for focus states  
- avoid sharp edges, harsh shadows, or neon colors  
- maintain low‑frequency motion  

**Do not**:
- use inline CSS  
- use random colors  
- override global variables without reason  

---

## 🜆 JavaScript Ritual Rules

All JS must:
- be modular  
- be named with verbs (e.g., `invokeCloak()`, `revealShell()`)  
- use transitions defined in `core/somnia.js`  
- avoid unnecessary complexity  
- avoid global variables  

**Do not**:
- write rushed logic  
- mix DOM manipulation styles  
- introduce new animation systems  
- break the calm pacing of the OS  

---

## 🜇 Asset Usage

All assets (art, audio, lore, sigils, fonts) are:
- **proprietary**  
- **not to be modified**  
- **not to be redistributed**  
- **not to be replaced** without explicit approval  

Place new assets only in the correct subfolder.

---

## 🜈 Commit Message Style

Commit messages should be:
- clear  
- calm  
- descriptive  
- lowercase preferred  
- short but meaningful  

Examples:
- `add breathing animation to nexus`  
- `refactor resonance engine timing`  
- `create ledger shell structure`  

Avoid:
- chaotic messages  
- jokes  
- unrelated notes  

---

## 🜉 Pull Request Etiquette

If collaborating:
- keep PRs small  
- explain the intention  
- describe how it preserves the SOMNIA aesthetic  
- avoid feature sprawl  
- avoid rushed or experimental code  

---

## 🜊 What Not to Touch

- proprietary assets  
- global palette variables  
- core transitions  
- the Nexus structure  
- the breathing rhythm  
- the tone of the world  

If unsure, ask before altering.

---

## ⭐ Final Note

SOMNIA is not just software — it is a world.  
Every contribution should honor the atmosphere, the ritual, and the inner‑world experience.

Move slowly.  
Build intentionally.  
Keep the dream intact.
