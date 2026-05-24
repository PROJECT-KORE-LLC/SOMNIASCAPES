/* ============================================================
   SOMNIASCAPES — FINAL ENGINE JS
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
      audioURL: null,

      zoom: 1,
      blur: 0,
      brightness: 1,
      opacity: 1,
      volume: 0.6
    },

    /* ------------------------------------------------------------
       INIT
    ------------------------------------------------------------ */
    init() {
      this.cache();
      this.bindImageUpload();
      this.bindSoundUpload();
      this.bindSliders();
      this.bindScratchpad();
      this.bindAutoHide();
      this.bindCast();
      this.bindPaletteButtons();
      this.initParticles();

      this.applyPalette(this.state.palette);
      this.applyVisuals();
    },

    /* ------------------------------------------------------------
       Cache DOM
    ------------------------------------------------------------ */
    cache() {
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
      this.ctx = this.$particleCanvas.getContext("2d");
    },

    /* ------------------------------------------------------------
       IMAGE UPLOAD
    ------------------------------------------------------------ */
    bindImageUpload() {
      this.$imageInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
          this.$image.src = ev.target.result;
          this.$image.style.opacity = 1;
        };
        reader.readAsDataURL(file);
      });
    },

    /* ------------------------------------------------------------
       SOUND UPLOAD
    ------------------------------------------------------------ */
    bindSoundUpload() {
      this.$soundInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
          this.$audio.src = ev.target.result;
          this.$audio.loop = true;
          this.$audio.volume = this.state.volume;
          this.$audio.play().catch(() => {});
        };
        reader.readAsDataURL(file);
      });
    },

    /* ------------------------------------------------------------
       SLIDERS → ENGINE
    ------------------------------------------------------------ */
    bindSliders() {
      this.$zoom.addEventListener("input", e => {
        this.state.zoom = parseFloat(e.target.value);
        this.applyVisuals();
      });

      this.$blur.addEventListener("input", e => {
        this.state.blur = parseFloat(e.target.value);
        this.applyVisuals();
      });

      this.$brightness.addEventListener("input", e => {
        this.state.brightness = parseFloat(e.target.value);
        this.applyVisuals();
      });

      this.$opacity.addEventListener("input", e => {
        this.state.opacity = parseFloat(e.target.value);
        this.applyVisuals();
      });

      this.$volume.addEventListener("input", e => {
        this.state.volume = parseFloat(e.target.value);
        this.applyVisuals();
      });
    },

    /* ------------------------------------------------------------
       APPLY VISUALS
    ------------------------------------------------------------ */
    applyVisuals() {
      const s = this.state;

      this.$image.style.transform = `scale(${s.zoom})`;
      this.$image.style.filter = `blur(${s.blur}px) brightness(${s.brightness})`;
      this.$image.style.opacity = s.opacity;

      this.$audio.volume = s.volume;
    },

    /* ------------------------------------------------------------
       SCRATCHPAD
    ------------------------------------------------------------ */
    bindScratchpad() {
      this.$toggleScratchpad.addEventListener("click", () => {
        this.$scratchpad.classList.toggle("hidden");
      });
    },

    /* ------------------------------------------------------------
       AUTO-HIDE CONTROLS
    ------------------------------------------------------------ */
    bindAutoHide() {
      let hideTimeout;

      const show = () => {
        this.$controls.classList.remove("hidden-controls");
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          this.$controls.classList.add("hidden-controls");
        }, 3000);
      };

      document.addEventListener("mousemove", show);
      document.addEventListener("touchstart", show);

      hideTimeout = setTimeout(() => {
        this.$controls.classList.add("hidden-controls");
      }, 3000);
    },

    /* ------------------------------------------------------------
       CAST TO TV
    ------------------------------------------------------------ */
    bindCast() {
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
       PARTICLES
    ------------------------------------------------------------ */
    initParticles() {
      const canvas = this.$particleCanvas;
      const ctx = this.ctx;

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

})();
