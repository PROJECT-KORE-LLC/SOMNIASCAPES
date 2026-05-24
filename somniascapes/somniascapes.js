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
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

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
