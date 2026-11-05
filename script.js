// ======================================
// 1. VARIABLES
// ======================================

let numeroCorrecte;
let paraulaCorrecta;
let lletresCorrectes;


// ======================================
// 2. NORMALITZAR PARAULES
// ======================================

function normalitzar(text) {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z]/g, "");

}


// ======================================
// 3. COMPROVAR L'ORDRE DE LES LLETRES
// ======================================

function conteLletres(paraula, lletres) {

    let posicio = 0;

    for (let i = 0; i < paraula.length; i++) {

        if (paraula[i] === lletres[posicio]) {
            posicio++;
        }

        if (posicio === lletres.length) {
            return true;
        }

    }

    return false;

}


// ======================================
// 4. CARREGAR DICCIONARI
// ======================================

async function carregarDiccionari() {

    const estat = document.getElementById("estatDiccionari");

    try {

        estat.textContent = "Carregant diccionari català...";

        const resposta = await fetch("./diccionari/ca_ES.dic");

        if (!resposta.ok) {
            throw new Error("No s'ha trobat ca_ES.dic");
        }

        const text = await resposta.text();

        window.diccionariSet = new Set(
            text
                .split("\n")
                .slice(1)
                .map(linia => linia.split("/")[0].trim())
                .map(paraula => normalitzar(paraula))
                .filter(Boolean)
        );

        window.diccionari = Array.from(
            window.diccionariSet
        );

        estat.textContent =
            `✓ Diccionari carregat (${window.diccionari.length} paraules)`;

        estat.style.color = "#62d6a5";

        document.getElementById("botoComprovar").disabled = false;

        novaPartida();

    } catch (error) {

        estat.textContent =
            "Error carregant el diccionari";

        estat.style.color = "#ff7777";

        console.error(error);

    }

}


// ======================================
// 5. GENERAR NOVA PARTIDA
// ======================================

function novaPartida() {

    document.getElementById("victoria").classList.add("amagat");

    document.getElementById("missatge").textContent = "";

    document.getElementById("respostaNumero").value = "";
    document.getElementById("respostaParaula").value = "";

    paraulaCorrecta =
        window.diccionari[
            Math.floor(
                Math.random() *
                window.diccionari.length
            )
        ];

    let paraulaNormalitzada =
        normalitzar(paraulaCorrecta);

    if (paraulaNormalitzada.length < 3) {
        novaPartida();
        return;
    }

    let posicions = [];

    while (posicions.length < 3) {

        let posicio =
            Math.floor(
                Math.random() *
                paraulaNormalitzada.length
            );

        if (!posicions.includes(posicio)) {
            posicions.push(posicio);
        }

    }

    posicions.sort((a, b) => a - b);

    lletresCorrectes =
        posicions.map(
            posicio =>
                paraulaNormalitzada[posicio]
        );

    let a = Math.floor(Math.random() * 9) + 1;
    let b = Math.floor(Math.random() * 9) + 1;
    let c = Math.floor(Math.random() * 9) + 1;
    let d = Math.floor(Math.random() * 9) + 1;

    numeroCorrecte =
        a * b + c - d;

    document.getElementById(
        "matricula"
    ).textContent =
        `${a}${b}${c}${d} - ${lletresCorrectes.join("").toUpperCase()}`;

    document.getElementById(
        "operacio"
    ).textContent =
        `${a} × ${b} + ${c} - ${d}`;

    document.getElementById(
        "lletres"
    ).textContent =
        lletresCorrectes
            .join(" - ")
            .toUpperCase();

}


// ======================================
// 6. COMPROVAR RESPOSTES
// ======================================

function comprovarResposta() {

    let numeroText =
        document.getElementById(
            "respostaNumero"
        ).value;

    let numeroUsuari =
        Number(numeroText);

    let paraulaOriginal =
        document.getElementById(
            "respostaParaula"
        )
        .value
        .trim();

    let paraulaNormalitzada =
        normalitzar(
            paraulaOriginal
        );

    let paraulaValida =
        paraulaOriginal.length > 0 &&
        window.diccionariSet.has(
            paraulaNormalitzada
        ) &&
        conteLletres(
            paraulaNormalitzada,
            lletresCorrectes
        );

    let numeroValid =
        numeroText !== "" &&
        numeroUsuari === numeroCorrecte;

    if (
        numeroValid &&
        paraulaValida
    ) {

        guanyar(
            paraulaOriginal
        );

    } else if (
        !numeroValid &&
        !paraulaValida
    ) {

        document.getElementById(
            "missatge"
        ).textContent =
            "Encara no! Revisa el resultat i la paraula.";

    } else if (
        !numeroValid
    ) {

        document.getElementById(
            "missatge"
        ).textContent =
            "La paraula és correcta però l'operació no.";

    } else {

        document.getElementById(
            "missatge"
        ).textContent =
            "L'operació és correcta però la paraula no existeix al diccionari.";

    }

}


// ======================================
// 7. GUANYAR
// ======================================

function guanyar(
    paraula
) {

    let ara =
        new Date();

    let hora =
        ara.toLocaleTimeString(
            "ca-ES",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    document.getElementById(
        "paraulaGuanyadora"
    ).textContent =
        "La paraula era: " +
        paraula.toUpperCase();

    document.getElementById(
        "horaVictoria"
    ).textContent =
        `Perfecte! L'has trobat a les ${hora}.`;

    document.getElementById(
        "missatge"
    ).textContent = "";

    document.getElementById(
        "victoria"
    ).classList.remove(
        "amagat"
    );

}


// ======================================
// 8. BOTONS
// ======================================

document
    .getElementById(
        "botoComprovar"
    )
    .addEventListener(
        "click",
        comprovarResposta
    );

document
    .getElementById(
        "botoNovaPartida"
    )
    .addEventListener(
        "click",
        novaPartida
    );

document
    .getElementById(
        "respostaParaula"
    )
    .addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                comprovarResposta();

            }

        }
    );


// ======================================
// 9. INICIAR
// ======================================

carregarDiccionari();
