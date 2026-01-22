// ===== CONFIGURATION =====
// ⚠️ REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx3nzjSSNyJvCIP2cIZRSJkiJxlvTeQamTEl-zFsbhq_XTHU5vfGSGCiy0g4sBWbPc/exec";

// ⚠️ RAZORPAY CONFIGURATION
// Get your key from: https://dashboard.razorpay.com/app/website-app-settings/api-keys
const RAZORPAY_KEY_ID = "rzp_live_RwgiRTP5M5Wz3Y"; // Your Razorpay Live Key
const BUSINESS_NAME = "Shreeji Vastraalay";
const BUSINESS_LOGO = "https://shreeji-vastraalay.vercel.app/logo.png"; // Your logo URL

// ===== PRODUCT DATA WITH ACTUAL FOLDER IMAGES =====
// Initialize with STATIC_PRODUCTS if available
let products = [];

// ===== FIREBASE INTEGRATION =====
// Ensure firebase is initialized in index.html or firebase-config.js before this script

async function fetchProductsFromFirebase() {
    console.log("Fetching products from Firebase...");
    
    // ALWAYS load static products first
    if (typeof window.STATIC_PRODUCTS !== 'undefined') {
        products = [...window.STATIC_PRODUCTS];
        console.log(`✅ Loaded ${products.length} static products`);
        loadProducts(); // Show static products immediately
    } else {
        console.warn("⚠️ STATIC_PRODUCTS not found - check if js/static-products.js is loaded");
    }
    
    try {
        if (typeof firebase === 'undefined') {
            console.error("Firebase SDK not loaded!");
            return; // Static products already loaded above
        }

        const db = firebase.firestore();
        const snapshot = await db.collection('products').where('inStock', '==', true).get();

        const firebaseProducts = snapshot.docs.map(doc => {
            const data = doc.data();

            // Map Firestore data to local structure
            let colorImages = data.colorImages || {};
            let sizePrices = data.sizePrices || {};

            if (data.variants && Array.isArray(data.variants)) {
                data.variants.forEach(variant => {
                    if (variant.color && variant.image) {
                        colorImages[variant.color] = variant.image;
                    }
                    if (variant.sizes && Array.isArray(variant.sizes)) {
                        variant.sizes.forEach(s => {
                            if (s.price) sizePrices[s.size] = s.price;
                        });
                    }
                });
            }

            return {
                id: doc.id,
                ...data,
                colorImages,
                sizePrices
            };
        });

        // Merge: Static + Firebase (avoid duplicates)
        const staticIds = new Set(products.map(p => p.id));
        const newProducts = firebaseProducts.filter(p => !staticIds.has(p.id));

        if (newProducts.length > 0) {
            products = [...products, ...newProducts];
            console.log(`✅ Added ${newProducts.length} Firebase products`);
            loadProducts(); // Refresh UI with combined products
        }

        console.log(`📊 Total products: ${products.length} (${products.length - newProducts.length} static, ${newProducts.length} Firebase)`);

    } catch (error) {
        console.error("❌ Error fetching Firebase products:", error);
        // Static products already loaded, so we're good
    }
}


// ===== CART STATE =====
let cart = [];

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Initializing Shreeji Vastraalay...");
    
    // Check if static products are available
    if (typeof window.STATIC_PRODUCTS !== 'undefined') {
        console.log(`✅ Static products available: ${window.STATIC_PRODUCTS.length} products`);
    } else {
        console.error("❌ Static products not found! Check js/static-products.js");
    }
    
    // Initialize Firebase products fetch (this will also load static products)
    if (typeof fetchProductsFromFirebase === 'function') {
        fetchProductsFromFirebase();
    } else {
        // Fallback: load static products directly
        if (typeof window.STATIC_PRODUCTS !== 'undefined') {
            products = [...window.STATIC_PRODUCTS];
            loadProducts();
        }
    }

    setupEventListeners();
    updateCartCount();
    addScrollAnimations();
});

// ===== LOAD PRODUCTS =====
function loadProducts() {
    // Load featured products on home page (limit to 4 for side-by-side display)
    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        const featuredProducts = products.filter(p => p.featured).slice(0, 4);
        featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    }

    // Load all products on products page
    const allProductsContainer = document.getElementById('allProducts');
    if (allProductsContainer) {
        allProductsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
    }
}

// ===== HELPER: ENCODE IMAGE PATH =====
function encodeImagePath(path) {
    if (!path) return '';
    
    // If it's a full URL (Firebase Storage), return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // For local paths, encode spaces and special characters in folder/file names
    return path.split('/').map(part => encodeURIComponent(part)).join('/');
}

// ===== CREATE PRODUCT CARD =====
function createProductCard(product) {
    const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    const encodedImage = encodeImagePath(product.image);
    const hasSizePricing = product.sizePrices && Object.keys(product.sizePrices).length > 0;
    const basePrice = hasSizePricing ? (product.sizePrices[product.sizes[0]] || product.price) : product.price;

    return `
        <div class="product-card" data-category="${product.category}" data-product-id="${product.id}">
            <div class="product-image-container" onclick="viewProductDetail('${product.id}')">
                <div class="product-image">
                    <img src="${encodedImage}" alt="${product.name}" 
                         loading="lazy"
                         onload="this.classList.remove('loading'); this.style.opacity='1';"
                         onerror="console.warn('Image failed to load:', '${encodedImage}'); this.style.display='none'; this.nextElementSibling.style.display='flex';"
                         class="loading"
                         style="opacity: 0;">
                    <div class="product-placeholder" style="display: none;">
                        <span class="placeholder-icon">${getCategoryIcon(product.category)}</span>
                        <p>Image Loading...</p>
                    </div>
                </div>
                ${discountPercent > 0 ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
                ${product.isNew ? '<div class="new-badge">NEW</div>' : ''}
                ${!product.inStock ? '<div class="stock-badge out-of-stock">Out of Stock</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h3 class="product-title" onclick="viewProductDetail('${product.id}')">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-pricing">
                    <span class="product-price" id="price-${product.id}">₹${basePrice}</span>
                    ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                    ${hasSizePricing ? '<span class="price-note" style="font-size: 12px; color: #666; display: block; margin-top: 4px;">Price varies by size</span>' : ''}
                </div>
                <div class="product-variants">
                    <div class="size-selector">
                        <label>Size:</label>
                        <select class="product-size" id="size-${product.id}" onchange="updatePriceForSize('${product.id}', this.value)">
                            <option value="">Select Size</option>
                            ${product.sizes.map(size => {
        const sizePrice = hasSizePricing ? (product.sizePrices[size] || product.price) : product.price;
        return `<option value="${size}" data-price="${sizePrice}">${size} - ₹${sizePrice}</option>`;
    }).join('')}
                        </select>
                    </div>
                    ${product.colors.length > 1 ? `
                    <div class="color-selector">
                        <label>Color:</label>
                        <div class="color-options" id="color-${product.id}">
                            ${product.colors.map((color, index) => `
                                <div class="color-option ${index === 0 ? 'selected' : ''}" 
                                     data-color="${color}" 
                                     title="${color}"
                                     onclick="selectColor('${product.id}', '${color}')">
                                    <span class="color-dot" style="background: ${getColorCode(color)}"></span>
                                    <span class="color-name">${color}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>` : ''}
                </div>
                <button class="add-to-cart-btn ${!product.inStock ? 'disabled' : ''}" 
                        onclick="addToCart('${product.id}')" 
                        ${!product.inStock ? 'disabled' : ''}>
                    ${!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
}

// ===== UPDATE PRICE BASED ON SIZE =====
function updatePriceForSize(productId, selectedSize) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.sizePrices) return;

    const priceElement = document.getElementById(`price-${productId}`);
    if (priceElement && selectedSize && product.sizePrices[selectedSize]) {
        const newPrice = product.sizePrices[selectedSize];
        priceElement.textContent = `₹${newPrice}`;
        priceElement.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            priceElement.style.animation = '';
        }, 300);
    }
}

// ===== HELPER FUNCTIONS =====
function getCategoryIcon(category) {
    const icons = {
        'dresses': '👗',
        'mukut': '👑',
        'mala': '📿',
        'bansuri': '🎵'
    };
    return icons[category] || '🎁';
}

function getColorCode(colorName) {
    const colors = {
        'Red': '#DC2626',
        'Yellow': '#EAB308',
        'Blue': '#2563EB',
        'Green': '#16A34A',
        'Orange': '#EA580C',
        'Pink': '#EC4899',
        'Red Yellow': 'linear-gradient(45deg, #DC2626, #EAB308)',
        'Maroon': '#7C2D12',
        'Navy Blue': '#1E3A8A',
        'Golden': '#D4AF37',
        'White': '#FFFFFF',
        'Cream': '#FEF3C7',
        'Light Pink': '#F9A8D4',
        'Silver': '#C0C0C0',
        'Natural Brown': '#8B4513',
        'Clear': '#F3F4F6',
        'Rose Quartz': '#F9A8D4',
        'Multi Color': 'linear-gradient(45deg, #DC2626, #EAB308, #16A34A, #2563EB)',
        'Rainbow': 'linear-gradient(45deg, #DC2626, #EA580C, #EAB308, #16A34A, #2563EB, #7C3AED)',
        'Off White': '#F8F8FF',
        'Colorful': 'linear-gradient(45deg, #DC2626, #EAB308, #16A34A)',
        'Design 1': '#FF6B6B',
        'Design 2': '#4ECDC4',
        'Design 3': '#45B7D1',
        'Design 4': '#96CEB4',
        'Design 5': '#FFEAA7',
        'Design 6': '#DDA0DD',
        'Design 7': '#98D8C8',
        'Design 8': '#F7DC6F',
        'Design 9': '#BB8FCE',
        'Standard': '#6B7280'
    };
    return colors[colorName] || '#6B7280';
}

function selectColor(productId, color) {
    // Remove selected class from all color options for this product
    const colorOptions = document.querySelectorAll(`#color-${productId} .color-option`);
    colorOptions.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to clicked option
    const clickedOption = document.querySelector(`#color-${productId} .color-option[data-color="${color}"]`);
    if (clickedOption) {
        clickedOption.classList.add('selected');
    }

    // Change product image based on color selection
    const product = products.find(p => p.id === productId);
    if (product && product.colorImages && product.colorImages[color]) {
        const productImage = document.querySelector(`[data-product-id="${productId}"] .product-image img`);
        if (productImage) {
            productImage.style.opacity = '0';
            productImage.classList.add('loading');
            productImage.src = encodeImagePath(product.colorImages[color]);
        }
    }
}

// ===== ADD TO CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect ? sizeSelect.value : '';
    const selectedColorElement = document.querySelector(`#color-${productId} .color-option.selected`);
    const selectedColor = selectedColorElement ? selectedColorElement.dataset.color : product.colors[0];

    if (!selectedSize) {
        alert('Please select a size');
        return;
    }

    // Get price based on size if sizePrices exists
    let itemPrice = product.price;
    if (product.sizePrices && product.sizePrices[selectedSize]) {
        itemPrice = product.sizePrices[selectedSize];
    }

    // Check if item already exists in cart
    const existingItem = cart.find(item =>
        item.id === productId && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: itemPrice,
            image: encodeImagePath(product.colorImages && product.colorImages[selectedColor] ? product.colorImages[selectedColor] : product.image),
            size: selectedSize,
            color: selectedColor,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification('Item added to cart!');
    
    // Reset selections
    if (sizeSelect) sizeSelect.value = '';
}

// ===== UPDATE CART COUNT =====
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// ===== SHOW CART MODAL =====
function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        totalAmountElement.textContent = '₹0';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.parentElement.innerHTML='<span style=\\'font-size:32px;\\'>${getCategoryIcon(products.find(p => p.id === item.id)?.category || 'dresses')}</span>'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
                    <div class="cart-item-color">Color: ${item.color}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmountElement.textContent = `₹${total}`;
    }

    modal.classList.add('active');
}

// ===== UPDATE QUANTITY =====
function updateQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartCount();
    showCart();
}

// ===== REMOVE FROM CART =====
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    showCart();
}

// ===== SHOW CHECKOUT MODAL =====
function showCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    document.getElementById('cartModal').classList.remove('active');
    document.getElementById('checkoutModal').classList.add('active');
}

// ===== HANDLE CHECKOUT FORM SUBMISSION =====
function handleCheckout(event) {
    event.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        pincode: document.getElementById('pincode').value,
        paymentMethod: document.getElementById('paymentMethod').value
    };

    // Create order object
    const orderId = `ORD${Date.now()}`;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderData = {
        orderId: orderId,
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
        items: cart.map(item => ({
            name: item.name,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        totalAmount: total,
        orderDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // Handle payment based on method
    if (formData.paymentMethod === 'COD') {
        // COD - Direct order placement
        sendOrderToGoogleSheets(orderData, 'COD');
    } else if (formData.paymentMethod === 'ONLINE') {
        // Online Payment - Razorpay (includes UPI)
        initiateRazorpayPayment(orderData);
    } else {
        alert('Please select a payment method');
    }
}

// ===== INITIATE RAZORPAY PAYMENT =====
function initiateRazorpayPayment(orderData) {
    const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
    submitBtn.textContent = 'Opening Payment...';
    submitBtn.disabled = true;

    const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.totalAmount * 100, // Amount in paise
        currency: "INR",
        name: BUSINESS_NAME,
        description: `Order #${orderData.orderId}`,
        image: BUSINESS_LOGO,
        prefill: {
            name: orderData.customerName,
            contact: orderData.phone,
        },
        theme: {
            color: "#B02E2E"
        },
        // Enable all payment methods including UPI
        method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
            emi: false
        },
        handler: async function (response) {
            // Payment successful - Only called when payment is actually completed
            try {
                // Store payment details
                orderData.paymentId = response.razorpay_payment_id;
                orderData.paymentOrderId = response.razorpay_order_id;
                orderData.paymentSignature = response.razorpay_signature;
                orderData.paymentStatus = "PAID";

                // Close checkout modal
                document.getElementById('checkoutModal').classList.remove('active');

                // Send order to Google Sheets
                await sendOrderToGoogleSheets(orderData, 'ONLINE');
            } catch (error) {
                console.error('Payment processing error:', error);
                alert('There was an error processing your payment. Please contact support with Payment ID: ' + response.razorpay_payment_id);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Place Order';
            }
        },
        modal: {
            ondismiss: function () {
                // Payment cancelled or closed
                submitBtn.disabled = false;
                submitBtn.textContent = 'Place Order';
            }
        },
        // Disable automatic success (only mark success when payment is actually completed)
        notes: {
            order_id: orderData.orderId
        }
    };

    const rzp = new Razorpay(options);

    rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert('Payment failed: ' + (response.error.description || 'Please try again.'));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order';
    });

    rzp.on('payment.authorized', function (response) {
        // This is called when payment is authorized
        // Payment will only be captured if this succeeds
        return true;
    });

    rzp.open();
}

// ===== SEND ORDER TO GOOGLE SHEETS =====
async function sendOrderToGoogleSheets(orderData, paymentMethod) {
    try {
        // Show loading state
        const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
        }

        await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        // Reset button
        if (submitBtn) {
            submitBtn.textContent = 'Place Order';
            submitBtn.disabled = false;
        }

        // Close checkout modal
        document.getElementById('checkoutModal').classList.remove('active');

        // Show success message
        let successMessage = '';
        if (paymentMethod === 'COD') {
            successMessage = '✅ Order placed successfully! We will contact you shortly for confirmation.';
        } else if (paymentMethod === 'ONLINE') {
            successMessage = '✅ Payment successful! Your order has been confirmed. Order ID: ' + orderData.orderId;
        }

        document.getElementById('successMessage').textContent = successMessage;
        document.getElementById('successModal').classList.add('active');

        // Clear cart
        cart = [];
        updateCartCount();

        // Reset form
        document.getElementById('checkoutForm').reset();

    } catch (error) {
        console.error('Error sending order:', error);
        alert('There was an error placing your order. Please try again or contact us directly.');

        const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Place Order';
            submitBtn.disabled = false;
        }
    }
}

// ===== SIDEBAR FUNCTIONALITY =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function toggleCategory(category) {
    const subcategoryList = document.getElementById(category + '-sub');
    const arrow = event.target.querySelector('.arrow') || event.target.parentElement.querySelector('.arrow');

    if (subcategoryList.classList.contains('active')) {
        subcategoryList.classList.remove('active');
        arrow.textContent = '▼';
    } else {
        // Close all other categories
        document.querySelectorAll('.subcategory-list').forEach(list => {
            list.classList.remove('active');
        });
        document.querySelectorAll('.arrow').forEach(arr => {
            arr.textContent = '▼';
        });

        // Open selected category
        subcategoryList.classList.add('active');
        arrow.textContent = '▲';
    }
}

function filterProducts(category, subcategory) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productCategory = card.dataset.category;
        const productId = parseInt(card.dataset.productId);
        const product = products.find(p => p.id === productId);

        let shouldShow = false;

        if (category === 'all') {
            shouldShow = true;
        } else if (subcategory === 'all') {
            shouldShow = productCategory === category;
        } else {
            shouldShow = productCategory === category &&
                (product.subcategory === subcategory ||
                    product.name.toLowerCase().includes(subcategory));
        }

        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });

    // Close sidebar after filtering
    toggleSidebar();
}

// ===== PRODUCT DETAIL VIEW =====
function viewProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Create product detail modal
    const modal = document.createElement('div');
    modal.className = 'modal active product-detail-modal';
    modal.innerHTML = `
        <div class="modal-content product-detail-content">
            <div class="modal-header">
                <h2>${product.name}</h2>
                <button class="close-btn" onclick="closeProductDetail()">&times;</button>
            </div>
            <div class="product-detail-body">
                <div class="product-images">
                    <div class="main-image">
                        <img src="${encodeImagePath(product.image)}" alt="${product.name}" id="mainProductImage">
                    </div>
                    <div class="thumbnail-images">
                        ${product.images ? product.images.map(img => `
                            <img src="${encodeImagePath(img)}" alt="${product.name}" onclick="changeMainImage('${encodeImagePath(img)}')" class="thumbnail">
                        `).join('') : ''}
                    </div>
                </div>
                <div class="product-details">
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(product.rating || 4.5)}
                        </div>
                        <span class="rating-text">${product.rating || 4.5} (${product.reviews || 0} reviews)</span>
                    </div>
                    <div class="product-pricing">
                        <span class="current-price" id="detail-price-${product.id}">₹${product.sizePrices && product.sizePrices[product.sizes[0]] ? product.sizePrices[product.sizes[0]] : product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                        ${product.originalPrice ? `<span class="discount">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>` : ''}
                        ${product.sizePrices ? '<span class="price-note" style="font-size: 12px; color: #666; display: block; margin-top: 4px;">Price varies by size</span>' : ''}
                    </div>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-options">
                        <div class="size-selection">
                            <label>Size:</label>
                            <div class="size-buttons">
                                ${product.sizes.map((size, index) => {
        const sizePrice = product.sizePrices && product.sizePrices[size] ? product.sizePrices[size] : product.price;
        return `<button class="size-btn ${index === 0 ? 'selected' : ''}" onclick="selectSizeWithPrice('${product.id}', '${size}', ${sizePrice})" data-size="${size}" data-price="${sizePrice}">${size} - ₹${sizePrice}</button>`;
    }).join('')}
                            </div>
                        </div>
                        
                        ${product.colors.length > 1 ? `
                        <div class="color-selection">
                            <label>Color:</label>
                            <div class="color-buttons">
                                ${product.colors.map((color, index) => `
                                    <button class="color-btn ${index === 0 ? 'selected' : ''}" 
                                            onclick="selectDetailColor('${product.id}', '${color}')" 
                                            data-color="${color}">
                                        <span class="color-dot" style="background: ${getColorCode(color)}"></span>
                                        <span>${color}</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>` : ''}
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart-detail" onclick="addToCartFromDetail('${product.id}')">
                            Add to Cart
                        </button>
                        <button class="btn btn-secondary buy-now" onclick="buyNow('${product.id}')">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeProductDetail() {
    const modal = document.querySelector('.product-detail-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '☆';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        stars += '☆';
    }

    return stars;
}

function selectSize(size) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function selectSizeWithPrice(productId, size, price) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');

    // Update price display
    const priceElement = document.getElementById(`detail-price-${productId}`);
    if (priceElement) {
        priceElement.textContent = `₹${price}`;
        priceElement.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            priceElement.style.animation = '';
        }, 300);
    }
}

function selectDetailColor(productId, color) {
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');

    // Change main image if color-specific image exists
    const product = products.find(p => p.id === productId);
    if (product && product.colorImages && product.colorImages[color]) {
        changeMainImage(encodeImagePath(product.colorImages[color]));
    }
}

function addToCartFromDetail(productId) {
    const selectedSizeBtn = document.querySelector('.size-btn.selected');
    const selectedSize = selectedSizeBtn?.dataset.size;
    const selectedColor = document.querySelector('.color-btn.selected')?.dataset.color;

    if (!selectedSize) {
        alert('Please select a size');
        return;
    }

    // Add to cart logic (reuse existing function)
    const product = products.find(p => p.id === productId);

    // Get price based on size if sizePrices exists
    let itemPrice = product.price;
    if (product.sizePrices && product.sizePrices[selectedSize]) {
        itemPrice = product.sizePrices[selectedSize];
    } else if (selectedSizeBtn?.dataset.price) {
        itemPrice = parseInt(selectedSizeBtn.dataset.price);
    }

    const existingItem = cart.find(item =>
        item.id === productId && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: itemPrice,
            image: encodeImagePath(product.colorImages && product.colorImages[selectedColor] ? product.colorImages[selectedColor] : product.image),
            size: selectedSize,
            color: selectedColor || product.colors[0],
            quantity: 1
        });
    }

    updateCartCount();
    showNotification('Item added to cart!');
    closeProductDetail();
}

function buyNow(productId) {
    addToCartFromDetail(productId);
    setTimeout(() => {
        showCart();
    }, 500);
}

function quickView(productId) {
    viewProductDetail(productId);
}

function toggleWishlist(productId) {
    // Wishlist functionality - can be implemented later
    console.log('Toggle wishlist for product:', productId);
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Cart icon click
    const cartIcons = document.querySelectorAll('#cartIcon');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', showCart);
    });

    // Setup form handlers
    setupFormHandlers();

    // Update product count on products page
    if (document.getElementById('allProducts')) {
        setTimeout(() => {
            const count = document.querySelectorAll('.product-card').length;
            const countElement = document.getElementById('productCount');
            if (countElement) {
                countElement.textContent = `${count} products`;
            }
        }, 100);
    }

    // Close cart modal
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            document.getElementById('cartModal').classList.remove('active');
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckout);
    }

    // Close checkout modal
    const closeCheckoutBtn = document.getElementById('closeCheckout');
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => {
            document.getElementById('checkoutModal').classList.remove('active');
        });
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Close success modal
    const closeSuccessBtn = document.getElementById('closeSuccess');
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            document.getElementById('successModal').classList.remove('active');
            window.location.href = 'index.html';
        });
    }

    // Close modals on outside click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ===== SHOW NOTIFICATION =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== SCROLL ANIMATIONS =====
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all product cards and feature cards
    const animatedElements = document.querySelectorAll('.product-card, .feature-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== APPLY FILTERS =====
function applyFilters() {
    const availabilityFilter = document.getElementById('availabilityFilter')?.value || 'all';
    const priceFilter = document.getElementById('priceFilter')?.value || 'all';
    const colorFilter = document.getElementById('colorFilter')?.value || 'all';
    const sortFilter = document.getElementById('sortFilter')?.value || 'featured';

    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    const filteredProducts = [];

    productCards.forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const product = products.find(p => p.id === productId);
        if (!product) return;

        let shouldShow = true;

        // Availability filter
        if (availabilityFilter === 'inStock' && !product.inStock) {
            shouldShow = false;
        } else if (availabilityFilter === 'outOfStock' && product.inStock) {
            shouldShow = false;
        }

        // Price filter
        if (shouldShow && priceFilter !== 'all') {
            const productPrice = product.sizePrices ? Math.min(...Object.values(product.sizePrices)) : product.price;
            if (priceFilter === '0-100' && (productPrice < 0 || productPrice > 100)) shouldShow = false;
            else if (priceFilter === '100-200' && (productPrice < 100 || productPrice > 200)) shouldShow = false;
            else if (priceFilter === '200-300' && (productPrice < 200 || productPrice > 300)) shouldShow = false;
            else if (priceFilter === '300-500' && (productPrice < 300 || productPrice > 500)) shouldShow = false;
            else if (priceFilter === '500+' && productPrice < 500) shouldShow = false;
        }

        // Color filter
        if (shouldShow && colorFilter !== 'all') {
            const hasColor = product.colors.some(c => c.toLowerCase().includes(colorFilter.toLowerCase()));
            if (!hasColor) shouldShow = false;
        }

        if (shouldShow) {
            card.style.display = 'block';
            visibleCount++;
            filteredProducts.push({ product, element: card });
        } else {
            card.style.display = 'none';
        }
    });

    // Update product count
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = `${visibleCount} products`;
    }

    // Sort products
    if (sortFilter !== 'featured') {
        filteredProducts.sort((a, b) => {
            const priceA = a.product.sizePrices ? Math.min(...Object.values(a.product.sizePrices)) : a.product.price;
            const priceB = b.product.sizePrices ? Math.min(...Object.values(b.product.sizePrices)) : b.product.price;

            if (sortFilter === 'priceLow') return priceA - priceB;
            if (sortFilter === 'priceHigh') return priceB - priceA;
            if (sortFilter === 'name') return a.product.name.localeCompare(b.product.name);
            return 0;
        });

        // Reorder in DOM
        const container = document.getElementById('allProducts') || document.getElementById('featuredProducts');
        if (container) {
            filteredProducts.forEach(({ element }) => {
                container.appendChild(element);
            });
        }
    }
}

// ===== SUGGESTION BOX =====
function openSuggestionBox() {
    document.getElementById('suggestionModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuggestionBox() {
    document.getElementById('suggestionModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('suggestionForm').reset();
}

// ===== RETURN/EXCHANGE =====
function openReturnExchange() {
    document.getElementById('returnExchangeModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeReturnExchange() {
    document.getElementById('returnExchangeModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('returnExchangeForm').reset();
}

// ===== SETUP FORM HANDLERS =====
function setupFormHandlers() {
    // Suggestion Box Form
    const suggestionForm = document.getElementById('suggestionForm');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('suggestionName').value;
            const phone = document.getElementById('suggestionPhone').value;
            const message = document.getElementById('suggestionMessage').value;

            const whatsappMessage = `*Suggestion from ${name}*\n\nPhone: ${phone}\n\nSuggestion:\n${message}`;
            const whatsappUrl = `https://wa.me/919687313466?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');

            closeSuggestionBox();
            showNotification('Opening WhatsApp...');
        });
    }

    // Return/Exchange Form
    const returnExchangeForm = document.getElementById('returnExchangeForm');
    if (returnExchangeForm) {
        returnExchangeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('returnName').value;
            const phone = document.getElementById('returnPhone').value;
            const orderId = document.getElementById('orderId').value;
            const requestType = document.getElementById('requestType').value;
            const reason = document.getElementById('returnReason').value;

            const whatsappMessage = `*${requestType.toUpperCase()} Request from ${name}*\n\nPhone: ${phone}\nOrder ID: ${orderId}\nRequest Type: ${requestType}\n\nReason:\n${reason}`;
            const whatsappUrl = `https://wa.me/919687313466?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');

            closeReturnExchange();
            showNotification('Opening WhatsApp...');
        });
    }
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add slide animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);