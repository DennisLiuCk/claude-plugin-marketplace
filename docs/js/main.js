// Main JavaScript for Claude Plugin Marketplace

// State management
let state = {
    currentCategory: 'all',
    currentSource: 'all',
    searchQuery: '',
    plugins: []
};

// DOM elements
let pluginsGrid;
let noResults;
let searchInput;
let categoryButtons;
let sourceButtons;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadPlugins();
    setupEventListeners();
    renderPlugins();
});

// Initialize DOM element references
function initializeElements() {
    pluginsGrid = document.getElementById('plugins-grid');
    noResults = document.getElementById('no-results');
    searchInput = document.getElementById('search-input');
    categoryButtons = document.querySelectorAll('[data-category]');
    sourceButtons = document.querySelectorAll('[data-source]');
}

// Load plugins data
function loadPlugins() {
    if (typeof window.pluginsData !== 'undefined') {
        state.plugins = window.pluginsData.plugins;
    } else {
        console.error('Plugins data not loaded');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            setActiveCategory(category);
            state.currentCategory = category;
            renderPlugins();
        });
    });

    // Source filter buttons
    sourceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const source = button.dataset.source;
            setActiveSource(source);
            state.currentSource = source;
            renderPlugins();
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            state.searchQuery = e.target.value.toLowerCase().trim();
            renderPlugins();
        }, 300));
    }
}

// Set active category button
function setActiveCategory(category) {
    categoryButtons.forEach(button => {
        if (button.dataset.category === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Set active source button
function setActiveSource(source) {
    sourceButtons.forEach(button => {
        if (button.dataset.source === source) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Filter plugins based on current state
function filterPlugins() {
    let filtered = state.plugins;

    // Filter by category
    if (state.currentCategory !== 'all') {
        filtered = filtered.filter(plugin =>
            plugin.category === state.currentCategory
        );
    }

    // Filter by source
    if (state.currentSource !== 'all') {
        filtered = filtered.filter(plugin =>
            plugin.sourceType === state.currentSource
        );
    }

    // Filter by search query
    if (state.searchQuery) {
        filtered = filtered.filter(plugin => {
            const searchableText = [
                plugin.name,
                plugin.displayName,
                plugin.description,
                plugin.category,
                CATEGORY_NAMES[plugin.category] || ''
            ].join(' ').toLowerCase();

            return searchableText.includes(state.searchQuery);
        });
    }

    return filtered;
}

// Render plugins to the grid
function renderPlugins() {
    const filtered = filterPlugins();

    // Show or hide no results message
    if (filtered.length === 0) {
        pluginsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    } else {
        pluginsGrid.style.display = 'grid';
        noResults.style.display = 'none';
    }

    // Clear existing cards
    pluginsGrid.innerHTML = '';

    // Create and append plugin cards
    filtered.forEach((plugin, index) => {
        const card = createPluginCard(plugin, index);
        pluginsGrid.appendChild(card);
    });
}

// Create a plugin card element
function createPluginCard(plugin, index) {
    const card = document.createElement('div');
    card.className = 'plugin-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const categoryLabel = CATEGORY_NAMES[plugin.category] || plugin.category;
    const sourceLabel = plugin.sourceType === 'official' ? '官方' : '社群';
    const sourceClass = plugin.sourceType === 'official' ? 'official' : 'community';

    card.innerHTML = `
        <div class="plugin-header">
            <div class="plugin-icon">${plugin.icon}</div>
            <div class="plugin-meta">
                <span class="plugin-category ${plugin.category}">${categoryLabel}</span>
                <span class="plugin-source ${sourceClass}">${sourceLabel}</span>
            </div>
        </div>

        <h3 class="plugin-title">${plugin.displayName}</h3>
        <p class="plugin-description">${plugin.description}</p>

        <div class="plugin-footer">
            <span class="plugin-version">v${plugin.version}</span>
            <a href="${plugin.githubUrl}" target="_blank" class="plugin-link">
                查看詳情 →
            </a>
        </div>
    `;

    return card;
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scroll for anchor links
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

// Add intersection observer for scroll animations
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

// Observe all plugin cards for scroll animations
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.plugin-card');
    cards.forEach(card => {
        observer.observe(card);
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Clear filters with Escape
    if (e.key === 'Escape') {
        if (searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
            state.searchQuery = '';
            renderPlugins();
        }
    }
});

// Console welcome message
console.log(
    '%c🚀 Claude Plugin Marketplace',
    'font-size: 20px; font-weight: bold; color: #00d4aa;'
);
console.log(
    '%c繁體中文插件市場 v1.0.0',
    'font-size: 14px; color: #9ca3b5;'
);
console.log(
    '%c查看源碼: https://github.com/DennisLiuCk/claude-plugin-marketplace',
    'font-size: 12px; color: #6b7280;'
);
