let operateur = "";

function determinerOperation(op) {
    operateur = op;
}

function effectuerOperation() {
    const op1 = document.getElementById("nombre1").value.trim();
    const op2 = document.getElementById("nombre2").value.trim();

    const erreur1 = document.getElementById("erreur1");
    const erreur2 = document.getElementById("erreur2");
    const resultat = document.getElementById("resultat");

    // Réinitialisation des messages
    erreur1.textContent = "";
    erreur2.textContent = "";
    resultat.textContent = "";

    if (!operateur) {
        resultat.textContent = "Vous devez sélectionner une opération.";
        return;
    }

    let nombre1 = parseFloat(op1);
    let nombre2 = parseFloat(op2);

    let erreurs = false;

    if (isNaN(nombre1)) {
        erreur1.textContent = "Entrez un nombre valide.";
        erreurs = true;
    }

    if (isNaN(nombre2)) {
        erreur2.textContent = "Entrez un nombre valide.";
        erreurs = true;
    }

    if (erreurs) return;

    faireOperation(nombre1, nombre2);
}

function faireOperation(nombre1, nombre2) {
    const message = document.getElementById("resultat");
    let resultat;

    switch (operateur) {
        case "addition":
            resultat = nombre1 + nombre2;
            message.textContent = `${nombre1} + ${nombre2} = ${resultat.toFixed(2)}`;
            break;
        case "soustraction":
            resultat = nombre1 - nombre2;
            message.textContent = `${nombre1} - ${nombre2} = ${resultat.toFixed(2)}`;
            break;
        case "multiplication":
            resultat = nombre1 * nombre2;
            message.textContent = `${nombre1} × ${nombre2} = ${resultat.toFixed(2)}`;
            break;
        case "division":
            if (nombre2 !== 0) {
                resultat = nombre1 / nombre2;
                message.textContent = `${nombre1} ÷ ${nombre2} = ${resultat.toFixed(2)}`;
            } else {
                message.textContent = "Division par zéro impossible.";
            }
            break;
        default:
            message.textContent = "Opération inconnue.";
    }
}