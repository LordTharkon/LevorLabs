// data/waxes.js

export const waxDatabase = [
 
    // --- USA / NORTH AMERICA ---
    {
        id: 'calwax_cb2',
        name: 'CalSoy CB-2 (Soy Bliss)',
        manufacturer: 'Calwax',
        origin: 'USA',
        type: 'Soy Blend',
        form: 'Slab',
        sg: 0.86, 
        costEstimate: 2.76,
        meta: {
            meltPoint: { f: 119, c: 48 },
            heatTo: { f: 200, c: 93 },
            pourAt: { f: 170, c: 77 }, 
            maxFragrance: 10,
            cureTime: '1-2 weeks'
        },
        description: 'A creamy, soy-based container blend enriched with a hint of food-grade paraffin. Known as "Soy Bliss", it offers superior glass adhesion, smooth tops, and single-pour performance without requiring additives.',
		badges: ['Soy Blend', 'Single Pour', 'Smooth Tops']
    },
        {
        id: 'gw_464',
        name: 'Golden Brands 464',
        manufacturer: 'AAK',
        origin: 'USA',
        type: 'Soy',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 2.50,
        meta: {
            meltPoint: { f: 113, c: 45 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 135, c: 57 },
            maxFragrance: 10,
            cureTime: '2 weeks'
        },
        description: "The industry standard soy wax. Excellent scent throw but prone to 'frosting' (white crystals).",
        badges: ['Beginner Friendly', 'Frosting Risk']
    },
    {
        id: 'gw_444',
        name: 'Golden Brands 444',
        manufacturer: 'AAK',
        origin: 'USA',
        type: 'Soy',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 2.55,
        meta: {
            meltPoint: { f: 119, c: 48 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 135, c: 57 },
            maxFragrance: 10,
            cureTime: '2 weeks'
        },
        description: "Similar to 464 but with a higher melting point. The preferred choice for shipping candles in hot weather.",
        badges: ['High Melt Point', 'Summer Wax']
    },
    {
        id: 'gw_454',
        name: 'Golden Brands 454',
        manufacturer: 'AAK',
        origin: 'USA',
        type: 'Coconut/Soy',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 2.80,
        meta: {
            meltPoint: { f: 115, c: 46 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 130, c: 54 },
            maxFragrance: 10,
            cureTime: '2 weeks'
        },
        description: "A newer blend designed to offer the easy usability of 464 but with the whiter, creamier finish of coconut wax.",
        badges: ['Coconut Blend', 'Low Soot']
    },
    {
        id: 'igi_6006',
        name: 'IGI 6006',
        manufacturer: 'IGI',
        origin: 'USA',
        type: 'Para-Soy Blend',
        form: 'Slab',
        sg: 0.88, // Blends are slightly lighter than pure soy in liquid form
        costEstimate: 3.00,
        meta: {
            meltPoint: { f: 133, c: 56 },
            heatTo: { f: 200, c: 93 }, 
            pourAt: { f: 170, c: 77 }, 
            maxFragrance: 10,
            cureTime: '5 days'
        },
        description: "A blend of soy and paraffin. Gives the smooth look of paraffin with the slow burn of soy. Very forgiving.",
        badges: ['Strong Throw', 'Smooth Tops']
    },
    {
        id: 'cs_coco_apricot',
        name: 'CandleScience Coconut Apricot',
        manufacturer: 'CandleScience',
        origin: 'USA',
        type: 'Coco-Apricot Blend',
        form: 'Slab',
        sg: 0.86,
        costEstimate: 4.50,
        meta: {
            meltPoint: { f: 126, c: 52 },
            heatTo: { f: 190, c: 88 },
            pourAt: { f: 175, c: 79 },
            maxFragrance: 12,
            cureTime: '2 days'
        },
        description: "CandleScience's proprietary luxury blend. Excellent adhesion and hot throw. Contains small amount of food-grade paraffin.",
        badges: ['Luxury', 'Single Pour', 'Proprietary']
    },
    {
        id: 'calwax_cedaserica',
        name: 'Ceda Serica',
        manufacturer: 'Calwax',
        origin: 'USA',
        type: 'Coco-Apricot Blend',
        form: 'Slab',
        sg: 0.86, 
        costEstimate: 4.60,
        meta: {
            meltPoint: { f: 129, c: 54 },
            heatTo: { f: 200, c: 93 },
            pourAt: { f: 160, c: 71 }, 
            maxFragrance: 12,
            cureTime: '2 weeks'
        },
        description: "The original 'luxury' coconut apricot wax. Known for its complex blend and shiny finish.",
        badges: ['Legacy Luxury', 'Glossy Finish']
    },
    {
        id: 'igi_6028',
        name: 'IGI 6028 Paraffin/Soy Pillar',
        manufacturer: 'IGI',
        origin: 'USA',
        type: 'Paraffin/Soy',
        form: 'Slab',
        sg: 0.90, // Paraffin content lowers liquid density
        costEstimate: 2.98,
        meta: {
            meltPoint: { f: 133, c: 56 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 180, c: 82 },
            maxFragrance: 9,
            cureTime: '5 days'
        },
        description: "A pre-blended paraffin and soy formula designed specifically for pillar candles. Requires a second pour.",
        badges: ['Pillar Blend', 'Hard Wax']
    },
    {
        id: 'igi_6046',
        name: 'IGI 6046 Coconut/Paraffin',
        manufacturer: 'IGI',
        origin: 'USA',
        type: 'Coconut/Paraffin',
        form: 'Slab',
        sg: 0.83, // High paraffin content
        costEstimate: 3.34,
        meta: {
            meltPoint: { f: 120, c: 49 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 175, c: 79 },
            maxFragrance: 10,
            cureTime: '5 days'
        },
        description: "Specialty blend of coconut and paraffin. Offers structural stability with creamy coconut appearance.",
        badges: ['Coconut Blend', 'Soft Slab']
    },
    {
        id: 'igi_1239a',
        name: 'IGI 1239 A Paraffin',
        manufacturer: 'IGI',
        origin: 'USA',
        type: 'Paraffin',
        form: 'Slab',
        sg: 0.91, 
        costEstimate: 2.65,
        meta: {
            meltPoint: { f: 138, c: 59 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 180, c: 82 },
            maxFragrance: 3,
            cureTime: '5 days'
        },
        description: "Hard, fully refined paraffin wax designed specifically for pillars and votives. Rustic, translucent finish.",
        badges: ['Pillar Wax', 'Hard Wax']
    },
    {
        id: 'igi_4627',
        name: 'IGI 4627 Comfort Blend',
        manufacturer: 'IGI',
        origin: 'USA',
        type: 'Paraffin',
        form: 'Slab',
        sg: 0.88, 
        costEstimate: 2.89,
        meta: {
            meltPoint: { f: 125, c: 52 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 180, c: 82 },
            maxFragrance: 12,
            cureTime: '5 days'
        },
        description: "Very soft, single-pour paraffin. Best glass adhesion of any wax on the market.",
        badges: ['Container Wax', 'Soft Wax']
    },
    {
        id: 'igi_4630',
        name: 'IGI 4630 Harmony Blend',
        manufacturer: 'IGI',
        origin: 'USA',
        type: 'Paraffin',
        form: 'Slab',
        sg: 0.88, 
        costEstimate: 2.60,
        meta: {
            meltPoint: { f: 119, c: 48 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 170, c: 77 },
            maxFragrance: 10,
            cureTime: '5 days'
        },
        description: "Soft, single-pour paraffin. Designed for container candles, offers a smooth, opaque finish.",
        badges: ['Container Wax', 'Soft Slab']
    },
    {
        id: 'nw_c3',
        name: 'NatureWax C-3',
        manufacturer: 'Cargill',
        origin: 'USA',
        type: 'Soy',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 2.60,
        meta: {
            meltPoint: { f: 125, c: 52 },
            heatTo: { f: 170, c: 77 },
            pourAt: { f: 155, c: 68 }, 
            maxFragrance: 8,
            cureTime: '2 weeks'
        },
        description: "100% soy wax known for superior glass adhesion. Famous for needing a hot pour (150-160°F) to prevent frosting.",
        badges: ['Pro Favorite', 'Strict Pour Temp']
    },
    {
        id: 'bw_921',
        name: 'BW-921 Pillar Blend',
        manufacturer: 'Blended Waxes Inc.',
        origin: 'USA',
        type: 'Soy', 
        form: 'Pastilles',
        sg: 0.86,
        costEstimate: 3.10,
        meta: {
            meltPoint: { f: 135, c: 57 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 170, c: 77 },
            maxFragrance: 10,
            cureTime: '1 week'
        },
        description: "An all-natural soy wax formulated for pillars, votives, and tarts. Holds shape well.",
        badges: ['Pillar', 'Natural Soy']
    },
    {
        id: 'penreco_gel_mp',
        name: 'Penreco Versagel (MP)',
        manufacturer: 'Penreco',
        origin: 'USA',
        type: 'Gel (Mineral)',
        form: 'Gel',
        sg: 0.85, // Mineral Oil Density
        costEstimate: 4.50,
        meta: {
            meltPoint: { f: 190, c: 88 },
            heatTo: { f: 220, c: 104 },
            pourAt: { f: 200, c: 93 },
            maxFragrance: 6,
            cureTime: '1 day'
        },
        description: "Medium density gel wax for transparent candles and suspended embeds.",
        badges: ['Transparent', 'Decorative']
    },
    {
        id: 'ecosoya_cb_adv',
        name: 'EcoSoya CB-Advanced',
        manufacturer: 'Kerax',
        origin: 'UK/USA',
        type: 'Soy',
        form: 'Pastilles',
        sg: 0.86,
        costEstimate: 3.20,
        meta: {
            meltPoint: { f: 111, c: 44 },
            heatTo: { f: 160, c: 71 },
            pourAt: { f: 140, c: 60 },
            maxFragrance: 12,
            cureTime: '1 week'
        },
        description: "Technologically advanced soy wax designed to be extremely resistant to frosting.",
        badges: ['Frost Free', 'Pellets']
    },
    {
        id: 'asw_a05',
        name: 'A05 Superior CocoSoy',
        manufacturer: 'All Seasons Wax Co.',
        origin: 'Australia',
        type: 'Coco-Soy',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 4.50,
        meta: {
            meltPoint: { f: 118, c: 48 },
            heatTo: { f: 165, c: 75 },
            pourAt: { f: 130, c: 55 },
            maxFragrance: 12,
            cureTime: '1 week'
        },
        description: "Premium Australian wax. Creamy, smooth finish with no frosting.",
        badges: ['Premium', 'No Frosting']
    },
    {
        id: 'asw_s16',
        name: 'S16 Deluxe Soy',
        manufacturer: 'All Seasons Wax Co.',
        origin: 'Australia',
        type: 'Soy',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 4.00,
        meta: {
            meltPoint: { f: 122, c: 50 },
            heatTo: { f: 167, c: 75 },
            pourAt: { f: 122, c: 50 },
            maxFragrance: 8, 
            cureTime: '2 weeks'
        },
        description: "Pure soy with a botanical additive to prevent frosting.",
        badges: ['Clean Burn', 'Vegan']
    },
    {
        id: 'asw_s100',
        name: 'S100 Pure Soy',
        manufacturer: 'All Seasons Wax Co.',
        origin: 'Australia',
        type: 'Soy',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 3.90,
        meta: {
            meltPoint: { f: 124, c: 51 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 130, c: 54 },
            maxFragrance: 10,
            cureTime: '2 weeks'
        },
        description: "Classic pure soy designed for the Australian climate.",
        badges: ['Pure Soy', 'Aus Favorite']
    },
    {
        id: 'asw_a27',
        name: 'Performance Soy Blend A27',
        manufacturer: 'All Seasons Wax Co.',
        origin: 'Australia',
        type: 'Soy Blend',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 4.20,
        meta: {
            meltPoint: { f: 122, c: 50 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 145, c: 63 },
            maxFragrance: 8,
            cureTime: '1 week'
        },
        description: "Harder soy blend designed for pillar candles and melts.",
        badges: ['Pillar Wax', 'Melts']
    },
    {
        id: 'asw_b808',
        name: 'BeeSoy B808',
        manufacturer: 'All Seasons Wax Co.',
        origin: 'Australia',
        type: 'Beeswax/Soy',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 5.50,
        meta: {
            meltPoint: { f: 118, c: 48 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 145, c: 63 },
            maxFragrance: 10,
            cureTime: '3 weeks'
        },
        description: "Luxury pre-blend of beeswax and soy. Offers the air-purifying marketing claims of beeswax.",
        badges: ['Luxury', 'Contains Beeswax']
    },
    {
        id: 'summit_wax',
        name: 'Summit Wax',
        manufacturer: 'Various',
        origin: 'Australia',
        type: 'Plant Blend',
        form: 'Flakes',
        sg: 0.86,
        costEstimate: 4.00,
        meta: {
            meltPoint: { f: 115, c: 46 },
            heatTo: { f: 175, c: 80 },
            pourAt: { f: 130, c: 55 },
            maxFragrance: 9,
            cureTime: '2 weeks'
        },
        description: "Palm-free, soy-free plant wax blend catering to the ultra-eco-conscious market.",
        badges: ['Palm Free', 'Soy Free']
    },
    {
        id: 'scoop_wax_au',
        name: 'Scoopable Wax (Generic)',
        manufacturer: 'Various',
        origin: 'Australia',
        type: 'Coconut Blend',
        form: 'Soft Paste',
        sg: 0.84,
        costEstimate: 5.00,
        meta: {
            meltPoint: { f: 100, c: 38 },
            heatTo: { f: 150, c: 65 },
            pourAt: { f: 120, c: 49 },
            maxFragrance: 12,
            cureTime: '3 days'
        },
        description: "Extremely soft wax designed for scoopable jar melts.",
        badges: ['Scoopable', 'Melts Only']
    },
    {
        id: 'kerasoy_4130',
        name: 'KeraSoy Container 4130',
        manufacturer: 'Kerax',
        origin: 'UK',
        type: 'Soy',
        form: 'Pastilles',
        sg: 0.86,
        costEstimate: 3.00,
        meta: {
            meltPoint: { f: 113, c: 45 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 131, c: 55 },
            maxFragrance: 10,
            cureTime: '2 weeks'
        },
        description: "The European standard for container soy wax. Comparable to GB464.",
        badges: ['EU Standard', 'Vegan']
    },
    {
        id: 'kerasoy_4120',
        name: 'KeraSoy Pillar 4120',
        manufacturer: 'Kerax',
        origin: 'UK',
        type: 'Soy',
        form: 'Pastilles',
        sg: 0.86, // Pillar Soy is slightly denser
        costEstimate: 3.10,
        meta: {
            meltPoint: { f: 140, c: 60 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 131, c: 55 },
            maxFragrance: 10,
            cureTime: '2 weeks'
        },
        description: "European standard for soy pillar candles and molds.",
        badges: ['Pillar Wax', 'Mold Release']
    },
    {
        id: 'kerawax_4600',
        name: 'Kerawax 4600',
        manufacturer: 'Kerax',
        origin: 'UK',
        type: 'Paraffin Blend',
        form: 'Pastilles',
        sg: 0.83, // Paraffin liquid density
        costEstimate: 2.90,
        meta: {
            meltPoint: { f: 133, c: 56 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 158, c: 70 },
            maxFragrance: 8,
            cureTime: '3 days'
        },
        description: "Pre-blended paraffin pillar wax with excellent stability.",
        badges: ['Pillar', 'Translucent']
    },
    {
        id: 'eu_rapeseed_gen',
        name: 'Generic Rapeseed Wax',
        manufacturer: 'Various',
        origin: 'EU',
        type: 'Rapeseed',
        form: 'Flakes',
        sg: 0.87,
        costEstimate: 3.00,
        meta: {
            meltPoint: { f: 125, c: 52 },
            heatTo: { f: 167, c: 75 },
            pourAt: { f: 122, c: 50 },
            maxFragrance: 8,
            cureTime: '2 weeks'
        },
        description: "Locally sourced Canola wax. Sustainable and carbon-neutral for EU makers.",
        badges: ['Sustainable', 'Local']
    },
    {
        id: 'ecococo_container',
        name: 'EcoCoco ContainerBlend',
        manufacturer: 'Kerax',
        origin: 'UK',
        type: 'Coconut/Soy',
        form: 'Slab',
        sg: 0.86,
        costEstimate: 4.20,
        meta: {
            meltPoint: { f: 113, c: 45 },
            heatTo: { f: 158, c: 70 },
            pourAt: { f: 113, c: 45 },
            maxFragrance: 10,
            cureTime: '1 week'
        },
        description: "Container wax formulated with a high percentage of coconut for superior glass adhesion.",
        badges: ['Coconut Rich', 'Low Temp']
    },
    {
        id: 'beeswax_bp',
        name: 'Beeswax (BP Grade)',
        manufacturer: 'Generic',
        origin: 'UK/EU',
        type: 'Beeswax',
        form: 'Pellets',
        sg: 0.96, // LIQUID DENSITY
        costEstimate: 8.50,
        meta: {
            meltPoint: { f: 145, c: 63 },
            heatTo: { f: 165, c: 74 },
            pourAt: { f: 150, c: 65 },
            maxFragrance: 6,
            cureTime: '1 week'
        },
        description: "British Pharmacopoeia grade beeswax. High purity.",
        badges: ['Luxury', 'Pharmaceutical']
    },
    {
        id: 'shea_wax',
        name: 'Shea Butter Wax',
        manufacturer: 'Generic',
        origin: 'Global', // Changed to Global
        type: 'Shea',
        form: 'Butter',
        sg: 0.85,
        costEstimate: 8.00,
        meta: {
            meltPoint: { f: 95, c: 35 },
            heatTo: { f: 140, c: 60 },
            pourAt: { f: 110, c: 43 },
            maxFragrance: 8,
            cureTime: '2 weeks'
        },
        description: "Luxury soft wax derived from Shea nuts. Excellent for massage candles.",
        badges: ['Luxury', 'Massage']
    },
    {
        id: 'stearic_acid',
        name: 'Stearic Acid (Triple Pressed)',
        manufacturer: 'Generic',
        origin: 'Global', // Changed to Global
        type: 'Fatty Acid',
        form: 'Powder',
        sg: 0.85,
        costEstimate: 1.80,
        meta: {
            meltPoint: { f: 156, c: 69 },
            heatTo: { f: 180, c: 82 },
            pourAt: { f: 160, c: 71 },
            maxFragrance: 0,
            cureTime: 'N/A'
        },
        description: "Vegetable additive used to harden wax and increase opacity.",
        badges: ['Additive', 'Hardener']
    },
    {
        id: 'palm_feather',
        name: 'Palm Wax (Feather)',
        manufacturer: 'Generic',
        origin: 'Global',
        type: 'Palm',
        form: 'Granules',
        sg: 0.89,
        costEstimate: 2.00,
        meta: {
            meltPoint: { f: 140, c: 60 },
            heatTo: { f: 205, c: 96 },
            pourAt: { f: 200, c: 93 },
            maxFragrance: 5,
            cureTime: '2 days'
        },
        description: "Hard natural wax that forms 'feather' patterns. Must be poured very hot.",
        badges: ['Crystal Finish', 'High Heat']
    },
    {
        id: 'palm_starburst',
        name: 'Palm Wax (Starburst)',
        manufacturer: 'Generic',
        origin: 'Global',
        type: 'Palm',
        form: 'Granules',
        sg: 0.89,
        costEstimate: 2.00,
        meta: {
            meltPoint: { f: 140, c: 60 },
            heatTo: { f: 205, c: 96 },
            pourAt: { f: 200, c: 93 },
            maxFragrance: 5,
            cureTime: '2 days'
        },
        description: "Similar to feather palm but crystallizes in round 'starburst' patterns.",
        badges: ['Crystal Finish', 'High Heat']
    },
    {
        id: 'ng_joy',
        name: 'Joy Wax',
        manufacturer: 'Natures Garden',
        origin: 'USA',
        type: 'Veg/Paraffin',
        form: 'Slab',
        sg: 0.84,
        costEstimate: 3.50,
        meta: {
            meltPoint: { f: 120, c: 49 },
            heatTo: { f: 180, c: 82 },
            pourAt: { f: 160, c: 71 },
            maxFragrance: 10,
            cureTime: '3 days'
        },
        description: "A famous proprietary blend known for incredible hot throw. Very soft and greasy.",
        badges: ['Strong Throw', 'Hobby Favorite']
    },
    {
        id: 'bw_910',
        name: 'BW-910 Container Soy',
        manufacturer: 'Blended Waxes Inc.',
        origin: 'USA',
        type: 'Soy',
        form: 'Pastilles',
        sg: 0.86,
        costEstimate: 2.60,
        meta: {
            meltPoint: { f: 125, c: 52 },
            heatTo: { f: 185, c: 85 },
            pourAt: { f: 160, c: 71 },
            maxFragrance: 10,
            cureTime: '2 weeks'
        },
        description: "A popular alternative to 464. 100% soy with good glass adhesion and less frosting.",
        badges: ['464 Alternative', 'Pure Soy']
    },
	    {
        id: 'ecosoya_cb_135',
        name: 'EcoSoya CB-135',
        manufacturer: 'Kerax',
        origin: 'Global', // Available in USA, UK, Aus
        type: 'Soy',
        form: 'Pastilles',
        sg: 0.86,
        costEstimate: 3.20,
        meta: {
            meltPoint: { f: 122, c: 50 },
            heatTo: { f: 158, c: 70 },
            pourAt: { f: 140, c: 60 },
            maxFragrance: 12,
            cureTime: '1 week'
        },
        description: "The 'Classic' single-pour soy wax. Excellent adhesion and scent throw.",
        badges: ['Single Pour', 'Classic']
    },
    {
        id: 'ecosoya_pillar',
        name: 'EcoSoya Pillar Blend',
        manufacturer: 'Kerax',
        origin: 'Global', // Available in USA, UK, Aus
        type: 'Soy',
        form: 'Pastilles',
        sg: 0.86,
        costEstimate: 3.30,
        meta: {
            meltPoint: { f: 130, c: 54 },
            heatTo: { f: 167, c: 75 },
            pourAt: { f: 140, c: 60 },
            maxFragrance: 10,
            cureTime: '48 hours'
        },
        description: "An all-natural soy blend specifically designed for pillars, votives, and tarts.",
        badges: ['Pillar', 'Mold Release']
    },
    {
        id: 'ecococo_pillar',
        name: 'EcoCoco PillarBlend',
        manufacturer: 'Kerax',
        origin: 'UK', // Rare in USA, Keep as UK
        type: 'Coconut/Soy',
        form: 'Slab',
        sg: 0.86,
        costEstimate: 4.20,
        meta: {
            meltPoint: { f: 126, c: 52 },
            heatTo: { f: 167, c: 75 },
            pourAt: { f: 149, c: 65 },
            maxFragrance: 12,
            cureTime: '48 hours'
        },
        description: "A coconut-rich pillar wax. Offers a whiter finish than traditional soy.",
        badges: ['Coconut Pillar', 'White Finish']
    },
    {
        id: 'ecoolive_container',
        name: 'EcoOlive Container',
        manufacturer: 'Kerax',
        origin: 'UK', // Rare in USA, Keep as UK
        type: 'Olive/Soy',
        form: 'Pastilles',
        sg: 0.86,
        costEstimate: 4.50,
        meta: {
            meltPoint: { f: 115, c: 46 },
            heatTo: { f: 167, c: 75 },
            pourAt: { f: 149, c: 65 },
            maxFragrance: 12,
            cureTime: '48 hours'
        },
        description: "A 100% natural blend of olive wax. Known for an incredibly smooth, glossy finish.",
        badges: ['Olive Wax', 'Glossy']
    },
    {
        id: 'ecoolive_pillar',
        name: 'EcoOlive Pillar',
        manufacturer: 'Kerax',
        origin: 'UK', // Rare in USA, Keep as UK
        type: 'Olive/Soy',
        form: 'Pastilles',
        sg: 0.86, 
        costEstimate: 4.60,
        meta: {
            meltPoint: { f: 125, c: 52 },
            heatTo: { f: 167, c: 75 },
            pourAt: { f: 149, c: 65 },
            maxFragrance: 12,
            cureTime: '48 hours'
        },
        description: "A hard vegetable wax for pillars. Creates a unique smooth, almost shiny finish.",
        badges: ['Olive Pillar', 'High Detail']
    }
];