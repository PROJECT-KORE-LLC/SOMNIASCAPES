// IMAGE UPLOAD LOGIC
const imageInput = document.getElementById("imageUpload");
const vibeImage = document.getElementById("vibe-image");

imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        vibeImage.src = e.target.result;
        vibeImage.style.opacity = 1; // fade in if you want
    };

    reader.readAsDataURL(file);
});

// SOUND UPLOAD LOGIC
const soundInput = document.getElementById("soundUpload");
const vibeAudio = document.getElementById("vibe-audio");

soundInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        vibeAudio.src = e.target.result;
        vibeAudio.play().catch(() => {
            console.log("User interaction required before audio can play.");
        });
    };

    // SCRATCHPAD TOGGLE LOGIC
const scratchpad = document.getElementById("scratchpad");
const toggleScratchpad = document.getElementById("toggleScratchpad");

toggleScratchpad.addEventListener("click", () => {
    scratchpad.classList.toggle("hidden");
});

    // PARTICLE SHIMMER
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create particles
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

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const baseColor = getComputedStyle(document.body).getPropertyValue("--particle-color");
ctx.fillStyle = baseColor.replace("0.55", p.opacity.toString());

        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// RANDOM DRIFT ANIMATION
let driftX = 0;
let driftY = 0;
let targetX = 0;
let targetY = 0;

function updateDriftTargets() {
    // Pick a new random drift target every 8–15 seconds
    targetX = (Math.random() - 0.5) * 10; // range: -5 to +5 px
    targetY = (Math.random() - 0.5) * 10;

    setTimeout(updateDriftTargets, 8000 + Math.random() * 7000);
}

updateDriftTargets();

function animateDrift() {
    // Ease toward target
    driftX += (targetX - driftX) * 0.01;
    driftY += (targetY - driftY) * 0.01;

    // Combine drift with breathing scale
    const breathScale = 1 + 0.03 * Math.sin(Date.now() / 6000);

    vibeImage.style.transform = `translate(${driftX}px, ${driftY}px) scale(${breathScale})`;

    requestAnimationFrame(animateDrift);
}

animateDrift();

    
    // UI AUTO-HIDE
const controls = document.getElementById("controls");
let hideTimeout;

// Show controls
function showControls() {
    controls.classList.remove("hidden-controls");

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        controls.classList.add("hidden-controls");
    }, 3000); // 3 seconds of inactivity
}

// Trigger show on any mouse movement or tap
document.addEventListener("mousemove", showControls);
document.addEventListener("touchstart", showControls);

// Start hidden after initial load
hideTimeout = setTimeout(() => {
    controls.classList.add("hidden-controls");
}, 3000);

    reader.readAsDataURL(file);
});

// CAST TO TV
const castButton = document.getElementById("castButton");

castButton.addEventListener("click", async () => {
    if (navigator.presentation && navigator.presentation.requestSession) {
        try {
            await navigator.presentation.requestSession();
        } catch (err) {
            console.log("Presentation API error:", err);
        }
    } else if (window.chrome && chrome.cast) {
        // Chrome Cast fallback
        try {
            chrome.cast.requestSession();
        } catch (err) {
            console.log("Chrome Cast error:", err);
        }
    } else {
        alert("Casting is not supported in this browser.");
    }
});

// EXPORT PRESET TO FILE
const exportBtn = document.getElementById("exportPreset");

exportBtn.addEventListener("click", () => {
    const preset = {
        image: vibeImage.src || null,
        sound: vibeAudio.src || null
    };

    const blob = new Blob([JSON.stringify(preset)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "somnia-preset.somnia";
    a.click();

    URL.revokeObjectURL(url);
});

// IMPORT PRESET FROM FILE
const importBtn = document.getElementById("importPreset");

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
                vibeImage.src = preset.image;
                vibeImage.style.opacity = 1;
            }

            if (preset.sound) {
                vibeAudio.src = preset.sound;
                vibeAudio.play().catch(() => {});
            }
        };

        reader.readAsText(file);
    };

    input.click();
});

// PALETTE MODES
const paletteButtons = document.querySelectorAll(".paletteBtn");

paletteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;

        document.body.classList.remove("noir", "lunar", "vellum", "amethyst");
        document.body.classList.add(mode);
    });
});
