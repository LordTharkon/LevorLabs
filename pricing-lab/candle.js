export const candleConfig = {
    id: 'candles',
    title: 'Candle Profit Calculator',
    
    // SECTION 1: VARIABLE COSTS
    materials: [
        // --- GROUP 1: RAW MATERIALS ---
        {
            id: 'wax',
            category: 'Raw Materials', // <--- NEW TAG
            mode: 'basic',
            label: 'Wax Cost',
            unitPre: '$',
            unitPost: '/lb',
            placeholder: '2.50',
            default: 2.50,
            qtyLabel: 'Weight (lbs)',
            qtyDefault: 0.5 
        },
        {
            id: 'fragrance',
            category: 'Raw Materials',
            mode: 'basic',
            label: 'Fragrance Oil',
            unitPre: '$',
            unitPost: '/oz',
            placeholder: '2.75',
            default: 2.75,
            qtyLabel: 'Amount (oz)',
            qtyDefault: 0.8 
        },
        {
            id: 'wick',
            category: 'Raw Materials',
            mode: 'basic',
            label: 'Wick Assembly',
            unitPre: '$',
            unitPost: '/unit',
            placeholder: '0.15',
            default: 0.15,
            qtyLabel: 'Quantity',
            qtyDefault: 1
        },
        {
            id: 'dye',
            category: 'Raw Materials',
            mode: 'advanced',
            label: 'Dye / Additives',
            unitPre: '$',
            unitPost: '/batch',
            placeholder: '0.10',
            default: 0.10,
            qtyLabel: 'Batches',
            qtyDefault: 1
        },

        // --- GROUP 2: PACKAGING ---
        {
            id: 'vessel',
            category: 'Packaging',
            mode: 'basic',
            label: 'Jar / Vessel',
            unitPre: '$',
            unitPost: '/unit',
            placeholder: '1.50',
            default: 1.50,
            qtyLabel: 'Quantity',
            qtyDefault: 1
        },
        {
            id: 'labels',
            category: 'Packaging',
            mode: 'advanced',
            label: 'Labels & Warning Stickers',
            unitPre: '$',
            unitPost: '/set',
            placeholder: '0.40',
            default: 0.40,
            qtyLabel: 'Sets',
            qtyDefault: 1
        },
        {
            id: 'packaging',
            category: 'Packaging',
            mode: 'advanced',
            label: 'Box & Packing Material',
            unitPre: '$',
            unitPost: '/unit',
            placeholder: '1.25',
            default: 1.25,
            qtyLabel: 'Units',
            qtyDefault: 1
        },

        // --- GROUP 3: OPERATIONS (NEW) ---
        {
            id: 'consumables',
            category: 'Operations',
            mode: 'basic', // Important enough to show by default? Or move to advanced.
            label: 'Gloves, Paper Towels, Alcohol',
            unitPre: '$',
            unitPost: '/run', // Per production run
            placeholder: '1.50',
            default: 1.50,
            qtyLabel: 'Allocated %', 
            qtyDefault: 0.10 // 10% of the run cost per candle
        },
        {
            id: 'utilities',
            category: 'Operations',
            mode: 'advanced',
            label: 'Energy & Wear',
            unitPre: '$',
            unitPost: '/hr', 
            placeholder: '0.50',
            default: 0.50,
            qtyLabel: 'Hours Used',
            qtyDefault: 0.25 
        }
    ],

    defaults: {
        hourlyRate: 20,
        hours: 0.25,
        overhead: 5, 
        profitMargin: 60, 
        wasteFactor: 5  
    }
};