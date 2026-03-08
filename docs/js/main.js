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

// ==========================================
// Knowledge / Guides Section
// ==========================================

const guidesData = [
    {
        id: 'what-is-skill',
        title: '什麼是 Skill？',
        icon: '📖',
        level: 'beginner',
        levelLabel: '入門',
        description: '了解 Claude Code 技能系統的核心概念，以及 Skill 與 Command、Agent、Hook 的差異。',
        content: `<h3>四種插件組件比較</h3>
<table>
<thead><tr><th>組件</th><th>觸發方式</th><th>用途</th></tr></thead>
<tbody>
<tr><td><strong>Command</strong></td><td>使用者手動輸入 <code>/command</code></td><td>執行特定操作</td></tr>
<tr><td><strong>Agent</strong></td><td>由 Claude 自動選擇</td><td>專門的 AI 助手</td></tr>
<tr><td><strong>Hook</strong></td><td>事件觸發（如檔案編輯）</td><td>攔截和檢查操作</td></tr>
<tr><td><strong>Skill</strong></td><td>Claude 根據描述自動啟用</td><td>提供領域專業知識和工作流程</td></tr>
</tbody>
</table>
<h3>Skill 的獨特之處</h3>
<p>Skill 最大的特點是<strong>自動觸發</strong>。當使用者的請求與技能描述匹配時，Claude 會自動讀取並運用該技能的指導。使用者不需要記住任何命令 — 技能會在需要時自然出現。</p>
<p>想了解更多？安裝 <a href="https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/skill-creator" target="_blank">skill-creator 插件</a> 查看完整的技能建立指南。</p>`
    },
    {
        id: 'skill-architecture',
        title: '三層載入架構',
        icon: '🏗️',
        level: 'beginner',
        levelLabel: '入門',
        description: '理解 Skill 的漸進式披露（Progressive Disclosure）設計，這是 Anthropic 的核心概念。',
        content: `<h3>三層載入系統</h3>
<p>Skill 使用漸進式披露，讓技能可以包含大量內容而不浪費上下文空間：</p>
<pre><code>第一層：元資料（始終在 Claude 的上下文中）
├── name: "skill-name"
└── description: "何時觸發、做什麼"（約 100 字）
     ↓ 當 Claude 決定使用此技能時
第二層：SKILL.md 本文（載入到上下文中）
├── 詳細指令和工作流程
└── 理想控制在 500 行以內
     ↓ 按需引用
第三層：附帶資源（按需載入，無限制）
├── scripts/    → 可執行的工具腳本
├── references/ → 參考文件
└── assets/     → 範本、圖示等</code></pre>
<h3>為什麼這很重要？</h3>
<p>Claude 的上下文視窗是有限的。第一層（描述）始終存在，所以要精簡但足夠觸發。第二層只在技能啟用時載入。第三層只在需要時讀取。</p>`
    },
    {
        id: 'skill-anatomy',
        title: 'Skill 結構剖析',
        icon: '🔬',
        level: 'intermediate',
        levelLabel: '進階',
        description: '深入理解 SKILL.md 的組成：YAML frontmatter、指令主體與附帶資源。',
        content: `<h3>YAML Frontmatter</h3>
<p>每個 SKILL.md 必須以 YAML frontmatter 開頭：</p>
<pre><code>---
name: my-skill
description: >
  這個描述決定了 Claude 何時會啟用此技能。
  要包含具體的觸發情境，而不只是功能描述。
---</code></pre>
<h3>重點：description 是觸發機制</h3>
<p>Claude 看到所有已安裝技能的名稱和描述。當使用者的請求與描述匹配時，Claude 才會讀取技能的完整內容。因此：</p>
<ul>
<li>描述要「積極」— Anthropic 發現 Claude 傾向於「觸發不足」</li>
<li>包含具體的使用情境</li>
<li>控制在 1024 字元以內（硬限制）</li>
</ul>
<h3>附帶資源結構</h3>
<pre><code>my-skill/
├── SKILL.md
├── scripts/        ← 可程式化執行的工具
├── references/     ← 需要時讀取的參考文件
└── assets/         ← 範本、圖示等</code></pre>`
    },
    {
        id: 'skill-best-practices',
        title: '撰寫最佳實踐',
        icon: '✅',
        level: 'intermediate',
        levelLabel: '進階',
        description: '從 Anthropic 官方指南學習：描述優化、漸進式披露、解釋優於規則。',
        content: `<h3>1. 解釋「為什麼」而非強制「必須」</h3>
<p>LLM 是聰明的。當你解釋原因時，它們能夠泛化到新的情境。</p>
<pre><code># 不好的寫法
ALWAYS use kebab-case for file names.

# 好的寫法
使用 kebab-case 命名檔案（如 my-skill.md），因為這與
Claude Code 的插件系統一致，也避免了不同作業系統
對大小寫敏感度的差異。</code></pre>
<h3>2. 保持精簡</h3>
<p>SKILL.md 理想控制在 500 行以內。需要更多內容時使用 <code>references/</code> 目錄。</p>
<h3>3. 使用祈使語氣</h3>
<p>直接說「讀取使用者的輸入檔案」而非「你應該讀取使用者的輸入檔案」。</p>
<h3>4. 迭代改進</h3>
<p>不要期望一次就寫出完美的技能。好的技能是通過寫草稿 → 測試 → 評估 → 改進循環迭代出來的。</p>
<h3>5. 避免過擬合</h3>
<p>從具體的回饋中概括出通用的原則，而非為每個測試案例寫特殊規則。</p>`
    },
    {
        id: 'skill-eval-system',
        title: '評估與基準測試',
        icon: '📊',
        level: 'advanced',
        levelLabel: '高級',
        description: '了解如何使用評估系統驗證技能品質，包含三個代理的協作流程。',
        content: `<h3>評估流程</h3>
<pre><code>1. 建立測試案例 (evals.json)
     ↓
2. 並行執行：有技能 vs 無技能（基線）
     ↓
3. 評分代理 (Grader) 驗證斷言
     ↓
4. 彙總為基準測試 (benchmark.json)
     ↓
5. 分析代理 (Analyzer) 發現模式
     ↓
6. 檢視器展示結果給使用者審查
     ↓
7. 使用者回饋 → 改進技能 → 重複</code></pre>
<h3>三個專門代理</h3>
<table>
<thead><tr><th>代理</th><th>角色</th><th>說明</th></tr></thead>
<tbody>
<tr><td><strong>Grader</strong></td><td>評分者</td><td>檢查每個斷言是否通過，提供證據</td></tr>
<tr><td><strong>Comparator</strong></td><td>比較者</td><td>盲測比較兩個輸出的優劣</td></tr>
<tr><td><strong>Analyzer</strong></td><td>分析者</td><td>分析結果模式，生成改進建議</td></tr>
</tbody>
</table>
<p>完整的評估工具包含在 <a href="https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/skill-creator" target="_blank">skill-creator 插件</a> 中。</p>`
    },
    {
        id: 'skill-trigger-optimization',
        title: '觸發描述優化',
        icon: '🎯',
        level: 'advanced',
        levelLabel: '高級',
        description: '學習如何優化技能描述以提高觸發準確度，避免 undertriggering 問題。',
        content: `<h3>描述優化流程</h3>
<ol>
<li>生成 20 個測試查詢（混合應觸發和不應觸發的）</li>
<li>將查詢分為訓練集和測試集（避免過擬合）</li>
<li>自動化循環測試不同的描述版本</li>
<li>選擇在保留測試集上表現最好的描述</li>
</ol>
<h3>好的描述範例</h3>
<pre><code>建立新技能、修改和改進現有技能、衡量技能效能。
當使用者想要建立技能、撰寫 skill、技能開發、技能測試、
或想要將工作流程轉換為可重複使用的技能時使用此技能。</code></pre>
<h3>不好的描述範例</h3>
<pre><code>一個用於建立技能的工具。</code></pre>
<h3>關鍵原則</h3>
<ul>
<li>描述要「積極」— Claude 傾向於觸發不足</li>
<li>聚焦使用者意圖而非實作細節</li>
<li>控制在 100-200 字（硬限制 1024 字元）</li>
<li>與其他技能的描述有所區別</li>
</ul>`
    }
];

// Render knowledge cards
function renderKnowledgeCards() {
    const grid = document.getElementById('knowledge-grid');
    if (!grid) return;

    grid.innerHTML = '';
    guidesData.forEach((guide, index) => {
        const card = document.createElement('div');
        card.className = 'knowledge-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.innerHTML = `
            <span class="knowledge-card-icon">${guide.icon}</span>
            <h3 class="knowledge-card-title">${guide.title}</h3>
            <p class="knowledge-card-description">${guide.description}</p>
            <span class="knowledge-card-level ${guide.level}">${guide.levelLabel}</span>
        `;
        card.addEventListener('click', () => openKnowledgeModal(guide));
        grid.appendChild(card);
    });
}

// Open knowledge detail modal
function openKnowledgeModal(guide) {
    const kModal = document.getElementById('knowledge-modal');
    if (!kModal) return;

    document.getElementById('knowledge-modal-icon').textContent = guide.icon;
    document.getElementById('knowledge-modal-title').textContent = guide.title;
    document.getElementById('knowledge-modal-meta').innerHTML = `
        <span class="knowledge-card-level ${guide.level}">${guide.levelLabel}</span>
    `;
    document.getElementById('knowledge-modal-content').innerHTML = guide.content;

    kModal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Close handlers
    const closeBtn = document.getElementById('knowledge-modal-close');
    const closeHandler = () => {
        kModal.classList.remove('show');
        document.body.style.overflow = '';
    };
    closeBtn.onclick = closeHandler;
    kModal.onclick = (e) => { if (e.target === kModal) closeHandler(); };
}

// Initialize knowledge section on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    renderKnowledgeCards();
});
