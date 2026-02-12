(() => {
let gameOver = false;

let mysteryColors = [];
let playerColors = ["blue", "blue", "blue"];
let attempts = 5;

function getRandomColor() {
    const colors = ["blue", "red", "yellow"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateMysteryColors() {
    for (let i = 0; i < 3; i++) {
    mysteryColors[i] = getRandomColor();
    }
}

function changeColor(tokenNumber) {
    if (gameOver) return; // bloque si partie finie

    const token = document.getElementById(`token${tokenNumber}`);
    const currentColor = playerColors[tokenNumber - 1];
    const newColor =
    currentColor === "blue" ? "red" :
    currentColor === "red" ? "yellow" :
    "blue";

    token.style.backgroundColor = newColor;
    playerColors[tokenNumber - 1] = newColor;
}

function revealMysteryColors() {
    for (let i = 0; i < 3; i++) {
    const mysteryToken = document.getElementById(`mystery${i + 1}`);
    mysteryToken.style.backgroundColor = mysteryColors[i];
    mysteryToken.classList.add("reveal");
    mysteryToken.innerText = "";
    }
}

function checkColors() {
    if (gameOver) return;
    if (attempts <= 0) return;

    let correctCount = 0;
    for (let i = 0; i < 3; i++) {
    if (playerColors[i] === mysteryColors[i]) correctCount++;
    }

    document.getElementById("correct-count").innerText = correctCount;

    if (correctCount === 3) {
    document.getElementById("message").innerText = "🎉 Félicitations ! Vous avez gagné !";
    revealMysteryColors();
      gameOver = true; // fin de partie
    return;
    }

    attempts--;
    document.getElementById("attempts-count").innerText = attempts;

    if (attempts === 0) {
    document.getElementById("message").innerText = "❌ Vous avez perdu. Essayez encore.";
    revealMysteryColors();
      gameOver = true; // fin de partie
    }
}

function newGame() {
    attempts = 5;
    gameOver = false; // réactive le jeu

    document.getElementById("attempts-count").innerText = attempts;
    document.getElementById("correct-count").innerText = "-";
    document.getElementById("message").innerText = "";

    mysteryColors = [];
    playerColors = ["blue", "blue", "blue"];

    for (let i = 1; i <= 3; i++) {
    const playerToken = document.getElementById(`token${i}`);
    playerToken.style.backgroundColor = "blue";

    const mysteryToken = document.getElementById(`mystery${i}`);
    mysteryToken.style.backgroundColor = "black";
    mysteryToken.innerText = "?";
    mysteryToken.classList.remove("reveal");
    }

    generateMysteryColors();
}

document.addEventListener("DOMContentLoaded", () => {
    // ✅ listeners UNE SEULE FOIS
    document.getElementById("token1").addEventListener("click", () => changeColor(1));
    document.getElementById("token2").addEventListener("click", () => changeColor(2));
    document.getElementById("token3").addEventListener("click", () => changeColor(3));

    // Si tes boutons HTML utilisent onclick="checkColors()" et onclick="newGame()"
    // on les expose quand même :
    window.checkColors = checkColors;
    window.newGame = newGame;

    newGame();
});
})();

