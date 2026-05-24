/* ============================================================
   SOMNIASCAPES — UNIFIED SIDEBAR ENGINE JS
   Amber + Copilot — 2026
   ============================================================ */

(function () {

  /* ------------------------------------------------------------
     Optional Supabase client (only works if supabase.js is loaded)
  ------------------------------------------------------------ */
  let sb = null;
  if (window.supabase) {
    sb = window.supabase.createClient(
      "https://wbhdubxzliqqjgycexkf.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaGR1Ynh6bGlxcWpneWNleGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDI2MTIsImV4cCI6MjA5NTE3ODYxMn0.TZfnQvs8JTtigPpyJkJllNQ7DlTtK15pjlV8XY7Jrh4"
    );
  }

  /* ------------------------------------------------------------
     Core Engine Object
  ------------------------------------------------------------ */
  const Scapes = {

    state: {
      palette: "noir",

      imageURL: null,

      zoom: 1,
      blur: 0,
      brightness: 1,
      opacity: 1,
      volume: 0.6,

      prompt: "",

      particles: {
        opacity: 0.6,
        speed: 0.2,
        density: 40,
        size: 2
      },

      glow: {
        opacity: 0.3,
        radius: 18,
        speed: 0.3
      },

      audioTracks: [],      // { id, src, audio, volume }
      starredVibes: [null, null, null] // 3 slots
    },

    particles: [],
    glowPhase: 0,

    /* ------------------------------------------------------------
       INIT
    ------------------------------------------------------------ */
    init() {
      this.cache();
      this.initDefaultVibe();
      this.bindImageUpload();
      this.bindAudioUpload();
      this.bindAdjustments();
      this.bindParticlesControls();
      this.bindGlowControls();
      this.bindAudioMixerControls();
      this.bindStarredVibes();
      this.bindPrompt();
      this.bindScratchpad();
      this.bindCast();
      this.bindPaletteButtons();
      this.initParticles();
      this.initGlow();
      this.bindCloak();

      this.applyPalette(this.state.palette);
      this.applyVisuals();
      this.renderAudioMixer();
      this.renderStarredVibes();
    },

    /* ------------------------------------------------------------
       Cache DOM
    ------------------------------------------------------------ */
    cache() {
      // Core visuals
      this.$image = document.getElementById("vibe-image");
      this.$audioMain = document.getElementById("vibe-audio");

      this.$sidebar = document.getElementById("sidebar");
      this.$scratchpad = document.getElementById("scratchpad");
      this.$scratchpadClose = document.getElementById("close-scratchpad");

      this.$imageInput = document.getElementById("imageUpload");
      this.$soundInput = document.getElementById("soundUpload");

      // Adjustments
      this.$zoom = document.getElementById("ctrl-zoom");
      this.$blur = document.getElementById("ctrl-blur");
      this.$brightness = document.getElementById("ctrl-brightness");
      this.$opacity = document.getElementById("ctrl-opacity");
      this.$volume = document.getElementById("ctrl-volume");

      // Palette + tools
      this.$castButton = document.getElementById("castButton");
      this.$toggleScratchpad = document.getElementById("toggleScratchpad");
      this.$cloakButton = document.getElementById("cloakButton");
      this.$paletteButtons = document.querySelectorAll(".paletteBtn");

      // Particles + glow
      this.$particleCanvas = document.getElementById("particleCanvas");
      this.ctx = this.$particleCanvas.getContext("2d");
      this.$blurPulse = document.getElementById("blurPulse");

      this.$particleOpacity = document.getElementById("particle-opacity");
      this.$particleSpeed = document.getElementById("particle-speed");
      this.$particleDensity = document.getElementById("particle-density");
      this.$particleSize = document.getElementById("particle-size");

      this.$glowOpacity = document.getElementById("glow-opacity");
      this.$glowRadius = document.getElementById("glow-radius");
      this.$glowSpeed = document.getElementById("glow-speed");

      // Audio mixer
      this.$audioMixerList = document.getElementById("audio-mixer-list");
      this.$addAudioTrackBtn = document.getElementById("add-audio-track-btn");
      this.$pauseAllAudioBtn = document.getElementById("pause-all-audio-btn");

      // Starred vibes
      this.$starredVibesPanel = document.getElementById("starred-vibes-panel");
      this.$starredVibesList = document.getElementById("starred-vibes-list");
      this.$saveVibeBtn = document.getElementById("save-vibe-btn");
      this.$starVibeBtn = document.getElementById("star-vibe-btn");

      // Prompt
      this.$promptField = document.getElementById("prompt-field");
    },

    /* ------------------------------------------------------------
       Default Vibe (slot 0: Dreamroot)
    ------------------------------------------------------------ */
    initDefaultVibe() {
      this.state.starredVibes[0] = {
        name: "Dreamroot (default)",
        palette: "noir",
        zoom: 1,
        blur: 0,
        brightness: 1,
        opacity: 1,
        volume: 0.6,
        prompt: "",
        imageURL: null,
        audioTracks: []
      };
    },

    /* ------------------------------------------------------------
       IMAGE UPLOAD
    ------------------------------------------------------------ */
    bindImageUpload() {
      if (!this.$imageInput) return;

      this.$imageInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
          this.state.imageURL = ev.target.result;
          this.$image.src = ev.target.result;
          this.$image.style.opacity = 1;
        };
        reader.readAsDataURL(file);
      });
    },

    /* ------------------------------------------------------------
       AUDIO UPLOAD → new track in mixer
    ------------------------------------------------------------ */
    bindAudioUpload() {
      if (!this.$soundInput) return;

      this.$soundInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
          this.addAudioTrack(ev.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    addAudioTrack(src) {
      const id = Date.now() + "_" + Math.random().toString(16).slice(2);
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = this.state.volume; // master volume baseline
      audio.play().catch(() => {});

      this.state.audioTracks.push({
        id,
        src,
        audio,
        volume: 1 // per-track volume
      });

      this.renderAudioMixer();
    },

    renderAudioMixer() {
      if (!this.$audioMixerList) return;

      this.$audioMixerList.innerHTML = "";

      this.state.audioTracks.forEach((track, index) => {
        const row = document.createElement("div");
        row.className = "audio-track-row";

        const label = document.createElement("span");
        label.textContent = `Track ${index + 1}`;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "1";
        slider.step = "0.01";
        slider.value = track.volume;
        slider.addEventListener("input", (e) => {
          track.volume = parseFloat(e.target.value);
          track.audio.volume = this.state.volume * track.volume;
        });

        const muteBtn = document.createElement("button");
        muteBtn.textContent = "Mute";
        muteBtn.addEventListener("click", () => {
          if (track.audio.muted) {
            track.audio.muted = false;
            muteBtn.textContent = "Mute";
          } else {
            track.audio.muted = true;
            muteBtn.textContent = "Unmute";
          }
        });

        row.appendChild(label);
        row.appendChild(slider);
        row.appendChild(muteBtn);
        this.$audioMixerList.appendChild(row);
      });
    },

    bindAudioMixerControls() {
      if (this.$addAudioTrackBtn) {
        this.$addAudioTrackBtn.addEventListener("click", () => {
          // Just trigger the upload input
          if (this.$soundInput) {
            this.$soundInput.click();
          }
        });
      }

      if (this.$pauseAllAudioBtn) {
        this.$pauseAllAudioBtn.addEventListener("click", () => {
          this.state.audioTracks.forEach(t => t.audio.pause());
        });
      }
    },

    /* ------------------------------------------------------------
       ADJUSTMENTS (zoom, blur, brightness, opacity, volume)
    ------------------------------------------------------------ */
    bindAdjustments() {
      if (this.$zoom) {
        this.$zoom.addEventListener("input", e => {
          this.state.zoom = parseFloat(e.target.value);
          this.applyVisuals();
        });
      }

      if (this.$blur) {
        this.$blur.addEventListener("input", e => {
          this.state.blur = parseFloat(e.target.value);
          this.applyVisuals();
        });
      }

      if (this.$brightness) {
        this.$brightness.addEventListener("input", e => {
          this.state.brightness = parseFloat(e.target.value);
          this.applyVisuals();
        });
      }

      if (this.$opacity) {
        this.$opacity.addEventListener("input", e => {
          this.state.opacity = parseFloat(e.target.value);
          this.applyVisuals();
        });
      }

      if (this.$volume) {
        this.$volume.addEventListener("input", e => {
          this.state.volume = parseFloat(e.target.value);
          this.applyVisuals();
        });
      }
    },

    /* ------------------------------------------------------------
       PARTICLE CONTROLS
    ------------------------------------------------------------ */
    bindParticlesControls() {
      if (this.$particleOpacity) {
        this.$particleOpacity.addEventListener("input", e => {
          this.state.particles.opacity = parseFloat(e.target.value);
        });
      }

      if (this.$particleSpeed) {
        this.$particleSpeed.addEventListener("input", e => {
          this.state.particles.speed = parseFloat(e.target.value);
        });
      }

      if (this.$particleDensity) {
        this.$particleDensity.addEventListener("input", e => {
          this.state.particles.density = parseInt(e.target.value, 10);
          this.resetParticles();
        });
      }

      if (this.$particleSize) {
        this.$particleSize.addEventListener("input", e => {
          this.state.particles.size = parseFloat(e.target.value);
          this.resetParticles();
        });
      }
    },

    resetParticles() {
      // Rebuild particle array with new density/size
      const canvas = this.$particleCanvas;
      if (!canvas) return;

      this.particles = [];
      const count = this.state.particles.density;

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: (Math.random() * 0.5 + 0.75) * this.state.particles.size,
          speedX: (Math.random() - 0.5) * this.state.particles.speed,
          speedY: (Math.random() - 0.5) * this.state.particles.speed,
          opacity: Math.random() * this.state.particles.opacity
        });
      }
    },

    /* ------------------------------------------------------------
       GLOW CONTROLS
    ------------------------------------------------------------ */
    bindGlowControls() {
      if (this.$glowOpacity) {
        this.$glowOpacity.addEventListener("input", e => {
          this.state.glow.opacity = parseFloat(e.target.value);
        });
      }

      if (this.$glowRadius) {
        this.$glowRadius.addEventListener("input", e => {
          this.state.glow.radius = parseFloat(e.target.value);
        });
      }

      if (this.$glowSpeed) {
        this.$glowSpeed.addEventListener("input", e => {
          this.state.glow.speed = parseFloat(e.target.value);
        });
      }
    },

    /* ------------------------------------------------------------
       APPLY VISUALS
    ------------------------------------------------------------ */
    applyVisuals() {
      const s = this.state;

      if (this.$image) {
        this.$image.style.transform = `scale(${s.zoom})`;
        this.$image.style.filter = `blur(${s.blur}px) brightness(${s.brightness})`;
        this.$image.style.opacity = s.opacity;
      }

      // Master volume affects all tracks
      this.state.audioTracks.forEach(track => {
        track.audio.volume = s.volume * track.volume;
      });
    },

    /* ------------------------------------------------------------
       SCRATCHPAD
    ------------------------------------------------------------ */
    bindScratchpad() {
      const pad = this.$scratchpad;
      const toggle = this.$toggleScratchpad;
      const closeBtn = this.$scratchpadClose;

      if (!pad || !toggle) return;

      toggle.addEventListener("click", () => {
        pad.classList.toggle("hidden");
      });

      pad.addEventListener("click", (e) => {
        if (e.target === pad) {
          pad.classList.add("hidden");
        }
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          pad.classList.add("hidden");
        });
      }
    },

    /* ------------------------------------------------------------
       CAST TO TV
    ------------------------------------------------------------ */
    bindCast() {
      if (!this.$castButton) return;

      this.$castButton.addEventListener("click", async () => {
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
          alert("Casting not supported.");
        }
      });
    },

    /* ------------------------------------------------------------
       PALETTE SWITCHING
    ------------------------------------------------------------ */
    bindPaletteButtons() {
      this.$paletteButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const mode = btn.dataset.mode;
          this.applyPalette(mode);
        });
      });
    },

    applyPalette(mode) {
      this.state.palette = mode;
      document.body.className = mode;
    },

    /* ------------------------------------------------------------
       CLOAK MODE — hide sidebar + scratchpad, tap anywhere to uncloak
    ------------------------------------------------------------ */
    bindCloak() {
      const btn = this.$cloakButton;
      const sidebar = this.$sidebar;
      const scratchpad = this.$scratchpad;

      if (!btn || !sidebar) return;

      this._uncloakHandler = () => {
        document.body.classList.remove("cloaked");
        sidebar.classList.remove("sidebar-hidden");
        if (scratchpad) scratchpad.classList.add("hidden");
        document.removeEventListener("click", this._uncloakHandler);
      };

      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const isCloaked = document.body.classList.toggle("cloaked");

        if (isCloaked) {
          sidebar.classList.add("sidebar-hidden");
          if (scratchpad) scratchpad.classList.add("hidden");
          document.addEventListener("click", this._uncloakHandler);
        } else {
          sidebar.classList.remove("sidebar-hidden");
          document.removeEventListener("click", this._uncloakHandler);
        }
      });
    },

    /* ------------------------------------------------------------
       PARTICLES (visual engine)
    ------------------------------------------------------------ */
    initParticles() {
      const canvas = this.$particleCanvas;
      const ctx = this.ctx;
      if (!canvas || !ctx) return;

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.resetParticles();
      };
      resize();
      window.addEventListener("resize", resize);

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.particles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${Math.min(p.opacity, this.state.particles.opacity)})`;
          ctx.fill();
        });

        requestAnimationFrame(animate);
      };

      this.resetParticles();
      animate();
    },

    /* ------------------------------------------------------------
       GLOW ENGINE (uses #blurPulse)
    ------------------------------------------------------------ */
    initGlow() {
      const el = this.$blurPulse;
      if (!el) return;

      const loop = (timestamp) => {
        const g = this.state.glow;
        this.glowPhase += g.speed * 0.02;

        const pulse = (Math.sin(this.glowPhase) + 1) / 2; // 0–1
        const opacity = g.opacity * (0.4 + 0.6 * pulse);

        el.style.boxShadow = `0 0 ${g.radius}px rgba(255,255,255,${opacity})`;

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    },

    /* ------------------------------------------------------------
       PROMPT FIELD
    ------------------------------------------------------------ */
    bindPrompt() {
      if (!this.$promptField) return;

      this.$promptField.addEventListener("input", (e) => {
        this.state.prompt = e.target.value;
      });
    },

    /* ------------------------------------------------------------
       STARRED VIBES (save/load)
    ------------------------------------------------------------ */
    bindStarredVibes() {
      if (this.$saveVibeBtn) {
        this.$saveVibeBtn.addEventListener("click", () => {
          // Just snapshot current vibe (not tied to a slot)
          this._lastSavedVibe = this.snapshotCurrentVibe("Saved Vibe");
        });
      }

      if (this.$starVibeBtn) {
        this.$starVibeBtn.addEventListener("click", () => {
          // Find first empty slot (1 or 2), or ask to replace
          let slot = this.state.starredVibes.findIndex((v, i) => i > 0 && v === null);
          if (slot === -1) slot = 1; // default to slot 1 if all filled

          this.state.starredVibes[slot] = this.snapshotCurrentVibe(`Starred Vibe ${slot + 1}`);
          this.renderStarredVibes();
        });
      }

      if (this.$starredVibesList) {
        this.$starredVibesList.addEventListener("click", (e) => {
          const btn = e.target.closest(".starred-vibe-btn");
          if (!btn) return;

          const slot = parseInt(btn.dataset.slot, 10);
          const vibe = this.state.starredVibes[slot];

          if (vibe) {
            this.loadVibe(vibe);
          } else {
            // Empty slot → save current into this slot
            this.state.starredVibes[slot] = this.snapshotCurrentVibe(`Starred Vibe ${slot + 1}`);
            this.renderStarredVibes();
          }
        });
      }
    },

    snapshotCurrentVibe(name) {
      return {
        name: name || "Vibe",
        palette: this.state.palette,
        zoom: this.state.zoom,
        blur: this.state.blur,
        brightness: this.state.brightness,
        opacity: this.state.opacity,
        volume: this.state.volume,
        prompt: this.state.prompt,
        imageURL: this.state.imageURL,
        audioTracks: this.state.audioTracks.map(t => ({
          src: t.src,
          volume: t.volume
        }))
      };
    },

    loadVibe(vibe) {
      if (!vibe) return;

      this.state.palette = vibe.palette;
      this.state.zoom = vibe.zoom;
      this.state.blur = vibe.blur;
      this.state.brightness = vibe.brightness;
      this.state.opacity = vibe.opacity;
      this.state.volume = vibe.volume;
      this.state.prompt = vibe.prompt;
      this.state.imageURL = vibe.imageURL;

      // Apply palette
      this.applyPalette(this.state.palette);

      // Apply image
      if (this.$image && this.state.imageURL) {
        this.$image.src = this.state.imageURL;
        this.$image.style.opacity = 1;
      }

      // Apply sliders
      if (this.$zoom) this.$zoom.value = this.state.zoom;
      if (this.$blur) this.$blur.value = this.state.blur;
      if (this.$brightness) this.$brightness.value = this.state.brightness;
      if (this.$opacity) this.$opacity.value = this.state.opacity;
      if (this.$volume) this.$volume.value = this.state.volume;

      // Prompt
      if (this.$promptField) this.$promptField.value = this.state.prompt;

      // Rebuild audio tracks
      this.state.audioTracks.forEach(t => t.audio.pause());
      this.state.audioTracks = [];
      (vibe.audioTracks || []).forEach(t => {
        this.addAudioTrack(t.src);
        const last = this.state.audioTracks[this.state.audioTracks.length - 1];
        last.volume = t.volume;
        last.audio.volume = this.state.volume * t.volume;
      });

      this.applyVisuals();
      this.renderAudioMixer();
    },

    renderStarredVibes() {
      if (!this.$starredVibesList) return;

      const buttons = this.$starredVibesList.querySelectorAll(".starred-vibe-btn");
      buttons.forEach(btn => {
        const slot = parseInt(btn.dataset.slot, 10);
        const vibe = this.state.starredVibes[slot];

        if (vibe) {
          btn.textContent = `★ ${vibe.name}`;
          btn.classList.remove("empty");
        } else {
          btn.textContent = "☆ Add your vibe";
          btn.classList.add("empty");
        }
      });
    }

  };

  /* ------------------------------------------------------------
     BOOT
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => Scapes.init());

})();
