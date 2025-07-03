import '../css/style.css';
import { supabaseColor, supabaseProcess } from './supabase-init.js';
import * as colorInspection from './color-inspection.js';
import * as productManagement from './product-management.js';
import * as deltaCalculator from './delta-calculator.js';
import * as processControl from './process-control.js';
import * as report from './report.js';
import * as helpers from './helpers.js';

let productsdb = [];
let selectedcolor = null;
let allInspectionsData = [];
let lastInspections = [];
let histogramChartInstance = null;

const DOM = {
    navTabs: document.querySelectorAll('.nav-tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    search: {
        productCodeInput: document.getElementById('productcode'),
        searchButton: document.querySelector('#search-tab button'),
        resultsContainer: document.getElementById('results'),
        inspector: document.getElementById('inspector'),
        labL: document.getElementById('labl'),
        labA: document.getElementById('laba'),
        labB: document.getElementById('labb'),
        bobinaId: document.getElementById('bobinaid'),
        opId: document.getElementById('opid'),
        fixarOp: document.getElementById('fixarop'),
        inspectButton: document.querySelector('#inspector button'),
        backButton: document.querySelector('#inspector .back-button'),
        fixedBackButton: document.getElementById('fixedbackbutton'),
        colorSampleRef: document.getElementById('colorsampleref'),
        colorSampleSample: document.getElementById('colorsamplesample'),
        resultMessage: document.getElementById('resultmessage'),
        deltaL: document.getElementById('deltal'),
        deltaA: document.getElementById('deltaa'),
        deltaB: document.getElementById('deltab'),
    },
    databaseColor: {
        searchInput: document.getElementById('databasesearch'),
        startDate: document.getElementById('startDateFilter'),
        endDate: document.getElementById('endDateFilter'),
        searchButton: document.querySelector('#database-color-tab .search-controls button'),
        clearButton: document.querySelector('#database-color-tab .btn-secondary'),
        tableBody: document.getElementById('databasebody'),
    },
    register: {
        newProductName: document.getElementById('newproductname'),
        newProductL: document.getElementById('newproductl'),
        newProductA: document.getElementById('newproducta'),
        newProductB: document.getElementById('newproductb'),
        colorPreview: document.getElementById('newcolorpreview'),
        registerButton: document.querySelector('#register-tab > button'),
        productSearchInput: document.getElementById('productsearch'),
        productSearchButton: document.querySelector('#productslist .search-controls button'),
        productShowAllButton: document.querySelector('#productslist .btn-secondary'),
        productsTableBody: document.getElementById('productsbody'),
    },
    deltaCalculator: {
        refL: document.getElementById('refl'),
        refA: document.getElementById('refa'),
        refB: document.getElementById('refb'),
        sampleL: document.getElementById('samplel'),
        sampleA: document.getElementById('samplea'),
        sampleB: document.getElementById('sampleb'),
        calculateButton: document.querySelector('#deltacalculator-tab button'),
    },
    bestMatch: {
        l1: document.getElementById('l1'),
        a1: document.getElementById('a1'),
        b1: document.getElementById('b1'),
        findButton: document.querySelector('#bestmatch-tab button'),
        inputSample: document.getElementById('bestmatch-input-sample'),
    },
    processControl: {
        profileSelect: document.getElementById('pc_profile_select'),
        verifyAndSaveButton: document.getElementById('verifyAndSaveButton'),
    },
    databaseProcess: {
        updateButton: document.querySelector('#database-process-tab button'),
        tableBody: document.getElementById('inspectionsTbody'),
    },
    report: {
        startDate: document.getElementById('reportStartDate'),
        endDate: document.getElementById('reportEndDate'),
        opInput: document.getElementById('reportOp'),
        generateButton: document.getElementById('generateReportBtn'),
        downloadButton: document.getElementById('downloadExcelBtn'),
        laudoButton: document.getElementById('generateLaudoBtn'),
        colorSelect: document.getElementById('colorSelect'),
        histogramButton: document.getElementById('histogramBtn'),
    }
};

function showTab(tabId) {
    DOM.tabContents.forEach(content => content.classList.remove('active'));
    DOM.navTabs.forEach(tab => tab.classList.remove('active'));

    const activeTabContent = document.getElementById(`${tabId}-tab`);
    if (activeTabContent) activeTabContent.classList.add('active');

    const activeNavTab = Array.from(DOM.navTabs).find(el => el.dataset.tab === tabId);
    if (activeNavTab) activeNavTab.classList.add('active');

    switch (tabId) {
        case 'database-color':
            if (allInspectionsData.length === 0) {
                colorInspection.loadAndCacheInspections(supabaseColor).then(data => {
                    allInspectionsData = data;
                    colorInspection.updateInspectionsTable(allInspectionsData);
                });
            }
            break;
        case 'register':
            if (productsdb.length === 0) {
                productManagement.loadProducts(supabaseColor).then(data => {
                    productsdb = data;
                    productManagement.updateProductsTable(productsdb);
                });
            }
            break;
        case 'bestmatch':
            if (productsdb.length === 0) {
                productManagement.loadProducts(supabaseColor).then(data => productsdb = data);
            }
            break;
        case 'database-process':
            processControl.fetchAndDisplayProcessInspections(supabaseProcess, DOM.databaseProcess.tableBody);
            break;
    }
}

function handleProductSelection(product) {
    selectedcolor = product;
    DOM.search.resultsContainer.style.display = 'none';
    DOM.search.inspector.style.display = 'flex';
    DOM.search.fixedBackButton.style.display = 'block';

    DOM.search.labL.value = '';
    DOM.search.labA.value = '';
    DOM.search.labB.value = '';
    DOM.search.bobinaId.value = '';
    if (!DOM.search.fixarOp.checked) DOM.search.opId.value = '';

    DOM.search.resultMessage.textContent = '';
    DOM.search.deltaL.textContent = '';
    DOM.search.deltaA.textContent = '';
    DOM.search.deltaB.textContent = '';

    helpers.updateColorSample(DOM.search.colorSampleRef, product.l, product.a, product.b);
    helpers.updateColorSample(DOM.search.colorSampleSample, 0, 0, 0);
}

function goBackToSearch() {
    DOM.search.inspector.style.display = 'none';
    DOM.search.resultsContainer.style.display = 'flex';
    DOM.search.fixedBackButton.style.display = 'none';
    selectedcolor = null;
}

function setupEventListeners() {
    DOM.navTabs.forEach(tab => {
        const tabId = tab.getAttribute('onclick').match(/'([^']+)'/)[1];
        tab.dataset.tab = tabId;
        tab.addEventListener('click', () => showTab(tabId));
    });

    DOM.search.searchButton.addEventListener('click', () => {
        colorInspection.searchProducts(productsdb, DOM.search.productCodeInput.value, DOM.search.resultsContainer, handleProductSelection);
    });

    DOM.search.inspectButton.addEventListener('click', async () => {
        const inspectionResult = await colorInspection.inspectColor(supabaseColor, selectedcolor, {
            l: DOM.search.labL.value,
            a: DOM.search.labA.value,
            b: DOM.search.labB.value,
            bobina: DOM.search.bobinaId.value,
            op: DOM.search.opId.value
        });
        if (inspectionResult) {
            DOM.search.resultMessage.textContent = `Delta E: ${inspectionResult.deltae.toFixed(2)} - ${inspectionResult.status}`;
            DOM.search.resultMessage.style.color = inspectionResult.status === "Aprovado" ? "var(--success)" : "var(--danger)";
            DOM.search.deltaL.textContent = "Delta L: " + (inspectionResult.inspected_l - selectedcolor.l).toFixed(2);
            DOM.search.deltaA.textContent = "Delta A: " + (inspectionResult.inspected_a - selectedcolor.a).toFixed(2);
            DOM.search.deltaB.textContent = "Delta B: " + (inspectionResult.inspected_b - selectedcolor.b).toFixed(2);
        }
    });

    [DOM.search.labL, DOM.search.labA, DOM.search.labB].forEach(input => {
        input.addEventListener('input', () => {
            helpers.updateColorSample(DOM.search.colorSampleSample, DOM.search.labL.value, DOM.search.labA.value, DOM.search.labB.value);
        });
    });

    DOM.search.backButton.addEventListener('click', goBackToSearch);
    DOM.search.fixedBackButton.addEventListener('click', goBackToSearch);
    DOM.search.opId.addEventListener('input', helpers.saveOpState);
    DOM.search.fixarOp.addEventListener('change', helpers.saveOpState);

    DOM.databaseColor.searchButton.addEventListener('click', () => {
        const filtered = colorInspection.filterInspections(allInspectionsData, {
            term: DOM.databaseColor.searchInput.value,
            startDate: DOM.databaseColor.startDate.value,
            endDate: DOM.databaseColor.endDate.value
        });
        colorInspection.updateInspectionsTable(filtered);
    });

    DOM.databaseColor.clearButton.addEventListener('click', () => {
        colorInspection.clearDatabaseFilters(DOM.databaseColor.searchInput, DOM.databaseColor.startDate, DOM.databaseColor.endDate);
        colorInspection.updateInspectionsTable(allInspectionsData);
    });

    DOM.register.registerButton.addEventListener('click', async () => {
        const newProductData = {
            name: DOM.register.newProductName.value,
            l: DOM.register.newProductL.value,
            a: DOM.register.newProductA.value,
            b: DOM.register.newProductB.value,
        };
        const success = await productManagement.registerNewProduct(supabaseColor, newProductData);
        if (success) {
            productsdb = await productManagement.loadProducts(supabaseColor);
            productManagement.updateProductsTable(productsdb);
            DOM.register.newProductName.value = '';
            DOM.register.newProductL.value = '';
            DOM.register.newProductA.value = '';
            DOM.register.newProductB.value = '';
            helpers.updateColorSample(DOM.register.colorPreview, 0, 0, 0);
        }
    });

    [DOM.register.newProductL, DOM.register.newProductA, DOM.register.newProductB].forEach(input => {
        input.addEventListener('input', () => {
            helpers.updateColorSample(DOM.register.colorPreview, DOM.register.newProductL.value, DOM.register.newProductA.value, DOM.register.newProductB.value);
        });
    });

    DOM.register.productSearchButton.addEventListener('click', () => {
        productManagement.searchProductsDB(productsdb, DOM.register.productSearchInput.value);
    });

    DOM.register.productShowAllButton.addEventListener('click', () => {
        DOM.register.productSearchInput.value = '';
        productManagement.updateProductsTable(productsdb);
    });

    DOM.register.productsTableBody.addEventListener('click', async (e) => {
        const result = await productManagement.handleProductActions(e, supabaseColor, productsdb);
        if (result && result.needsUpdate) {
            productsdb = await productManagement.loadProducts(supabaseColor);
            productManagement.updateProductsTable(productsdb);
        }
    });

    DOM.deltaCalculator.calculateButton.addEventListener('click', deltaCalculator.calculateDeltaE);
    [DOM.deltaCalculator.refL, DOM.deltaCalculator.refA, DOM.deltaCalculator.refB].forEach(input => {
        input.addEventListener('input', () => deltaCalculator.updateDeltaCalcPreview('ref'));
    });
    [DOM.deltaCalculator.sampleL, DOM.deltaCalculator.sampleA, DOM.deltaCalculator.sampleB].forEach(input => {
        input.addEventListener('input', () => deltaCalculator.updateDeltaCalcPreview('sample'));
    });

    DOM.bestMatch.findButton.addEventListener('click', () => {
        deltaCalculator.findBestMatches(productsdb, {
            l: DOM.bestMatch.l1.value,
            a: DOM.bestMatch.a1.value,
            b: DOM.bestMatch.b1.value
        });
    });
    [DOM.bestMatch.l1, DOM.bestMatch.a1, DOM.bestMatch.b1].forEach(input => {
        input.addEventListener('input', () => helpers.updateColorSample(DOM.bestMatch.inputSample, DOM.bestMatch.l1.value, DOM.bestMatch.a1.value, DOM.bestMatch.b1.value));
    });

    DOM.processControl.profileSelect.addEventListener('change', (e) => {
        processControl.loadProfileStandards(e.target.value);
    });
    DOM.processControl.verifyAndSaveButton.addEventListener('click', () => {
        processControl.handleVerificationAndSave(supabaseProcess);
    });

    DOM.databaseProcess.updateButton.addEventListener('click', () => {
        processControl.fetchAndDisplayProcessInspections(supabaseProcess, DOM.databaseProcess.tableBody);
    });

    DOM.report.generateButton.addEventListener('click', async () => {
        const reportData = await report.generateReport(supabaseColor, {
            startDate: DOM.report.startDate.value,
            endDate: DOM.report.endDate.value,
            op: DOM.report.opInput.value
        });
        if (reportData) {
            lastInspections = reportData;
            DOM.report.downloadButton.disabled = false;
            DOM.report.histogramButton.disabled = false;
        }
    });

    DOM.report.downloadButton.addEventListener('click', () => report.downloadExcel(lastInspections, {
        startDate: DOM.report.startDate.value,
        endDate: DOM.report.endDate.value
    }));

    DOM.report.laudoButton.addEventListener('click', () => report.generateLaudo(supabaseColor, {
        startDate: DOM.report.startDate.value,
        endDate: DOM.report.endDate.value,
        op: DOM.report.opInput.value
    }));

    DOM.report.histogramButton.addEventListener('click', () => {
        histogramChartInstance = report.generateHistogram(lastInspections, DOM.report.colorSelect.value, histogramChartInstance);
    });
}

async function initializeApp() {
    helpers.loadOpState();
    setupEventListeners();

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formatDate = d => d.toISOString().split("T")[0];
    DOM.report.startDate.value = formatDate(firstDayOfMonth);
    DOM.report.endDate.value = formatDate(today);

    processControl.populateProfileSelector();
    processControl.populateFixedTables();
    processControl.loadProfileStandards(DOM.processControl.profileSelect.value);

    deltaCalculator.updateDeltaCalcPreview('ref');
    deltaCalculator.updateDeltaCalcPreview('sample');
    helpers.updateColorSample(DOM.bestMatch.inputSample, 0, 0, 0);
    helpers.updateColorSample(DOM.register.colorPreview, 0, 0, 0);

    productsdb = await productManagement.loadProducts(supabaseColor);
    productManagement.updateProductsTable(productsdb);

    showTab('search');
}

document.addEventListener('DOMContentLoaded', initializeApp);
