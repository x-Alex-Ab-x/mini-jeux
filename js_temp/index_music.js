window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-music");
    const audio = document.getElementById("bg-music");

    let playing = false;

    btn.addEventListener("click", () => {
        if (!playing) {
            audio.play()
                .then(() => {
                    playing = true;
                    btn.textContent = "⏸️ Mettre la musique en pause";
                })
                .catch((error) => {
                    console.error("La lecture automatique a échoué :", error);
                });
        } else {
            audio.pause();
            playing = false;
            btn.textContent = "🎵 Rejouer la musique";
        }
    });
});