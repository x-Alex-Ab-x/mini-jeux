window.addEventListener("DOMContentLoaded", () => {
const music = document.getElementById("bg-music");
const btn = document.getElementById("btn-music");

// Volume par défaut (entre 0.0 et 1.0)
  music.volume = 0.1; // (tu peux mettre 0.1, 0.15, 0.25...)

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
