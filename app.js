// ===== CONFIGURATION =====
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx3nzjSSNyJvCIP2cIZRSJkiJxlvTeQamTEl-zFsbhq_XTHU5vfGSGCiy0g4sBWbPc/exec";
const RAZORPAY_KEY_ID = "rzp_live_RwgiRTP5M5Wz3Y";
const BUSINESS_NAME = "Shreeji Vastraalay";
const BUSINESS_LOGO = "logo.png";

// ===== STATE MANAGEMENT =====
// Attach products and cart to window for debugging and global access if needed
window.products = [];
window.cart = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Initializing Shreeji Vastraalay...");

    // 1. Load Static Products Immediately
    if (typeof window.STATIC_PRODUCTS !== 'undefined' && Array.isArray(window.STATIC_PRODUCTS)) {
        console.log(`✅ Found ${window.STATIC_PRODUCTS.length} static products`);
        window.products = [...window.STATIC_PRODUCTS];
    } else {
        console.warn("⚠️ No STATIC_PRODUCTS found. Check js/static-products.js loading.");
    }

    // 2. Initial Render (shows static content fast)
    loadProducts();
    updateCartCount();
    setupEventListeners();

    // 3. Fetch Remote Products (Async)
    if (typeof fetchProductsFromFirebase === 'function') {
        fetchProductsFromFirebase();
    }

    addScrollAnimations();
});

// ===== DATA LOADING =====
async function fetchProductsFromFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.warn("⚠️ Firebase SDK not loaded, skipping remote fetch.");
            return;
        }

        const db = firebase.firestore();
        const snapshot = await db.collection('products').where('inStock', '==', true).get();

        const firebaseProducts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure maps/objects exist
                colorImages: data.colorImages || {},
                sizePrices: data.sizePrices || {}
            };
        });

        // MERGE: Keep Static products, add Firestore products ONLY if ID doesn't exist
        const staticIds = new Set(window.products.map(p => p.id));
        const newProducts = firebaseProducts.filter(p => !staticIds.has(p.id));

        if (newProducts.length > 0) {
            console.log(`🔥 Loaded ${newProducts.length} new products from Firestore`);
            window.products = [...window.products, ...newProducts];
            loadProducts(); // Re-render with combined list
        } else {
            console.log("no new products from firestore (duplicates filtered)");
        }

    } catch (error) {
        console.error("❌ Firebase fetch error:", error);
    }
}

// ===== RENDER LOGIC =====
function loadProducts() {
    // Render Featured (limit 4)
    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        const featured = window.products.filter(p => p.featured).slice(0, 4);
        featuredContainer.innerHTML = featured.map(p => createProductCard(p)).join('');
    }

    // Render All Products
    const allProductsContainer = document.getElementById('allProducts');
    if (allProductsContainer) {
        allProductsContainer.innerHTML = window.products.map(p => createProductCard(p)).join('');
    }

    // Re-run scroll animations for new elements
    addScrollAnimations();

    // Update count
    const countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = `${window.products.length} products`;
}

function createProductCard(product) {
    const defaultImage = product.image ? encodeImagePath(product.image) : 'placeholder.jpg';

    // Calculate display price
    let displayPrice = product.price;
    if (product.sizePrices && Object.keys(product.sizePrices).length > 0) {
        // Find smallest price
        const prices = Object.values(product.sizePrices);
        displayPrice = Math.min(...prices);
    }

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)
        : 0;

    return `
        <div class="product-card" data-category="${product.category}" data-product-id="${product.id}">
            <div class="product-image-container" onclick="window.viewProductDetail('${product.id}')">
                <div class="product-image">
                    <img src="${defaultImage}" 
                         alt="${product.name}" 
                         class="loading"
                         onload="this.classList.remove('loading'); this.style.opacity='1';"
                         onerror="this.onerror=null; this.src='https://placehold.co/400x400?text=No+Image';">
                </div>
                ${discount > 0 ? `<div class="discount-badge">${discount}% OFF</div>` : ''}
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title" onclick="window.viewProductDetail('${product.id}')">${product.name}</h3>
                
                <div class="product-pricing">
                    <span class="product-price" id="card-price-${product.id}">₹${displayPrice}</span>
                    ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                </div>

                <!-- Variants Preview -->
                 <div class="product-variants">
                    <div class="size-selector">
                        <label>Size:</label>
                        <select class="product-size" id="size-${product.id}" onchange="window.updatePriceForSize('${product.id}', this.value)">
                            <option value="">Select Size</option>
                            ${product.sizes.map(size => {
        const p = (product.sizePrices && product.sizePrices[size]) || product.price;
        return `<option value="${size}"> ${size} - ₹${p}</option>`;
    }).join('')}
                        </select>
                    </div>

                    ${product.colors && product.colors.length > 0 ? `
                        <div class="color-selector">
                             <div class="color-options" id="color-group-${product.id}">
                                ${product.colors.map((color, i) => `
                                    <div class="color-option ${i === 0 ? 'selected' : ''}" 
                                         data-color="${color}" 
                                         title="${color}"
                                         onclick="window.selectColor('${product.id}', '${color}')">
                                        <span class="color-dot" style="background: ${getColorCode(color)}"></span>
                                    </div>
                                `).join('')}
                             </div>
                        </div>
                    ` : ''}
                 </div>

                <button class="add-to-cart-btn" onclick="window.addToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// ===== HELPER: IMAGE ENCODING =====
function encodeImagePath(path) {
    if (!path) return '';
    // If remote URL, return as is
    if (path.startsWith('http')) return path;

    // For local files, encode only URI components
    return path.split('/').map(part => encodeURIComponent(part)).join('/');
}

// ===== GLOBAL ACTIONS (Attached to Window) =====

window.viewProductDetail = function (productId) {
    const product = window.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'modal active product-detail-modal';
    // Simplified Modal HTML strictly for stability first
    modal.innerHTML = `
        <div class="modal-content product-detail-content">
            <span class="close-btn" onclick="window.closeProductDetail()">&times;</span>
            <div class="product-detail-body">
                <div class="product-images">
                    <img id="detail-main-img" src="${encodeImagePath(product.image)}" style="width:100%; border-radius:8px;">
                     <div class="thumbnail-images">
                        ${(product.images || []).map(img => `
                            <img src="${encodeImagePath(img)}" onclick="document.getElementById('detail-main-img').src='${encodeImagePath(img)}'" class="thumbnail">
                        `).join('')}
                    </div>
                </div>
                <div class="product-details">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <div class="product-pricing">
                        <h3>₹${product.price}</h3>
                    </div>
                    
                    <!-- Options -->
                    <div class="product-options">
                        ${product.colors ? `
                        <div class="option-group">
                            <label>Color:</label>
                            <div class="color-buttons">
                                ${product.colors.map((c, i) => `
                                    <button class="color-btn ${i === 0 ? 'selected' : ''}" 
                                            onclick="window.selectDetailColor('${product.id}', '${c}', this)" 
                                            data-color="${c}">
                                        <span class="color-dot" style="background:${getColorCode(c)}"></span> ${c}
                                    </button>
                                `).join('')}
                            </div>
                        </div>` : ''}

                         <div class="option-group" style="margin-top:10px;">
                            <label>Size:</label>
                            <div class="size-buttons">
                                ${product.sizes.map((s, i) => `
                                    <button class="size-btn ${i === 0 ? 'selected' : ''}" 
                                            onclick="window.selectDetailSize('${product.id}', '${s}', this)" 
                                            data-size="${s}">
                                        ${s}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-primary" style="margin-top:20px; width:100%;" onclick="window.addToCartFromDetail('${product.id}')">ADD TO CART</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
};

window.closeProductDetail = function () {
    const modal = document.querySelector('.product-detail-modal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
};

window.selectColor = function (productId, color) {
    // Update card selection UI
    const group = document.getElementById(`color-group-${productId}`);
    if (group) {
        group.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
        const target = group.querySelector(`[data-color="${color}"]`);
        if (target) target.classList.add('selected');
    }

    // Update image
    const product = window.products.find(p => p.id === productId);
    if (product && product.colorImages && product.colorImages[color]) {
        const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
        const img = card ? card.querySelector('.product-image img') : null;
        if (img) img.src = encodeImagePath(product.colorImages[color]);
    }
};

window.updatePriceForSize = function (productId, size) {
    const product = window.products.find(p => p.id === productId);
    if (!product) return;

    // Logic to update price display if variant pricing exists
    if (product.sizePrices && product.sizePrices[size]) {
        const priceEl = document.getElementById(`card-price-${productId}`);
        if (priceEl) priceEl.innerText = `₹${product.sizePrices[size]}`;
    }
}

// Detail Modal Helpers
window.selectDetailColor = function (pid, color, btnEl) {
    // UI Update
    const container = btnEl.closest('.color-buttons');
    container.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    btnEl.classList.add('selected');

    // Image Update
    const product = window.products.find(p => p.id === pid);
    if (product && product.colorImages && product.colorImages[color]) {
        document.getElementById('detail-main-img').src = encodeImagePath(product.colorImages[color]);
    }
};

window.selectDetailSize = function (pid, size, btnEl) {
    const container = btnEl.closest('.size-buttons');
    container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btnEl.classList.add('selected');
};

window.addToCart = function (productId) {
    // 1. Find product
    const product = window.products.find(p => p.id === productId);
    if (!product) return;

    // 2. Get selected variants (from Card UI)
    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect ? sizeSelect.value : '';

    const colorGroup = document.getElementById(`color-group-${productId}`);
    const selectedColorEl = colorGroup ? colorGroup.querySelector('.selected') : null;
    const selectedColor = selectedColorEl ? selectedColorEl.dataset.color : (product.colors[0] || 'Standard');

    if (!selectedSize) {
        alert("Please select a size first.");
        return;
    }

    // 3. Determine Price
    let finalPrice = product.price;
    if (product.sizePrices && product.sizePrices[selectedSize]) {
        finalPrice = product.sizePrices[selectedSize];
    }

    // 4. Add to Cart Logic
    addToCartInternal(product, selectedSize, selectedColor, finalPrice);
};

window.addToCartFromDetail = function (productId) {
    const modal = document.querySelector('.product-detail-modal');
    // Get selection from inside modal
    const sizeBtn = modal.querySelector('.size-btn.selected');
    const colorBtn = modal.querySelector('.color-btn.selected');
    const product = window.products.find(p => p.id === productId);

    if (!product) return;
    if (!sizeBtn) { alert("Select size"); return; }

    const size = sizeBtn.dataset.size;
    const color = colorBtn ? colorBtn.dataset.color : (product.colors[0] || 'Standard');

    let price = product.sizePrices && product.sizePrices[size] ? product.sizePrices[size] : product.price;

    addToCartInternal(product, size, color, price);
    window.closeProductDetail();
};

function addToCartInternal(product, size, color, price) {
    const existing = window.cart.find(item =>
        item.id === product.id && item.size === size && item.color === color
    );

    if (existing) {
        existing.quantity++;
    } else {
        // Determine image for cart
        let img = product.image;
        if (product.colorImages && product.colorImages[color]) img = product.colorImages[color];

        window.cart.push({
            id: product.id,
            name: product.name,
            price: price,
            image: encodeImagePath(img),
            size: size,
            color: color,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification("Added to Cart!");
    showCart(); // Optional: open cart immediately to confirm
}

window.updateCartCount = function () {
    const count = window.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => el.innerText = count);
}

// ===== CART UI ACTIONS =====
window.showCart = function () {
    const modal = document.getElementById('cartModal');
    if (!modal) return;

    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('totalAmount');

    if (window.cart.length === 0) {
        container.innerHTML = '<div class="empty-cart">Cart is empty</div>';
        totalEl.innerText = '₹0';
    } else {
        container.innerHTML = window.cart.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.image}" style="width:50px; height:50px; object-fit:cover;">
                <div class="cart-details">
                    <h4>${item.name}</h4>
                    <p>${item.color} | ${item.size}</p>
                    <p>₹${item.price} x ${item.quantity}</p>
                </div>
                <div class="cart-actions">
                     <button onclick="window.updateQty(${idx}, -1)">-</button>
                     <span>${item.quantity}</span>
                     <button onclick="window.updateQty(${idx}, 1)">+</button>
                </div>
                <button onclick="window.removeFromCart(${idx})" class="remove-btn">×</button>
            </div>
        `).join('');

        const total = window.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        totalEl.innerText = `₹${total}`;
    }

    modal.classList.add('active');
}

window.updateQty = function (idx, change) {
    if (window.cart[idx]) {
        window.cart[idx].quantity += change;
        if (window.cart[idx].quantity <= 0) window.cart.splice(idx, 1);
        updateCartCount();
        showCart();
    }
}

window.removeFromCart = function (idx) {
    window.cart.splice(idx, 1);
    updateCartCount();
    showCart();
}

// Utility
function getColorCode(name) {
    const map = {
        'Red': '#EF4444', 'Yellow': '#EAB308', 'Blue': '#3B82F6',
        'Green': '#22C55E', 'Pink': '#EC4899', 'White': '#FFFFFF',
        'Black': '#000000', 'Orange': '#F97316'
    };
    return map[name] || '#888888';
}

function showNotification(msg) {
    const d = document.createElement('div');
    d.className = 'notification-toast';
    d.innerText = msg;
    d.style.cssText = "position:fixed; top:20px; right:20px; background:#333; color:#fff; padding:10px 20px; border-radius:5px; z-index:9999;";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2000);
}

function setupEventListeners() {
    // Basic modal closers
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = function () {
            this.closest('.modal').classList.remove('active');
        }
    });

    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) cartIcon.onclick = window.showCart;
}

// Stub for scroll animations
function addScrollAnimations() { }