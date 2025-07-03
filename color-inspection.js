import { ciede2000 } from './helpers.js';
import { updateColorSample } from './helpers.js';

export function searchProducts(productsdb, productCode, resultsContainer, onProductSelect) {
    const searchTerm = productCode.toLowerCase().trim();
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "flex";

    const matches = !searchTerm ? productsdb : productsdb.filter(p => p.name.toLowerCase().includes(searchTerm));

    if (matches.length === 0) {
        resultsContainer.innerHTML = "Nenhum produto correspondente encontrado.";
        return;
    }

    matches.forEach(match => {
        const matchDiv = document.createElement("div");
        matchDiv.classList.add("match");
        matchDiv.innerHTML = `
            <span>${match.name}</span>
            <div class="color-sample" style="background-color: lab(${match.l}% ${match.a} ${match.b});"></div>
        `;
        matchDiv.onclick = () => onProductSelect(match);
        resultsContainer.appendChild(matchDiv);
    });
}

export async function inspectColor(supabase, selectedColor, values) {
    if (!selectedColor) {
        alert("Nenhum produto selecionado!");
        return null;
    }

    const l2 = parseFloat(values.l);
    const a2 = parseFloat(values.a);
    const b2 = parseFloat(values.b);
    const bobina = values.bobina.trim();
    const op = values.op.trim() ? parseInt(values.op.trim()) : null;

    if (isNaN(l2) || isNaN(a2) || isNaN(b2) || l2 < 0 || l2 > 100) {
        alert("Valores L, a, b inválidos.");
        return null;
    }

    const deltae = ciede2000(selectedColor.l, selectedColor.a, selectedColor.b, l2, a2, b2);
    const status = deltae <= 2 ? "Aprovado" : "Reprovado";

    updateColorSample(document.getElementById('colorsamplesample'), l2, a2, b2);

    const inspectionData = {
        product: selectedColor.name,
        original_l: selectedColor.l,
        original_a: selectedColor.a,
        original_b: selectedColor.b,
        inspected_l: l2,
        inspected_a: a2,
        inspected_b: b2,
        deltae: deltae.toFixed(2),
        status: status,
        bobina: bobina || null,
        op: op,
        timestamp: new Date().toISOString()
    };

    try {
        const { error } = await supabase.from("color_inspections").insert([inspectionData]);
        if (error) throw error;
        alert("Inspeção salva com sucesso!");
        return inspectionData;
    } catch (e) {
        alert("Erro ao salvar inspeção: " + e.message);
        return null;
    }
}

export async function loadAndCacheInspections(supabase) {
    try {
        const { data, error } = await supabase.from("color_inspections").select("*").order('timestamp', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (e) {
        alert("Erro ao carregar inspeções de cor: " + e.message);
        return [];
    }
}

export function filterInspections(allData, filters) {
    const searchTerm = filters.term.toLowerCase().trim();
    let filteredData = allData;

    if (searchTerm) {
        filteredData = filteredData.filter(item =>
            (item.product && item.product.toLowerCase().includes(searchTerm)) ||
            (item.status && item.status.toLowerCase().includes(searchTerm)) ||
            (item.deltae && item.deltae.toString().includes(searchTerm)) ||
            (item.bobina && item.bobina.toLowerCase().includes(searchTerm)) ||
            (item.op != null && item.op.toString().toLowerCase().includes(searchTerm))
        );
    }

    if (filters.startDate) {
        const startFilterDate = new Date(filters.startDate + 'T00:00:00');
        if (!isNaN(startFilterDate)) {
            filteredData = filteredData.filter(item => new Date(item.timestamp || item.created_at) >= startFilterDate);
        }
    }

    if (filters.endDate) {
        const endFilterDate = new Date(filters.endDate + 'T23:59:59.999');
        if (!isNaN(endFilterDate)) {
            filteredData = filteredData.filter(item => new Date(item.timestamp || item.created_at) <= endFilterDate);
        }
    }

    return filteredData;
}

export function clearDatabaseFilters(searchInput, startDateInput, endDateInput) {
    searchInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
}

export function updateInspectionsTable(data) {
    const tableBody = document.getElementById("databasebody");
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="12" style="text-align: center;">Nenhum resultado encontrado</td></tr>`;
        return;
    }

    data.forEach(item => {
        const timestamp = item.timestamp || item.created_at;
        const formattedDate = timestamp ? new Date(timestamp).toLocaleString("pt-BR") : "-";
        const statusClass = item.status === 'Aprovado' ? 'status-aprovado' : item.status === 'Reprovado' ? 'status-reprovado' : '';

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.product || '-'}</td>
            <td>${item.original_l != null ? item.original_l.toFixed(2) : '-'}</td>
            <td>${item.original_a != null ? item.original_a.toFixed(2) : '-'}</td>
            <td>${item.original_b != null ? item.original_b.toFixed(2) : '-'}</td>
            <td>${item.inspected_l != null ? item.inspected_l.toFixed(2) : '-'}</td>
            <td>${item.inspected_a != null ? item.inspected_a.toFixed(2) : '-'}</td>
            <td>${item.inspected_b != null ? item.inspected_b.toFixed(2) : '-'}</td>
            <td>${item.deltae != null ? item.deltae : '-'}</td>
            <td class="status-cell ${statusClass}">${item.status || '-'}</td>
            <td>${formattedDate}</td>
            <td>${item.bobina || '-'}</td>
            <td>${item.op != null ? item.op : '-'}</td>
        `;
        tableBody.appendChild(row);
    });
}
