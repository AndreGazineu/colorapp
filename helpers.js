export function ciede2000(l1, a1, b1, l2, a2, b2) {
    const pi = Math.PI;
    const rad2deg = 180 / pi;
    const deg2rad = pi / 180;

    const c1 = Math.sqrt(a1 * a1 + b1 * b1);
    const c2 = Math.sqrt(a2 * a2 + b2 * b2);
    const c1c2 = (c1 + c2) / 2.0;
    const c1c2pow7 = Math.pow(c1c2, 7);
    const g = 0.5 * (1.0 - Math.sqrt(c1c2pow7 / (c1c2pow7 + Math.pow(25, 7))));

    const a1p = (1.0 + g) * a1;
    const a2p = (1.0 + g) * a2;

    const c1p = Math.sqrt(a1p * a1p + b1 * b1);
    const c2p = Math.sqrt(a2p * a2p + b2 * b2);

    let h1p = Math.atan2(b1, a1p);
    if (h1p < 0) h1p += 2 * pi;
    h1p *= rad2deg;

    let h2p = Math.atan2(b2, a2p);
    if (h2p < 0) h2p += 2 * pi;
    h2p *= rad2deg;

    const dlp = l2 - l1;
    const dcp = c2p - c1p;

    let dhp = 0;
    if (c1p * c2p !== 0) {
        dhp = h2p - h1p;
        if (dhp > 180) dhp -= 360;
        else if (dhp < -180) dhp += 360;
    }

    const dhp2 = 2.0 * Math.sqrt(c1p * c2p) * Math.sin((dhp * deg2rad) / 2.0);

    const lpmean = (l1 + l2) / 2.0;
    const cpmean = (c1p + c2p) / 2.0;

    let hmean = 0;
    if (c1p * c2p !== 0) {
        hmean = (h1p + h2p) / 2.0;
        if (Math.abs(h1p - h2p) > 180) hmean += 180;
        if (hmean > 360) hmean -= 360;
    }

    const t = 1 - 0.17 * Math.cos((hmean - 30) * deg2rad) + 0.24 * Math.cos((2 * hmean) * deg2rad) + 0.32 * Math.cos((3 * hmean + 6) * deg2rad) - 0.20 * Math.cos((4 * hmean - 63) * deg2rad);
    const lpmean_minus_50squared = (lpmean - 50) * (lpmean - 50);
    const sl = 1 + (0.015 * lpmean_minus_50squared) / Math.sqrt(20 + lpmean_minus_50squared);
    const sc = 1 + 0.045 * cpmean;
    const sh = 1 + 0.015 * cpmean * t;
    const dtheta = 30 * Math.exp(-Math.pow((hmean - 275) / 25, 2));
    const cpmeanPow7 = Math.pow(cpmean, 7);
    const rc = 2 * Math.sqrt(cpmeanPow7 / (cpmeanPow7 + Math.pow(25, 7)));
    const rt = -rc * Math.sin(2 * dtheta * deg2rad);

    const kl = 1, kc = 1, kh = 1;
    const dlpsl = dlp / (kl * sl);
    const dcpsc = dcp / (kc * sc);
    const dhpsh = dhp2 / (kh * sh);

    return Math.sqrt(dlpsl * dlpsl + dcpsc * dcpsc + dhpsh * dhpsh + rt * dcpsc * dhpsh);
}

export function updateColorSample(element, l, a, b) {
    if (!element) return;
    const lVal = Math.max(0, Math.min(100, parseFloat(l) || 0));
    const aVal = parseFloat(a) || 0;
    const bVal = parseFloat(b) || 0;
    element.style.backgroundColor = (!isNaN(lVal) && !isNaN(aVal) && !isNaN(bVal)) ? `lab(${lVal}% ${aVal} ${bVal})` : '#808080';
}

export function saveOpState() {
    const opInput = document.getElementById("opid");
    const fixarOpCheckbox = document.getElementById("fixarop");
    if (opInput && fixarOpCheckbox) {
        localStorage.setItem('savedOp', opInput.value);
        localStorage.setItem('isOpFixed', fixarOpCheckbox.checked);
    }
}

export function loadOpState() {
    const savedOp = localStorage.getItem('savedOp');
    const isOpFixed = localStorage.getItem('isOpFixed') === 'true';
    const opInput = document.getElementById("opid");
    const fixarOpCheckbox = document.getElementById("fixarop");

    if (opInput && fixarOpCheckbox) {
        if (savedOp) {
            opInput.value = savedOp;
        }
        fixarOpCheckbox.checked = isOpFixed;
    }
}
