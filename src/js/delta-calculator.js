import { ciede2000, updateColorSample } from './helpers.js';

export function updateDeltaCalcPreview(type) {
    let l, a, b, previewId;
    const domElements = {
        ref: {
            l: document.getElementById("refl"),
            a: document.getElementById("refa"),
            b: document.getElementById("refb"),
            preview: document.getElementById("ref-preview")
        },
        sample: {
            l: document.getElementById("samplel"),
            a: document.getElementById("samplea"),
            b: document.getElementById("sampleb"),
            preview: document.getElementById("sample-preview")
        }
    };

    const elements = domElements[type];
    if (!elements) return;

    l = parseFloat(elements.l.value) || 0;
    a = parseFloat(elements.a.value) || 0;
    b = parseFloat(elements.b.value) || 0;

    updateColorSample(elements.preview, l, a, b);
}

export function calculateDeltaE() {
    const refL = parseFloat(document.getElementById("refl").value);
    const refA = parseFloat(document.getElementById("refa").value);
    const refB = parseFloat(document.getElementById("refb").value);
    const sampleL = parseFloat(document.getElementById("samplel").value);
    const sampleA = parseFloat(document.getElementById("samplea").value);
    const sampleB = parseFloat(document.getElementById("sampleb").value);
    const resultDiv = document.getElementById("deltaeresult");

    if (isNaN(refL) || isNaN(refA) || isNaN(refB) || isNaN(sampleL) || isNaN(sampleA) || isNaN(sampleB) || refL < 0 || refL > 100 || sampleL < 0 || sampleL > 100) {
        resultDiv.textContent = "Valores L, a, b inválidos.";
        resultDiv.style.color = "var(--danger)";
        return;
    }

    const deltae = ciede2000(refL, refA, refB, sampleL, sampleA, sampleB);
    resultDiv.textContent = `Delta E (CIEDE2000): ${deltae.toFixed(2)}`;
    resultDiv.style.color = "var(--text-dark)";
}

export function findBestMatches(productsdb, inputColor) {
    const l1 = parseFloat(inputColor.l);
    const a1 = parseFloat(inputColor.a);
    const b1 = parseFloat(inputColor.b);
    const resultsDiv = document.getElementById("bestmatches");
    resultsDiv.innerHTML = "";

    if (isNaN(l1) || isNaN(a1) || isNaN(b1) || l1 < 0 || l1 > 100) {
        alert("Valores L, a, b de entrada inválidos.");
        return;
    }

    if (!productsdb || productsdb.length === 0) {
        alert("Base de dados de produtos não carregada.");
        return;
    }

    const matches = productsdb
        .map(color => ({
            color,
            deltae: ciede2000(l1, a1, b1, color.l, color.a, color.b)
        }))
        .sort((a, b) => a.deltae - b.deltae);

    if (matches.length === 0) {
        resultsDiv.innerHTML = "Nenhuma correspondência encontrada.";
        return;
    }

    matches.forEach(match => {
        const matchDiv = document.createElement("div");
        matchDiv.classList.add("match");
        matchDiv.dataset.deltaeGood = match.deltae <= 2;
        matchDiv.innerHTML = `
            <span>${match.color.name} (ΔE = ${match.deltae.toFixed(2)})</span>
            <div class="color-sample" style="background-color: lab(${match.color.l}% ${match.color.a} ${match.color.b});"></div>
        `;
        resultsDiv.appendChild(matchDiv);
    });
}
