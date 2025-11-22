// Plugin data - Generated from marketplace.json
// This data structure includes all plugins with their metadata

const PLUGIN_ICONS = {
    'agent-sdk-dev': '🔧',
    'feature-dev': '🚀',
    'frontend-design': '🎨',
    'ralph-wiggum': '🔄',
    'plugin-dev': '📦',
    'pr-review-toolkit': '👀',
    'commit-commands': '💾',
    'code-review': '🔍',
    'hookify': '🪝',
    'security-guidance': '🔒',
    'explanatory-output-style': '💡',
    'learning-output-style': '📚',
    'issue-review': '🔬',
};

const CATEGORY_NAMES = {
    'development': '開發工具',
    'productivity': '生產力',
    'security': '安全',
    'learning': '學習',
};

const pluginsData = {
    marketplace: {
        name: "claude-plugin-marketplace-zh-tw",
        version: "1.1.0",
        description: "Claude Code 繁體中文插件市場 - 提供繁體中文版本的 Claude Code 插件，幫助華語使用者更容易學習和使用",
        owner: {
            name: "Dennis Liu",
            email: "dennis@example.com"
        }
    },
    plugins: [
        {
            name: "agent-sdk-dev",
            displayName: "Agent Sdk Dev",
            description: "Claude Agent SDK 開發工具包，用於建立和驗證 Python 和 TypeScript 應用程式",
            version: "1.0.0",
            author: {
                name: "Ashwin Bhat",
                chineseName: "繁體中文版",
                email: "ashwin@anthropic.com"
            },
            source: "plugins/agent-sdk-dev",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['agent-sdk-dev'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/agent-sdk-dev"
        },
        {
            name: "feature-dev",
            displayName: "Feature Dev",
            description: "提供七階段功能開發流程，配備專門的代理進行程式碼庫探索、架構設計和品質審查",
            version: "1.0.0",
            author: {
                name: "Siddharth Bidasaria",
                chineseName: "繁體中文版",
                email: "sbidasaria@anthropic.com"
            },
            source: "plugins/feature-dev",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['feature-dev'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/feature-dev"
        },
        {
            name: "frontend-design",
            displayName: "Frontend Design",
            description: "建立獨特的生產級前端介面，具備高設計品質。產生富有創意、精緻的程式碼，避免通用的 AI 美學",
            version: "1.0.0",
            author: {
                name: "Prithvi Rajasekaran & Alexander Bricken",
                chineseName: "繁體中文版",
                email: "prithvi@anthropic.com"
            },
            source: "plugins/frontend-design",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['frontend-design'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/frontend-design"
        },
        {
            name: "ralph-wiggum",
            displayName: "Ralph Wiggum",
            description: "互動式自我參照 AI 循環，用於迭代開發。Claude 反覆處理相同任務，觀察之前的工作，直到完成",
            version: "1.0.0",
            author: {
                name: "Daisy Hollman",
                chineseName: "繁體中文版",
                email: "daisy@anthropic.com"
            },
            source: "plugins/ralph-wiggum",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['ralph-wiggum'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/ralph-wiggum"
        },
        {
            name: "plugin-dev",
            displayName: "Plugin Dev",
            description: "開發 Claude Code 插件的綜合工具包。包含 7 個專家技能，涵蓋鉤子、MCP 整合、命令、代理和最佳實踐。AI 輔助的插件建立和驗證",
            version: "0.1.0",
            author: {
                name: "Daisy Hollman",
                chineseName: "繁體中文版",
                email: "daisy@anthropic.com"
            },
            source: "plugins/plugin-dev",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['plugin-dev'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/plugin-dev"
        },
        {
            name: "pr-review-toolkit",
            displayName: "Pr Review Toolkit",
            description: "綜合 PR 審查代理，專精於程式碼註解、測試、錯誤處理、類型設計、程式碼品質和程式碼簡化",
            version: "1.0.0",
            author: {
                name: "Daisy",
                chineseName: "繁體中文版",
                email: "daisy@anthropic.com"
            },
            source: "plugins/pr-review-toolkit",
            category: "productivity",
            sourceType: "official",
            icon: PLUGIN_ICONS['pr-review-toolkit'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/pr-review-toolkit"
        },
        {
            name: "commit-commands",
            displayName: "Commit Commands",
            description: "使用簡單命令簡化 Git 工作流程，包括提交、推送和建立 Pull Request",
            version: "1.0.0",
            author: {
                name: "Anthropic",
                chineseName: "繁體中文版",
                email: "support@anthropic.com"
            },
            source: "plugins/commit-commands",
            category: "productivity",
            sourceType: "official",
            icon: PLUGIN_ICONS['commit-commands'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/commit-commands"
        },
        {
            name: "code-review",
            displayName: "Code Review",
            description: "使用多個專門代理進行自動化程式碼審查，配備基於置信度的評分系統以過濾誤報",
            version: "1.0.0",
            author: {
                name: "Boris Cherny",
                chineseName: "繁體中文版",
                email: "boris@anthropic.com"
            },
            source: "plugins/code-review",
            category: "productivity",
            sourceType: "official",
            icon: PLUGIN_ICONS['code-review'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/code-review"
        },
        {
            name: "hookify",
            displayName: "Hookify",
            description: "透過分析對話模式或明確指令，輕鬆建立自訂鉤子以防止不想要的行為。透過簡單的 markdown 檔案定義規則",
            version: "0.1.0",
            author: {
                name: "Daisy Hollman",
                chineseName: "繁體中文版",
                email: "daisy@anthropic.com"
            },
            source: "plugins/hookify",
            category: "productivity",
            sourceType: "official",
            icon: PLUGIN_ICONS['hookify'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/hookify"
        },
        {
            name: "security-guidance",
            displayName: "Security Guidance",
            description: "安全提醒鉤子，在編輯檔案時警告潛在的安全問題，包括命令注入、XSS 和不安全的程式碼模式",
            version: "1.0.0",
            author: {
                name: "David Dworken",
                chineseName: "繁體中文版",
                email: "dworken@anthropic.com"
            },
            source: "plugins/security-guidance",
            category: "security",
            sourceType: "official",
            icon: PLUGIN_ICONS['security-guidance'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/security-guidance"
        },
        {
            name: "explanatory-output-style",
            displayName: "Explanatory Output Style",
            description: "添加關於實作選擇和程式碼庫模式的教育性見解（模仿已棄用的解釋性輸出風格）",
            version: "1.0.0",
            author: {
                name: "Dickson Tsai",
                chineseName: "繁體中文版",
                email: "dickson@anthropic.com"
            },
            source: "plugins/explanatory-output-style",
            category: "learning",
            sourceType: "official",
            icon: PLUGIN_ICONS['explanatory-output-style'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/explanatory-output-style"
        },
        {
            name: "learning-output-style",
            displayName: "Learning Output Style",
            description: "互動式學習模式，在決策點請求有意義的程式碼貢獻（模仿未發布的學習輸出風格）",
            version: "1.0.0",
            author: {
                name: "Boris Cherny",
                chineseName: "繁體中文版",
                email: "boris@anthropic.com"
            },
            source: "plugins/learning-output-style",
            category: "learning",
            sourceType: "official",
            icon: PLUGIN_ICONS['learning-output-style'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/learning-output-style"
        },
        {
            name: "issue-review",
            displayName: "Issue Review",
            description: "專業的問題分析專家系統，能夠深入分析各類問題、調查程式碼庫、定位根本原因並提供解決方案",
            version: "1.0.0",
            author: {
                name: "Dennis Liu",
                chineseName: "繁體中文版",
                email: "dennisliuck@gmail.com"
            },
            source: "plugins/issue-review",
            category: "productivity",
            sourceType: "community",
            icon: PLUGIN_ICONS['issue-review'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/issue-review"
        }
    ]
};

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.pluginsData = pluginsData;
    window.PLUGIN_ICONS = PLUGIN_ICONS;
    window.CATEGORY_NAMES = CATEGORY_NAMES;
}
