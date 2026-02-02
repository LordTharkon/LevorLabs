export const tuftingConfig = {
    id: 'tufting',
    title: 'Rug Tufting Calculator',
    
    // SECTION 1: MATERIALS
    materials: [
        // --- GROUP 1: TUFTING PHASE ---
        {
            id: 'yarn',
            category: 'Tufting Materials', // <--- NEW
            mode: 'basic', 
            label: 'Yarn Cost',
            unitPre: '$',
            unitPost: '/oz',
            placeholder: '2.26',
            default: 2.26,
            qtyLabel: 'Weight Used (oz)',
            qtyDefault: 20
        },
        {
            id: 'primary_backing',
            category: 'Tufting Materials',
            mode: 'basic',
            label: 'Primary Tufting Cloth',
            unitPre: '$',
            unitPost: '/sq ft',
            placeholder: '3.50',
            default: 3.50,
            qtyLabel: 'Area (sq ft)',
            qtyDefault: 9
        },

        // --- GROUP 2: FINISHING PHASE ---
        {
            id: 'glue',
            category: 'Finishing & Backing', // <--- NEW
            mode: 'basic',
            label: 'Carpet Adhesive',
            unitPre: '$',
            unitPost: '/oz',
            placeholder: '0.80',
            default: 0.80,
            qtyLabel: 'Amount (oz)',
            qtyDefault: 12
        },
        {
            id: 'secondary_backing',
            category: 'Finishing & Backing',
            mode: 'basic', 
            label: 'Backing Felt / Non-Slip',
            unitPre: '$',
            unitPost: '/sq ft',
            placeholder: '1.00',
            default: 1.00,
            qtyLabel: 'Area (sq ft)',
            qtyDefault: 9
        },
        {
            id: 'twill_tape',
            category: 'Finishing & Backing',
            mode: 'advanced', 
            label: 'Twill Tape / Binding',
            unitPre: '$',
            unitPost: '/ft',
            placeholder: '0.50',
            default: 0.50,
            qtyLabel: 'Perimeter (ft)',
            qtyDefault: 12
        },

        // --- GROUP 3: PACKAGING ---
        {
            id: 'packaging',
            category: 'Packaging', // <--- NEW
            mode: 'basic',
            label: 'Box & Packing Material',
            unitPre: '$',
            unitPost: '/unit',
            placeholder: '5.00',
            default: 5.00,
            qtyLabel: 'Units',
            qtyDefault: 1
        },

        // --- GROUP 4: OPERATIONS ---
        {
            id: 'consumables',
            category: 'Operations', // <--- NEW
            mode: 'advanced',
            label: 'Machine Wear / Oil',
            unitPre: '$',
            unitPost: '/hr',
            placeholder: '0.50',
            default: 0.50,
            qtyLabel: 'Tufting Hours',
            qtyDefault: 5
        }
    ],

    // SECTION 2: DEFAULTS
    defaults: {
        hourlyRate: 25,
        hours: 5,
        overhead: 10, 
        profitMargin: 50,
        wasteFactor: 15 
    }
};