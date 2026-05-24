# SOMNIASCAPES — Project Scaffold  
### The blueprint of our tiny dream‑OS.

This document explains how SOMNIASCAPES is structured,  
what each folder does,  
and how all the chaos stays organized.

If you're contributing, read this before touching anything.

---

# 🌙 1. Root Directory  
The main files that make the whole vibe machine run.

/somniascapes
│
├── index.html
├── somniascapes.js
├── somniascapes.css
├── somniascapes.svg
│
├── /assets
├── /ui
├── /engine
├── /auth
│
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SCAFFOLD.md
└── PHASES.md


---

# 🌌 2. Core Files (The Heartbeat)

### **index.html**  
The main entry point.  
Loads the editor, the UI, and the engine.  
If this breaks, everything breaks.

### **somniascapes.js**  
The master script.  
Handles:

- [scene building] 
- [preview logic] 
- [free vs paid mode]
- [UI interactions]
- [engine orchestration]

### **somniascapes.css**  
All the glow, blur, cozy, aesthetic nonsense.  
If it’s pretty, it’s here.

### **somniascapes.svg**  
The banner.  
The vibe.  
The face of the project.

---

# 🔮 3. /assets (The Library)
 
Everything comes from here.

/assets
│
├── /images      → curated backgrounds
├── /audio       → ambient loops
└── /particles   → particle textures + configs


# Rules: 

- No copyrighted content.  
- No giant files.  
- No ugly assets.  
- No memes unless they’re aesthetic memes.

---

# 🧠 4. /engine (The Magic)

This is where the actual atmosphere engine lives.

/engine
│
├── renderer.js        → draws images + layers
├── audio.js           → loops + volume + fade
├── particles.js       → particle engine
├── palettes.js        → color modes + glow
└── breathing.js       → subtle animation pulses


If it moves, glows, breathes, or sparkles — it’s here.

---

# 🎛️ 5. /ui (The Buttons + Chaos)

Everything the user touches.

/ui
│
├── editor.html        → the main interface
├── sliders.js         → zoom/blur/brightness/etc
├── scratchpad.js      → the doodle pad
├── cloak.js           → instant hide mode
└── castButton.js      → locked/unlocked states


# Rules:

- UI must stay minimal.  
- No clutter.  
- No 900‑button toolbars.  
- No “advanced mode.”  
- No ugly.

---

# 🔒 6. /auth (The $1 Gate)

Handles the unlock system.

/auth
│
├── paywall.js         → shows the unlock screen
├── unlock.js          → marks user as paid
└── supabase.js        → secure reads/writes


Free users:

- can build  
- can preview  
- **cannot save**  
- **cannot load**  
- **cannot cast**  
- **cannot share**

Paid users:

- unlock everything  
- still cannot export (ever)

---

# 🗄️ 7. Supabase Structure (The Vault)

Tables:

users

id

isPaid (boolean)

scenes

id

userId

data (JSON)

createdAt

shared_links

id

sceneId

createdAt


Rules:

- No public buckets.  
- No asset exposure.  
- No direct file access.  
- No bypassing the unlock.  

---

# 🧩 8. How Everything Connects

### **index.html**  
loads →  
**somniascapes.js**  
which loads →  
**engine + ui + auth modules**  
which load →  
**assets + Supabase (if paid)**

It’s a tiny OS.  
Everything is modular.  
Everything is intentional.

---

# 🧿 9. Developer Boundaries (Important)

- Do not add exporting.  
- Do not add uploading.  
- Do not add device saving.  
- Do not add “free save.”  
- Do not add “free cast.”  
- Do not add clutter.  
- Do not break the vibe.  
- Do not break the $1 model.

If your change violates any of these, it will be rejected instantly.

---

# 🌟 10. Final Note

SOMNIASCAPES is built to feel like a cozy, chaotic, aesthetic dream‑OS.  
This scaffold keeps the magic intact.

Build carefully.  
Break nothing.  
Add only vibes.
