(() => {
  const choices = ["roche", "papier", "ciseau"];

  const imgMap = {
    roche: "../images/rpc/roche.png",
    papier: "../images/rpc/papier.png",
    ciseau: "../images/rpc/ciseau.png",
    o_roche: "../images/rpc/o_roche.png",
    o_papier: "../images/rpc/o_papier.png",
    o_ciseau: "../images/rpc/o_ciseau.png"
  };

  const scoreKey = "rpc_score_v1";

  const $Jscore = document.getElementById("Jscore");
  const $Oscore = document.getElementById("Oscore");
  const $Jimg = document.getElementById("Jimage");
  const $Oimg = document.getElementById("Oimage");
  const $msg = document.getElementById("Message");
  const $reset = document.getElementById("reset");

  // Charger score sauvegardé
  const saved = JSON.parse(localStorage.getItem(scoreKey) || '{"j":0,"o":0}');
  let jPoint = saved.j ?? 0;
  let oPoint = saved.o ?? 0;
  updateScore();

  // Click boutons
  document.querySelectorAll(".btn[data-choice]").forEach(btn => {
    btn.addEventListener("click", () => playRound(btn.dataset.choice));
  });

  // Reset
  $reset.addEventListener("click", () => {
    jPoint = 0;
    oPoint = 0;
    saveScore();
    updateScore();
    $msg.textContent = "Score remis à zéro ✅";
  });

  // Raccourcis clavier (R, P, C)
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "r") playRound("roche");
    if (k === "p") playRound("papier");
    if (k === "c") playRound("ciseau");
  });

  function playRound(playerChoice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    // Images
    $Jimg.src = imgMap[playerChoice];
    $Oimg.src = imgMap[`o_${computerChoice}`];

    pulse($Jimg);
    pulse($Oimg);

    // Résultat
    const result = getResult(playerChoice, computerChoice);

    if (result === "draw") {
      jPoint += 1;
      oPoint += 1;
      $msg.textContent = "🤝 Partie nulle ! (+1 chacun)";
    } else if (result === "win") {
      jPoint += 1;
      $msg.textContent = "🎉 Tu as gagné ! (+1 joueur)";
    } else {
      oPoint += 1;
      $msg.textContent = "😅 Tu as perdu ! (+1 ordinateur)";
    }

    saveScore();
    updateScore();
  }

  function getResult(j, o) {
    if (j === o) return "draw";
    // règles : roche > ciseau, ciseau > papier, papier > roche
    if (
      (j === "roche" && o === "ciseau") ||
      (j === "ciseau" && o === "papier") ||
      (j === "papier" && o === "roche")
    ) return "win";
    return "lose";
  }

  function updateScore() {
    $Jscore.textContent = String(jPoint);
    $Oscore.textContent = String(oPoint);
  }

  function saveScore() {
    localStorage.setItem(scoreKey, JSON.stringify({ j: jPoint, o: oPoint }));
  }

  function pulse(imgEl) {
    imgEl.classList.remove("pulse");
    // reflow trick
    void imgEl.offsetWidth;
    imgEl.classList.add("pulse");
  }
})();
