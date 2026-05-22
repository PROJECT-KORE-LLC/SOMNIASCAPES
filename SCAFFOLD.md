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
