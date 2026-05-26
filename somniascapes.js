/* ============================================================
   SOMNIASCAPES — UNIFIED RESONANCE CHAMBER ENGINE CORE
   High-Fidelity Web Audio Context Architecture • Local Asset Defaults
   ============================================================ */

(function () {
    "use strict";

    // Immutable High-Fidelity Preload Data Layer (Bypasses Onboarding Friction)
    const IMMUTABLE_LIBRARY = {
        dreamroot: {
            image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1920",
            stems: [
                "https://actions.google.com/sounds/v1/ambiences/coffee_shop_ambience.ogg",
                "https://actions.google.com/sounds/v1/ambiences/rain_heavy_loud.ogg"
            ]
        },
        "lunar-tide": {
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920",
            stems: ["https://actions.google.com/sounds/v1/ambiences/ocean_waves.ogg"]
        },
        "amethyst-rift": {
            image: "https://images.unsplash.com/photo-1516339901601-2e1d62dc0c45?q=80&w=1920",
            stems: ["https://actions.google.com/sounds/v1/ambiences/ambient_hum_air_conditioner.ogg"]
        }
    };

    const Engine = {
        state: {
            palette: "noir",
            zoom: 1,
            blur: 0,
            volume: 0.6,
            prompt: "",
            reverbWet: 0.3,
            filterFreq: 4000,
            particles: { opacity: 0.6, speed: 0.2, density: 40 },
            audioTracks: [], // Array mapping { id, src, sourceNode, gainNode }
            starredVibes: [null, null, null]
        },

        // Native Web Audio Context Pipeline Properties
        audioCtx: null,
        masterGain: null,
        convolverNode: null,
        filterNode: null,
        
        // Mechanical Elements
        particles: [],
        isInitialized: false,

        init() {
            this.cacheDOM();
            this.setupInitialInteractivity();
        },

        cacheDOM() {
            this.$portal = document.getElementById("awakening-portal");
            this.$awakenBtn = document.getElementById("awaken-btn");
            this.$image = document.getElementById("vibe-image");
            this.$sidebar = document.getElementById("sidebar");
            this.$scratchpad = document.getElementById("scratchpad");
            this.$toggleScratchpad = document.getElementById("toggleScratchpad");
            this.$scratchpadClose = document.getElementById("close-scratchpad");
            this.$imageInput = document.getElementById("imageUpload");
            this.$soundInput = document.getElementById("soundUpload");
            
            // Layout Adjustments
            this.$zoom = document.getElementById("ctrl-zoom");
            this.$blur = document.getElementById("ctrl-blur");
            this.$volume = document.getElementById("ctrl-volume");
            this.$reverb = document.getElementById("ctrl-reverb");
            this.$filter = document.getElementById("ctrl-filter");

            // Particles
            this.$particleCanvas = document.getElementById("particleCanvas");
            this.ctx = this.$particleCanvas.getContext("2d");
            this.$particleOpacity = document.getElementById("particle-opacity");
            this.$particleSpeed = document.getElementById("particle-speed");
            this.$particleDensity = document.getElementById("particle-density");

            // Systems
            this.$cloakButton = document.getElementById("cloakButton");
            this.$paletteButtons = document.querySelectorAll(".paletteBtn");
            this.$libraryButtons = document.querySelectorAll(".lib-vibe-btn");
            this.$audioMixerList = document.getElementById("audio-mixer-list");
            this.$addAudioTrackBtn = document.getElementById("add-audio-track-btn");
            this.$pauseAllAudioBtn = document.getElementById("pause-all-audio-btn");
            this.$starredVibesList = document.getElementById("starred-vibes-list");
            this.$starVibeBtn = document.getElementById("star-vibe-btn");
            this.$promptField = document.getElementById("prompt-field");
        },

        setupInitialInteractivity() {
            // One physical click to clear systemic browser autoplay bans
            this.$awakenBtn.addEventListener("click", () => this.awakenChamber());
        },

        async awakenChamber() {
            if (this.isInitialized) return;
            
            // Instantiate Core Web Audio API Pipeline Infrastructure
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.gain.value = this.state.volume;

            this.filterNode = this.audioCtx.createBiquadFilter();
            this.filterNode.type = "lowpass";
            this.filterNode.frequency.value = this.state.filterFreq;

            // Connecting our Chamber Acoustic Signal Chain Matrix
            this.filterNode.connect(this.masterGain);
            this.masterGain.connect(this.audioCtx.destination);

            this.isInitialized = true;

            // Dissolve Entrance Portal
            this.$portal.classList.add("shattered");

            // Wake Visual Engine Loops
            this.bindMechanics();
            this.initParticlesEngine();
            
            // Auto-load Core Environment Array Without Stutter
            this.loadThematicEnvironment("dreamroot");
        },

        bindMechanics() {
            // Adjustments Interactivity
            this.$zoom.addEventListener("input", e => { this.state.zoom = parseFloat(e.target.value); this.applyVisualCalibration(); });
            this.$blur.addEventListener("input", e => { this.state.blur = parseFloat(e.target.value); this.applyVisualCalibration(); });
            this.$volume.addEventListener("input", e => { 
                this.state.volume = parseFloat(e.target.value); 
                if (this.masterGain) this.masterGain.gain.setValueAtTime(this.state.volume, this.audioCtx.currentTime);
            });
            this.$filter.addEventListener("input", e => {
                this.state.filterFreq = parseFloat(e.target.value);
                if (this.filterNode) this.filterNode.getFrequencyResponse ? this.filterNode.frequency.setValueAtTime(this.state.filterFreq, this.audioCtx.currentTime) : this.filterNode.frequency.value = this.state.filterFreq;
            });

            // Asset Manual Upload Channels
            this.$imageInput.addEventListener("change", e => this.executeLocalImageLoad(e));
            this.$soundInput.addEventListener("change", e => this.executeLocalAudioLoad(e));

            // Library Navigation Matrix
            this.$libraryButtons.forEach(btn => {
                btn.addEventListener("click", () => this.loadThematicEnvironment(btn.dataset.vibe));
            });

            // Palette Operations
            this.$paletteButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    this.state.palette = btn.dataset.mode;
                    document.body.className = this.state.palette;
                });
            });

            // Ironclad Non-Bubbling Cloak System Realization
            this.setupCloakEngine();

            // Scratchpad Execution
            this.$toggleScratchpad.addEventListener("click", () => this.$scratchpad.classList.toggle("hidden"));
            this.$scratchpadClose.addEventListener("click", () => this.$scratchpad.classList.add("hidden"));
            this.$scratchpad.addEventListener("click", e => { if (e.target === this.$scratchpad) this.$scratchpad.classList.add("hidden"); });

            // Particles Sliders Handlers
            this.$particleOpacity.addEventListener("input", e => this.state.particles.opacity = parseFloat(e.target.value));
            this.$particleSpeed.addEventListener("input", e => this.state.particles.speed = parseFloat(e.target.value));
            this.$particleDensity.addEventListener("input", e => {
                this.state.particles.density = parseInt(e.target.value, 10);
                this.generateParticlesArray();
            });
        },

        setupCloakEngine() {
            this._uncloakVaultHandler = (e) => {
                // Ensure internal operational clicks do not trigger structural bypass
                if (this.$sidebar.contains(e.target) || this.$scratchpad.contains(e.target)) return;

                document.body.classList.remove("cloaked");
                document.removeEventListener("click", this._uncloakVaultHandler);
            };

            this.$cloakButton.addEventListener("click", (e) => {
                e.stopPropagation(); // Stop click from bleeding into document detection layer instantly
                const isCloaked = document.body.classList.toggle("cloaked");

                if (isCloaked) {
                    document.addEventListener("click", this._uncloakVaultHandler);
                } else {
                    document.removeEventListener("click", this._uncloakVaultHandler);
                }
            });
        },

        async loadThematicEnvironment(vibeKey) {
            const data = IMMUTABLE_LIBRARY[vibeKey];
            if (!data) return;

            // Load Image Smoothly
            this.$image.classList.add("unloaded");
            this.$image.src = data.image;
            this.$image.onload = () => this.$image.classList.remove("unloaded");

            // Purge Running Native Audio Nodes
            this.state.audioTracks.forEach(t => { try { t.sourceNode.stop(); } catch(err){} });
            this.state.audioTracks = [];
            this.$audioMixerList.innerHTML = "";

            // Inject Stems Chain Spatially
            for (const stemUrl of data.stems) {
                await this.injectAudioStemNode(stemUrl);
            }
        },

        async injectAudioStemNode(url) {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

                const sourceNode = this.audioCtx.createBufferSource();
                sourceNode.buffer = audioBuffer;
                sourceNode.loop = true;

                const gainNode = this.audioCtx.createGain();
                gainNode.gain.value = 0.5; // Baseline track weight

                // Connect to processing block node
                sourceNode.connect(gainNode);
                gainNode.connect(this.filterNode);
                
                sourceNode.start(0);

                const trackId = "track_" + Date.now() + "_" + Math.floor(Math.random()*1000);
                this.state.audioTracks.push({ id: trackId, src: url, sourceNode, gainNode, volume: 0.5 });

                this.renderMixerRow(trackId, this.state.audioTracks.length);
            } catch (err) {
                console.error("Sensory stem injection failure:", err);
            }
        },

        renderMixerRow(trackId, index) {
            const track = this.state.audioTracks.find(t => t.id === trackId);
            if (!track) return;

            const row = document.createElement("div");
            row.className = "audio-track-row";

            const label = document.createElement("span");
            label.textContent = `Stem Node ${index}`;

            const slider = document.createElement("input");
            slider.type = "range";
            slider.min = "0";
            slider.max = "1";
            slider.step = "0.02";
            slider.value = track.volume;
            slider.addEventListener("input", e => {
                track.volume = parseFloat(e.target.value);
                track.gainNode.gain.setValueAtTime(track.volume, this.audioCtx.currentTime);
            });

            row.appendChild(label);
            row.appendChild(slider);
            this.$audioMixerList.appendChild(row);
        },

        executeLocalImageLoad(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                this.$image.classList.add("unloaded");
                this.$image.src = ev.target.result;
                this.$image.onload = () => this.$image.classList.remove("unloaded");
            };
            reader.readAsDataURL(file);
        },

        executeLocalAudioLoad(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (ev) => {
                await this.injectAudioStemNode(ev.target.result);
            };
            reader.readAsDataURL(file);
        },

        applyVisualCalibration() {
            this.$image.style.transform = `scale(${this.state.zoom})`;
            this.$image.style.filter = `blur(${this.state.blur}px)`;
        },

        /* --- THE SENSORY CANVAS: HIGH VELOCITY ENGINE --- */
        initParticlesEngine() {
            const resizeCanvas = () => {
                this.$particleCanvas.width = window.innerWidth;
                this.$particleCanvas.height = window.innerHeight;
                this.generateParticlesArray();
            };
            window.addEventListener("resize", resizeCanvas);
            resizeCanvas();

            const renderLoop = () => {
                this.ctx.clearRect(0, 0, this.$particleCanvas.width, this.$particleCanvas.height);
                
                this.particles.forEach(p => {
                    p.x += p.vx * this.state.particles.speed;
                    p.y += p.vy * this.state.particles.speed;

                    if (p.x < 0) p.x = this.$particleCanvas.width;
                    if (p.x > this.$particleCanvas.width) p.x = 0;
                    if (p.y < 0) p.y = this.$particleCanvas.height;
                    if (p.y > this.$particleCanvas.height) p.y = 0;

                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * this.state.particles.opacity})`;
                    this.ctx.fill();
                });

                requestAnimationFrame(renderLoop);
            };
            requestAnimationFrame(renderLoop);
        },

        generateParticlesArray() {
            this.particles = [];
            const density = this.state.particles.density;
            for (let i = 0; i < density; i++) {
                this.particles.push({
                    x: Math.random() * this.$particleCanvas.width,
                    y: Math.random() * this.$particleCanvas.height,
                    radius: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    alpha: Math.random() * 0.5 + 0.5
                });
            }
        }
    };

    document.addEventListener("DOMContentLoaded", () => Engine.init());
})();
