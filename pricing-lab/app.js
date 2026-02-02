import { tuftingConfig } from './tufting.js';
import { candleConfig } from './candle.js';
import { soapConfig } from './soap.js';

// Registry
const calculators = {
    'tufting': tuftingConfig,
	'soap': soapConfig,
    'candles': candleConfig 
};

let currentConfig = null;
let isMetric = false;

// --- CONVERSION LOGIC ---
const unitMap = {
    '/lb': { target: '/kg', factor: 0.453592 },
    '/oz': { target: '/g',  factor: 28.3495 },
    '/ft': { target: '/m',  factor: 0.3048 },
    '/sq ft': { target: '/sq m', factor: 0.092903 },
    '/fl oz': { target: '/ml', factor: 29.5735 },
    '/gal': { target: '/L', factor: 3.78541 }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SEARCH LOGIC
    const searchInput = document.getElementById('templateSearch');
    const grid = document.getElementById('templateGrid');
    const cards = grid.querySelectorAll('.card');
    const noResults = document.getElementById('noResults');

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        let visibleCount = 0;
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            const keywords = card.dataset.keywords || ""; 
            if (text.includes(term) || keywords.includes(term)) {
                card.style.display = "block"; visibleCount++;
            } else {
                card.style.display = "none";
            }
        });
        noResults.style.display = visibleCount === 0 ? "block" : "none";
    });

    // 2. CARD CLICK LOGIC
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if(card.classList.contains('coming-soon')) return;
            const type = card.dataset.type;
            if (calculators[type]) loadCalculator(calculators[type]);
        });
    });

    // 3. BACK BUTTON
    document.getElementById('backBtn').addEventListener('click', () => {
        document.getElementById('calculatorView').style.display = 'none';
        document.getElementById('selectionView').style.display = 'block';
        currentConfig = null;
    });

    // 4. UNIT TOGGLE
    const unitToggle = document.getElementById('unitToggle');
    unitToggle.addEventListener('change', (e) => {
        isMetric = e.target.checked;
        updateUnitLabels(); // Update UI colors
        convertValues();    // Convert numbers
        calculateTotal();   // Recalc totals
        saveState();        // Save preference
    });

    // 5. ADVANCED TOGGLE (Refactored: CSS Hide only)
    const advToggle = document.getElementById('advancedToggle');
    advToggle.addEventListener('change', (e) => {
        toggleAdvancedRows(e.target.checked);
		calculateTotal();
        saveState(); // Save preference
    });

    // 6. GLOBAL INPUT LISTENER (For Auto-Save)
    // We attach this to the calculator view so we catch ANY input change bubbling up
    document.getElementById('calculatorView').addEventListener('input', (e) => {
        // Only trigger recalc/save if it's an input we care about
        if(e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
            calculateTotal();
            saveState();
        }
    });
});

function loadCalculator(config) {
    currentConfig = config;
    
    // Switch Views
    document.getElementById('selectionView').style.display = 'none';
    document.getElementById('calculatorView').style.display = 'block';

    // 1. Render the Full Form (Defaults)
    renderInputs(config);

    // 2. Check for Saved Data
    // We try to load data. If loadState() returns false (no save found), we stick with defaults.
    const hasSavedData = loadState(); 

    if (!hasSavedData) {
        // Load Config Defaults if no save exists
        document.getElementById('hourlyRate').value = config.defaults.hourlyRate;
        document.getElementById('hoursSpent').value = config.defaults.hours;
        document.getElementById('fixedOverhead').value = config.defaults.overhead;
        document.getElementById('profitMargin').value = config.defaults.profitMargin;
        document.getElementById('profitDisplay').innerText = config.defaults.profitMargin + "%";
        
        // Default Toggles
        document.getElementById('unitToggle').checked = false;
        document.getElementById('advancedToggle').checked = false;
        isMetric = false;
        updateUnitLabels();
        toggleAdvancedRows(false);
    }

    calculateTotal();
}

function renderInputs(config) {
    const matContainer = document.getElementById('materialsList');
    matContainer.innerHTML = ''; 

    // Header
    const header = document.createElement('div');
    header.className = 'tower-header';
    header.innerHTML = `<div class="col-header">Item</div><div class="col-header">Unit Cost</div><div class="col-header">Quantity</div><div class="col-header" style="text-align:right;">Total</div>`;
    matContainer.appendChild(header);

    let lastCategory = null;

    config.materials.forEach((mat, index) => {
        const currentCategory = mat.category || 'Materials';
        
        // Category Header
        if (currentCategory !== lastCategory) {
            const catHeader = document.createElement('div');
            catHeader.className = 'category-header';
            catHeader.innerText = currentCategory;
            // NEW: Add an ID or data attribute to the header if needed, but innerText is enough for now
            matContainer.appendChild(catHeader);
            lastCategory = currentCategory;
        }

        const row = document.createElement('div');
        row.className = 'input-row';
        
        // NEW: Tag the row with its category so we can look it up later
        row.dataset.category = currentCategory; 
        
        // Mark Advanced Rows for Toggling
        if (mat.mode === 'advanced') {
            row.classList.add('is-advanced');
        }

        row.innerHTML = `
            <div class="row-label">
                ${mat.label}
                ${mat.mode === 'advanced' ? '<span class="adv-badge">ADV</span>' : ''}
            </div>
            <div class="input-wrapper">
                <span>${mat.unitPre}</span>
                <input type="number" class="cost-input" data-id="${index}" data-orig-unit="${mat.unitPost}" value="${mat.default.toFixed(2)}" placeholder="0.00">
                <span class="unit-label-cost">${mat.unitPost}</span>
            </div>
            <div class="input-wrapper">
                <input type="number" class="qty-input" data-id="${index}" value="${mat.qtyDefault.toFixed(3)}" placeholder="0">
                <span class="unit-label-qty">${formatQtyLabel(mat.qtyLabel, mat.unitPost)}</span>
            </div>
            <div class="row-total" id="row-total-${index}">$0.00</div>
        `;
        matContainer.appendChild(row);
    });

    // Waste Slider
    if (config.defaults.wasteFactor) {
        const wasteDiv = document.createElement('div');
        wasteDiv.className = 'is-advanced'; 
        wasteDiv.style.marginTop = '20px'; wasteDiv.style.padding = '15px'; wasteDiv.style.background = '#fff0f0'; wasteDiv.style.borderRadius = '8px'; wasteDiv.style.border = '1px solid #fecdd3';
        wasteDiv.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; color:#be123c; font-weight:600; font-size:0.9rem;">
                <label>Waste Factor <span style="font-weight:normal; font-size:0.85em; opacity:0.8;">(Trimming loss)</span></label>
                <span id="wasteDisplay">${config.defaults.wasteFactor}%</span>
            </div>
            <input type="range" id="wasteFactor" min="0" max="30" value="${config.defaults.wasteFactor}" style="accent-color:#be123c;">
        `;
        matContainer.appendChild(wasteDiv);
        
        document.getElementById('wasteFactor').addEventListener('input', (e) => {
            document.getElementById('wasteDisplay').innerText = e.target.value + "%";
            calculateTotal(); // Trigger recalc when sliding
        });
    }
}

// --- LOGIC: VISUAL TOGGLING ---
function toggleAdvancedRows(showAdvanced) {
    // 1. Toggle the Rows
    const advItems = document.querySelectorAll('.is-advanced');
    advItems.forEach(el => {
        if (showAdvanced) el.classList.remove('row-hidden');
        else el.classList.add('row-hidden');
    });

    // 2. Toggle the Headers
    const headers = document.querySelectorAll('.category-header');
    headers.forEach(header => {
        const catName = header.innerText;
        const rowsForThisCat = document.querySelectorAll(`.input-row[data-category="${catName}"]`);
        
        let hasVisibleChildren = false;
        rowsForThisCat.forEach(row => {
            if (!row.classList.contains('row-hidden')) {
                hasVisibleChildren = true;
            }
        });

        header.style.display = hasVisibleChildren ? 'flex' : 'none';
    });

    // --- FIX STARTS HERE ---
    // 3. Fix Double Borders (Scoped ONLY to Materials List)
    const matContainer = document.getElementById('materialsList');
    const materialRows = matContainer.querySelectorAll('.input-row');
    
    // Reset borders for material rows only
    materialRows.forEach(row => row.style.borderBottom = '');

    // Get strictly the visible material rows
    const visibleMatRows = Array.from(materialRows).filter(row => !row.classList.contains('row-hidden'));
    
    if (visibleMatRows.length > 0) {
        // Remove border from the absolute last visible MATERIAL row
        visibleMatRows[visibleMatRows.length - 1].style.borderBottom = 'none';
    }
}

function updateUnitLabels() {
    document.getElementById('unitLabelImp').style.color = isMetric ? 'var(--text-sub)' : 'var(--primary)';
    document.getElementById('unitLabelMet').style.color = isMetric ? 'var(--primary)' : 'var(--text-sub)';
}

// --- LOGIC: SAVING & LOADING ---
function saveState() {
    if(!currentConfig) return;
    
    const state = {
        // Toggles
        isMetric: document.getElementById('unitToggle').checked,
        isAdvanced: document.getElementById('advancedToggle').checked,
        
        // Global Inputs
        hourlyRate: document.getElementById('hourlyRate').value,
        hoursSpent: document.getElementById('hoursSpent').value,
        fixedOverhead: document.getElementById('fixedOverhead').value,
        profitMargin: document.getElementById('profitMargin').value,
        wasteFactor: document.getElementById('wasteFactor') ? document.getElementById('wasteFactor').value : 0,

        // Material Inputs (Array of values)
        materials: [] 
    };

    // Scrape all dynamic inputs
    const costs = document.querySelectorAll('.cost-input');
    costs.forEach(input => {
        const id = input.dataset.id;
        const qty = document.querySelector(`.qty-input[data-id="${id}"]`).value;
        state.materials.push({
            id: id,
            cost: input.value,
            qty: qty
        });
    });

    localStorage.setItem(`levor_calc_${currentConfig.id}`, JSON.stringify(state));
}

function loadState() {
    if(!currentConfig) return false;

    const savedJSON = localStorage.getItem(`levor_calc_${currentConfig.id}`);
    if(!savedJSON) return false; // No save found

    try {
        const state = JSON.parse(savedJSON);

        // 1. Restore Toggles
        document.getElementById('unitToggle').checked = state.isMetric;
        isMetric = state.isMetric;
        updateUnitLabels();

        document.getElementById('advancedToggle').checked = state.isAdvanced;
        toggleAdvancedRows(state.isAdvanced);

        // 2. Restore Global Inputs
        document.getElementById('hourlyRate').value = state.hourlyRate;
        document.getElementById('hoursSpent').value = state.hoursSpent;
        document.getElementById('fixedOverhead').value = state.fixedOverhead;
        document.getElementById('profitMargin').value = state.profitMargin;
        document.getElementById('profitDisplay').innerText = state.profitMargin + "%";
        
        if(state.wasteFactor && document.getElementById('wasteFactor')) {
            document.getElementById('wasteFactor').value = state.wasteFactor;
            document.getElementById('wasteDisplay').innerText = state.wasteFactor + "%";
        }

        // 3. Restore Material Inputs
        // Note: We don't need to re-convert units here because we saved the *displayed* value.
        // We just shove the values back into the boxes.
        if (state.materials) {
            state.materials.forEach(item => {
                const costInput = document.querySelector(`.cost-input[data-id="${item.id}"]`);
                const qtyInput = document.querySelector(`.qty-input[data-id="${item.id}"]`);
                if(costInput && qtyInput) {
                    costInput.value = item.cost;
                    qtyInput.value = item.qty;
                    
                    // Update the text labels to match the Metric state we just loaded
                    if(isMetric) {
                        const origUnit = costInput.dataset.origUnit;
                        const map = unitMap[origUnit];
                        if(map) {
                            costInput.nextElementSibling.innerText = map.target; // Label update
                            
                            // Robust Qty Label update
                            const mat = currentConfig.materials[item.id];
                            const qLabel = qtyInput.nextElementSibling;
                            qLabel.innerText = formatQtyLabel(mat.qtyLabel, map.target);
                        }
                    }
                }
            });
        }
        return true;

    } catch(e) {
        console.error("Save file corrupted", e);
        return false;
    }
}

// ... (Keep existing formatQtyLabel, convertValues, calculateTotal, updateChart functions exactly as they were) ...
// Ensure you include those helper functions at the bottom of this file!
// Re-pasting them here for completeness:

function convertValues() {
    const costInputs = document.querySelectorAll('.cost-input');
    
    costInputs.forEach(costInput => {
        const id = costInput.dataset.id;
        const origUnit = costInput.dataset.origUnit; 
        const map = unitMap[origUnit];
        
        if (!map) return; 

        const qtyInput = document.querySelector(`.qty-input[data-id="${id}"]`);
        const costLabel = costInput.nextElementSibling; 
        const qtyLabel = qtyInput.nextElementSibling;   

        let currentCost = parseFloat(costInput.value) || 0;
        let currentQty = parseFloat(qtyInput.value) || 0;

        if (isMetric) {
            // IMPERIAL -> METRIC
            costInput.value = (currentCost / map.factor).toFixed(2);
            qtyInput.value = (currentQty * map.factor).toFixed(3);
            costLabel.innerText = map.target;

        } else {
            // METRIC -> IMPERIAL
            costInput.value = (currentCost * map.factor).toFixed(2);
            qtyInput.value = (currentQty / map.factor).toFixed(3);
            costLabel.innerText = origUnit;
        }

        // Robust Label Update
        const mat = currentConfig.materials[id];
        const targetUnit = isMetric ? map.target : origUnit;
        qtyLabel.innerText = formatQtyLabel(mat.qtyLabel, targetUnit);
    });
}

function formatQtyLabel(originalLabel, currentUnit) {
    if(currentUnit === '/kg') return originalLabel.replace('lbs', 'kg');
    if(currentUnit === '/g') return originalLabel.replace('oz', 'g');
    if(currentUnit === '/m') return originalLabel.replace('ft', 'm');
    if(currentUnit === '/sq m') return originalLabel.replace('sq ft', 'sq m');
    if(currentUnit === '/L') return originalLabel.replace('gal', 'L'); // Handle Gallons
    
    // Fallback: Check for parens, otherwise return original
    const parts = originalLabel.split('(');
    if (parts.length > 1) {
        return parts[1].replace(')', '');
    }
    return originalLabel;
}

function calculateTotal() {
    if(!currentConfig) return;

    let totalMaterialCost = 0;
    
    const costs = document.querySelectorAll('.cost-input');

    costs.forEach((costInput) => {
        const row = costInput.closest('.input-row');
        if (row.classList.contains('row-hidden')) return;

        const id = costInput.dataset.id;
        const qtyInput = document.querySelector(`.qty-input[data-id="${id}"]`);
        const rowTotalDiv = document.getElementById(`row-total-${id}`);
        
        if (qtyInput) {
            const cost = parseFloat(costInput.value) || 0;
            const qty = parseFloat(qtyInput.value) || 0;
            let rowTotal = cost * qty;

            if(rowTotalDiv) {
                rowTotalDiv.innerText = "$" + rowTotal.toFixed(2);
            }
            totalMaterialCost += rowTotal;
        }
    });

    const wasteSlider = document.getElementById('wasteFactor');
    if (wasteSlider) {
        const wastePct = parseFloat(wasteSlider.value) / 100;
        totalMaterialCost = totalMaterialCost * (1 + wastePct);
    }

    const rate = parseFloat(document.getElementById('hourlyRate').value) || 0;
    const hours = parseFloat(document.getElementById('hoursSpent').value) || 0;
    const laborCost = rate * hours;
    const overhead = parseFloat(document.getElementById('fixedOverhead').value) || 0;
    
    const totalOps = laborCost + overhead;

    const breakEven = totalMaterialCost + totalOps;
    const marginPercent = parseFloat(document.getElementById('profitMargin').value) || 0;
    const profitAmt = breakEven * (marginPercent / 100);
    const retailPrice = breakEven + profitAmt;

    document.getElementById('totalMaterials').innerText = "$" + totalMaterialCost.toFixed(2);
    document.getElementById('totalLaborOps').innerText = "$" + totalOps.toFixed(2);
    document.getElementById('displayRetail').innerText = "$" + retailPrice.toFixed(2);
    document.getElementById('displayBreakEven').innerText = "$" + breakEven.toFixed(2);
    document.getElementById('displayProfit').innerText = "+$" + profitAmt.toFixed(2);
    document.getElementById('displayMargin').innerText = marginPercent + "%";
    document.getElementById('profitDisplay').innerText = marginPercent + "%";

    updateChart(laborCost, totalMaterialCost, overhead, profitAmt, retailPrice);
}

function updateChart(labor, material, overhead, profit, total) {
    if(total === 0) return; 
    
    const pLabor = (labor / total) * 100;
    const pMat = (material / total) * 100;
    const pOver = (overhead / total) * 100;
    const pProfit = (profit / total) * 100;

    const stop1 = pLabor;
    const stop2 = stop1 + pMat;
    const stop3 = stop2 + pOver;

    const chart = document.getElementById('doughnutChart');
    chart.style.background = `conic-gradient(
        #a855f7 0% ${stop1}%, 
        #3b82f6 ${stop1}% ${stop2}%, 
        #64748b ${stop2}% ${stop3}%, 
        #10b981 ${stop3}% 100%
    )`;
}