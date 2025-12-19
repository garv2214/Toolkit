/* ================================================================
   TOOLKIT E-COMMERCE - MAIN APPLICATION LOGIC
   ================================================================ */

// ================================================================
// TOOLKIT NAMESPACE - Global utilities
// ================================================================
const Toolkit = {
    // Format price in Indian Rupees
    formatPrice: (price) => {
        return `₹${Math.round(price).toLocaleString('en-IN')}`;
    },

    // Show toast notification
    showToast: (message, type = 'success') => {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Open modal
    openModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    // Close modal
    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    // Close all modals
    closeAllModals: () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    },

    // Debounce function
    debounce: (func, delay = 300) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    // Check if user is online
    isOnline: () => {
        return navigator.onLine;
    },

    // Get URL parameter
    getUrlParam: (param) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(param);
    },

    // Get all URL parameters
    getAllUrlParams: () => {
        const params = new URLSearchParams(window.location.search);
        const obj = {};
        params.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    },

    // Format date
    formatDate: (date, format = 'short') => {
        const options = format === 'short' 
            ? { year: 'numeric', month: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('en-IN', options);
    },

    // Generate unique ID
    generateId: () => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Check if email is valid
    isValidEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Check if phone is valid (India)
    isValidPhone: (phone) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(phone.replace(/\D/g, ''));
    },

    // Capitalize first letter
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Truncate text
    truncate: (text, length = 50) => {
        return text.length > length ? text.substr(0, length) + '...' : text;
    },

    // Copy to clipboard
    copyToClipboard: (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                Toolkit.showToast('Copied to clipboard! 📋');
            }).catch(() => {
                Toolkit.showToast('Failed to copy', 'error');
            });
        }
    }
};

// ================================================================
// DARK MODE TOGGLE
// ================================================================
const DarkMode = {
    STORAGE_KEY: 'toolkit_dark_mode',

    // Get dark mode preference
    isDarkMode: () => {
        const stored = localStorage.getItem(DarkMode.STORAGE_KEY);
        if (stored !== null) {
            return stored === 'true';
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    // Enable dark mode
    enable: () => {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        localStorage.setItem(DarkMode.STORAGE_KEY, 'true');
        DarkMode.updateToggleButton();
    },

    // Disable dark mode
    disable: () => {
        document.documentElement.setAttribute('data-color-scheme', 'light');
        localStorage.setItem(DarkMode.STORAGE_KEY, 'false');
        DarkMode.updateToggleButton();
    },

    // Toggle dark mode
    toggle: () => {
        if (DarkMode.isDarkMode()) {
            DarkMode.disable();
        } else {
            DarkMode.enable();
        }
    },

    // Update toggle button
    updateToggleButton: () => {
        const btn = document.querySelector('.dark-mode-toggle');
        if (btn) {
            btn.textContent = DarkMode.isDarkMode() ? '☀️' : '🌙';
        }
    },

    // Initialize dark mode
    init: () => {
        if (DarkMode.isDarkMode()) {
            DarkMode.enable();
        } else {
            DarkMode.disable();
        }

        // Add click listener
        const btn = document.querySelector('.dark-mode-toggle');
        if (btn) {
            btn.addEventListener('click', DarkMode.toggle);
        }

        // Listen to system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem(DarkMode.STORAGE_KEY) === null) {
                if (e.matches) {
                    DarkMode.enable();
                } else {
                    DarkMode.disable();
                }
            }
        });
    }
};

// ================================================================
// NAVIGATION MENU MOBILE
// ================================================================
const MobileNav = {
    // Toggle mobile menu
    toggle: () => {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
    },

    // Close mobile menu
    close: () => {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    },

    // Open mobile menu
    open: () => {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.add('active');
        }
    },

    // Initialize mobile menu
    init: () => {
        // Add hamburger button
        const navbar = document.querySelector('.navbar');
        if (navbar && !document.querySelector('.menu-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'menu-toggle';
            toggleBtn.innerHTML = '☰';
            toggleBtn.style.cssText = `
                display: none;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--text);
            `;

            // Insert before nav-right
            const navRight = navbar.querySelector('.nav-right');
            if (navRight) {
                navRight.parentElement.insertBefore(toggleBtn, navRight);
            }

            toggleBtn.addEventListener('click', MobileNav.toggle);
        }

        // Close menu on link click
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', MobileNav.close);
        });
    }
};

// ================================================================
// SCROLL TO SMOOTH BEHAVIOR
// ================================================================
const ScrollBehavior = {
    // Smooth scroll to element
    scrollToElement: (selector, offset = 0) => {
        const element = document.querySelector(selector);
        if (element) {
            const top = element.offsetTop - offset;
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    },

    // Smooth scroll to top
    scrollToTop: () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Initialize scroll behavior
    init: () => {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    ScrollBehavior.scrollToElement(href, 80);
                }
            });
        });

        // Back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.innerHTML = '⬆️';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 24px;
            display: none;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(backToTopBtn);

        // Show/hide back to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', ScrollBehavior.scrollToTop);
    }
};

// ================================================================
// ANALYTICS & TRACKING
// ================================================================
const Analytics = {
    // Track page view
    trackPageView: (pageName) => {
        const event = {
            type: 'pageView',
            page: pageName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer
        };
        console.log('📊 Page View:', event);
    },

    // Track event
    trackEvent: (eventName, data = {}) => {
        const event = {
            type: 'event',
            name: eventName,
             data,
            timestamp: new Date().toISOString()
        };
        console.log('📊 Event:', event);
    },

    // Track product view
    trackProductView: (productId, productName) => {
        Analytics.trackEvent('product_view', {
            productId: productId,
            productName: productName
        });
    },

    // Track add to cart
    trackAddToCart: (productId, productName, price) => {
        Analytics.trackEvent('add_to_cart', {
            productId: productId,
            productName: productName,
            price: price
        });
    },

    // Track purchase
    trackPurchase: (orderId, total, items) => {
        Analytics.trackEvent('purchase', {
            orderId: orderId,
            total: total,
            items: items
        });
    }
};

// ================================================================
// PERFORMANCE MONITORING
// ================================================================
const Performance = {
    // Measure page load time
    measurePageLoad: () => {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⏱️ Page Load Time: ${pageLoadTime}ms`);
        });
    },

    // Measure API response time
    measureApiCall: async (url) => {
        const startTime = performance.now();
        try {
            const response = await fetch(url);
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.log(`⏱️ API Call (${url}): ${duration.toFixed(2)}ms`);
            return response;
        } catch (error) {
            console.error('API Call Error:', error);
        }
    },

    // Initialize performance monitoring
    init: () => {
        Performance.measurePageLoad();

        // Log Core Web Vitals if available
        if ('web-vital' in window) {
            console.log('📊 Web Vitals Monitoring Enabled');
        }
    }
};

// ================================================================
// INITIALIZATION
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Toolkit Store Initialized');

    // Initialize dark mode
    DarkMode.init();

    // Initialize mobile navigation
    MobileNav.init();

    // Initialize scroll behavior
    ScrollBehavior.init();

    // Initialize performance monitoring
    Performance.init();

    // Track initial page view
    const pageName = document.title.split(' - ')[0];
    Analytics.trackPageView(pageName);

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        .toast {
            animation: slideIn 0.3s ease-out;
        }

        .modal.active {
            animation: fadeIn 0.3s ease-out;
        }

        @media (max-width: 768px) {
            .menu-toggle {
                display: block !important;
            }

            .nav-menu {
                display: none;
            }

            .nav-menu.active {
                display: flex;
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
});

// ================================================================
// UTILITY FUNCTIONS FOR FORMS
// ================================================================
const FormUtils = {
    // Validate form
    validateForm: (formElement) => {
        const formData = new FormData(formElement);
        const errors = [];

        formData.forEach((value, key) => {
            if (!value || value.trim() === '') {
                errors.push(`${key} is required`);
            }

            // Email validation
            if (key.includes('email') && !Toolkit.isValidEmail(value)) {
                errors.push(`${key} is invalid`);
            }

            // Phone validation
            if (key.includes('phone') && !Toolkit.isValidPhone(value)) {
                errors.push('Phone number must be 10 digits');
            }

            // Password validation
            if (key.includes('password') && value.length < 6) {
                errors.push('Password must be at least 6 characters');
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    // Reset form
    resetForm: (formElement) => {
        formElement.reset();
        formElement.querySelectorAll('.error-message').forEach(el => el.remove());
    },

    // Show form errors
    showFormErrors: (formElement, errors) => {
        FormUtils.clearFormErrors(formElement);
        errors.forEach(error => {
            const errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            errorEl.textContent = error;
            errorEl.style.cssText = `
                color: #ef4444;
                font-size: 12px;
                margin-bottom: 8px;
            `;
            formElement.appendChild(errorEl);
        });
    },

    // Clear form errors
    clearFormErrors: (formElement) => {
        formElement.querySelectorAll('.error-message').forEach(el => el.remove());
    },

    // Get form data as object
    getFormData: (formElement) => {
        const formData = new FormData(formElement);
        const obj = {};
        formData.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
};

// ================================================================
// LAZY LOADING
// ================================================================
const LazyLoad = {
    // Observe images for lazy loading
    init: () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
};

// ================================================================
// NETWORK STATUS
// ================================================================
window.addEventListener('online', () => {
    Toolkit.showToast('You are back online! 🌐');
    console.log('🌐 Online');
});

window.addEventListener('offline', () => {
    Toolkit.showToast('You are offline! Check your connection.', 'error');
    console.log('📴 Offline');
});

// ================================================================
// DEBUGGING HELPERS
// ================================================================
const Debug = {
    // Log all cart items
    logCart: () => {
        console.log('🛒 Cart:', cartManager.getCart());
    },

    // Log all products
    logProducts: () => {
        console.log('📦 Products:', PRODUCTS);
    },

    // Log current user
    logCurrentUser: () => {
        console.log('👤 Current User:', authManager.getCurrentUser());
    },

    // Log all categories
    logCategories: () => {
        console.log('📂 Categories:', CATEGORIES);
    },

    // Log data stats
    logDataStats: () => {
        console.log('📊 Data Stats:', DataStats);
    },

    // Clear all data
    clearAllData: () => {
        if (confirm('This will clear all cart, user, and local data. Continue?')) {
            localStorage.clear();
            location.reload();
        }
    }
};

// Make debug available globally in console
window.Debug = Debug;
