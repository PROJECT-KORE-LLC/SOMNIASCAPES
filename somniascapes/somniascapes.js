// ===============================
// IMAGE UPLOAD
// ===============================
const imageInput = document.getElementById("imageUpload");
const vibeImage = document.getElementById("vibe-image");

imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        vibeImage.src = e.target.result;
        vibeImage.style.opacity = 1;
    };
    reader.readAsDataURL(file);
});

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://wbhdubxzliqqjgycexkf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaGR1Ynh6bGlxcWpneWNleGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDI2MTIsImV4cCI6MjA5NTE3ODYxMn0.TZfnQvs8JTtigPpyJkJllNQ7DlTtK15pjlV8XY7Jrh4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaGR1Ynh6bGlxcWpneWNleGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDI2MTIsImV4cCI6MjA5NTE3ODYxMn0.TZfnQvs8JTtigPpyJkJllNQ7DlTtK15pjlV8XY7Jrh4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ===============================
// SOUND UPLOAD
// ===============================
const soundInput = document.getElementById("soundUpload");
const vibeAudio = document.getElementById("vibe-audio");

soundInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        vibeAudio.src = e.target.result;
        vibeAudio.play().catch(() => {
            console.log("User interaction required before audio can play.");
        });
    };
    reader.readAsDataURL(file);
});

// ===============================
// SCRATCHPAD
// ===============================
const scratchpad = document.getElementById("scratchpad");
const toggleScratchpad = document.getElementById("toggleScratchpad");

toggleScratchpad.addEventListener("click", () => {
    scratchpad.classList.toggle("hidden");
});

// ===============================
// PARTICLE SHIMMER
// ===============================
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
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

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const baseColor = getComputedStyle(document.body).getPropertyValue("--particle-color");

    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = baseColor.replace("0.55", p.opacity.toString());
        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===============================
// RANDOM DRIFT
// ===============================
let driftX = 0, driftY = 0;
let targetX = 0, targetY = 0;

function updateDriftTargets() {
    targetX = (Math.random() - 0.5) * 10;
    targetY = (Math.random() - 0.5) * 10;
    setTimeout(updateDriftTargets, 8000 + Math.random() * 7000);
}
updateDriftTargets();

function animateDrift() {
    driftX += (targetX - driftX) * 0.01;
    driftY += (targetY - driftY) * 0.01;

    const breathScale = 1 + 0.03 * Math.sin(Date.now() / 6000);

    vibeImage.style.transform = `translate(${driftX}px, ${driftY}px) scale(${breathScale})`;

    requestAnimationFrame(animateDrift);
}
animateDrift();

// ===============================
// UI AUTO-HIDE
// ===============================
const controls = document.getElementById("controls");
let hideTimeout;

function showControls() {
    controls.classList.remove("hidden-controls");

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        controls.classList.add("hidden-controls");
    }, 3000);
}

document.addEventListener("mousemove", showControls);
document.addEventListener("touchstart", showControls);

hideTimeout = setTimeout(() => {
    controls.classList.add("hidden-controls");
}, 3000);

// ===============================
// CASTING
// ===============================
const castButton = document.getElementById("castButton");

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

// ===============================
// PALETTE MODES
// ===============================
const paletteButtons = document.querySelectorAll(".paletteBtn");

paletteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        document.body.classList.remove("noir", "lunar", "vellum", "amethyst");
        document.body.classList.add(mode);
    });
});

// ===============================
// AMBIENT BLUR PULSE
// ===============================
const blurPulse = document.getElementById("blurPulse");

let blurTarget = 0;
let currentBlur = 0;

function updateBlurTarget() {
    blurTarget = Math.random() * 4;
    setTimeout(updateBlurTarget, 6000 + Math.random() * 6000);
}
updateBlurTarget();

function animateBlurPulse() {
    currentBlur += (blurTarget - currentBlur) * 0.02;
    blurPulse.style.backdropFilter = `blur(${currentBlur}px)`;
    requestAnimationFrame(animateBlurPulse);
}
animateBlurPulse();
