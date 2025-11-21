# Claude Code 繁體中文插件市場

> 為繁體中文使用者打造的 Claude Code 插件集合,提供開發、生產力、安全與學習工具

## 📖 專案簡介

本專案基於 Anthropic 官方的 [claude-code](https://github.com/anthropics/claude-code) 儲存庫,將優質的 Claude Code 插件翻譯為繁體中文版本,降低華語開發者的使用門檻。

**為什麼需要這個專案?**
- **語言友善**: 完整的繁體中文介面與說明文件
- **品質保證**: 以 Anthropic 官方插件為基礎進行翻譯
- **立即可用**: 12 個精選插件,涵蓋開發全流程
- **持續更新**: 跟隨官方版本同步更新

## 🚀 快速開始

### 方式一：使用 CLI 安裝 (推薦)

```bash
# 安裝單一插件
claude plugin install github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands

# 安裝多個插件
claude plugin install \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/security-guidance \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/feature-dev
```

### 方式二：手動安裝

```bash
# 1. 複製儲存庫
git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git

# 2. 複製插件到專案或全域目錄
# 專案級別
cp -r claude-plugin-marketplace/plugins/[插件名稱] ./.claude/plugins/

# 全域級別 (所有專案可用)
cp -r claude-plugin-marketplace/plugins/[插件名稱] ~/.claude/plugins/
```

## 📦 插件總覽

本專案提供 **12 個插件**,分為 4 大類別:

### 🛠️ 開發工具 (5 個)

| 插件名稱 | 說明 | 主要命令 |
|---------|------|---------|
| **agent-sdk-dev** | Agent SDK 開發工具,支援 Python 與 TypeScript | `/new-sdk-app` |
| **feature-dev** | 七階段功能開發流程,配備專業代理程式 | `/feature-dev` |
| **frontend-design** | 高品質前端介面設計指引,避免通用 AI 風格 | 自動啟用 |
| **ralph-wiggum** | 互動式迭代開發循環,自動重複執行直到完成 | `/ralph-loop`, `/cancel-ralph` |
| **plugin-dev** | 完整的插件開發工具包,含 7 個專家技能 | `/create-plugin` |

### 📈 生產力工具 (4 個)

| 插件名稱 | 說明 | 主要命令 |
|---------|------|---------|
| **pr-review-toolkit** | 完整的 PR 審查工具,含 6 種專業代理程式 | 自動啟用 |
| **commit-commands** | 簡化 Git 工作流程的快速命令 | `/commit`, `/commit-push-pr`, `/clean_gone` |
| **code-review** | 自動化程式碼審查,智慧過濾誤報 | `/code-review` |
| **hookify** | 自訂行為規則系統,防止不當操作 | `/hookify`, `/list`, `/configure` |

### 🔒 安全工具 (1 個)

| 插件名稱 | 說明 | 主要功能 |
|---------|------|---------|
| **security-guidance** | 編輯檔案時自動檢測 6 種常見安全漏洞 | 自動檢測與警告 |

### 📚 學習工具 (2 個)

| 插件名稱 | 說明 | 主要功能 |
|---------|------|---------|
| **explanatory-output-style** | 在程式碼中加入教育性見解與說明 | 自動添加註解 |
| **learning-output-style** | 互動式學習模式,引導有意義的程式碼貢獻 | 互動式學習 |

## 💡 使用範例

安裝插件後,即可在 Claude Code 中使用以下命令:

```bash
# 開發相關
/new-sdk-app my-project          # 建立 Agent SDK 專案
/feature-dev                     # 啟動功能開發流程
/create-plugin                   # 建立新插件
/ralph-loop "優化效能" --max-iterations 5

# Git 工作流程
/commit                          # 智慧提交
/commit-push-pr                  # 提交、推送並建立 PR
/clean_gone                      # 清理已刪除的遠端分支

# 程式碼審查
/code-review                     # 執行完整審查

# Hookify 規則管理
/hookify                         # 建立新規則
/list                           # 列出所有規則
/configure                      # 設定規則
```

詳細使用說明請參考各插件目錄下的 `README.md` 檔案。

## 📂 儲存庫結構

```
claude-plugin-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # 市場配置
├── plugins/                       # 插件目錄
│   ├── agent-sdk-dev/            # Agent SDK 開發
│   ├── code-review/              # 程式碼審查
│   ├── commit-commands/          # Git 命令
│   ├── explanatory-output-style/ # 解釋性輸出
│   ├── feature-dev/              # 功能開發
│   ├── frontend-design/          # 前端設計
│   ├── hookify/                  # 規則系統
│   ├── learning-output-style/    # 學習模式
│   ├── plugin-dev/               # 插件開發
│   ├── pr-review-toolkit/        # PR 審查
│   ├── ralph-wiggum/             # 迭代開發
│   └── security-guidance/        # 安全檢測
├── README.md                      # 本檔案
└── CLAUDE.md                      # AI 助手指南
```

## 🤝 參與貢獻

歡迎提交 Issue 與 Pull Request!

### 貢獻流程

1. Fork 本儲存庫
2. 建立功能分支 (`git checkout -b feature/your-feature`)
3. 提交變更 (`git commit -m '新增功能說明'`)
4. 推送分支 (`git push origin feature/your-feature`)
5. 開啟 Pull Request

### 翻譯原則

- ✅ 使用自然流暢的繁體中文
- ✅ 保持技術術語的精確性
- ✅ 保留程式碼、URL、檔案路徑不翻譯
- ✅ 維持原始的 Markdown 格式
- ❌ 避免使用表情符號 (除非原文有)
- ❌ 避免過度直譯造成不自然的用詞

## 📚 相關資源

- [Claude Code 官方文件](https://docs.claude.com/en/docs/claude-code)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Claude Agent SDK 文件](https://docs.claude.com/en/api/agent-sdk/overview)
- [Anthropic 官網](https://www.anthropic.com)

## 🆘 支援與協助

遇到問題時的處理步驟:

1. 📖 查閱插件的 README.md 詳細說明
2. 🔍 搜尋 GitHub Issues 是否有類似問題
3. 💬 建立新 Issue 描述您的問題
4. 📚 參考官方 Claude Code 文件

## 📝 更新日誌

### v1.0.0 (2025-11-21)
- 🎉 首次發布
- ✨ 新增 12 個官方插件的繁體中文版本
- 📖 提供完整文件與使用說明

## 🙏 致謝

感謝 Anthropic 團隊開發優秀的 Claude Code 工具與插件系統,以及所有原始插件作者的貢獻。

## ⚖️ 授權說明

本專案遵循原始 [anthropics/claude-code](https://github.com/anthropics/claude-code) 儲存庫的授權條款。

---

**重要聲明**: 本專案為社群維護的繁體中文翻譯版本,並非 Anthropic 官方專案。如需官方支援,請參考 [Anthropic 官方儲存庫](https://github.com/anthropics/claude-code)。
