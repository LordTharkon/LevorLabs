export const soapConfig = {
    id: 'soap',
    title: 'Cold Process Soap Calculator',
    
    // SECTION 1: MATERIALS
    materials: [
        // --- GROUP 1: BASE INGREDIENTS ---
        {
            id: 'oils',
            category: 'Oils & Lye',
            mode: 'basic',
            label: 'Base Oils (Olive, Coconut)',
            unitPre: '$',
            unitPost: '/lb',
            placeholder: '3.50',
            default: 3.50,
            qtyLabel: 'Weight (lbs)',
            qtyDefault: 0.35 // Approx for 1 large bar
        },
        {
            id: 'lye',
            category: 'Oils & Lye',
            mode: 'basic',
            label: 'Sodium Hydroxide (Lye)',
            unitPre: '$',
            unitPost: '/lb',
            placeholder: '5.00',
            default: 5.00,
            qtyLabel: 'Weight (lbs)',
            qtyDefault: 0.05 
        },
        {
            id: 'water',
            category: 'Oils & Lye',
            mode: 'advanced',
            label: 'Distilled Water',
            unitPre: '$',
            unitPost: '/gal',
            placeholder: '1.20',
            default: 1.20,
            qtyLabel: 'Volume (gal)',
            qtyDefault: 0.02
        },

        // --- GROUP 2: ADDITIVES ---
        {
            id: 'scent',
            category: 'Scent & Additives',
            mode: 'basic',
            label: 'Essential / Fragrance Oil',
            unitPre: '$',
            unitPost: '/oz',
            placeholder: '4.50',
            default: 4.50,
            qtyLabel: 'Amount (oz)',
            qtyDefault: 0.25
        },
        {
            id: 'color',
            category: 'Scent & Additives',
            mode: 'advanced',
            label: 'Micas, Clays, Botanicals',
            unitPre: '$',
            unitPost: '/batch',
            placeholder: '2.00',
            default: 2.00,
            qtyLabel: 'Per Bar Alloc.',
            qtyDefault: 0.10 // 10% of a batch cost
        },

        // --- GROUP 3: PACKAGING ---
        {
            id: 'label',
            category: 'Packaging',
            mode: 'basic',
            label: 'Label / Cigar Band',
            unitPre: '$',
            unitPost: '/unit',
            placeholder: '0.35',
            default: 0.35,
            qtyLabel: 'Units',
            qtyDefault: 1
        },
        {
            id: 'shrink',
            category: 'Packaging',
            mode: 'advanced',
            label: 'Shrink Wrap / Box',
            unitPre: '$',
            unitPost: '/unit',
            placeholder: '0.50',
            default: 0.50,
            qtyLabel: 'Units',
            qtyDefault: 1
        },

        // --- GROUP 4: OPERATIONS ---
        {
            id: 'ppe',
            category: 'Operations',
            mode: 'advanced',
            label: 'Gloves, Vinegar, pH Strips',
            unitPre: '$',
            unitPost: '/run',
            placeholder: '1.50',
            default: 1.50,
            qtyLabel: 'Allocated %',
            qtyDefault: 0.10 
        }
    ],

    // SECTION 2: DEFAULTS
    defaults: {
        hourlyRate: 20,
        hours: 0.15, // ~9 mins labor per bar (batch efficient)
        overhead: 1.50, // Cure rack space, electricity
        profitMargin: 65,
        wasteFactor: 10 // Trimming ends off loaves
    }
};