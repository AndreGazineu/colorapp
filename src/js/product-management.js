export async function loadProducts(supabase) {
    let allProducts = [];
    let offset = 0;
    const batchSize = 1000;
    let keepFetching = true;
    let totalCount = null;

    try {
        while (keepFetching) {
            const options = totalCount === null ? { count: 'exact' } : {};
            const { data, error, count } = await supabase.from("products").select("*", options).order('name').range(offset, offset + batchSize - 1);
            if (error) {
                throw error;
            }
            if (totalCount === null && count !== null) {
                totalCount = count;
            }
            if (data && data.length > 0) {
                allProducts = allProducts.concat(data);
                if (data.length < batchSize || (totalCount !== null && allProducts.length >= totalCount)) {
                    keepFetching = false;
                } else {
                    offset += batchSize;
                }
            } else {
                keepFetching = false;
            }
        }
        return allProducts;
    } catch (catchError) {
        console.error("Erro ao carregar produtos:", catchError);
        alert("Erro ao carregar produtos: " + catchError.message);
        return [];
    }
}

export function updateProductsTable(products) {
    const tableBody = document.getElementById("productsbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (!products || products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Nenhum produto cadastrado</td></tr>`;
        return;
    }

    products.forEach(product => {
        const row = document.createElement("tr");
        row.id = `product-row-${product.id}`;
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.l.toFixed(2)}</td>
            <td>${product.a.toFixed(2)}</td>
            <td>${product.b.toFixed(2)}</td>
            <td><div class="color-sample" style="background-color: lab(${product.l}% ${product.a} ${product.b});"></div></td>
            <td>
                <button data-action="edit" data-id="${product.id}">Editar</button>
                <button class="btn-danger" data-action="remove" data-id="${product.id}">Remover</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

export async function registerNewProduct(supabase, productData) {
    const name = productData.name.trim();
    const l = parseFloat(productData.l);
    const a = parseFloat(productData.a);
    const b = parseFloat(productData.b);

    if (!name || isNaN(l) || isNaN(a) || isNaN(b) || l < 0 || l > 100) {
        alert("Dados inválidos. Verifique nome e valores L(0-100), a, b.");
        return false;
    }

    try {
        const { error } = await supabase.from("products").insert([{ name, l, a, b }]);
        if (error) throw error;
        alert("Produto cadastrado com sucesso!");
        return true;
    } catch (e) {
        console.error("Erro ao inserir produto:", e);
        alert("Erro ao inserir produto: " + e.message);
        return false;
    }
}

function editProduct(id, products) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const row = document.getElementById(`product-row-${id}`);
    if (!row) return;

    row.dataset.originalHtml = row.innerHTML;
    row.innerHTML = `
        <td><input type="text" id="edit-name-${id}" value="${product.name}"></td>
        <td><input type="number" step="0.01" id="edit-l-${id}" value="${product.l.toFixed(2)}"></td>
        <td><input type="number" step="0.01" id="edit-a-${id}" value="${product.a.toFixed(2)}"></td>
        <td><input type="number" step="0.01" id="edit-b-${id}" value="${product.b.toFixed(2)}"></td>
        <td></td>
        <td>
            <button data-action="save" data-id="${id}">Salvar</button>
            <button class="btn-secondary" data-action="cancel" data-id="${id}">Cancelar</button>
        </td>
    `;
}

function cancelEdit(id) {
    const row = document.getElementById(`product-row-${id}`);
    if (row && row.dataset.originalHtml) {
        row.innerHTML = row.dataset.originalHtml;
        delete row.dataset.originalHtml;
    }
}

async function saveProductEdit(id, supabase) {
    const newName = document.getElementById(`edit-name-${id}`).value.trim();
    const newL = parseFloat(document.getElementById(`edit-l-${id}`).value);
    const newA = parseFloat(document.getElementById(`edit-a-${id}`).value);
    const newB = parseFloat(document.getElementById(`edit-b-${id}`).value);

    if (!newName || isNaN(newL) || isNaN(newA) || isNaN(newB) || newL < 0 || newL > 100) {
        alert("Dados inválidos.");
        return false;
    }

    const { error } = await supabase.from("products").update({ name: newName, l: newL, a: newA, b: newB }).eq("id", id);

    if (error) {
        alert("Erro ao atualizar produto: " + error.message);
        cancelEdit(id);
        return false;
    }

    alert("Produto atualizado com sucesso!");
    return true;
}

async function removeProduct(id, supabase) {
    if (confirm("Tem certeza que deseja remover este produto?")) {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            alert("Erro ao remover produto: " + error.message);
            return false;
        }
        return true;
    }
    return false;
}

export async function handleProductActions(event, supabase, products) {
    const target = event.target;
    const action = target.dataset.action;
    const id = parseInt(target.dataset.id);

    if (!action || !id) return null;

    switch (action) {
        case 'edit':
            editProduct(id, products);
            return { needsUpdate: false };
        case 'cancel':
            cancelEdit(id);
            return { needsUpdate: false };
        case 'save':
            const saved = await saveProductEdit(id, supabase);
            return { needsUpdate: saved };
        case 'remove':
            const removed = await removeProduct(id, supabase);
            return { needsUpdate: removed };
        default:
            return null;
    }
}

export function searchProductsDB(products, searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const filteredProducts = !term ? products : products.filter(p => p.name.toLowerCase().includes(term));
    updateProductsTable(filteredProducts);
}
