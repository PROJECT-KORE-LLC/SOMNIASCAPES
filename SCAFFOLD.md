SOMNIA/
│
├── core/                      # Shared logic, utilities, global CSS + JS
│   ├── somnia.css             # Core aesthetic rules (glow, breathing, palette)
│   ├── somnia.js              # Shared functions, transitions, rituals
│   └── utils.js               # Helpers for shells, audio, state, timing
│
├── shells/                    # Each shell = a room in the dream‑OS
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
│   └── resonance/             # Ambient sound engine
│       ├── index.html
│       ├── resonance.js
│       └── resonance.css
│
├── assets/                    # All proprietary SOMNIA world assets
│   ├── audio/                 # Resonance Engine soundscapes
│   ├── fonts/                 # Custom typography
│   ├── images/                # Sigils, glyphs, backgrounds
│   └── video/                 # Ritual animations, breathing loops
│
├── pwa/                       # Progressive Web App support
│   ├── manifest.json
│   └── service-worker.js
│
├── index.html                 # The Nexus — the hub of SOMNIA
├── LICENSE                    # MIT for code, proprietary for assets
├── .gitignore                 # Node, build artifacts, OS files
└── README.md                  # Hero page, world description, shell overview
