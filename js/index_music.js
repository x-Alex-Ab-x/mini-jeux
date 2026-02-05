window.addEventListener("DOMContentLoaded", () => {
const music = document.getElementById("bg-music");
const btn = document.getElementById("btn-music");

btn.addEventListener("click", () => {
    if (music.paused) {
    music.play();
    btn.textContent = "⏸️ Pause musique";
    } else {
    music.pause();
    btn.textContent = "🎵 Lancer la musique";
    }
});
});
