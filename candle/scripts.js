/* --- GLOBAL MENU LOGIC --- */
function toggleMenu() {
    const nav = document.querySelector('.nav-menu');
    const toggleIcon = document.querySelector('.mobile-toggle i');
    
    nav.classList.toggle('active');
    
    if (nav.classList.contains('active')) {
        toggleIcon.classList.replace('ph-list', 'ph-x');
    } else {
        toggleIcon.classList.replace('ph-x', 'ph-list');
    }
}

/* --- GLOBAL UNIT MANAGEMENT --- */
// 1. Get stored preference or default to imperial
let globalUnit = localStorage.getItem('levor_unit') || 'imperial';

// 2. Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateToggleUI();
    applyUnitsToPage(false); // false = don't convert numbers yet, just labels
});

// 3. The Toggle Function
function toggleGlobalUnit() {
    const oldUnit = globalUnit;
    globalUnit = globalUnit === 'imperial' ? 'metric' : 'imperial';
    localStorage.setItem('levor_unit', globalUnit);
    
    updateToggleUI();
    
    // Trigger conversion on the current page
    // We pass 'true' to indicate we need to mathematically convert the numbers
    applyUnitsToPage(true); 
}

// 4. Update the Button Visuals
function updateToggleUI() {
    const label = document.getElementById('global-unit-label');
    if(label) {
        label.textContent = globalUnit === 'imperial' ? 'OZ / IN' : 'G / CM';
    }
    
    // Update all static text labels (e.g., "oz", "g")
    const unitLabels = document.querySelectorAll('.unit-label');
    unitLabels.forEach(el => {
        el.textContent = globalUnit === 'imperial' ? 'oz' : 'g';
    });
}

// 5. Central Conversion Logic
function applyUnitsToPage(shouldConvertNumbers) {
    // Dispatch event so individual pages can hook in if needed
    const event = new CustomEvent('unitChange', { detail: { unit: globalUnit, converting: shouldConvertNumbers } });
    document.dispatchEvent(event);
}

// Helper: Convert a specific input element safely
function convertInput(elementId, type) {
    const el = document.getElementById(elementId);
    if (!el || !el.value) return;
    
    let val = parseFloat(el.value);
    
    if (globalUnit === 'metric') {
        // Imperial -> Metric
        if (type === 'mass') val = val * 28.3495;
        if (type === 'len') val = val * 2.54;
    } else {
        // Metric -> Imperial
        if (type === 'mass') val = val / 28.3495;
        if (type === 'len') val = val / 2.54;
    }
    
    // Formatting
    if (type === 'mass') el.value = val.toFixed(globalUnit === 'imperial' ? 2 : 1);
    if (type === 'len') el.value = val.toFixed(1);
}