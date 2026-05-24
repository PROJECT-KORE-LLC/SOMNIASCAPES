/* ============================================================
   SOMNIASCAPES ENGINE — COMPLETE JS FILE
   ============================================================ */

/* ------------------------------------------------------------
   SUPABASE CLIENT
------------------------------------------------------------ */
const supabase = supabase.createClient(
  "https://wbhdubxzliqqjgycexkf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaGR1Ynh6bGlxcWpneWNleGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDI2MTIsImV4cCI6MjA5NTE3ODYxMn0.TZfnQvs8JTtigPpyJkJllNQ7DlTtK15pjlV8XY7Jrh4"
);

/* ------------------------------------------------------------
   CORE STATE
------------------------------------------------------------ */
const Scapes = {
  state: {
    vibe: "embers",

    imageURL: null,
    audioURL: null,

    zoom: 1,
    panX: 0,
    panY: 0,
    fit: "cover",

    blur: 0,
    brightness: 1,
    opacity: 1,
    volume: 0.6
  },

  vibes: {
    embers: {
      primary: "#f6b27a",
      secondary: "#3b1b2a",
      glow: "#ffddaa",
      vignette: 0.7,
      particles: 0.6,
      drift: 0.4,
      pulse: 0.3
    },
    lunar: {
      primary: "#c9e4ff",
      secondary: "#0b1020",
      glow: "#9fd4ff",
      vignette: 0.5,
      particles: 0.3,
      drift: 0.2,
      pulse: 0.2
    },
    abyss: {
      primary: "#5ce0c2",
      secondary: "#020308",
      glow: "#3cf0ff",
      vignette: 0.85,
      particles: 0.9,
      drift: 0.7,
      pulse: 0.5
    }
  },

  /* ------------------------------------------------------------
     INIT
  ------------------------------------------------------------ */
  init() {
    this.$root = document.documentElement;
    this.$image = document.getElementById("vibe-image");
    this.$audio = document.getElementById("vibe-audio");

    this.bindUploads();
    this.bindScratchpad();
    this.bindAutoHide();
    this.bindCast();
    this.bindPresetExport();
    this.bindPresetImport();

    this.applyVibe(this.vibes[this.state.vibe]);
    this.applyControls();

    this.initParticles();
  },

  /* ------------------------------------------------------------
     IMAGE UPLOAD
  ------------------------------------------------------------ */
  bindUploads() {
    const imageInput = document.getElementById("imageUpload");
    const soundInput = document.getElementById("soundUpload");

    imageInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = ev => this.setImage(ev.target.result);
      reader.readAsDataURL(file);
    });

    soundInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = ev => this.setAudio(ev.target.result);
      reader.readAsDataURL(file);
    });
  },

  setImage(url) {
    this.state.imageURL = url;
    this.$image.src = url;
    this.$image.style.opacity = 1;
  },

  setAudio(url) {
    this.state.audioURL = url;
    this.$audio.src = url;
    this.$audio.loop = true;
    this.fadeAudioTo(this.state.volume, 600);
    this.$audio.play().catch(() => {});
  },

  fadeAudioTo(target, duration) {
    const a = this.$audio;
    const start = a.volume;
    const delta = target - start;
    const startTime = performance.now();

    const tick = now => {
      const t = Math.min(1, (now - startTime) / duration);
      a.volume = start + delta * t;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },

  /* ------------------------------------------------------------
     VIBE SYSTEM
  ------------------------------------------------------------ */
  setVibe(name) {
    if (!this.vibes[name]) return;
    this.state.vibe = name;
    this.applyVibe(this.vibes[name]);
  },

  applyVibe(vibe) {
    const r = this.$root;

    r.style.setProperty("--primary", vibe.primary);
    r.style.setProperty("--secondary", vibe.secondary);
    r.style.setProperty("--glow", vibe.glow);
    r.style.setProperty("--vignette-strength", vibe.vignette);
    r.style.setProperty("--particle-density", vibe.particles);
    r.style.setProperty("--drift-speed", vibe.drift);
    r.style.setProperty("--blur-pulse", vibe.pulse);
  },

  /* ------------------------------------------------------------
     CONTROLS → CSS VARS
  ------------------------------------------------------------ */
  applyControls() {
    const s = this.state;

    this.$image.style.setProperty("--zoom", s.zoom);
    this.$image.style.setProperty("--pan-x", `${s.panX}%`);
    this.$image.style.setProperty("--pan-y", `${s.panY}%`);
    this.$image.style.objectFit = s.fit;
    this.$image.style.opacity = s.opacity;
    this.$image.style.filter = `blur(${s.blur}px) brightness(${s.brightness})`;

    this.$audio.volume = s.volume;
  },

  /* ------------------------------------------------------------
     SCRATCHPAD
  ------------------------------------------------------------ */
  bindScratchpad() {
    const pad = document.getElementById("scratchpad");
    const toggle = document.getElementById("toggleScratchpad");

    toggle.addEventListener("click", () => {
      pad.classList.toggle("hidden");
    });
  },

  /* ------------------------------------------------------------
     AUTO-HIDE UI
  ------------------------------------------------------------ */
  bindAutoHide() {
    const controls = document.getElementById("controls");
    let hideTimeout;

    const showControls = () => {
      controls.classList.remove("hidden-controls");
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        controls.classList.add("hidden-controls");
      }, 3000);
    };

    document.addEventListener("mousemove", showControls);
    document.addEventListener("touchstart", showControls);

    hideTimeout = setTimeout(() => {
      controls.classList.add("hidden-controls");
    }, 3000);
  },

  /* ------------------------------------------------------------
     CAST TO TV
  ------------------------------------------------------------ */
  bindCast() {
    const castButton = document.getElementById("castButton");

    castButton.addEventListener("click", async () => {
      if (navigator.presentation?.requestSession) {
        try {
          await navigator.presentation.requestSession();
        } catch (err) {
          console.log("Presentation API error:", err);
        }
      } else if (window.chrome?.cast) {
        try {
          chrome.cast.requestSession();
        } catch (err) {
          console.log("Chrome Cast error:", err);
        }
      } else {
        alert("Casting is not supported in this browser.");
      }
    });
  },

  /* ------------------------------------------------------------
     EXPORT PRESET
  ------------------------------------------------------------ */
  bindPresetExport() {
    const exportBtn = document.getElementById("exportPreset");

    exportBtn.addEventListener("click", () => {
      const preset = {
        image: this.state.imageURL,
        sound: this.state.audioURL,
        vibe: this.state.vibe
      };

      const blob = new Blob([JSON.stringify(preset)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "somnia-preset.somnia";
      a.click();

      URL.revokeObjectURL(url);
    });
  },

  /* ------------------------------------------------------------
     IMPORT PRESET
  ------------------------------------------------------------ */
  bindPresetImport() {
    const importBtn = document.getElementById("importPreset");

    importBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".somnia";

      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
          const preset = JSON.parse(ev.target.result);

          if (preset.image) this.setImage(preset.image);
          if (preset.sound) this.setAudio(preset.sound);
          if (preset.vibe) this.setVibe(preset.vibe);
        };

        reader.readAsText(file);
      };

      input.click();
    });
  },

  /* ------------------------------------------------------------
     PARTICLES
  ------------------------------------------------------------ */
  initParticles() {
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.6 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
};

/* ------------------------------------------------------------
   BOOT
------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => Scapes.init());
