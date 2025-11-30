// ===== CONFIGURATION =====
// ⚠️ REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbx3nzjSSNyJvCIP2cIZRSJkiJxlvTeQamTEl-zFsbhq_XTHU5vfGSGCiy0g4sBWbPc/exec";

// ===== PRODUCT DATA =====
// 📝 Edit this array to add/modify your products
const products = [
    {
        id: 1,
        name: "Premium Silk Poshak",
        price: 599,
        image: "🎭", // Replace with actual image URL
        sizes: ["0 No", "1 No", "2 No", "3 No", "4 No"],
        featured: true
    },
    {
        id: 2,
        name: "Golden Mukut",
        price: 399,
        image: "👑", // Replace with actual image URL
        sizes: ["Small", "Medium", "Large"],
        featured: true
    },
    {
        id: 3,
        name: "Designer Mala",
        price: 249,
        image: "📿", // Replace with actual image URL
        sizes: ["One Size"],
        featured: true
    },
    {
        id: 4,
        name: "Decorative Bansuri",
        price: 199,
        image: "🎵", // Replace with actual image URL
        sizes: ["Small", "Medium"],
        featured: false
    },
    {
        id: 5,
        name: "Velvet Poshak Set",
        price: 799,
        image: "👗", // Replace with actual image URL
        sizes: ["0 No", "1 No", "2 No", "3 No"],
        featured: false
    },
    {
        id: 6,
        name: "Pearl Mukut",
        price: 499,
        image: "💎", // Replace with actual image URL
        sizes: ["Small", "Medium", "Large"],
        featured: false
    },
    {
        id: 7,
        name: "Crystal Mala",
        price: 349,
        image: "✨", // Replace with actual image URL
        sizes: ["One Size"],
        featured: false
    },
    {
        id: 8,
        name: "Silver Bansuri",
        price: 299,
        image: "🎶", // Replace with actual image URL
        sizes: ["Small", "Medium"],
        featured: false
    }
];

// ===== CART STATE =====
let cart = [];

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    updateCartCount();
    addScrollAnimations();
});

// ===== LOAD PRODUCTS =====
function loadProducts() {
    // Load featured products on home page
    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        const featuredProducts = products.filter(p => p.featured);
        featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    }
    
    // Load all products on products page
    const allProductsContainer = document.getElementById('allProducts');
    if (allProductsContainer) {
        allProductsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
    }
}

// ===== CREATE PRODUCT CARD =====
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price}</p>
                <select class="product-size" id="size-${product.id}">
                    <option value="">Select Size</option>
                    ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// ===== ADD TO CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect.value;
    
    if (!selectedSize) {
        alert('Please select a size');
        return;
    }
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => 
        item.id === productId && item.size === selectedSize
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification('Item added to cart!');
    sizeSelect.value = '';
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
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-size">Size: ${item.size}</div>
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
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        totalAmount: total,
        orderDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    // Send to Google Sheets
    sendOrderToGoogleSheets(orderData, formData.paymentMethod);
}

// ===== SEND ORDER TO GOOGLE SHEETS =====
async function sendOrderToGoogleSheets(orderData, paymentMethod) {
    try {
        // Show loading state
        const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close checkout modal
        document.getElementById('checkoutModal').classList.remove('active');
        
        // Show success message
        let successMessage = 'Thank you for your order! We will contact you shortly.';
        if (paymentMethod === 'PREPAID') {
            successMessage = 'Thank you! Payment link will be sent to you on WhatsApp shortly.';
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
        
        // Reset button
        const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
        submitBtn.textContent = 'Place Order';
        submitBtn.disabled = false;
    }
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Cart icon click
    const cartIcons = document.querySelectorAll('#cartIcon');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', showCart);
    });
    
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
