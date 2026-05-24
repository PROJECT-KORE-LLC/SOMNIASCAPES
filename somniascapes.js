/* ============================================================
   SomniaScapes — Full Engine JS (single file)
   ============================================================ */

(function () {
  /* -----------------------------
     Supabase client (optional)
  ----------------------------- */
  let sb = null;
  if (window.supabase) {
    sb = window.supabase.createClient(
      "https://wbhdubxzliqqjgycexkf.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaGR1Ynh6bGlxcWpneWNleGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDI2MTIsImV4cCI6MjA5NTE3ODYxMn0.TZfnQvs8JTtigPpyJkJllNQ7DlTtK15pjlV8XY7Jrh4"
    );
  }

  const Scapes = {
    /* -----------------------------
       State
    ----------------------------- */
    state: {
      palette: "noir",
      imageURL: null,
      audioURL: null,

      zoom: 1,
      panX: 0,
      panY: 0,
      blur: 0,
      brightness: 1,
      opacity: 1,
      volume: 0.6
    },

    /* -----------------------------
       Init
    ----------------------------- */
    init() {
      this.cacheElements();
      this.bindImageUpload();
      this.bindSoundUpload();
      this.bindScratchpad();
      this.bindAutoHide();
      this.bindCast();
      this.bindExportPreset();
      this.bindImportPreset();
      this.bindSliders();
      this.bindPaletteButtons();
      this.initParticles();

      this.applyPalette(this.state.palette);
      this.applyVisuals();
    },

    cacheElements() {
      this.$root = document.documentElement;
      this.$body = document.body;
      this.$image = document.getElementById("vibe-image");
      this.$audio = document.getElementById("vibe-audio");
      this.$controls = document.getElementById("controls");
      this.$scratchpad = document.getElementById("scratchpad");

      this.$imageInput = document.getElementById("imageUpload");
      this.$soundInput = document.getElementById("soundUpload");

      this.$zoom = document.getElementById("ctrl-zoom");
      this.$blur = document.getElementById("ctrl-blur");
      this.$brightness = document.getElementById("ctrl-brightness");
      this.$opacity = document.getElementById("ctrl-opacity");
      this.$volume = document.getElementById("ctrl-volume");

      this.$castButton = document.getElementById("castButton");
      this.$toggleScratchpad = document.getElementById("toggleScratchpad");
      this.$paletteButtons = document.querySelectorAll(".paletteBtn");

      this.$particleCanvas = document.getElementById("particleCanvas");
      this.particleCtx = this.$particleCanvas.getContext("2d");
    },

    /* -----------------------------
       Image upload (your original)
    ----------------------------- */
    bindImageUpload() {
      const imageInput = this.$imageInput;
      const vibeImage = this.$image;

      imageInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          vibeImage.src = e.target.result;
          vibeImage.style.opacity = 1;
        };
        reader.readAsDataURL(file);
      });
    },

    /* -----------------------------
       Sound upload (your original)
    ----------------------------- */
    bindSoundUpload() {
      const soundInput = this.$soundInput;
      const vibeAudio = this.$audio;

      soundInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          vibeAudio.src = e.target.result;
          vibeAudio.loop = true;
          vibeAudio.volume = 0.6;
          vibeAudio
            .play()
            .catch(() => console.log("User interaction required before audio can play."));
        };
        reader.readAsDataURL(file);
      });
    },

    /* -----------------------------
       Scratchpad (your original)
    ----------------------------- */
    bindScratchpad() {
      const scratchpad = this.$scratchpad;
      const toggleScratchpad = this.$toggleScratchpad;

      toggleScratchpad.addEventListener("click", () => {
        scratchpad.classList.toggle("hidden");
      });
    },

    /* -----------------------------
       Auto-hide controls (your original)
    ----------------------------- */
    bindAutoHide() {
      const controls = this.$controls;
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

    /* -----------------------------
       Cast to TV (your original)
    ----------------------------- */
    bindCast() {
      const castButton = this.$castButton;

      castButton.addEventListener("click", async () => {
        if (navigator.presentation && navigator.presentation.requestSession) {
          try {
            await navigator.presentation.requestSession();
          } catch (err) {
            console.log("Presentation API error:", err);
          }
        } else if (window.chrome && chrome.cast) {
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

    /* -----------------------------
       Export preset (your original)
    ----------------------------- */
    bindExportPreset() {
      const exportBtn = document.getElementById("exportPreset");
      if (!exportBtn) return; // you removed it from HTML for now

      exportBtn.addEventListener("click", () => {
        const preset = {
          image: this.$image.src || null,
          sound: this.$audio.src || null,
          palette: this.state.palette,
          zoom: this.state.zoom,
          blur: this.state.blur,
          brightness: this.state.brightness,
          opacity: this.state.opacity,
          volume: this.state.volume
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

    /* -----------------------------
       Import preset (your original)
    ----------------------------- */
    bindImportPreset() {
      const importBtn = document.getElementById("importPreset");
      if (!importBtn) return; // you removed it from HTML for now

      importBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".somnia";

        input.onchange = e => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = event => {
            const preset = JSON.parse(event.target.result);

            if (preset.image) {
              this.$image.src = preset.image;
              this.$image.style.opacity = 1;
            }

            if (preset.sound) {
              this.$audio.src = preset.sound;
              this.$audio
                .play()
                .catch(() => {});
            }

            if (preset.palette) {
              this.applyPalette(preset.palette);
            }

            if (typeof preset.zoom === "number") this.state.zoom = preset.zoom;
            if (typeof preset.blur === "number") this.state.blur = preset.blur;
            if (typeof preset.brightness === "number") this.state.brightness = preset.brightness;
            if (typeof preset.opacity === "number") this.state.opacity = preset.opacity;
            if (typeof preset.volume === "number") this.state.volume = preset.volume;

            this.syncSlidersFromState();
            this.applyVisuals();
          };

          reader.readAsText(file);
        };

        input.click();
      });
    },

    /* -----------------------------
       Sliders → engine
    ----------------------------- */
    bindSliders() {
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

    syncSlidersFromState() {
      if (this.$zoom) this.$zoom.value = this.state.zoom;
      if (this.$blur) this.$blur.value = this.state.blur;
      if (this.$brightness) this.$brightness.value = this.state.brightness;
      if (this.$opacity) this.$opacity.value = this.state.opacity;
      if (this.$volume) this.$volume.value = this.state.volume;
    },

    applyVisuals() {
      const img = this.$image;
      const s = this.state;

      img.style.transform = `scale(${s.zoom}) translate(${s.panX}%, ${s.panY}%)`;
      img.style.filter = `blur(${s.blur}px) brightness(${s.brightness})`;
      img.style.opacity = s.opacity;

      this.$audio.volume = s.volume;
    },

    /* -----------------------------
       Palette / theme logic
    ----------------------------- */
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
      this.$body.className = mode; // CSS handles colors per body class
    },

    /* -----------------------------
       Particles (your original)
    ----------------------------- */
    initParticles() {
      const canvas = this.$particleCanvas;
      const ctx = this.particleCtx;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const particles = [];
      const particleCount = 40;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.6 + 0.2
        });
      }

      const animateParticles = () => {
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

        requestAnimationFrame(animateParticles);
      };

      animateParticles();
    },

    /* -----------------------------
       Supabase presets (skeleton)
    ----------------------------- */
    async savePresetToSupabase(name) {
      if (!sb) return null;

      const preset = {
        name,
        palette: this.state.palette,
        zoom: this.state.zoom,
        blur: this.state.blur,
        brightness: this.state.brightness,
        opacity: this.state.opacity,
        volume: this.state.volume
      };

      const { data, error } = await sb
        .from("presets")
        .insert(preset)
        .select()
        .single();

      if (error) {
        console.error("Error saving preset:", error);
        return null;
      }
      return data;
    },

    async loadPresetFromSupabase(id) {
      if (!sb) return null;

      const { data, error } = await sb
        .from("presets")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error loading preset:", error);
        return null;
      }

      this.state.palette = data.palette;
      this.state.zoom = data.zoom;
      this.state.blur = data.blur;
      this.state.brightness = data.brightness;
      this.state.opacity = data.opacity;
      this.state.volume = data.volume;

      this.applyPalette(this.state.palette);
      this.syncSlidersFromState();
      this.applyVisuals();

      return data;
    }
  };

  document.addEventListener("DOMContentLoaded", () => Scapes.init());
})();
