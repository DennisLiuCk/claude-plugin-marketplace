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
    'legacy-analyzer': '🎯',
    'claude-opus-4-5-migration': '🔀',
    'sql-to-osc': '🗃️',
    'community-code-review': '🔎',
    'code-simplifier': '✨',
    'ralph-loop': '♾️',
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
        version: "1.5.0",
        description: "Claude Code 繁體中文插件市場 - 提供繁體中文版本的 Claude Code 插件，幫助華語使用者更容易學習和使用",
        owner: {
            name: "Dennis Liu",
            email: "nossi1970@hotmail.com"
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
                email: "ashwin@anthropic.com"
            },
            source: "./plugins/agent-sdk-dev",
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
                email: "sbidasaria@anthropic.com"
            },
            source: "./plugins/feature-dev",
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
                email: "prithvi@anthropic.com"
            },
            source: "./plugins/frontend-design",
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
                email: "daisy@anthropic.com"
            },
            source: "./plugins/ralph-wiggum",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['ralph-wiggum'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/ralph-wiggum"
        },
        {
            name: "plugin-dev",
            displayName: "Plugin Dev",
            description: "Claude Code 插件開發工具包，提供七個專業技能、三個代理和完整的工作流程命令，用於構建高品質插件",
            version: "1.1.0",
            author: {
                name: "Daisy Hollman",
                email: "daisy@anthropic.com"
            },
            source: "./plugins/plugin-dev",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['plugin-dev'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/plugin-dev"
        },
        {
            name: "ralph-loop",
            displayName: "Ralph Loop",
            description: "連續自引用 AI 循環，用於互動式迭代開發。實現 Ralph Wiggum 技術，讓 Claude 在 while-true 循環中執行相同提示直到任務完成",
            version: "1.0.0",
            author: {
                name: "Anthropic",
                email: "support@anthropic.com"
            },
            source: "./plugins/ralph-loop",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['ralph-loop'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/ralph-loop"
        },
        {
            name: "pr-review-toolkit",
            displayName: "Pr Review Toolkit",
            description: "綜合 PR 審查代理，專精於程式碼註解、測試、錯誤處理、類型設計、程式碼品質和程式碼簡化",
            version: "1.0.0",
            author: {
                name: "Daisy",
                email: "daisy@anthropic.com"
            },
            source: "./plugins/pr-review-toolkit",
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
                email: "support@anthropic.com"
            },
            source: "./plugins/commit-commands",
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
                email: "boris@anthropic.com"
            },
            source: "./plugins/code-review",
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
                email: "daisy@anthropic.com"
            },
            source: "./plugins/hookify",
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
                email: "dworken@anthropic.com"
            },
            source: "./plugins/security-guidance",
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
                email: "dickson@anthropic.com"
            },
            source: "./plugins/explanatory-output-style",
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
                email: "boris@anthropic.com"
            },
            source: "./plugins/learning-output-style",
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
                email: "nossi1970@hotmail.com"
            },
            source: "./plugins/issue-review",
            category: "productivity",
            sourceType: "community",
            icon: PLUGIN_ICONS['issue-review'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/issue-review"
        },
        {
            name: "legacy-analyzer",
            displayName: "Legacy Analyzer",
            description: "使用多個專門代理配合基於置信度的評分系統，分析 Legacy Java Spring Boot 專案並產生高品質教學文件",
            version: "1.4.0",
            author: {
                name: "Dennis Liu",
                email: "nossi1970@hotmail.com"
            },
            source: "./plugins/legacy-analyzer",
            category: "development",
            sourceType: "community",
            icon: PLUGIN_ICONS['legacy-analyzer'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/legacy-analyzer"
        },
        {
            name: "claude-opus-4-5-migration",
            displayName: "Claude Opus 4 5 Migration",
            description: "將程式碼和提示詞從 Sonnet 4.x 和 Opus 4.1 遷移至 Opus 4.5，處理模型字串更新和行為差異調整",
            version: "1.0.0",
            author: {
                name: "William Hu",
                email: "whu@anthropic.com"
            },
            source: "./plugins/claude-opus-4-5-migration",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['claude-opus-4-5-migration'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/claude-opus-4-5-migration"
        },
        {
            name: "sql-to-osc",
            displayName: "Sql To Osc",
            description: "將 Flyway SQL 遷移腳本轉換為 OSC (Online Schema Change) 格式，支援 ALTER TABLE 和 CREATE INDEX 語句的自動轉換",
            version: "1.0.0",
            author: {
                name: "Dennis Liu",
                email: "nossi1970@hotmail.com"
            },
            source: "./plugins/sql-to-osc",
            category: "productivity",
            sourceType: "community",
            icon: PLUGIN_ICONS['sql-to-osc'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/sql-to-osc"
        },
        {
            name: "community-code-review",
            displayName: "Community Code Review",
            description: "社群版本的 Git 提交程式碼審查工具，使用多個專門代理進行自動化審查，配備驗證機制以過濾誤報",
            version: "1.0.0",
            author: {
                name: "Dennis Liu",
                email: "nossi1970@hotmail.com"
            },
            source: "./plugins/community-code-review",
            category: "productivity",
            sourceType: "community",
            icon: PLUGIN_ICONS['community-code-review'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/community-code-review"
        },
        {
            name: "code-simplifier",
            displayName: "Code Simplifier",
            description: "簡化和優化程式碼以提升清晰度、一致性和可維護性，同時保持原有功能不變",
            version: "1.0.0",
            author: {
                name: "Anthropic",
                email: "support@anthropic.com"
            },
            source: "./plugins/code-simplifier",
            category: "development",
            sourceType: "official",
            icon: PLUGIN_ICONS['code-simplifier'],
            githubUrl: "https://github.com/DennisLiuCk/claude-plugin-marketplace/tree/main/plugins/code-simplifier"
        }
    ]
};

// Export for use in main.js
if (typeof window !== 'undefined') {
    window.pluginsData = pluginsData;
    window.PLUGIN_ICONS = PLUGIN_ICONS;
    window.CATEGORY_NAMES = CATEGORY_NAMES;
}
