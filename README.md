# Claude Code 繁體中文插件市場

專為繁體中文使用者設計的 Claude Code 插件集合，提供開發、生產力、安全與學習等工具。

## 專案說明

本專案基於 Anthropic 官方的 [claude-code](https://github.com/anthropics/claude-code) 儲存庫，將官方插件翻譯為繁體中文版本。專案目標是降低繁體中文開發者的學習成本，提供完整的中文介面與技術文件。

**專案特點**
- 完整繁體中文介面與說明文件
- 基於 Anthropic 官方插件翻譯而成
- 涵蓋 20 個精選插件，支援完整開發流程
- 持續更新，跟隨官方版本同步

## 安裝方式

### 使用 CLI 安裝（推薦）

```bash
# 安裝單一插件
claude plugin install github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands

# 安裝多個插件
claude plugin install \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/security-guidance \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/feature-dev
```

### 手動安裝

```bash
# 複製儲存庫
git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git

# 複製至專案目錄
cp -r claude-plugin-marketplace/plugins/[插件名稱] ./.claude/plugins/

# 或複製至全域目錄（所有專案可用）
cp -r claude-plugin-marketplace/plugins/[插件名稱] ~/.claude/plugins/
```

## 插件列表

本專案提供 20 個插件，分為四大類別：

### 開發工具（10 個）

| 插件名稱 | 說明 | 主要命令 |
|---------|------|---------|
| agent-sdk-dev | Agent SDK 開發工具，支援 Python 與 TypeScript | `/new-sdk-app` |
| feature-dev | 七階段功能開發流程，包含程式碼探索、架構設計與審查代理程式 | `/feature-dev` |
| frontend-design | 前端介面設計指引，提供專業的設計建議 | 自動啟用 |
| ralph-wiggum | 互動式迭代開發循環，自動重複執行直到完成任務 | `/ralph-loop`, `/cancel-ralph` |
| ralph-loop | 連續自引用 AI 循環，實現 Ralph Wiggum 技術 | `/ralph`, `/ralph-stop` |
| plugin-dev | 插件開發工具包，包含 7 個專業技能模組 | `/create-plugin` |
| legacy-analyzer | 遺留專案分析工具，使用多代理置信度評分分析 Java Spring Boot 專案 | `/analyze-java-domain` |
| claude-opus-4-5-migration | 將程式碼和提示詞從 Sonnet/Opus 4.x 遷移至 Opus 4.5 | `/migrate-to-opus-4-5` |
| code-simplifier | 簡化和優化程式碼以提升清晰度與可維護性 | 自動啟用 |
| java-code-simplifier | Java/Spring Boot 程式碼簡化專家，運用企業級最佳實踐 | `/simplify-java` |

### 生產力工具（7 個）

| 插件名稱 | 說明 | 主要命令 |
|---------|------|---------|
| pr-review-toolkit | Pull Request 審查工具，包含 6 種專業審查代理程式 | 自動啟用 |
| commit-commands | Git 工作流程簡化命令 | `/commit`, `/commit-push-pr`, `/clean_gone` |
| code-review | 自動化程式碼審查，具備智慧過濾機制 | `/code-review` |
| hookify | 自訂規則系統，可防止特定操作執行 | `/hookify`, `/list`, `/configure` |
| issue-review | 專業的問題分析專家系統，深入分析問題並定位根本原因 | `/skill issue-review` |
| sql-to-osc | 將 Flyway SQL 遷移腳本轉換為 OSC 格式 | `/sql-to-osc` |
| community-code-review | 社群版 Git 提交程式碼審查工具，配備驗證機制 | `/community-code-review` |

### 安全工具（1 個）

| 插件名稱 | 說明 | 主要功能 |
|---------|------|---------|
| security-guidance | 自動檢測常見安全漏洞，在編輯檔案時提供警告 | 自動檢測與警告 |

### 學習工具（2 個）

| 插件名稱 | 說明 | 主要功能 |
|---------|------|---------|
| explanatory-output-style | 在程式碼實作中加入教學性說明 | 自動添加說明 |
| learning-output-style | 互動式學習模式，引導使用者參與程式碼實作 | 互動式學習 |

## 使用說明

安裝插件後，可在 Claude Code 中執行以下命令：

```bash
# 開發相關
/new-sdk-app my-project          # 建立 Agent SDK 專案
/feature-dev                     # 啟動功能開發流程
/create-plugin                   # 建立插件
/ralph-loop "優化效能" --max-iterations 5

# Git 工作流程
/commit                          # 建立提交
/commit-push-pr                  # 提交、推送並建立 Pull Request
/clean_gone                      # 清理已刪除的遠端分支

# 程式碼審查
/code-review                     # 執行程式碼審查

# 規則管理
/hookify                         # 建立規則
/list                           # 列出規則
/configure                      # 設定規則
```

詳細使用方式請參考各插件目錄下的 README.md 檔案。

## 目錄結構

```
claude-plugin-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # 市場配置檔案
├── plugins/                       # 插件目錄
│   ├── agent-sdk-dev/            # Agent SDK 開發
│   ├── claude-opus-4-5-migration/ # Opus 4.5 遷移工具
│   ├── code-review/              # 程式碼審查
│   ├── code-simplifier/          # 程式碼簡化
│   ├── commit-commands/          # Git 命令
│   ├── community-code-review/    # 社群版程式碼審查
│   ├── explanatory-output-style/ # 解釋性輸出
│   ├── feature-dev/              # 功能開發
│   ├── frontend-design/          # 前端設計
│   ├── hookify/                  # 規則系統
│   ├── issue-review/             # 問題分析（社群插件）
│   ├── java-code-simplifier/     # Java 程式碼簡化
│   ├── learning-output-style/    # 學習模式
│   ├── legacy-analyzer/          # 遺留專案分析（社群插件）
│   ├── plugin-dev/               # 插件開發
│   ├── pr-review-toolkit/        # PR 審查
│   ├── ralph-loop/               # Ralph Loop 迭代開發
│   ├── ralph-wiggum/             # Ralph Wiggum 迭代開發
│   ├── security-guidance/        # 安全檢測
│   └── sql-to-osc/               # SQL 轉 OSC
├── README.md                      # 本檔案
└── CLAUDE.md                      # AI 助手指南
```

## 貢獻方式

歡迎提交 Issue 與 Pull Request。

### 貢獻流程

1. Fork 本儲存庫
2. 建立功能分支：`git checkout -b feature/your-feature`
3. 提交變更：`git commit -m '功能說明'`
4. 推送分支：`git push origin feature/your-feature`
5. 建立 Pull Request

### 翻譯規範

- 使用自然流暢的繁體中文
- 保持技術術語精確性
- 保留程式碼、URL、檔案路徑不翻譯
- 維持原始 Markdown 格式
- 避免使用表情符號
- 避免過度直譯

## 技術資源

- [Claude Code 官方文件](https://docs.claude.com/en/docs/claude-code)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Claude Agent SDK 文件](https://docs.claude.com/en/api/agent-sdk/overview)
- [Anthropic 官方網站](https://www.anthropic.com)

## 問題回報

遇到問題時建議依序執行以下步驟：

1. 查閱插件目錄下的 README.md 說明文件
2. 搜尋 GitHub Issues 確認是否有相同問題
3. 建立新 Issue 並詳細描述問題
4. 參考官方 Claude Code 文件

## 更新紀錄

### v1.6.0（2026-01-11）
- 新增 claude-opus-4-5-migration 插件：支援從 Sonnet/Opus 4.x 遷移至 Opus 4.5
- 新增 code-simplifier 插件：簡化和優化程式碼
- 新增 java-code-simplifier 插件：Java/Spring Boot 程式碼簡化專家
- 新增 sql-to-osc 插件：將 Flyway SQL 遷移轉換為 OSC 格式
- 新增 community-code-review 插件：社群版 Git 提交程式碼審查
- 新增 ralph-loop 插件：連續自引用 AI 循環
- 更新文件以反映 20 個插件

### v1.5.0（2025-11-25）
- 移除已棄用插件：legacy-hero-java、legacy-hero-java-v2
- 上述插件已由 legacy-analyzer 取代
- 更新文件以反映 14 個插件

### v1.1.0（2025-11-22）
- 新增 Issue Review 插件（社群插件）
- 修正所有文件中的年份錯誤（2024 → 2025）
- 改進插件來源類型判斷機制（基於作者 email）
- 更新文件以反映 13 個插件

### v1.0.0（2025-11-21）
- 首次發布
- 提供 12 個官方插件的繁體中文版本
- 包含完整文件與使用說明

## 致謝

感謝 Anthropic 團隊開發 Claude Code 工具與插件系統，以及所有原始插件作者的貢獻。

## 授權資訊

本專案遵循原始 [anthropics/claude-code](https://github.com/anthropics/claude-code) 儲存庫的授權條款。

---

本專案為社群維護的繁體中文翻譯版本，非 Anthropic 官方專案。如需官方支援，請參考 [Anthropic 官方儲存庫](https://github.com/anthropics/claude-code)。
