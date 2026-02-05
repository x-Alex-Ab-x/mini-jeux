let Tableau = [];
let partieEnCours = false;
let tourJoueur1 = true;
let coups = 0;
const INTERVALLE_ERREUR = 500;

window.onload = function () {
    document.getElementById("terminerPartie").disabled = true;
};

function debuterPartie() {
    if (validernom()) {
        document.getElementById("debuterPartie").disabled = true;
        document.getElementById("terminerPartie").disabled = false;
        document.getElementById("txtJoueur1").disabled = true;
        document.getElementById("txtJoueur2").disabled = true;

        for (let cnt = 1; cnt <= 9; cnt++) {
            const cellule = document.getElementById("cellule" + cnt);
            cellule.className = "";
            cellule.innerHTML = "";
        }

        document.getElementById("resultat").innerHTML = "";

        Tableau = [];
        partieEnCours = true;
        tourJoueur1 = true;
        coups = 0;
        preparerTourJoueur();
    }
}

function validernom() {
    const joueur1 = document.getElementById("txtJoueur1");
    const joueur2 = document.getElementById("txtJoueur2");
    const span1 = document.getElementById("joueur1");
    const span2 = document.getElementById("joueur2");

    span1.innerText = "";
    span2.innerText = "";

    if (joueur1.value.trim() === "") {
        span1.innerText = "Saisir le nom du premier joueur.";
        return false;
    }

    if (joueur2.value.trim() === "") {
        span2.innerText = "Saisir le nom du deuxième joueur.";
        return false;
    }

    if (joueur1.value.trim().toLowerCase() === joueur2.value.trim().toLowerCase()) {
        span2.innerText = "Les deux joueurs ne peuvent pas avoir le même nom.";
        return false;
    }

    return true;
}

function preparerTourJoueur() {
    const joueur1 = document.getElementById("txtJoueur1");
    const joueur2 = document.getElementById("txtJoueur2");

    joueur1.className = tourJoueur1 ? "joueurActif" : "";
    joueur2.className = !tourJoueur1 ? "joueurActif" : "";
}

function validerClicCellule(numero) {
    if (partieEnCours) {
        const cellule = document.getElementById("cellule" + numero);

        if (cellule.innerHTML !== "") {
            cellule.className = "celluleinvalide";
            setTimeout(() => {
                cellule.className = "";
            }, INTERVALLE_ERREUR);
        } else {
            cellule.innerHTML = tourJoueur1 ? "X" : "O";
            cellule.style.fontSize = "50px";
            cellule.style.color = tourJoueur1 ? "navy" : "orange";

            enregistrerInfos(numero);
            coups++;
            verifierGagnant();
            tourJoueur1 = !tourJoueur1;
            preparerTourJoueur();
        }
    }
}

function enregistrerInfos(numero) {
    Tableau[numero] = tourJoueur1 ? "X" : "O";
}

function verifierGagnant() {
    if (coups > 4) {
        const combinaisons = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9],
            [1, 5, 9], [3, 5, 7]
        ];

        for (const [a, b, c] of combinaisons) {
            if (Tableau[a] === Tableau[b] && Tableau[a] === Tableau[c] && Tableau[a]) {
                identifierGagnant(a, b, c);
                return;
            }
        }

        if (coups === 9) {
            document.getElementById("resultat").innerText = "Partie nulle !";
            terminerPartie();
        }
    }
}

function identifierGagnant(a, b, c) {
    [a, b, c].forEach(num => {
        document.getElementById("cellule" + num).className = "cellulegagnante";
    });

    const gagnant = tourJoueur1 ? document.getElementById("txtJoueur1").value : document.getElementById("txtJoueur2").value;
    document.getElementById("resultat").innerText = `${gagnant} a gagné la partie !`;
    terminerPartie();
}

function terminerPartie() {
    document.getElementById("txtJoueur1").disabled = false;
    document.getElementById("txtJoueur2").disabled = false;
    document.getElementById("txtJoueur1").className = "";
    document.getElementById("txtJoueur2").className = "";

    document.getElementById("debuterPartie").disabled = false;
    document.getElementById("terminerPartie").disabled = true;

    partieEnCours = false;
}