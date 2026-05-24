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

