/* ================================================================
   TOOLKIT E-COMMERCE - PRODUCT DATA & CATEGORIES
   ================================================================ */

// ================================================================
// CATEGORIES
// ================================================================
const CATEGORIES = {
    pens: {
        name: 'Pens',
        icon: '🖊️',
        description: 'Premium writing pens'
    },
    pencils: {
        name: 'Pencils',
        icon: '✏️',
        description: 'Quality pencils for sketching and writing'
    },
    erasers: {
        name: 'Erasers & Sharpeners',
        icon: '🧹',
        description: 'Erasers and pencil sharpeners'
    },
    notebooks: {
        name: 'Notebooks & Diaries',
        icon: '📓',
        description: 'Journals and notebooks for notes'
    },
    sticky: {
        name: 'Sticky Notes & Highlighters',
        icon: '🟩',
        description: 'Sticky notes and highlighting tools'
    },
    art: {
        name: 'Art Supplies',
        icon: '🎨',
        description: 'Complete art and drawing supplies'
    },
    geometry: {
        name: 'Geometry Boxes & Rulers',
        icon: '📐',
        description: 'Geometry sets and measuring tools'
    },
    office: {
        name: 'Office Stationery',
        icon: '📎',
        description: 'Professional office supplies'
    },
    kits: {
        name: 'School Kits & Combos',
        icon: '🎒',
        description: 'Complete school supply kits'
    }
};

// ================================================================
// PRODUCTS (24 total across 9 categories)
// ================================================================
const PRODUCTS = [
    // PENS (3 items)
    {
        id: 1,
        name: 'Classic Ball Point Pen',
        category: 'pens',
        price: 299,
        image: '🖊️',
        description: 'Smooth writing experience with reliable ink flow. Perfect for daily use.',
        stock: 50,
        rating: 4.5,
        tags: ['popular', 'affordable']
    },
    {
        id: 2,
        name: 'Premium Gel Pen Set',
        category: 'pens',
        price: 599,
        image: '🖍️',
        description: 'Pack of 12 vibrant gel pens. Smooth gliding ink for comfortable writing.',
        stock: 30,
        rating: 4.8,
        tags: ['trending', 'bestseller']
    },
    {
        id: 3,
        name: 'Luxury Fountain Pen',
        category: 'pens',
        price: 1299,
        image: '✒️',
        description: 'Premium fountain pen with elegant design. Perfect for professionals.',
        stock: 15,
        rating: 4.9,
        tags: ['premium', 'luxury']
    },

    // PENCILS (3 items)
    {
        id: 4,
        name: 'HB Graphite Pencil Pack',
        category: 'pencils',
        price: 199,
        image: '✏️',
        description: 'Set of 24 HB pencils. Ideal for sketching and writing.',
        stock: 60,
        rating: 4.3,
        tags: ['affordable', 'popular']
    },
    {
        id: 5,
        name: 'Colored Pencil Collection',
        category: 'pencils',
        price: 899,
        image: '🖍️',
        description: '36 vibrant colored pencils for artists. Premium quality pigments.',
        stock: 25,
        rating: 4.7,
        tags: ['trending', 'artist']
    },
    {
        id: 6,
        name: 'Mechanical Pencil Set',
        category: 'pencils',
        price: 399,
        image: '✏️',
        description: 'Set of 5 mechanical pencils with extra leads. Precision engineering.',
        stock: 40,
        rating: 4.4,
        tags: ['professional', 'popular']
    },

    // ERASERS & SHARPENERS (2 items)
    {
        id: 7,
        name: 'Combo Eraser & Sharpener',
        category: 'erasers',
        price: 149,
        image: '🧹',
        description: 'All-in-one eraser and pencil sharpener. Compact and portable.',
        stock: 100,
        rating: 4.2,
        tags: ['affordable', 'combo']
    },
    {
        id: 8,
        name: 'Professional Sharpener Set',
        category: 'erasers',
        price: 549,
        image: '🧹',
        description: 'Professional grade sharpeners for all pencil sizes.',
        stock: 35,
        rating: 4.6,
        tags: ['professional', 'quality']
    },

    // NOTEBOOKS & DIARIES (3 items)
    {
        id: 9,
        name: 'Plain Notebook A4',
        category: 'notebooks',
        price: 299,
        image: '📓',
        description: 'Quality paper notebook. 100 pages for writing and sketching.',
        stock: 75,
        rating: 4.3,
        tags: ['popular', 'affordable']
    },
    {
        id: 10,
        name: 'Hardcover Diary 2025',
        category: 'notebooks',
        price: 699,
        image: '📔',
        description: 'Premium hardcover diary with elegant design. Daily planner included.',
        stock: 45,
        rating: 4.7,
        tags: ['trending', 'premium']
    },
    {
        id: 11,
        name: 'Dot Grid Bullet Journal',
        category: 'notebooks',
        price: 499,
        image: '📓',
        description: 'Dot grid pages for creative planning. Perfect for bullet journaling.',
        stock: 55,
        rating: 4.8,
        tags: ['trending', 'creative']
    },

    // STICKY NOTES & HIGHLIGHTERS (2 items)
    {
        id: 12,
        name: 'Sticky Notes Value Pack',
        category: 'sticky',
        price: 199,
        image: '🟩',
        description: 'Pack of 8 sticky note pads in different colors. 100 sheets each.',
        stock: 80,
        rating: 4.2,
        tags: ['affordable', 'popular']
    },
    {
        id: 13,
        name: 'Highlighter Marker Set',
        category: 'sticky',
        price: 349,
        image: '🖍️',
        description: 'Set of 10 vibrant highlighters. Non-bleeding formula.',
        stock: 50,
        rating: 4.5,
        tags: ['popular', 'quality']
    },

    // ART SUPPLIES (3 items)
    {
        id: 14,
        name: 'Watercolor Paint Set',
        category: 'art',
        price: 799,
        image: '🎨',
        description: '24 vibrant watercolors. Professional grade pigments.',
        stock: 30,
        rating: 4.8,
        tags: ['trending', 'artist']
    },
    {
        id: 15,
        name: 'Brush Set for Watercolor',
        category: 'art',
        price: 599,
        image: '🖌️',
        description: 'Set of 12 quality brushes. Perfect for watercolor painting.',
        stock: 40,
        rating: 4.6,
        tags: ['quality', 'artist']
    },
    {
        id: 16,
        name: 'Sketching Charcoal Set',
        category: 'art',
        price: 449,
        image: '🎨',
        description: 'Professional charcoal pencils and sticks for sketching.',
        stock: 35,
        rating: 4.4,
        tags: ['professional', 'artist']
    },

    // GEOMETRY BOXES & RULERS (2 items)
    {
        id: 17,
        name: 'Complete Geometry Box',
        category: 'geometry',
        price: 399,
        image: '📐',
        description: 'Full set with compass, ruler, protractor, and more.',
        stock: 50,
        rating: 4.5,
        tags: ['popular', 'student']
    },
    {
        id: 18,
        name: 'Precision Ruler Set',
        category: 'geometry',
        price: 249,
        image: '📏',
        description: 'Set of 4 precision rulers. Accurate measurements for technical drawing.',
        stock: 60,
        rating: 4.3,
        tags: ['professional', 'quality']
    },

    // OFFICE STATIONERY (3 items)
    {
        id: 19,
        name: 'Paper Clips & Pins Pack',
        category: 'office',
        price: 149,
        image: '📎',
        description: 'Assorted office supplies. 500 pieces total.',
        stock: 100,
        rating: 4.1,
        tags: ['affordable', 'office']
    },
    {
        id: 20,
        name: 'Stapler & Staples Combo',
        category: 'office',
        price: 349,
        image: '📌',
        description: 'Heavy-duty stapler with 5000 staples included.',
        stock: 45,
        rating: 4.4,
        tags: ['office', 'professional']
    },
    {
        id: 21,
        name: 'File Organizer Set',
        category: 'office',
        price: 599,
        image: '📁',
        description: 'Set of 5 colorful file organizers. Keep your desk organized.',
        stock: 40,
        rating: 4.6,
        tags: ['popular', 'office']
    },

    // SCHOOL KITS & COMBOS (3 items)
    {
        id: 22,
        name: 'Back to School Starter Kit',
        category: 'kits',
        price: 1299,
        image: '🎒',
        description: 'Complete kit with pens, pencils, notebook, and more.',
        stock: 25,
        rating: 4.7,
        tags: ['trending', 'bestseller']
    },
    {
        id: 23,
        name: 'Art Student Kit',
        category: 'kits',
        price: 1599,
        image: '🎨',
        description: 'All-in-one kit for art students. Paint, brushes, sketching tools.',
        stock: 20,
        rating: 4.9,
        tags: ['trending', 'premium']
    },
    {
        id: 24,
        name: 'Professional Office Bundle',
        category: 'kits',
        price: 1899,
        image: '📋',
        description: 'Premium office supplies bundle. Everything for the professional.',
        stock: 15,
        rating: 4.8,
        tags: ['premium', 'professional']
    }
];

// ================================================================
// HELPER FUNCTIONS - Get filtered product lists
// ================================================================

/**
 * Get featured products (first 6 products)
 */
function getFeaturedProducts() {
    return PRODUCTS.slice(0, 6);
}

/**
 * Get trending products (products with trending tag)
 */
function getTrendingProducts() {
    return PRODUCTS.filter(product => product.tags.includes('trending')).slice(0, 8);
}

/**
 * Get products by category
 */
function getProductsByCategory(categoryKey) {
    return PRODUCTS.filter(product => product.category === categoryKey);
}

/**
 * Search products by name or description
 */
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Get products by price range
 */
function getProductsByPriceRange(minPrice, maxPrice) {
    return PRODUCTS.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

/**
 * Get products by rating (minimum rating)
 */
function getProductsByRating(minRating) {
    return PRODUCTS.filter(product => product.rating >= minRating);
}

/**
 * Get best-selling products
 */
function getBestSellingProducts() {
    return PRODUCTS.filter(product => product.tags.includes('bestseller')).slice(0, 8);
}

/**
 * Get products by tag
 */
function getProductsByTag(tag) {
    return PRODUCTS.filter(product => product.tags.includes(tag));
}

/**
 * Get in-stock products
 */
function getInStockProducts() {
    return PRODUCTS.filter(product => product.stock > 0);
}

/**
 * Get low-stock products (less than 20)
 */
function getLowStockProducts() {
    return PRODUCTS.filter(product => product.stock < 20 && product.stock > 0);
}

/**
 * Get product by ID
 */
function getProductById(id) {
    return PRODUCTS.find(product => product.id === id);
}

/**
 * Get related products (same category, exclude current)
 */
function getRelatedProducts(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];
    
    return PRODUCTS.filter(p => 
        p.category === product.category && p.id !== productId
    ).slice(0, limit);
}

/**
 * Sort products
 */
function sortProducts(products, sortBy = 'featured') {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sorted.reverse();
            break;
        case 'featured':
        default:
            // Keep original order
            break;
    }
    
    return sorted;
}

/**
 * Get category by key
 */
function getCategoryByKey(key) {
    return CATEGORIES[key];
}

/**
 * Get all categories as array
 */
function getAllCategories() {
    return Object.entries(CATEGORIES).map(([key, value]) => ({
        key: key,
        ...value
    }));
}

/**
 * Get total products count
 */
function getTotalProductsCount() {
    return PRODUCTS.length;
}

/**
 * Get total products in category
 */
function getTotalInCategory(categoryKey) {
    return getProductsByCategory(categoryKey).length;
}

/**
 * Get average rating across all products
 */
function getAverageRating() {
    const sum = PRODUCTS.reduce((total, product) => total + product.rating, 0);
    return Math.round((sum / PRODUCTS.length) * 10) / 10;
}

/**
 * Get total inventory (all items in stock)
 */
function getTotalInventory() {
    return PRODUCTS.reduce((total, product) => total + product.stock, 0);
}

/**
 * Get price range
 */
function getPriceRange() {
    const prices = PRODUCTS.map(p => p.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
        average: Math.round(prices.reduce((a, b) => a + b) / prices.length)
    };
}

// ================================================================
// EXPORT DATA STATS
// ================================================================
const DataStats = {
    totalProducts: getTotalProductsCount(),
    totalCategories: Object.keys(CATEGORIES).length,
    totalInventory: getTotalInventory(),
    averageRating: getAverageRating(),
    priceRange: getPriceRange(),
    inStockCount: getInStockProducts().length,
    lowStockCount: getLowStockProducts().length
};

// Log data stats (optional - for debugging)
console.log('📊 Toolkit Store Data Loaded');
console.log(`✅ Total Products: ${DataStats.totalProducts}`);
console.log(`✅ Categories: ${DataStats.totalCategories}`);
console.log(`✅ Inventory: ${DataStats.totalInventory} units`);
console.log(`✅ Average Rating: ${DataStats.averageRating} ⭐`);
console.log(`✅ Price Range: ₹${DataStats.priceRange.min} - ₹${DataStats.priceRange.max}`);
