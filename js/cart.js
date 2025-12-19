/* ================================================================
   TOOLKIT E-COMMERCE - SHOPPING CART SYSTEM
   ================================================================ */

// ================================================================
// CART MANAGER - Handles shopping cart operations
// ================================================================
const cartManager = {
    // Storage key
    STORAGE_KEY: 'toolkit_cart',

    // Get cart from localStorage
    getCart: () => {
        return JSON.parse(localStorage.getItem(cartManager.STORAGE_KEY) || '[]');
    },

    // Save cart to localStorage
    saveCart: (cart) => {
        localStorage.setItem(cartManager.STORAGE_KEY, JSON.stringify(cart));
        // Notify subscribers of changes
        cartManager.notify();
    },

    // Add item to cart
    addToCart: (product, quantity = 1) => {
        const cart = cartManager.getCart();
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity;
        } else {
            // Add new item
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: quantity
            });
        }
        
        cartManager.saveCart(cart);
        return { success: true, message: `${product.name} added to cart` };
    },

    // Remove item from cart
    removeFromCart: (productId) => {
        const cart = cartManager.getCart();
        const filteredCart = cart.filter(item => item.id !== productId);
        cartManager.saveCart(filteredCart);
        return { success: true, message: 'Item removed from cart' };
    },

    // Update item quantity
    updateQuantity: (productId, quantity) => {
        const cart = cartManager.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (!item) {
            return { success: false, message: 'Item not found in cart' };
        }
        
        if (quantity <= 0) {
            return cartManager.removeFromCart(productId);
        }
        
        item.quantity = quantity;
        cartManager.saveCart(cart);
        return { success: true, message: 'Quantity updated' };
    },

    // Get item quantity
    getQuantityInCart: (productId) => {
        const cart = cartManager.getCart();
        const item = cart.find(item => item.id === productId);
        return item ? item.quantity : 0;
    },

    // Clear entire cart
    clearCart: () => {
        localStorage.removeItem(cartManager.STORAGE_KEY);
        cartManager.notify();
        return { success: true, message: 'Cart cleared' };
    },

    // Get cart total (subtotal)
    getCartTotal: () => {
        const cart = cartManager.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get cart item count
    getCartCount: () => {
        const cart = cartManager.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },

    // Check if product in cart
    isInCart: (productId) => {
        const cart = cartManager.getCart();
        return cart.some(item => item.id === productId);
    },

    // Apply discount code
    applyDiscount: (code) => {
        const discounts = {
            'WELCOME10': 0.10,
            'SUMMER20': 0.20,
            'STUDENT15': 0.15,
            'ARTIST25': 0.25
        };
        
        return discounts[code.toUpperCase()] || 0;
    },

    // Get discount percentage
    getDiscountPercentage: (code) => {
        const discount = cartManager.applyDiscount(code);
        return Math.round(discount * 100);
    },

    // Get valid discount codes
    getValidCodes: () => {
        return ['WELCOME10', 'SUMMER20', 'STUDENT15', 'ARTIST25'];
    },

    // Calculate final price with discount
    calculateTotal: (discount = 0) => {
        const subtotal = cartManager.getCartTotal();
        const discountAmount = Math.round(subtotal * discount);
        const tax = Math.round((subtotal - discountAmount) * 0.05);
        const total = subtotal - discountAmount + tax;
        
        return {
            subtotal: subtotal,
            discount: discountAmount,
            tax: tax,
            total: total
        };
    },

    // Merge carts (for guest checkout)
    mergeCarts: (guestCart, userCart) => {
        const merged = [...userCart];
        
        guestCart.forEach(guestItem => {
            const existingItem = merged.find(item => item.id === guestItem.id);
            if (existingItem) {
                existingItem.quantity += guestItem.quantity;
            } else {
                merged.push(guestItem);
            }
        });
        
        return merged;
    },

    // Export cart as JSON
    exportCart: () => {
        const cart = cartManager.getCart();
        return JSON.stringify(cart, null, 2);
    },

    // Import cart from JSON
    importCart: (jsonString) => {
        try {
            const cart = JSON.parse(jsonString);
            if (!Array.isArray(cart)) {
                return { success: false, message: 'Invalid cart format' };
            }
            cartManager.saveCart(cart);
            return { success: true, message: 'Cart imported successfully' };
        } catch (error) {
            return { success: false, message: 'Failed to import cart' };
        }
    },

    // Get cart summary
    getCartSummary: () => {
        const cart = cartManager.getCart();
        const total = cartManager.getCartTotal();
        const count = cartManager.getCartCount();
        
        return {
            items: cart,
            itemCount: count,
            subtotal: total,
            tax: Math.round(total * 0.05),
            total: total + Math.round(total * 0.05)
        };
    },

    // Validate cart
    validateCart: () => {
        const cart = cartManager.getCart();
        
        // Check if cart is empty
        if (cart.length === 0) {
            return { valid: false, message: 'Cart is empty' };
        }
        
        // Check if all items have required fields
        const isValid = cart.every(item => 
            item.id && item.name && item.price && item.quantity && item.quantity > 0
        );
        
        if (!isValid) {
            return { valid: false, message: 'Cart contains invalid items' };
        }
        
        return { valid: true, message: 'Cart is valid' };
    },

    // Subscribe to cart changes
    subscribers: [],
    
    subscribe: (callback) => {
        cartManager.subscribers.push(callback);
        return () => {
            cartManager.subscribers = cartManager.subscribers.filter(cb => cb !== callback);
        };
    },

    // Notify subscribers of changes
    notify: () => {
        cartManager.subscribers.forEach(callback => callback(cartManager.getCart()));
    }
};

// ================================================================
// INITIALIZE CART
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    cartManager.updateCartUI();
});

// ================================================================
// UPDATE CART UI
// ================================================================
cartManager.updateCartUI = () => {
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        const count = cartManager.getCartCount();
        cartCounter.textContent = count;
    }
};

// Subscribe to cart changes and update UI
cartManager.subscribe(() => {
    cartManager.updateCartUI();
});

// ================================================================
// CART UTILITIES
// ================================================================
const CartUtils = {
    // Format price (helper function for Toolkit namespace)
    formatPrice: (price) => {
        return `₹${Math.round(price).toLocaleString('en-IN')}`;
    },

    // Calculate savings
    calculateSavings: (originalPrice, discountPercent) => {
        return Math.round(originalPrice * (discountPercent / 100));
    },

    // Get estimated delivery date
    getDeliveryDate: (days = 5) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    },

    // Generate order ID
    generateOrderId: () => {
        return Math.floor(Date.now() / 1000);
    },

    // Check if item is in stock
    isInStock: (productId) => {
        const product = PRODUCTS.find(p => p.id === productId);
        return product && product.stock > 0;
    },

    // Get stock count
    getStockCount: (productId) => {
        const product = PRODUCTS.find(p => p.id === productId);
        return product ? product.stock : 0;
    },

    // Check if quantity available
    isQuantityAvailable: (productId, quantity) => {
        const stock = CartUtils.getStockCount(productId);
        return quantity <= stock;
    },

    // Get available quantity
    getAvailableQuantity: (productId) => {
        return CartUtils.getStockCount(productId);
    }
};

// ================================================================
// CART VALIDATION & ERROR HANDLING
// ================================================================
const CartValidator = {
    // Validate product can be added
    canAddToCart: (product, quantity = 1) => {
        if (!product) {
            return { valid: false, message: 'Product not found' };
        }

        if (quantity < 1) {
            return { valid: false, message: 'Quantity must be at least 1' };
        }

        if (quantity > product.stock) {
            return { 
                valid: false, 
                message: `Only ${product.stock} items available` 
            };
        }

        return { valid: true, message: 'Product can be added' };
    },

    // Validate checkout
    canCheckout: () => {
        const validation = cartManager.validateCart();
        if (!validation.valid) {
            return validation;
        }

        return { valid: true, message: 'Ready for checkout' };
    },

    // Validate discount code
    isValidCode: (code) => {
        const validCodes = cartManager.getValidCodes();
        return validCodes.includes(code.toUpperCase());
    }
};

// ================================================================
// CART PERSISTENCE & EXPORT
// ================================================================
const CartPersistence = {
    // Save cart snapshot
    snapshot: () => {
        const cart = cartManager.getCart();
        return {
             JSON.stringify(cart),
            timestamp: new Date().toISOString(),
            count: cart.length,
            total: cartManager.getCartTotal()
        };
    },

    // Restore from snapshot
    restore: (snapshot) => {
        try {
            const cart = JSON.parse(snapshot.data);
            cartManager.saveCart(cart);
            return { success: true, message: 'Cart restored' };
        } catch (error) {
            return { success: false, message: 'Failed to restore cart' };
        }
    },

    // Download cart as JSON file
    downloadCart: () => {
        const cart = cartManager.getCart();
        const dataStr = JSON.stringify(cart, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `toolkit-cart-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    // Upload cart from JSON file
    uploadCart: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const cart = JSON.parse(event.target.result);
                    cartManager.saveCart(cart);
                    resolve({ success: true, message: 'Cart imported' });
                } catch (error) {
                    reject({ success: false, message: 'Invalid file format' });
                }
            };
            reader.onerror = () => {
                reject({ success: false, message: 'Failed to read file' });
            };
            reader.readAsText(file);
        });
    }
};

// ================================================================
// CART ANALYTICS
// ================================================================
const CartAnalytics = {
    // Get cart stats
    getStats: () => {
        const cart = cartManager.getCart();
        const summary = cartManager.getCartSummary();

        return {
            itemCount: cart.length,
            totalQuantity: summary.itemCount,
            subtotal: summary.subtotal,
            tax: summary.tax,
            total: summary.total,
            averagePrice: cart.length > 0 ? summary.subtotal / cart.length : 0,
            mostExpensive: cart.length > 0 ? Math.max(...cart.map(item => item.price)) : 0,
            cheapest: cart.length > 0 ? Math.min(...cart.map(item => item.price)) : 0
        };
    },

    // Get cart by category
    getCartByCategory: () => {
        const cart = cartManager.getCart();
        const byCategory = {};

        cart.forEach(item => {
            if (!byCategory[item.category]) {
                byCategory[item.category] = [];
            }
            byCategory[item.category].push(item);
        });

        return byCategory;
    },

    // Get category totals
    getCategoryTotals: () => {
        const byCategory = CartAnalytics.getCartByCategory();
        const totals = {};

        Object.entries(byCategory).forEach(([category, items]) => {
            totals[category] = {
                count: items.length,
                quantity: items.reduce((sum, item) => sum + item.quantity, 0),
                total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
        });

        return totals;
    }
};

// ================================================================
// EXPORT FOR EXTERNAL USE
// ================================================================
// All functions are available globally:
// cartManager.addToCart(product, 1)
// cartManager.removeFromCart(productId)
// cartManager.getCart()
// cartManager.getCartTotal()
// cartManager.applyDiscount('WELCOME10')
// CartValidator.canAddToCart(product, quantity)
// CartAnalytics.getStats()
