const STATIC_PRODUCTS = [
    {
        "id": "POSHAK_001",
        "name": "Chudi Dar Poshak",
        "category": "dresses",
        "subcategory": "chudi dar",
        "price": 250,
        "description": "Traditional Chudi Dar Poshak in vibrant colors",
        "inStock": true,
        "image": "chudi dar poshak/red.jpg",
        "images": ["chudi dar poshak/red.jpg", "chudi dar poshak/yellow.jpg"],
        "colors": ["Red", "Yellow"],
        "sizes": ["3", "4"],
        "colorImages": {
            "Red": "chudi dar poshak/red.jpg",
            "Yellow": "chudi dar poshak/yellow.jpg"
        },
        "sizePrices": {
            "3": 250,
            "4": 250
        },
        "featured": true
    },
    {
        "id": "POSHAK_002",
        "name": "Colour Dress",
        "category": "dresses",
        "subcategory": "colour",
        "price": 120,
        "description": "Beautiful multi-colored dresses for Laddu Gopal",
        "inStock": true,
        "image": "colour dress/blue.jpg",
        "images": [
            "colour dress/blue.jpg", "colour dress/orange.jpg",
            "colour dress/pibk.jpg", "colour dress/red.jpg", "colour dress/yellow.jpg"
        ],
        "colors": ["Blue", "Orange", "Pink", "Red", "Yellow"],
        "sizes": ["2"],
        "colorImages": {
            "Blue": "colour dress/blue.jpg",
            "Orange": "colour dress/orange.jpg",
            "Pink": "colour dress/pibk.jpg",
            "Red": "colour dress/red.jpg",
            "Yellow": "colour dress/yellow.jpg"
        },
        "sizePrices": { "2": 120 }
    },
    {
        "id": "COMBO_001",
        "name": "Combo Set",
        "category": "combo",
        "subcategory": "mix",
        "price": 100,
        "description": "Value combo set with mixed designs",
        "inStock": true,
        "image": "combo/20251016_123822.jpg",
        "images": [
            "combo/20251016_123822.jpg", "combo/20251016_123853.jpg",
            "combo/20251016_123921.jpg", "combo/20251016_123956.jpg",
            "combo/20251016_124115.jpg", "combo/20251016_124139.jpg"
        ],
        "colors": ["Design 1", "Design 2", "Design 3", "Design 4", "Design 5", "Design 6"],
        "sizes": ["1", "2"],
        "colorImages": {
            "Design 1": "combo/20251016_123822.jpg",
            "Design 2": "combo/20251016_123853.jpg",
            "Design 3": "combo/20251016_123921.jpg",
            "Design 4": "combo/20251016_123956.jpg",
            "Design 5": "combo/20251016_124115.jpg",
            "Design 6": "combo/20251016_124139.jpg"
        },
        "sizePrices": {
            "1": 100,
            "2": 100
        }
    },
    {
        "id": "POSHAK_003",
        "name": "Cotton Poshak",
        "category": "dresses",
        "subcategory": "cotton",
        "price": 50,
        "description": "Comfortable cotton daily weat poshak. Price increases with size.",
        "inStock": true,
        "image": "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.04 AM.jpeg",
        "images": [
            "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.04 AM.jpeg",
            "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.27 AM (1).jpeg",
            "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.27 AM.jpeg",
            "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.28 AM.jpeg"
        ],
        "colors": ["Design 1", "Design 2", "Design 3", "Design 4"],
        "sizes": ["1", "2", "3", "4", "5", "6"],
        "colorImages": {
            "Design 1": "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.04 AM.jpeg",
            "Design 2": "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.27 AM (1).jpeg",
            "Design 3": "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.27 AM.jpeg",
            "Design 4": "cotton poshak/WhatsApp Image 2025-12-24 at 12.28.28 AM.jpeg"
        },
        "sizePrices": {
            "1": 50,
            "2": 70,
            "3": 90,
            "4": 110,
            "5": 130,
            "6": 150
        }
    },
    {
        "id": "POSHAK_004",
        "name": "Diamond Border Dress",
        "category": "dresses",
        "subcategory": "fancy",
        "price": 220,
        "description": "Elegant dress with diamond border work",
        "inStock": true,
        "image": "diamond border dress/pink.jpg",
        "images": [
            "diamond border dress/pink.jpg",
            "diamond border dress/red.jpg",
            "diamond border dress/yellow.jpg"
        ],
        "colors": ["Pink", "Red", "Yellow"],
        "sizes": ["3", "4"],
        "colorImages": {
            "Pink": "diamond border dress/pink.jpg",
            "Red": "diamond border dress/red.jpg",
            "Yellow": "diamond border dress/yellow.jpg"
        },
        "sizePrices": {
            "3": 220,
            "4": 220
        }
    },
    {
        "id": "MUKUT_001",
        "name": "Feather Mukut",
        "category": "mukut",
        "subcategory": "feather",
        "price": 80,
        "description": "Stylish feather mukut for Laddu Gopal",
        "inStock": true,
        "image": "Feather mukut/blue.jpg",
        "images": [
            "Feather mukut/blue.jpg", "Feather mukut/greenn.jpg", "Feather mukut/orange.jpg",
            "Feather mukut/pink.jpg", "Feather mukut/red.jpg", "Feather mukut/yellow.jpg"
        ],
        "colors": ["Blue", "Green", "Orange", "Pink", "Red", "Yellow"],
        "sizes": ["3", "4"],
        "colorImages": {
            "Blue": "Feather mukut/blue.jpg",
            "Green": "Feather mukut/greenn.jpg",
            "Orange": "Feather mukut/orange.jpg",
            "Pink": "Feather mukut/pink.jpg",
            "Red": "Feather mukut/red.jpg",
            "Yellow": "Feather mukut/yellow.jpg"
        },
        "sizePrices": { "3": 80, "4": 80 }
    },
    {
        "id": "POSHAK_005",
        "name": "Flower Design Poshak",
        "category": "dresses",
        "subcategory": "flower",
        "price": 150,
        "description": "Floral design poshak for a fresh look",
        "inStock": true,
        "image": "flower design poshak/pink.jpg",
        "images": [
            "flower design poshak/baby pink.jpg", "flower design poshak/blue.jpg",
            "flower design poshak/green.jpg", "flower design poshak/pink.jpg", "flower design poshak/white.jpg"
        ],
        "colors": ["Baby Pink", "Blue", "Green", "Pink", "White"],
        "sizes": ["3"],
        "colorImages": {
            "Baby Pink": "flower design poshak/baby pink.jpg",
            "Blue": "flower design poshak/blue.jpg",
            "Green": "flower design poshak/green.jpg",
            "Pink": "flower design poshak/pink.jpg",
            "White": "flower design poshak/white.jpg"
        },
        "sizePrices": { "3": 150 }
    },
    {
        "id": "POSHAK_006",
        "name": "Ful Dress",
        "category": "dresses",
        "subcategory": "budget",
        "price": 60,
        "description": "Budget-friendly everyday dress",
        "inStock": true,
        "image": "ful dress/WhatsApp Image 2025-12-24 at 12.28.43 AM.jpeg",
        "images": [
            "ful dress/WhatsApp Image 2025-12-24 at 12.28.43 AM.jpeg",
            "ful dress/WhatsApp Image 2025-12-24 at 12.30.23 AM.jpeg",
            "ful dress/WhatsApp Image 2025-12-24 at 12.30.23 AM (1).jpeg"
        ],
        "colors": ["Design 1", "Design 2", "Design 3"],
        "sizes": ["2"],
        "colorImages": {
            "Design 1": "ful dress/WhatsApp Image 2025-12-24 at 12.28.43 AM.jpeg",
            "Design 2": "ful dress/WhatsApp Image 2025-12-24 at 12.30.23 AM.jpeg",
            "Design 3": "ful dress/WhatsApp Image 2025-12-24 at 12.30.23 AM (1).jpeg"
        },
        "sizePrices": { "2": 60 }
    },
    {
        "id": "MUKUT_002",
        "name": "Ganesh Mukut",
        "category": "mukut",
        "subcategory": "ganesh",
        "price": 70,
        "description": "Divine Ganesh Mukut",
        "inStock": true,
        "image": "ganesh mukut/red.jpg",
        "images": [
            "ganesh mukut/blue.jpg", "ganesh mukut/green.jpg", "ganesh mukut/orange.jpg",
            "ganesh mukut/pink.jpg", "ganesh mukut/red.jpg", "ganesh mukut/yellow.jpg"
        ],
        "colors": ["Blue", "Green", "Orange", "Pink", "Red", "Yellow"],
        "sizes": ["7", "8"],
        "colorImages": {
            "Blue": "ganesh mukut/blue.jpg",
            "Green": "ganesh mukut/green.jpg",
            "Orange": "ganesh mukut/orange.jpg",
            "Pink": "ganesh mukut/pink.jpg",
            "Red": "ganesh mukut/red.jpg",
            "Yellow": "ganesh mukut/yellow.jpg"
        },
        "sizePrices": { "7": 70, "8": 70 }
    },
    {
        "id": "POSHAK_007",
        "name": "Glitter Poshak",
        "category": "dresses",
        "subcategory": "fancy",
        "price": 80,
        "description": "Shiny glitter poshak",
        "inStock": true,
        "image": "glitter poshak/red.jpg",
        "images": [
            "glitter poshak/blue.jpg", "glitter poshak/golden.jpg", "glitter poshak/pink.jpg",
            "glitter poshak/red.jpg", "glitter poshak/silver.jpg", "glitter poshak/white.jpg"
        ],
        "colors": ["Blue", "Golden", "Pink", "Red", "Silver", "White"],
        "sizes": ["2"],
        "colorImages": {
            "Blue": "glitter poshak/blue.jpg",
            "Golden": "glitter poshak/golden.jpg",
            "Pink": "glitter poshak/pink.jpg",
            "Red": "glitter poshak/red.jpg",
            "Silver": "glitter poshak/silver.jpg",
            "White": "glitter poshak/white.jpg"
        },
        "sizePrices": { "2": 80 }
    },
    {
        "id": "POSHAK_008",
        "name": "Leaf Work Dress",
        "category": "dresses",
        "subcategory": "work",
        "price": 200,
        "description": "Heavy work dress with leaf patterns",
        "inStock": true,
        "image": "leaf work dress/green.jpg",
        "images": [
            "leaf work dress/green.jpg", "leaf work dress/pink.jpg",
            "leaf work dress/purple.jpg", "leaf work dress/red.jpg"
        ],
        "colors": ["Green", "Pink", "Purple", "Red"],
        "sizes": ["3", "4"],
        "colorImages": {
            "Green": "leaf work dress/green.jpg",
            "Pink": "leaf work dress/pink.jpg",
            "Purple": "leaf work dress/purple.jpg",
            "Red": "leaf work dress/red.jpg"
        },
        "sizePrices": { "3": 200, "4": 200 }
    },
    {
        "id": "POSHAK_009",
        "name": "More Design Dress",
        "category": "dresses",
        "subcategory": "fancy",
        "price": 60,
        "description": "Unique design dresses",
        "inStock": true,
        "image": "more design poshok/orange.jpg",
        "images": [
            "more design poshok/orange.jpg", "more design poshok/red.jpg", "more design poshok/yellow.jpg"
        ],
        "colors": ["Orange", "Red", "Yellow"],
        "sizes": ["2"],
        "colorImages": {
            "Orange": "more design poshok/orange.jpg",
            "Red": "more design poshok/red.jpg",
            "Yellow": "more design poshok/yellow.jpg"
        },
        "sizePrices": { "2": 60 }
    },
    {
        "id": "POSHAK_010",
        "name": "Moti Dress",
        "category": "dresses",
        "subcategory": "heavy",
        "price": 250,
        "description": "Heavy moti work dress",
        "inStock": true,
        "image": "moti work dress/red.jpg",
        "images": [
            "moti work dress/blue'.jpg", "moti work dress/green.jpg", "moti work dress/orange.jpg",
            "moti work dress/pink.jpg", "moti work dress/red.jpg", "moti work dress/yellow.jpg"
        ],
        "colors": ["Blue", "Green", "Orange", "Pink", "Red", "Yellow"],
        "sizes": ["3", "4"],
        "colorImages": {
            "Blue": "moti work dress/blue'.jpg",
            "Green": "moti work dress/green.jpg",
            "Orange": "moti work dress/orange.jpg",
            "Pink": "moti work dress/pink.jpg",
            "Red": "moti work dress/red.jpg",
            "Yellow": "moti work dress/yellow.jpg"
        },
    },
    {
        "id": "PAGDI_001",
        "name": "Multicolor Pagdi",
        "category": "pagdi",
        "subcategory": "fancy",
        "price": 70,
        "description": "Vibrant multicolor pagdi",
        "inStock": true,
        "image": "multicolour pagdi/blue.jpg",
        "images": ["multicolour pagdi/blue.jpg"],
        "colors": ["Multicolor"],
        "sizes": ["2"],
        "colorImages": {
            "Multicolor": "multicolour pagdi/blue.jpg"
        },
        "sizePrices": { "2": 70 }
    },
    {
        "id": "POSHAK_011",
        "name": "Net Dress",
        "category": "dresses",
        "subcategory": "net",
        "price": 60,
        "description": "Elegant net dress. Price increases with size.",
        "inStock": true,
        "image": "net dress/WhatsApp Image 2025-12-24 at 12.28.28 AM (2).jpeg",
        "images": ["net dress/WhatsApp Image 2025-12-24 at 12.28.28 AM (2).jpeg"],
        "colors": ["Design 1"],
        "sizes": ["2", "3", "4", "5", "6"],
        "colorImages": {
            "Design 1": "net dress/WhatsApp Image 2025-12-24 at 12.28.28 AM (2).jpeg"
        },
        "sizePrices": {
            "2": 60,
            "3": 90,
            "4": 120,
            "5": 150,
            "6": 180
        }
    },
    {
        "id": "MUKUT_003",
        "name": "Net Mukut",
        "category": "mukut",
        "subcategory": "net",
        "price": 80,
        "description": "Matching net mukut",
        "inStock": true,
        "image": "net mukut/20251016_110407.jpg",
        "images": ["net mukut/20251016_110407.jpg"],
        "colors": ["Design 1"],
        "sizes": ["3", "4"],
        "colorImages": {
            "Design 1": "net mukut/20251016_110407.jpg"
        },
        "sizePrices": { "3": 80, "4": 80 }
    },
    {
        "id": "POSHAK_012",
        "name": "Radhe Print Poshak",
        "category": "dresses",
        "subcategory": "print",
        "price": 120,
        "description": "Poshak with Radhe print",
        "inStock": true,
        "image": "radha print poshak/WhatsApp Image 2025-12-24 at 12.28.29 AM.jpeg",
        "images": ["radha print poshak/WhatsApp Image 2025-12-24 at 12.28.29 AM.jpeg"],
        "colors": ["Design 1"],
        "sizes": ["3", "4"],
        "colorImages": {
            "Design 1": "radha print poshak/WhatsApp Image 2025-12-24 at 12.28.29 AM.jpeg"
        },
        "sizePrices": { "3": 120, "4": 120 }
    },
    {
        "id": "POSHAK_013",
        "name": "Radhe Name Dress",
        "category": "dresses",
        "subcategory": "name",
        "price": 80,
        "description": "Dress with Radhe name design",
        "inStock": true,
        "image": "radhe name dress/green.jpg",
        "images": ["radhe name dress/green.jpg"],
        "colors": ["Design 1"],
        "sizes": ["2"],
        "colorImages": {
            "Design 1": "radhe name dress/green.jpg"
        },
        "sizePrices": { "2": 80 }
    },
    {
        "id": "POSHAK_014",
        "name": "Sitsar Poshak",
        "category": "dresses",
        "subcategory": "sitsar",
        "price": 60,
        "description": "Sitsar work poshak. Price increases with size.",
        "inStock": true,
        "image": "sitare poshak/green.jpeg",
        "images": ["sitare poshak/green.jpeg"],
        "colors": ["Design 1"],
        "sizes": ["2", "3", "4", "5", "6"],
        "colorImages": {
            "Design 1": "sitare poshak/green.jpeg"
        },
        "sizePrices": {
            "2": 60,
            "3": 90,
            "4": 120,
            "5": 150,
            "6": 180
        }
    },
    {
        "id": "POSHAK_015",
        "name": "Sunflower Poshak",
        "category": "dresses",
        "subcategory": "flower",
        "price": 150,
        "description": "Bright sunflower design poshak",
        "inStock": true,
        "image": "sunflower poshak/WhatsApp Image 2025-12-24 at 12.30.24 AM.jpeg",
        "images": ["sunflower poshak/WhatsApp Image 2025-12-24 at 12.30.24 AM.jpeg"],
        "colors": ["Design 1"],
        "sizes": ["5", "6"],
        "colorImages": {
            "Design 1": "sunflower poshak/WhatsApp Image 2025-12-24 at 12.30.24 AM.jpeg"
        },
        "sizePrices": { "5": 150, "6": 150 }
    },
    {
        "id": "POSHAK_016",
        "name": "Sunflower Dress",
        "category": "dresses",
        "subcategory": "flower",
        "price": 100,
        "description": "Cute sunflower dress",
        "inStock": true,
        "image": "sunflowers dress/WhatsApp Image 2025-12-24 at 12.28.28 AM (1).jpeg",
        "images": ["sunflowers dress/WhatsApp Image 2025-12-24 at 12.28.28 AM (1).jpeg"],
        "colors": ["Design 1"],
        "sizes": ["2"],
        "colorImages": {
            "Design 1": "sunflowers dress/WhatsApp Image 2025-12-24 at 12.28.28 AM (1).jpeg"
        },
        "sizePrices": { "2": 100 }
    },
    {
        "id": "POSHAK_017",
        "name": "Velvet Dress",
        "category": "dresses",
        "subcategory": "velvet",
        "price": 150,
        "description": "Rich velvet fabric dress",
        "inStock": true,
        "image": "velvet dress/blue.jpg",
        "images": ["velvet dress/blue.jpg"],
        "colors": ["Design 1"],
        "sizes": ["2"],
        "colorImages": {
            "Design 1": "velvet dress/blue.jpg"
        },
        "sizePrices": { "2": 150 }
    },
    {
        "id": "MUKUT_004",
        "name": "White Color Mukut",
        "category": "mukut",
        "subcategory": "simple",
        "price": 100,
        "description": "Pure white mukut",
        "inStock": true,
        "image": "white colour mukut/20251016_103525.jpg",
        "images": ["white colour mukut/20251016_103525.jpg"],
        "colors": ["Design 1"],
        "sizes": ["3"],
        "colorImages": {
            "Design 1": "white colour mukut/20251016_103525.jpg"
        },
        "sizePrices": { "3": 100 }
    }
];

if (typeof window !== 'undefined') {
    window.STATIC_PRODUCTS = STATIC_PRODUCTS;
    console.log("✅ Custom Static Products Loaded:", STATIC_PRODUCTS.length);
}