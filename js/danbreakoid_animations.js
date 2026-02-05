document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("start-btn");

    button.style.display = "inline-block";

    anime({
    targets: "#start-btn",
    scale: [1, 1.2],
    duration: 500,
    easing: "easeInOutQuad",
    direction: "alternate",
    loop: true
    });
});

document.getElementById("start-btn").addEventListener("click", () => {
    const splashScreen = document.getElementById("splash-screen");
    const loadingScreen = document.getElementById("loading-screen");
    const progressFill = document.getElementById("progress-fill");

    splashScreen.style.display = "none";
    loadingScreen.style.display = "flex";

    let progress = 0;
    const interval = setInterval(() => {
    progress += 25;
    progressFill.style.width = progress + "%";

    if (progress >= 100) {
        clearInterval(interval);
        loadingScreen.style.display = "none";

        const gameWrapper = document.getElementById("game-wrapper");
        gameWrapper.style.display = "block";
        gameWrapper.classList.add("fade-in");

        startGame();
    }
    }, 1000);
});

function startGame() {
    createBricks();
    resetBallAndPaddle();
    draw();
}

function showVictoryAnimation() {
    const overlay = document.getElementById("overlay");

    overlay.innerHTML = `
    <div style="text-align:center;">
        <img src="/Users/Alexa/OneDrive/Desktop/Mini-Jeux/Images/DanBreakoid_images/succes.png" alt="Victoire" style="max-width: 200px; margin: 0 auto 10px;">
        <div>🎉 BRAVO! Niveau réussi 🎉</div>
    </div>
    `;
    overlay.style.display = "flex";
    overlay.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
    overlay.style.animation = "fadeInOut 5s ease-in-out";

    setTimeout(() => {
    overlay.style.display = "none";

    level++;
    if (level > 3) level = 1;

    document.body.style.background = `url('/Users/Alexa/OneDrive/Desktop/Mini-Jeux/Images/DanBreakoid_images/bg_niveau${level}.png') no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";

    createBricks();
    resetBallAndPaddle();
    isVictory = false;
    draw();
    }, 5000);
}

function showGameOverAnimation() {
    const overlay = document.getElementById("overlay");

    overlay.innerHTML = `
    <div style="text-align:center;">
        <img src="/Users/Alexa/OneDrive/Desktop/Mini-Jeux/Images/DanBreakoid_images/redeyes.png" alt="Perdu" style="max-width: 180px; margin:0 auto 10px;">
        <img src="/Users/Alexa/OneDrive/Desktop/Mini-Jeux/Images/DanBreakoid_images/rire.png" alt="Rire" style="max-width: 100px; margin:0 auto 10px;">
        <div>☠ GAME OVER ☠</div>
        <button id="retry-btn" style="
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 18px;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
        ">REJOUER</button>
    </div>
    `;

    overlay.style.display = "flex";
    overlay.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
    overlay.style.animation = "fadeInOut 5s ease-in-out";

    setTimeout(() => {
        document.getElementById("retry-btn").addEventListener("click", () => {
            overlay.style.display = "none";
            score = 0;
            lives = 3;
            isGameOver = false;
            level = 1;
            createBricks();
            resetBallAndPaddle();
            draw();
        });
    }, 5000);
}