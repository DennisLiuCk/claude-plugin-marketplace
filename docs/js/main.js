// Main JavaScript for Claude Plugin Marketplace

// State management
let state = {
    currentCategory: 'all',
    currentSource: 'all',
    searchQuery: '',
    plugins: [],
    readmeCache: {} // Cache for README content
};

// DOM elements
let pluginsGrid;
let noResults;
let searchInput;
let categoryButtons;
let sourceButtons;

// Modal elements
let modal;
let modalTitle;
let modalIcon;
let modalMeta;
let modalContent;
let modalLoading;
let modalError;
let modalGithubBtn;
let modalGithubLink;
let modalInstallBtn;
let modalClose;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeModal();
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

// Initialize Modal elements
function initializeModal() {
    modal = document.getElementById('plugin-modal');
    modalTitle = document.getElementById('modal-title');
    modalIcon = document.getElementById('modal-icon');
    modalMeta = document.getElementById('modal-meta');
    modalContent = document.getElementById('modal-content');
    modalLoading = document.getElementById('modal-loading');
    modalError = document.getElementById('modal-error');
    modalGithubBtn = document.getElementById('modal-github-btn');
    modalGithubLink = document.getElementById('modal-github-link');
    modalInstallBtn = document.getElementById('modal-install-btn');
    modalClose = document.getElementById('modal-close');

    // Setup modal event listeners
    if (modal) {
        // Close button
        modalClose.addEventListener('click', closeModal);

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        // Install button in modal
        modalInstallBtn.addEventListener('click', function() {
            const command = this.dataset.command;
            if (command) {
                copyToClipboard(command, this, '插件');
            }
        });
    }
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
                window.CATEGORY_NAMES[plugin.category] || ''
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

    const categoryLabel = window.CATEGORY_NAMES[plugin.category] || plugin.category;
    const sourceLabel = plugin.sourceType === 'official' ? '官方' : '社群';
    const sourceClass = plugin.sourceType === 'official' ? 'official' : 'community';

    // Generate install command
    const installCommand = `claude plugin install github:DennisLiuCk/claude-plugin-marketplace/plugins/${plugin.name}`;

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

        <div class="plugin-actions">
            <button class="install-btn" data-command="${installCommand}" data-plugin-name="${plugin.displayName}">
                <span class="install-btn-icon">⚡</span>
                <span class="install-btn-text">一鍵安裝</span>
                <span class="install-btn-copied">已複製！</span>
            </button>
            <button class="install-details-toggle" data-plugin-name="${plugin.name}">
                <span class="toggle-icon">📋</span>
                安裝方式
            </button>
        </div>

        <div class="install-details" data-plugin="${plugin.name}">
            <div class="install-method">
                <div class="method-header">
                    <span class="method-icon">💻</span>
                    <h4 class="method-title">CLI 安裝（推薦）</h4>
                </div>
                <div class="code-block">
                    <code class="install-command">${installCommand}</code>
                    <button class="copy-code-btn" data-command="${installCommand}">
                        <span class="copy-icon">📋</span>
                    </button>
                </div>
            </div>

            <div class="install-method">
                <div class="method-header">
                    <span class="method-icon">📁</span>
                    <h4 class="method-title">手動安裝（專案層級）</h4>
                </div>
                <div class="install-note">
                    需要先 clone 儲存庫到本機，然後在儲存庫目錄內執行：
                </div>
                <div class="code-block multi-step">
                    <code class="install-command">git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git && cd claude-plugin-marketplace && cp -r plugins/${plugin.name} YOUR_PROJECT/.claude/plugins/</code>
                    <button class="copy-code-btn" data-command="git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git && cd claude-plugin-marketplace && cp -r plugins/${plugin.name} YOUR_PROJECT/.claude/plugins/">
                        <span class="copy-icon">📋</span>
                    </button>
                </div>
                <div class="install-hint">
                    💡 請將 <code>YOUR_PROJECT</code> 替換為你的專案路徑
                </div>
            </div>

            <div class="install-method">
                <div class="method-header">
                    <span class="method-icon">🌐</span>
                    <h4 class="method-title">手動安裝（全域）</h4>
                </div>
                <div class="install-note">
                    需要先 clone 儲存庫到本機，然後在儲存庫目錄內執行：
                </div>
                <div class="code-block multi-step">
                    <code class="install-command">git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git && cd claude-plugin-marketplace && cp -r plugins/${plugin.name} ~/.claude/plugins/</code>
                    <button class="copy-code-btn" data-command="git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git && cd claude-plugin-marketplace && cp -r plugins/${plugin.name} ~/.claude/plugins/">
                        <span class="copy-icon">📋</span>
                    </button>
                </div>
                <div class="install-hint">
                    💡 此插件將在所有專案中可用
                </div>
            </div>
        </div>

        <div class="plugin-footer">
            <span class="plugin-version">v${plugin.version}</span>
            <button class="plugin-readme-btn" data-plugin-name="${plugin.name}">
                📖 查看 README
            </button>
        </div>
    `;

    // Add event listeners after creating the card
    setupCardEventListeners(card, plugin);

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

// Add smooth scroll for anchor links (only for internal page anchors)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Skip if it's just "#" or if the href has been changed to an external URL
        // Also skip if the anchor has target="_blank" (external links)
        if (href === '#' || !href.startsWith('#') || this.target === '_blank') {
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
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

// Setup event listeners for plugin card
function setupCardEventListeners(card, plugin) {
    // Install button click handler
    const installBtn = card.querySelector('.install-btn');
    if (installBtn) {
        installBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const command = this.dataset.command;
            const pluginName = this.dataset.pluginName;
            copyToClipboard(command, this, pluginName);
        });

        // Add hover tooltip
        installBtn.addEventListener('mouseenter', function() {
            showCommandTooltip(this, this.dataset.command);
        });

        installBtn.addEventListener('mouseleave', function() {
            hideCommandTooltip();
        });
    }

    // Details toggle button
    const toggleBtn = card.querySelector('.install-details-toggle');
    const detailsPanel = card.querySelector('.install-details');
    if (toggleBtn && detailsPanel) {
        toggleBtn.addEventListener('click', function() {
            const isExpanded = detailsPanel.classList.contains('expanded');

            // Close all other panels first
            document.querySelectorAll('.install-details.expanded').forEach(panel => {
                panel.classList.remove('expanded');
            });
            document.querySelectorAll('.install-details-toggle.active').forEach(btn => {
                btn.classList.remove('active');
            });

            // Toggle current panel
            if (!isExpanded) {
                detailsPanel.classList.add('expanded');
                this.classList.add('active');
            }
        });
    }

    // Copy buttons in details panel
    const copyBtns = card.querySelectorAll('.copy-code-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const command = this.dataset.command;
            copyToClipboard(command, this);
        });
    });

    // README button click handler
    const readmeBtn = card.querySelector('.plugin-readme-btn');
    if (readmeBtn) {
        readmeBtn.addEventListener('click', function() {
            openPluginModal(plugin);
        });
    }
}

// Copy to clipboard with visual feedback
async function copyToClipboard(text, button, pluginName = null) {
    try {
        await navigator.clipboard.writeText(text);

        // Create success particles effect
        createCopyParticles(button);

        // Add copied state to button
        button.classList.add('copied');

        // Show global notification
        if (pluginName) {
            showCopyNotification(pluginName);
        }

        // Reset button state after animation
        setTimeout(() => {
            button.classList.remove('copied');
        }, 2000);

    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        fallbackCopy(text, button);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 2000);
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
}

// Create particle effect on copy
function createCopyParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create 8 particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'copy-particle';
        particle.textContent = '✨';

        // Position at button center
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';

        // Calculate random direction
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 50 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(particle);

        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Show copy success notification
function showCopyNotification(pluginName) {
    // Remove existing notification if any
    const existing = document.querySelector('.copy-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `
        <div class="notification-icon">✓</div>
        <div class="notification-content">
            <div class="notification-title">安裝命令已複製</div>
            <div class="notification-message">${pluginName} 可在終端機中執行安裝</div>
        </div>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show command tooltip on hover
let currentTooltip = null;

function showCommandTooltip(button, command) {
    // Remove existing tooltip
    hideCommandTooltip();

    const tooltip = document.createElement('div');
    tooltip.className = 'command-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <span class="tooltip-icon">$</span>
            <span class="tooltip-title">安裝命令</span>
        </div>
        <code class="tooltip-command">${command}</code>
    `;

    document.body.appendChild(tooltip);
    currentTooltip = tooltip;

    // Position tooltip above button
    const rect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px';
    tooltip.style.top = rect.top - tooltipRect.height - 10 + 'px';

    // Show tooltip
    setTimeout(() => tooltip.classList.add('show'), 10);
}

function hideCommandTooltip() {
    if (currentTooltip) {
        currentTooltip.classList.remove('show');
        setTimeout(() => {
            if (currentTooltip) {
                currentTooltip.remove();
                currentTooltip = null;
            }
        }, 200);
    }
}

// Console welcome message
console.log(
    '%c🚀 Claude Plugin Marketplace',
    'font-size: 20px; font-weight: bold; color: #00d4aa;'
);
console.log(
    '%c繁體中文插件市場 v1.5.0',
    'font-size: 14px; color: #9ca3b5;'
);
console.log(
    '%c查看源碼: https://github.com/DennisLiuCk/claude-plugin-marketplace',
    'font-size: 12px; color: #6b7280;'
);

// ==========================================
// Modal Functions
// ==========================================

// Open plugin detail modal
async function openPluginModal(plugin) {
    if (!modal) return;

    const categoryLabel = window.CATEGORY_NAMES[plugin.category] || plugin.category;
    const sourceLabel = plugin.sourceType === 'official' ? '官方' : '社群';
    const sourceClass = plugin.sourceType === 'official' ? 'official' : 'community';
    const installCommand = `claude plugin install github:DennisLiuCk/claude-plugin-marketplace/plugins/${plugin.name}`;

    // Set modal content
    modalIcon.textContent = plugin.icon;
    modalTitle.textContent = plugin.displayName;
    modalMeta.innerHTML = `
        <span class="modal-category ${plugin.category}">${categoryLabel}</span>
        <span class="modal-source ${sourceClass}">${sourceLabel}</span>
        <span class="modal-version">v${plugin.version}</span>
    `;

    // Set button links
    modalGithubBtn.href = plugin.githubUrl;
    modalGithubLink.href = plugin.githubUrl;
    modalInstallBtn.dataset.command = installCommand;

    // Reset modal state
    modalLoading.style.display = 'flex';
    modalContent.style.display = 'none';
    modalContent.innerHTML = '';
    modalError.style.display = 'none';

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Fetch README content
    try {
        const readmeContent = await fetchPluginReadme(plugin.name);
        if (readmeContent) {
            // Configure marked options
            if (typeof marked !== 'undefined') {
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    headerIds: true,
                    mangle: false
                });
                modalContent.innerHTML = marked.parse(readmeContent);
            } else {
                // Fallback: display as preformatted text
                modalContent.innerHTML = `<pre>${escapeHtml(readmeContent)}</pre>`;
            }
            modalLoading.style.display = 'none';
            modalContent.style.display = 'block';
        } else {
            throw new Error('No content');
        }
    } catch (error) {
        console.error('Failed to load README:', error);
        modalLoading.style.display = 'none';
        modalError.style.display = 'flex';
    }
}

// Close modal
function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Fetch README from GitHub
async function fetchPluginReadme(pluginName) {
    // Check cache first
    if (state.readmeCache[pluginName]) {
        return state.readmeCache[pluginName];
    }

    const rawUrl = `https://raw.githubusercontent.com/DennisLiuCk/claude-plugin-marketplace/main/plugins/${pluginName}/README.md`;

    try {
        const response = await fetch(rawUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        // Cache the content
        state.readmeCache[pluginName] = content;
        return content;
    } catch (error) {
        console.error('Error fetching README:', error);
        return null;
    }
}

// Escape HTML for safe display
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
