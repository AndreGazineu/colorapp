import { allProfileData } from '../data/profiles.js';

const processControlStandards = {
    densities: [],
    tva50: [
        { color: 'Cyan', id_prefix: 'tva_c50', min: 64, target: 69, max: 74 },
        { color: 'Magenta', id_prefix: 'tva_m50', min: 64, target: 69, max: 74 },
        { color: 'Yellow', id_prefix: 'tva_y50', min: 64, target: 69, max: 74 },
        { color: 'Black', id_prefix: 'tva_k50', min: 64, target: 69, max: 74 }
    ],
    opacity: [
        { item: 'Opacidade Tinta Branca', id_prefix: 'opacity_white', min: 50, target: 52, max: 56 }
    ]
};

function clearGlobalMessage() {
    const globalMessage = document.getElementById('processControlGlobalMessage');
    globalMessage.textContent = '';
    globalMessage.style.display = 'none';
}

export function populateProfileSelector() {
    const selector = document.getElementById('pc_profile_select');
    selector.innerHTML = '<option value="">-- Selecione um Perfil --</option>';
    Object.keys(allProfileData).sort().forEach(profileName => {
        const option = document.createElement('option');
        option.value = profileName;
        option.textContent = profileName;
        selector.appendChild(option);
    });
}

export function loadProfileStandards(profileName) {
    const profileNoteDensities = document.getElementById('current_profile_note_densities');
    const densitiesTbody = document.getElementById('densities_tbody');
    densitiesTbody.innerHTML = '';

    if (!profileName || !allProfileData[profileName]) {
        profileNoteDensities.textContent = 'Nenhum perfil de densidade selecionado ou perfil inválido.';
        processControlStandards.densities = [];
        return;
    }

    const selectedProfile = allProfileData[profileName];
    processControlStandards.densities = [
        { color: 'Cyan', id_prefix: 'density_c', ...selectedProfile.densities.cyan },
        { color: 'Magenta', id_prefix: 'density_m', ...selectedProfile.densities.magenta },
        { color: 'Yellow', id_prefix: 'density_y', ...selectedProfile.densities.yellow },
        { color: 'Black', id_prefix: 'density_k', ...selectedProfile.densities.black }
    ];

    processControlStandards.densities.forEach(item => {
        const row = densitiesTbody.insertRow();
        row.innerHTML = `
            <td>${item.color}</td>
            <td class="tolerance-value">${item.min.toFixed(2)}</td>
            <td class="tolerance-value">${item.target.toFixed(2)}</td>
            <td class="tolerance-value">${item.max.toFixed(2)}</td>
            <td><input type="number" step="0.01" id="${item.id_prefix}_measured" placeholder="Medido"></td>
            <td class="status-cell" id="${item.id_prefix}_status"></td>
        `;
    });

    profileNoteDensities.textContent = `Padrões de densidade baseados no perfil: ${profileName}`;
    clearGlobalMessage();
}

export function populateFixedTables() {
    const tvaTbody = document.getElementById('tva_tbody');
    tvaTbody.innerHTML = '';
    processControlStandards.tva50.forEach(item => {
        const row = tvaTbody.insertRow();
        row.innerHTML = `
            <td>${item.color}</td>
            <td class="tolerance-value">${item.min.toFixed(0)}%</td>
            <td class="tolerance-value">${item.target.toFixed(0)}%</td>
            <td class="tolerance-value">${item.max.toFixed(0)}%</td>
            <td><input type="number" step="0.1" id="${item.id_prefix}_measured" placeholder="Medido (%)"></td>
            <td class="status-cell" id="${item.id_prefix}_status"></td>
        `;
    });

    const opacityTbody = document.getElementById('opacity_tbody');
    opacityTbody.innerHTML = '';
    processControlStandards.opacity.forEach(item => {
        const row = opacityTbody.insertRow();
        row.innerHTML = `
            <td>${item.item}</td>
            <td class="tolerance-value">${item.min}%</td>
            <td class="tolerance-value">${item.target}%</td>
            <td class="tolerance-value">${item.max}%</td>
            <td><input type="number" step="1" id="${item.id_prefix}_measured" placeholder="Medido (%)"></td>
            <td class="status-cell" id="${item.id_prefix}_status"></td>
        `;
    });
}

function checkProcessControlData() {
    let allApproved = true;
    let anyFieldFilled = false;
    clearGlobalMessage();

    function checkAndUpdate(itemData, valueFieldId, statusFieldId) {
        const measuredInput = document.getElementById(valueFieldId);
        const statusCell = document.getElementById(statusFieldId);
        statusCell.textContent = '';
        statusCell.className = 'status-cell';

        if (!measuredInput || measuredInput.value.trim() === '') return;

        anyFieldFilled = true;
        const measuredValue = parseFloat(measuredInput.value.replace(',', '.'));

        if (isNaN(measuredValue)) {
            statusCell.textContent = 'Inválido';
            statusCell.classList.add('status-reprovado');
            allApproved = false;
            return;
        }

        if (measuredValue >= itemData.min && measuredValue <= itemData.max) {
            statusCell.textContent = 'Aprovado';
            statusCell.classList.add('status-aprovado');
        } else {
            statusCell.textContent = 'Reprovado';
            statusCell.classList.add('status-reprovado');
            allApproved = false;
        }
    }

    if (processControlStandards.densities.length === 0) {
        const globalMessage = document.getElementById('processControlGlobalMessage');
        globalMessage.textContent = 'Selecione um perfil de densidade para verificação.';
        globalMessage.style.color = 'var(--text-light)';
        globalMessage.style.display = 'block';
        return { allApproved: false, anyFieldFilled: false };
    }

    processControlStandards.densities.forEach(item => checkAndUpdate(item, `${item.id_prefix}_measured`, `${item.id_prefix}_status`));
    processControlStandards.tva50.forEach(item => checkAndUpdate(item, `${item.id_prefix}_measured`, `${item.id_prefix}_status`));
    processControlStandards.opacity.forEach(item => checkAndUpdate(item, `${item.id_prefix}_measured`, `${item.id_prefix}_status`));

    const globalMessage = document.getElementById('processControlGlobalMessage');
    if (!anyFieldFilled) {
        globalMessage.textContent = 'Nenhum valor medido informado para verificação.';
        globalMessage.style.color = 'var(--text-light)';
    } else if (allApproved) {
        globalMessage.textContent = 'Todos os itens verificados estão APROVADOS!';
        globalMessage.style.color = 'var(--success)';
    } else {
        globalMessage.textContent = 'Atenção: Um ou mais itens estão REPROVADOS ou inválidos.';
        globalMessage.style.color = 'var(--danger)';
    }
    globalMessage.style.display = 'block';

    return { allApproved, anyFieldFilled };
}

export async function handleVerificationAndSave(supabase) {
    const button = document.getElementById('verifyAndSaveButton');
    const globalMessage = document.getElementById('processControlGlobalMessage');
    const { allApproved, anyFieldFilled } = checkProcessControlData();

    if (!anyFieldFilled || processControlStandards.densities.length === 0) return;

    button.disabled = true;
    button.textContent = 'Salvando...';

    const getNumericValue = (id) => {
        const input = document.getElementById(id);
        if (!input) return null;
        const val = input.value;
        return val.trim() === '' ? null : parseFloat(val.replace(',', '.'));
    };

    const inspectionData = {
        perfil_densidade: document.getElementById('pc_profile_select').value,
        produto: document.getElementById('pc_product_name').value || null,
        op_number: document.getElementById('pc_op_number').value || null,
        bobina_filha_id: document.getElementById('pc_daughter_coil_id').value || null,
        densidade_c_medido: getNumericValue('density_c_measured'),
        densidade_m_medido: getNumericValue('density_m_measured'),
        densidade_y_medido: getNumericValue('density_y_measured'),
        densidade_k_medido: getNumericValue('density_k_measured'),
        tva_c_medido: getNumericValue('tva_c50_measured'),
        tva_m_medido: getNumericValue('tva_m50_measured'),
        tva_y_medido: getNumericValue('tva_y50_measured'),
        tva_k_medido: getNumericValue('tva_k50_measured'),
        opacidade_branco_medido: getNumericValue('opacity_white_measured'),
        status_geral: allApproved ? 'APROVADO' : 'REPROVADO'
    };

    try {
        const { error } = await supabase.from('inspecoes_processo').insert([inspectionData]);
        if (error) throw error;
        globalMessage.innerHTML += '<br><b>Dados salvos com sucesso!</b>';
    } catch (e) {
        globalMessage.innerHTML += `<br><b>Falha ao salvar: ${e.message}</b>`;
        globalMessage.style.color = 'var(--danger)';
    } finally {
        button.disabled = false;
        button.textContent = 'Verificar e Salvar Dados';
    }
}

export async function fetchAndDisplayProcessInspections(supabase, tableBody) {
    tableBody.innerHTML = '<tr><td colspan="14" style="text-align:center;">Buscando dados...</td></tr>';
    try {
        const { data, error } = await supabase.from('inspecoes_processo').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="14" style="text-align:center;">Nenhuma inspeção encontrada.</td></tr>';
            return;
        }

        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = tableBody.insertRow();
            const statusClass = item.status_geral === 'APROVADO' ? 'status-aprovado' : 'status-reprovado';
            const formatValue = (value) => value !== null ? value : '-';
            row.innerHTML = `
                <td>${new Date(item.created_at).toLocaleString('pt-BR')}</td>
                <td>${formatValue(item.produto)}</td>
                <td>${formatValue(item.bobina_filha_id)}</td>
                <td>${formatValue(item.perfil_densidade)}</td>
                <td class="status-cell ${statusClass}">${formatValue(item.status_geral)}</td>
                <td>${formatValue(item.densidade_c_medido)}</td>
                <td>${formatValue(item.densidade_m_medido)}</td>
                <td>${formatValue(item.densidade_y_medido)}</td>
                <td>${formatValue(item.densidade_k_medido)}</td>
                <td>${formatValue(item.tva_c_medido)}</td>
                <td>${formatValue(item.tva_m_medido)}</td>
                <td>${formatValue(item.tva_y_medido)}</td>
                <td>${formatValue(item.tva_k_medido)}</td>
                <td>${formatValue(item.opacidade_branco_medido)}</td>
            `;
        });
    } catch (e) {
        tableBody.innerHTML = `<tr><td colspan="14" style="text-align:center; color: var(--danger);">Erro: ${e.message}</td></tr>`;
    }
}
