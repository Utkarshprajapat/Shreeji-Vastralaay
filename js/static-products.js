const STATIC_PRODUCTS = [
    {
        "id": "POSHAK001",
        "name": "Chudi Dar Poshak",
        "category": "dresses",
        "subcategory": "chudi dar",
        "price": 299,
        "originalPrice": 350,
        "description": "Beautiful traditional chudi dar poshak for Krishna in multiple colors",
        "inStock": true,
        "image": "chudi dar poshak/red.jpg",
        "images": ["chudi dar poshak/red.jpg", "chudi dar poshak/yellow.jpg"],
        "colors": ["Red", "Yellow"],
        "sizes": ["Size 2", "Size 3", "Size 4"],
        "colorImages": {
            "Red": "chudi dar poshak/red.jpg",
            "Yellow": "chudi dar poshak/yellow.jpg"
        },
        "sizePrices": {
            "Size 2": 299,
            "Size 3": 299,
            "Size 4": 319
        },
        "featured": true
    },
    {
        "id": "POSHAK002",
        "name": "Colour Dress",
        "category": "dresses",
        "subcategory": "colour dress",
        "price": 249,
        "originalPrice": 299,
        "description": "Vibrant colour dress collection in multiple beautiful colors",
        "inStock": true,
        "image": "colour dress/blue.jpg",
        "images": [
            "colour dress/blue.jpg",
            "colour dress/orange.jpg",
            "colour dress/pink.jpg",
            "colour dress/red.jpg",
            "colour dress/yellow.jpg"
        ],
        "colors": ["Blue", "Orange", "Pink", "Red", "Yellow"],
        "sizes": ["Size 2", "Size 3", "Size 4"],
        "colorImages": {
            "Blue": "colour dress/blue.jpg",
            "Orange": "colour dress/orange.jpg",
            "Pink": "colour dress/pink.jpg",
            "Red": "colour dress/red.jpg",
            "Yellow": "colour dress/yellow.jpg"
        },
        "sizePrices": {
            "Size 2": 249,
            "Size 3": 249,
            "Size 4": 269
        },
        "featured": true
    },
    {
        "id": "POSHAK003",
        "name": "Flower Design Poshak",
        "category": "dresses",
        "subcategory": "flower design",
        "price": 349,
        "originalPrice": 399,
        "description": "Elegant flower design poshak with beautiful patterns",
        "inStock": true,
        "image": "flower design poshak/pink.jpg",
        "images": [
            "flower design poshak/baby pink.jpg",
            "flower design poshak/blue.jpg",
            "flower design poshak/green.jpg",
            "flower design poshak/pink.jpg",
            "flower design poshak/white.jpg"
        ],
        "colors": ["Baby Pink", "Blue", "Green", "Pink", "White"],
        "sizes": ["Size 2", "Size 3", "Size 4"],
        "colorImages": {
            "Baby Pink": "flower design poshak/baby pink.jpg",
            "Blue": "flower design poshak/blue.jpg",
            "Green": "flower design poshak/green.jpg",
            "Pink": "flower design poshak/pink.jpg",
            "White": "flower design poshak/white.jpg"
        },
        "sizePrices": {
            "Size 2": 349,
            "Size 3": 349,
            "Size 4": 369
        },
        "featured": true
    },
    {
        "id": "MUKUT001",
        "name": "Feather Mukut",
        "category": "mukut",
        "subcategory": "feather",
        "price": 179,
        "originalPrice": 229,
        "description": "Elegant feather mukut with beautiful design",
        "inStock": true,
        "image": "Feather mukut/blue.jpg",
        "images": ["Feather mukut/blue.jpg"],
        "colors": ["Blue"],
        "sizes": ["Medium", "Large"],
        "colorImages": {
            "Blue": "Feather mukut/blue.jpg"
        },
        "sizePrices": {
            "Medium": 179,
            "Large": 199
        }
    },
    {
        "id": "MUKUT002",
        "name": "Ganesh Mukut",
        "category": "mukut",
        "subcategory": "ganesh",
        "price": 199,
        "originalPrice": 249,
        "description": "Special Ganesh themed mukut with golden finish",
        "inStock": true,
        "image": "ganesh mukut/orange.jpg",
        "images": ["ganesh mukut/orange.jpg"],
        "colors": ["Golden"],
        "sizes": ["Medium", "Large"],
        "colorImages": {
            "Golden": "ganesh mukut/orange.jpg"
        },
        "sizePrices": {
            "Medium": 199,
            "Large": 219
        }
    },
    {
        "id": "COMBO001",
        "name": "Complete Dress Set",
        "category": "combo",
        "subcategory": "full set",
        "price": 599,
        "originalPrice": 699,
        "description": "Complete Krishna dress combo set with all accessories",
        "inStock": true,
        "image": "combo/20251016_123822.jpg",
        "images": [
            "combo/20251016_123822.jpg",
            "combo/20251016_123853.jpg",
            "combo/20251016_123921.jpg",
            "combo/20251016_123956.jpg"
        ],
        "colors": ["Design 1", "Design 2", "Design 3", "Design 4"],
        "sizes": ["Size 2", "Size 3", "Size 4"],
        "colorImages": {
            "Design 1": "combo/20251016_123822.jpg",
            "Design 2": "combo/20251016_123853.jpg",
            "Design 3": "combo/20251016_123921.jpg",
            "Design 4": "combo/20251016_123956.jpg"
        },
        "sizePrices": {
            "Size 2": 599,
            "Size 3": 599,
            "Size 4": 649
        },
        "featured": true
    }
];

if (typeof window !== 'undefined') {
    window.STATIC_PRODUCTS = STATIC_PRODUCTS;
    console.log("✅ Static products loaded:", STATIC_PRODUCTS.length);
}