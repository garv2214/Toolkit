/* ================================================================
   TOOLKIT E-COMMERCE - PRODUCTS PAGE LOGIC
   ================================================================ */

// ================================================================
// PRODUCT FILTER & SORT STATE
// ================================================================
const FilterState = {
    category: null,
    priceRange: { min: 0, max: 2000 },
    rating: 0,
    searchQuery: '',
    sortBy: 'featured',
    tags: [],

    // Reset filters
    reset: () => {
        FilterState.category = null;
        FilterState.priceRange = { min: 0, max: 2000 };
        FilterState.rating = 0;
        FilterState.searchQuery = '';
        FilterState.sortBy = 'featured';
        FilterState.tags = [];
    },

    // Set category filter
    setCategory: (category) => {
        FilterState.category = category;
    },

    // Set price range
    setPriceRange: (min, max) => {
        FilterState.priceRange = { min, max };
    },

    // Set minimum rating
    setRating: (rating) => {
        FilterState.rating = rating;
    },

    // Set search query
    setSearchQuery: (query) => {
        FilterState.searchQuery = query;
    },

    // Set sort option
    setSortBy: (sort) => {
        FilterState.sortBy = sort;
    },

    // Add tag filter
    addTag: (tag) => {
        if (!FilterState.tags.includes(tag)) {
            FilterState.tags.push(tag);
        }
    },

    // Remove tag filter
    removeTag: (tag) => {
        FilterState.tags = FilterState.tags.filter(t => t !== tag);
    },

    // Get filter summary
    getSummary: () => {
        return {
            category: FilterState.category,
            priceRange: FilterState.priceRange,
            rating: FilterState.rating,
            searchQuery: FilterState.searchQuery,
            sortBy: FilterState.sortBy,
            tags: FilterState.tags
        };
    }
};

// ================================================================
// PRODUCT FILTERING ENGINE
// ================================================================
const ProductFilter = {
    // Apply all filters
    applyFilters: () => {
        let filtered = [...PRODUCTS];

        // Filter by category
        if (FilterState.category) {
            filtered = filtered.filter(p => p.category === FilterState.category);
        }

        // Filter by search query
        if (FilterState.searchQuery) {
            const query = FilterState.searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Filter by price range
        filtered = filtered.filter(p =>
            p.price >= FilterState.priceRange.min &&
            p.price <= FilterState.priceRange.max
        );

        // Filter by rating
        if (FilterState.rating > 0) {
            filtered = filtered.filter(p => p.rating >= FilterState.rating);
        }

        // Filter by tags
        if (FilterState.tags.length > 0) {
            filtered = filtered.filter(p =>
                FilterState.tags.some(tag => p.tags.includes(tag))
            );
        }

        // Sort results
        filtered = sortProducts(filtered, FilterState.sortBy);

        return filtered;
    },

    // Get filter suggestions
    getSuggestions: () => {
        const filtered = ProductFilter.applyFilters();
        return {
            count: filtered.length,
            priceRange: {
                min: Math.min(...filtered.map(p => p.price)),
                max: Math.max(...filtered.map(p => p.price))
            },
            tags: [...new Set(filtered.flatMap(p => p.tags))],
            categories: [...new Set(filtered.map(p => p.category))]
        };
    }
};

// ================================================================
// PRODUCT LISTING UI
// ================================================================
const ProductListing = {
    // Render product cards
    renderProducts: (products, containerId = 'products-grid') => {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p style="font-size: 18px; color: var(--text-secondary);">📦 No products found</p>
                    <p style="color: var(--text-secondary);">Try adjusting your filters or search query</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">${product.image}</div>
                <div class="product-content">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${CATEGORIES[product.category].name}</p>
                    <p class="product-description">${Toolkit.truncate(product.description, 40)}</p>
                    <div class="product-rating">
                        <span class="stars">${'⭐'.repeat(Math.round(product.rating))}</span>
                        <span class="rating-value">${product.rating}</span>
                    </div>
                    <div class="product-stock">
                        ${product.stock > 0 
                            ? `<span style="color: #22c55e;">✅ In Stock (${product.stock})</span>`
                            : `<span style="color: #ef4444;">❌ Out of Stock</span>`
                        }
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${Toolkit.formatPrice(product.price)}</span>
                        <button class="btn btn-add-to-cart" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            🛒 Add
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners
        ProductListing.attachEventListeners(container);
    },

    // Attach event listeners to product cards
    attachEventListeners: (container) => {
        // Add to cart buttons
        container.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(btn.getAttribute('data-product-id'));
                const product = PRODUCTS.find(p => p.id === productId);
                if (product && product.stock > 0) {
                    cartManager.addToCart(product, 1);
                    Toolkit.showToast(`${product.name} added to cart! 🛒`);
                    Analytics.trackAddToCart(product.id, product.name, product.price);
                } else {
                    Toolkit.showToast('Product out of stock', 'error');
                }
            });
        });

        // Product card click (view details)
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-add-to-cart')) {
                    const productId = card.getAttribute('data-product-id');
                    Analytics.trackProductView(productId, card.querySelector('.product-name').textContent);
                    window.location.href = `product.html?id=${productId}`;
                }
            });
        });
    },

    // Render grid with pagination
    renderProductsWithPagination: (products, itemsPerPage = 12, page = 1) => {
        const totalPages = Math.ceil(products.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageProducts = products.slice(start, end);

        ProductListing.renderProducts(pageProducts);

        return {
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: itemsPerPage,
            totalItems: products.length,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    }
};

// ================================================================
// FILTER UI COMPONENT
// ================================================================
const FilterUI = {
    // Render filter sidebar
    renderFilterSidebar: (containerId = 'filter-sidebar') => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const suggestions = ProductFilter.getSuggestions();
        const priceRange = getPriceRange();

        container.innerHTML = `
            <!-- Search Filter -->
            <div class="filter-group">
                <h3>Search</h3>
                <input 
                    type="text" 
                    id="search-input" 
                    class="form-control" 
                    placeholder="Search products..."
                    value="${FilterState.searchQuery}"
                >
            </div>

            <!-- Category Filter -->
            <div class="filter-group">
                <h3>Category</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="display: flex; align-items: center; gap: 8px;">
                        <input 
                            type="radio" 
                            name="category" 
                            value="" 
                            ${!FilterState.category ? 'checked' : ''}
                        >
                        All Categories
                    </label>
                    ${Object.entries(CATEGORIES).map(([key, cat]) => `
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input 
                                type="radio" 
                                name="category" 
                                value="${key}"
                                ${FilterState.category === key ? 'checked' : ''}
                            >
                            ${cat.icon} ${cat.name}
                        </label>
                    `).join('')}
                </div>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-group">
                <h3>Price Range</h3>
                <div style="display: flex; gap: 8px;">
                    <input 
                        type="number" 
                        id="price-min" 
                        class="form-control" 
                        placeholder="Min"
                        value="${FilterState.priceRange.min}"
                        min="0"
                        max="${priceRange.max}"
                    >
                    <input 
                        type="number" 
                        id="price-max" 
                        class="form-control" 
                        placeholder="Max"
                        value="${FilterState.priceRange.max}"
                        min="0"
                        max="${priceRange.max}"
                    >
                </div>
                <p style="font-size: 12px; color: var(--text-secondary); margin-top: 8px;">
                    ₹${FilterState.priceRange.min} - ₹${FilterState.priceRange.max}
                </p>
            </div>

            <!-- Rating Filter -->
            <div class="filter-group">
                <h3>Minimum Rating</h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${[0, 3, 3.5, 4, 4.5].map(rating => `
                        <label style="display: flex; align-items: center; gap: 8px;">
                            <input 
                                type="radio" 
                                name="rating" 
                                value="${rating}"
                                ${FilterState.rating === rating ? 'checked' : ''}
                            >
                            ${rating === 0 ? 'All Ratings' : '⭐'.repeat(Math.round(rating)) + ` & up (${rating})`}
                        </label>
                    `).join('')}
                </div>
            </div>

            <!-- Sort Options -->
            <div class="filter-group">
                <h3>Sort By</h3>
                <select id="sort-select" class="form-control" value="${FilterState.sortBy}">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                </select>
            </div>

            <!-- Active Filters Display -->
            <div class="filter-group">
                <h3>Active Filters</h3>
                <div id="active-filters" style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${FilterState.category ? `
                        <span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 16px; font-size: 12px;">
                            ${CATEGORIES[FilterState.category].name} ✕
                        </span>
                    ` : ''}
                </div>
            </div>

            <!-- Reset Button -->
            <button id="reset-filters" class="btn btn-secondary btn-block">
                Reset All Filters
            </button>
        `;

        FilterUI.attachFilterListeners();
    },

    // Attach filter event listeners
    attachFilterListeners: () => {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', Toolkit.debounce((e) => {
                FilterState.setSearchQuery(e.target.value);
                FilterUI.applyAndRender();
            }, 300));
        }

        // Category radio buttons
        document.querySelectorAll('input[name="category"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                FilterState.setCategory(e.target.value || null);
                FilterUI.applyAndRender();
            });
        });

        // Price range inputs
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');

        if (priceMin) {
            priceMin.addEventListener('change', (e) => {
                FilterState.setPriceRange(
                    parseInt(e.target.value),
                    FilterState.priceRange.max
                );
                FilterUI.applyAndRender();
            });
        }

        if (priceMax) {
            priceMax.addEventListener('change', (e) => {
                FilterState.setPriceRange(
                    FilterState.priceRange.min,
                    parseInt(e.target.value)
                );
                FilterUI.applyAndRender();
            });
        }

        // Rating radio buttons
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                FilterState.setRating(parseFloat(e.target.value));
                FilterUI.applyAndRender();
            });
        });

        // Sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                FilterState.setSortBy(e.target.value);
                FilterUI.applyAndRender();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                FilterState.reset();
                FilterUI.applyAndRender();
                FilterUI.renderFilterSidebar();
                Toolkit.showToast('Filters reset! 🔄');
            });
        }
    },

    // Apply filters and render products
    applyAndRender: () => {
        const filtered = ProductFilter.applyFilters();
        ProductListing.renderProducts(filtered);
    }
};

// ================================================================
// PRODUCT DETAIL PAGE
// ================================================================
const ProductDetail = {
    // Load and display product details
    loadProductDetail: (productId) => {
        const product = getProductById(parseInt(productId));

        if (!product) {
            document.body.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h1>Product Not Found</h1>
                    <p>The product you're looking for doesn't exist.</p>
                    <a href="products.html" class="btn btn-primary">Back to Products</a>
                </div>
            `;
            return;
        }

        document.body.innerHTML = `
            <header class="header">
                <nav class="navbar">
                    <a href="index.html" class="logo">🎨 Toolkit</a>
                    <a href="products.html" class="btn btn-outline">← Back to Products</a>
                </nav>
            </header>

            <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
                    <!-- Product Image -->
                    <div style="text-align: center;">
                        <div style="font-size: 120px; margin-bottom: 20px;">${product.image}</div>
                        ${product.stock > 0 
                            ? `<span style="background: #22c55e; color: white; padding: 8px 16px; border-radius: 8px; display: inline-block;">✅ In Stock (${product.stock} available)</span>`
                            : `<span style="background: #ef4444; color: white; padding: 8px 16px; border-radius: 8px; display: inline-block;">❌ Out of Stock</span>`
                        }
                    </div>

                    <!-- Product Info -->
                    <div>
                        <h1>${product.name}</h1>
                        <p style="color: var(--text-secondary); margin-bottom: 20px;">
                            Category: ${CATEGORIES[product.category].name}
                        </p>

                        <!-- Rating -->
                        <div style="margin-bottom: 20px;">
                            <span class="stars">${'⭐'.repeat(Math.round(product.rating))}</span>
                            <span style="margin-left: 8px; font-weight: 500;">${product.rating} out of 5</span>
                        </div>

                        <!-- Price -->
                        <h2 style="color: var(--primary); font-size: 32px; margin: 20px 0;">
                            ${Toolkit.formatPrice(product.price)}
                        </h2>

                        <!-- Description -->
                        <p style="margin: 20px 0; line-height: 1.6;">
                            ${product.description}
                        </p>

                        <!-- Tags -->
                        <div style="margin: 20px 0;">
                            ${product.tags.map(tag => `
                                <span style="background: var(--lighter); padding: 4px 12px; margin-right: 8px; border-radius: 16px; font-size: 12px; display: inline-block; margin-bottom: 8px;">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>

                        <!-- Add to Cart -->
                        <div style="display: flex; gap: 16px; margin-top: 30px;">
                            <button id="add-to-cart-btn" class="btn btn-primary btn-large" ${product.stock === 0 ? 'disabled' : ''}>
                                🛒 Add to Cart
                            </button>
                            <button id="buy-now-btn" class="btn btn-outline btn-large" ${product.stock === 0 ? 'disabled' : ''}>
                                Buy Now
                            </button>
                        </div>

                        <!-- Quantity Selector -->
                        <div style="display: flex; align-items: center; gap: 16px; margin-top: 20px;">
                            <label>Quantity:</label>
                            <input type="number" id="quantity-input" value="1" min="1" max="${product.stock}" class="form-control" style="width: 80px;">
                        </div>
                    </div>
                </div>

                <!-- Related Products -->
                <div>
                    <h2>Related Products</h2>
                    <div id="related-products" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;"></div>
                </div>
            </div>
        `;

        // Load all scripts
        const scripts = ['js/data.js', 'js/cart.js', 'js/auth.js', 'js/main.js'];
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            document.body.appendChild(script);
        });

        // Setup event listeners
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        const buyNowBtn = document.getElementById('buy-now-btn');
        const quantityInput = document.getElementById('quantity-input');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                cartManager.addToCart(product, quantity);
                Toolkit.showToast(`${quantity}x ${product.name} added to cart! 🛒`);
                Analytics.trackAddToCart(product.id, product.name, product.price);
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                cartManager.addToCart(product, quantity);
                window.location.href = 'cart.html';
            });
        }

        // Load related products
        const relatedContainer = document.getElementById('related-products');
        if (relatedContainer) {
            const related = getRelatedProducts(product.id, 4);
            relatedContainer.innerHTML = related.map(p => `
                <div class="product-card" data-product-id="${p.id}">
                    <div class="product-image">${p.image}</div>
                    <div class="product-content">
                        <h3 class="product-name">${p.name}</h3>
                        <p class="product-category">${CATEGORIES[p.category].name}</p>
                        <div class="product-rating">
                            <span class="stars">${'⭐'.repeat(Math.round(p.rating))}</span>
                        </div>
                        <div class="product-footer">
                            <span class="product-price">${Toolkit.formatPrice(p.price)}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            relatedContainer.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-product-id');
                    window.location.href = `product.html?id=${id}`;
                });
            });
        }
    }
};

// ================================================================
// INITIALIZATION
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if on products page
    if (document.getElementById('products-grid')) {
        // Get category filter from URL
        const category = Toolkit.getUrlParam('category');
        if (category) {
            FilterState.setCategory(category);
        }

        // Render filters
        FilterUI.renderFilterSidebar();

        // Apply filters and render
        FilterUI.applyAndRender();

        console.log('📦 Products Page Loaded');
    }

    // Check if on product detail page
    const productId = Toolkit.getUrlParam('id');
    if (productId && document.body.innerHTML.includes('product-detail')) {
        ProductDetail.loadProductDetail(productId);
        console.log(`📄 Product Detail Page Loaded (ID: ${productId})`);
    }
});

// ================================================================
// EXPORT FOR EXTERNAL USE
// ================================================================
// FilterState - Control filters
// FilterUI.renderFilterSidebar() - Render filter sidebar
// ProductListing.renderProducts(products) - Render product list
// ProductFilter.applyFilters() - Get filtered products
// ProductDetail.loadProductDetail(id) - Load product detail
