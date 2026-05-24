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

    reader.readAsDataURL(file);
});
