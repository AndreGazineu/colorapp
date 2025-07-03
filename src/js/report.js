import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';

Chart.register(...registerables);

const HUE_START = 120;
const HUE_END = 0;
const SATURATION = "75%";
const LIGHTNESS_GOOD = "88%";
const LIGHTNESS_BAD = "75%";
const DELTAE_MAX_FOR_COLOR = 6.0;
const DELTAE_APPROVED_THRESHOLD = 2.0;

function getDates(startDateValue, endDateValue) {
    const reportPeriodDiv = document.getElementById("reportPeriod");
    if (!startDateValue || !endDateValue) {
        reportPeriodDiv.innerHTML = '<span class="error">Selecione data inicial e final.</span>';
        return null;
    }
    const sd = new Date(startDateValue + "T00:00:00");
    const ed = new Date(endDateValue + "T23:59:59.999");
    if (isNaN(sd) || isNaN(ed) || ed < sd) {
        reportPeriodDiv.innerHTML = '<span class="error">Período de datas inválido.</span>';
        return null;
    }
    const opts = { day: "2-digit", month: "2-digit", year: "numeric" };
    reportPeriodDiv.textContent = `Período: ${sd.toLocaleDateString("pt-BR", opts)} a ${ed.toLocaleDateString("pt-BR", opts)}`;
    return { sd, ed };
}

async function fetchReportData(supabase, sdISO, edISO, opFilter) {
    let query = supabase.from("color_inspections").select("product, deltae, bobina, op, timestamp").gte("timestamp", sdISO).lte("timestamp", edISO);
    if (opFilter !== null) {
        query = query.eq("op", opFilter);
    }
    query = query.order("product").order("timestamp", { ascending: true });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

function getDeltaEColor(deltae) {
    if (isNaN(deltae) || deltae === null) return "#e0e0e0";
    const normalized = Math.min(Math.max(deltae, 0), DELTAE_MAX_FOR_COLOR) / DELTAE_MAX_FOR_COLOR;
    const hue = HUE_START * (1 - normalized);
    const lGood = parseFloat(LIGHTNESS_GOOD);
    const lBad = parseFloat(LIGHTNESS_BAD);
    const lightness = lGood + (lBad - lGood) * normalized;
    return `hsl(${hue}, ${SATURATION}, ${lightness}%)`;
}

function getTextColor(bgColor) {
    try {
        const match = bgColor.match(/hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*(\d+)%?\s*\)/i);
        if (match && match[1]) return parseInt(match[1], 10) > 65 ? "#333333" : "#ffffff";
    } catch (e) {
        return "#333333";
    }
    return "#333333";
}

function groupAndStats(inspections) {
    const grouped = {};
    let total = 0, approved = 0, rejected = 0;
    inspections.forEach(item => {
        const prod = item.product || "Não especificado";
        if (!grouped[prod]) grouped[prod] = [];
        grouped[prod].push(item);
        const d = parseFloat(item.deltae);
        if (!isNaN(d)) {
            total++;
            if (d <= DELTAE_APPROVED_THRESHOLD) approved++;
            else rejected++;
        } else {
            total++;
            rejected++;
        }
    });
    return { grouped, total, approved, rejected };
}

function resetStats() {
    document.getElementById("statTotalValue").textContent = "-";
    document.getElementById("statApprovedValue").textContent = "-";
    document.getElementById("statRejectedValue").textContent = "-";
    document.getElementById("statRateValue").textContent = "-%";
    document.getElementById("downloadExcelBtn").disabled = true;
    populateColorDropdown([]);
    document.getElementById("histogramBtn").disabled = true;
}

function fillStats(total, approved, rejected) {
    document.getElementById("statTotalValue").textContent = total;
    document.getElementById("statApprovedValue").textContent = approved;
    document.getElementById("statRejectedValue").textContent = rejected;
    const rate = total > 0 ? (approved / total) * 100 : 0;
    document.getElementById("statRateValue").textContent = rate.toFixed(1) + "%";
}

function renderProducts(groupedData) {
    const resultsAreaDiv = document.getElementById("resultsArea");
    resultsAreaDiv.innerHTML = "";
    const products = Object.keys(groupedData).sort();
    if (products.length === 0) {
        resultsAreaDiv.innerHTML = `<div class="placeholder-message">Nenhum produto encontrado.</div>`;
        populateColorDropdown([]);
        return;
    }
    populateColorDropdown(products);
    products.forEach(prod => {
        const section = document.createElement("div");
        section.className = "product-group";
        section.innerHTML = `<h3>${prod}</h3><div class="inspection-items"></div>`;
        const itemsContainer = section.querySelector('.inspection-items');
        groupedData[prod].forEach(item => {
            const card = document.createElement("div");
            card.className = "inspection-item";
            const d = parseFloat(item.deltae);
            const bg = getDeltaEColor(d);
            card.style.backgroundColor = bg;
            card.style.color = getTextColor(bg);
            const displayDate = item.timestamp ? new Date(item.timestamp).toLocaleDateString("pt-BR") : "-";
            card.title = `Bobina: ${item.bobina || "-"}\nOP: ${item.op ?? "-"}\nData: ${displayDate}\nΔE: ${isNaN(d) ? "-" : d.toFixed(2)}`;
            card.innerHTML = `<span class="item-deltae">${isNaN(d) ? "-" : d.toFixed(2)}</span><span class="item-detail">Bobina: ${item.bobina || "N/A"}</span>`;
            itemsContainer.appendChild(card);
        });
        resultsAreaDiv.appendChild(section);
    });
}

function populateColorDropdown(products) {
    const colorSelect = document.getElementById("colorSelect");
    colorSelect.innerHTML = `<option value="">Selecione uma cor (produto)...</option>`;
    products.forEach(prod => {
        const opt = document.createElement("option");
        opt.value = prod;
        opt.textContent = prod;
        colorSelect.appendChild(opt);
    });
}

export async function generateReport(supabase, filters) {
    resetStats();
    const resultsAreaDiv = document.getElementById("resultsArea");
    resultsAreaDiv.innerHTML = `<div class="placeholder-message">Carregando…</div>`;
    const dates = getDates(filters.startDate, filters.endDate);
    if (!dates) return null;

    const opVal = filters.op.trim();
    const opFilter = opVal ? parseInt(opVal) : null;

    try {
        const data = await fetchReportData(supabase, dates.sd.toISOString(), dates.ed.toISOString(), opFilter);
        if (data.length === 0) {
            resultsAreaDiv.innerHTML = `<div class="placeholder-message">Nenhuma inspeção encontrada no período.</div>`;
            return [];
        }
        const { grouped, total, approved, rejected } = groupAndStats(data);
        fillStats(total, approved, rejected);
        renderProducts(grouped);
        return data;
    } catch (err) {
        resultsAreaDiv.innerHTML = `<div class="error">Erro ao buscar dados: ${err.message}</div>`;
        document.getElementById("reportPeriod").innerHTML = `<span class="error">Falha ao carregar dados.</span>`;
        return null;
    }
}

export function generateHistogram(lastInspections, selectedColor, chartInstance) {
    if (chartInstance) {
        chartInstance.destroy();
    }
    if (!selectedColor) {
        alert("Selecione uma cor para gerar o histograma.");
        return null;
    }
    const deltaEValues = lastInspections.filter(item => item.product === selectedColor).map(item => parseFloat(item.deltae)).filter(d => !isNaN(d));
    if (deltaEValues.length === 0) {
        alert("Não há dados de ΔE para o produto selecionado.");
        return null;
    }
    const numBins = 10;
    const minDE = Math.min(...deltaEValues);
    const maxDE = Math.max(...deltaEValues);
    const binWidth = (maxDE - minDE) / numBins || 0.1;
    const binCounts = Array(numBins).fill(0);
    deltaEValues.forEach(d => {
        let binIndex = Math.floor((d - minDE) / binWidth);
        if (binIndex >= numBins) binIndex = numBins - 1;
        if (binIndex < 0) binIndex = 0;
        binCounts[binIndex]++;
    });
    const binLabels = Array.from({ length: numBins }, (_, i) => `${(minDE + i * binWidth).toFixed(2)}–${(minDE + (i + 1) * binWidth).toFixed(2)}`);
    const ctx = document.getElementById("histogramChart").getContext("2d");
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: binLabels,
            datasets: [{
                label: `Frequência de ΔE para "${selectedColor}"`,
                data: binCounts,
                backgroundColor: "rgba(36, 99, 235, 0.7)"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Intervalo de ΔE" } },
                y: { title: { display: true, text: "Frequência" }, beginAtZero: true, ticks: { precision: 0 } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

export function downloadExcel(lastInspections, filters) {
    if (!lastInspections || !lastInspections.length) return;
    const rows = [["Produto", "Bobina", "OP", "ΔE", "Data/Hora"]];
    lastInspections.forEach(item => rows.push([item.product || "-", item.bobina || "-", item.op ?? "-", item.deltae, item.timestamp ? new Date(item.timestamp).toLocaleString("pt-BR") : "-"]));
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inspeções");
    const start = filters.startDate.replace(/-/g, "");
    const end = filters.endDate.replace(/-/g, "");
    XLSX.writeFile(wb, `inspecoes_${start}_${end}.xlsx`);
}

export async function generateLaudo(supabase, filters) {
    const opVal = filters.op.trim();
    if (!opVal) {
        alert("Informe a OP para gerar o laudo.");
        return;
    }
    const dates = getDates(filters.startDate, filters.endDate);
    if (!dates) return;
    const laudoAreaDiv = document.getElementById("laudoArea");
    laudoAreaDiv.innerHTML = `<div class="placeholder-message">Carregando…</div>`;
    try {
        const data = await fetchReportData(supabase, dates.sd.toISOString(), dates.ed.toISOString(), parseInt(opVal));
        if (data.length === 0) {
            laudoAreaDiv.innerHTML = `<div class="placeholder-message">Nenhuma inspeção encontrada para a OP ${opVal}.</div>`;
            return;
        }
        const grouped = {};
        data.forEach(item => {
            const prod = item.product || "Não especificado";
            if (!grouped[prod]) grouped[prod] = [];
            grouped[prod].push(item);
        });
        let productHtml = "";
        Object.keys(grouped).sort().forEach(prod => {
            const arr = grouped[prod];
            const values = arr.map(i => parseFloat(i.deltae)).filter(v => !isNaN(v));
            const n = values.length;
            const avg = n > 0 ? values.reduce((s, v) => s + v, 0) / n : 0;
            const stdDev = n > 1 ? Math.sqrt(values.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / (n - 1)) : 0;
            productHtml += `
              <div class="laudo-product-stats">
                <h5>${prod}</h5>
                <ul>
                    <li><span>Total de Amostras:</span> <strong>${arr.length}</strong></li>
                    <li><span>ΔE Médio:</span> <strong>${avg.toFixed(2)}</strong></li>
                    <li><span>Desvio Padrão (ΔE):</span> <strong>${stdDev.toFixed(2)}</strong></li>
                    <li><span>ΔE Mínimo:</span> <strong>${(n > 0 ? Math.min(...values) : 0).toFixed(2)}</strong></li>
                    <li><span>ΔE Máximo:</span> <strong>${(n > 0 ? Math.max(...values) : 0).toFixed(2)}</strong></li>
                    <li><span>Amostras com ΔE > 2.5:</span> <strong>${values.filter(v => v > 2.5).length}</strong></li>
                    <li><span>Amostras com ΔE > 3.0:</span> <strong>${values.filter(v => v > 3.0).length}</strong></li>
                </ul>
              </div>`;
        });
        laudoAreaDiv.innerHTML = `<div class="laudo-report"><h4>Laudo Estatístico para OP: ${opVal}</h4>${productHtml}</div>`;
    } catch (err) {
        laudoAreaDiv.innerHTML = `<div class="error">Erro ao gerar laudo: ${err.message}</div>`;
    }
}
