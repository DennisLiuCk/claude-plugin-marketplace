# Claude Code 繁體中文插件市場

歡迎來到 Claude Code 繁體中文插件市場！這個儲存庫提供了專為繁體中文使用者設計的 Claude Code 插件集合，幫助您更輕鬆地學習和使用 Claude Code 的各種功能。

## 關於此專案

此專案基於 Anthropic 官方的 [claude-code](https://github.com/anthropics/claude-code) 儲存庫，將其中的金標準插件翻譯成繁體中文版本，包括：

- 命令提示詞
- 代理指令
- 鉤子腳本
- 技能說明

## 專案目標

1. **降低學習門檻**：提供繁體中文介面，讓華語使用者更容易理解和使用 Claude Code 插件
2. **保持品質標準**：複製官方儲存庫的金標準，確保插件品質
3. **促進本地化**：針對繁體中文使用者的需求進行適當調整
4. **完整涵蓋**：提供所有官方插件的繁體中文版本

## 可用插件

### 開發工具 (Development)

#### agent-sdk-dev
Claude Agent SDK 開發工具包，用於建立和驗證 Python 和 TypeScript 應用程式

**功能：**
- `/new-sdk-app` - 互動式建立新的 Agent SDK 應用程式
- 自動驗證 Python 和 TypeScript SDK 設置
- 支援最新 SDK 版本檢查和安裝

#### feature-dev
提供七階段功能開發流程，配備專門的代理進行程式碼庫探索、架構設計和品質審查

**功能：**
- `/feature-dev` - 啟動結構化的功能開發工作流程
- 程式碼探索代理、架構設計代理、程式碼審查代理
- 系統化的開發方法論

#### frontend-design
建立獨特的生產級前端介面，具備高設計品質。產生富有創意、精緻的程式碼，避免通用的 AI 美學

**功能：**
- 獨特的設計美學指導
- 避免通用 AI 風格
- 高品質前端實作建議

#### ralph-wiggum
互動式自我參照 AI 循環，用於迭代開發。Claude 反覆處理相同任務，觀察之前的工作，直到完成

**功能：**
- `/ralph-loop` - 啟動迭代開發循環
- `/cancel-ralph` - 取消活動中的循環
- 自動迭代直到任務完成

#### plugin-dev
開發 Claude Code 插件的綜合工具包。包含 7 個專家技能，涵蓋鉤子、MCP 整合、命令、代理和最佳實踐

**功能：**
- `/create-plugin` - 八階段插件建立工作流程
- 7 個專家技能涵蓋所有插件開發面向
- AI 輔助的插件建立和驗證

### 生產力工具 (Productivity)

#### pr-review-toolkit
綜合 PR 審查代理，專精於程式碼註解、測試、錯誤處理、類型設計、程式碼品質和程式碼簡化

**功能：**
- 6 個專門的審查代理
- 註解分析、測試分析、錯誤處理檢查
- 類型設計評估、程式碼品質和簡化建議

#### commit-commands
使用簡單命令簡化 Git 工作流程，包括提交、推送和建立 Pull Request

**功能：**
- `/commit` - 建立 Git 提交
- `/commit-push-pr` - 提交、推送並建立 Pull Request
- `/clean_gone` - 清理已刪除的分支

#### code-review
使用多個專門代理進行自動化程式碼審查，配備基於置信度的評分系統以過濾誤報

**功能：**
- `/code-review` - 執行全面的 PR 審查
- 多代理並行審查
- 80+ 置信度閾值過濾誤報

#### hookify
透過分析對話模式或明確指令，輕鬆建立自訂鉤子以防止不想要的行為。透過簡單的 markdown 檔案定義規則

**功能：**
- `/hookify` - 建立新的行為規則
- `/list` - 列出所有配置的規則
- `/configure` - 啟用/停用規則
- 支援警告和阻止操作

### 安全工具 (Security)

#### security-guidance
安全提醒鉤子，在編輯檔案時警告潛在的安全問題，包括命令注入、XSS 和不安全的程式碼模式

**功能：**
- 自動檢測 6 種常見安全漏洞
- 編輯檔案前的即時警告
- 無需配置即可使用

### 學習工具 (Learning)

#### explanatory-output-style
添加關於實作選擇和程式碼庫模式的教育性見解（模仿已棄用的解釋性輸出風格）

**功能：**
- 自動添加教育性見解
- 解釋實作選擇和設計決策
- 程式碼庫特定的學習內容

#### learning-output-style
互動式學習模式，在決策點請求有意義的程式碼貢獻（模仿未發布的學習輸出風格）

**功能：**
- 識別 5-10 行的有意義程式碼貢獻機會
- 解釋權衡和設計選擇
- 協作式學習體驗

## 安裝方式

### 使用 Claude Code CLI 安裝（推薦）

如果您使用的是支援插件安裝的 Claude Code 版本，可以直接從此儲存庫安裝：

```bash
# 安裝單個插件
claude plugin install github:DennisLiuCk/claude-plugin-marketplace/plugins/agent-sdk-dev

# 安裝多個插件
claude plugin install \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/security-guidance \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/feature-dev
```

### 手動安裝

1. 複製此儲存庫：
```bash
git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git
```

2. 將插件目錄複製到您的專案或全域 Claude 配置：
```bash
# 複製到專案
cp -r claude-plugin-marketplace/plugins/commit-commands ./.claude/plugins/

# 或複製到全域配置（所有專案可用）
cp -r claude-plugin-marketplace/plugins/commit-commands ~/.claude/plugins/
```

## 使用說明

安裝插件後，您可以在 Claude Code 中使用相應的斜線命令和功能。以下是一些常用命令：

### 開發命令
- `/new-sdk-app [專案名稱]` - 建立新的 Agent SDK 應用程式
- `/feature-dev` - 啟動功能開發工作流程
- `/ralph-loop "<提示>" --max-iterations <數字>` - 啟動迭代開發循環
- `/create-plugin` - 建立新的 Claude Code 插件

### 生產力命令
- `/commit` - 建立 Git 提交
- `/commit-push-pr` - 完整的提交、推送和 PR 工作流程
- `/code-review` - 審查當前 Pull Request
- `/hookify` - 建立自訂行為規則
- `/list` - 列出 hookify 規則
- `/configure` - 配置 hookify 規則

更多命令和詳細說明，請參考各插件的 README 檔案。

## 儲存庫結構

```
claude-plugin-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # 市場配置檔案
├── plugins/                       # 插件目錄
│   ├── agent-sdk-dev/            # Agent SDK 開發工具
│   ├── code-review/              # 程式碼審查
│   ├── commit-commands/          # Git 工作流程命令
│   ├── explanatory-output-style/ # 解釋性輸出風格
│   ├── feature-dev/              # 功能開發工作流程
│   ├── frontend-design/          # 前端設計
│   ├── hookify/                  # 自訂鉤子系統
│   ├── learning-output-style/    # 學習輸出風格
│   ├── plugin-dev/               # 插件開發工具包
│   ├── pr-review-toolkit/        # PR 審查工具包
│   ├── ralph-wiggum/             # 迭代開發循環
│   └── security-guidance/        # 安全提醒
└── README.md                      # 本檔案
```

## 插件統計

- **總插件數**：12 個
- **開發工具**：5 個
- **生產力工具**：4 個
- **安全工具**：1 個
- **學習工具**：2 個

## 貢獻指南

歡迎提交 Issue 和 Pull Request！如果您發現翻譯錯誤或有改進建議，請隨時提出。

### 貢獻步驟

1. Fork 此儲存庫
2. 建立您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的變更 (`git commit -m '新增某個很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟一個 Pull Request

### 翻譯指南

- 保持技術術語的準確性
- 使用自然的繁體中文表達
- 保留所有程式碼、URL 和檔案路徑
- 不使用表情符號
- 維持原始的 markdown 格式和結構

## 授權

本專案基於原始 [anthropics/claude-code](https://github.com/anthropics/claude-code) 儲存庫的授權條款。

## 相關資源

- [Claude Code 官方文件](https://docs.claude.com/en/docs/claude-code)
- [Claude Code GitHub 儲存庫](https://github.com/anthropics/claude-code)
- [Anthropic 官方網站](https://www.anthropic.com)
- [Claude Agent SDK 文件](https://docs.claude.com/en/api/agent-sdk/overview)

## 支援

如果您遇到問題或需要協助：

1. 查看各插件的 README 檔案以獲取詳細說明
2. 在 GitHub Issues 中搜尋類似問題
3. 建立新的 Issue 詳細描述您的問題
4. 參考官方 Claude Code 文件

## 更新日誌

### v1.0.0 (2025-11-21)
- 初始發布
- 新增所有 12 個官方插件的繁體中文版本
- 包含完整的文件和使用說明

## 致謝

感謝 Anthropic 團隊開發了優秀的 Claude Code 工具和插件系統，以及所有原始插件的作者們。

---

**注意**：此專案為社群維護的繁體中文版本，非 Anthropic 官方專案。如需官方支援，請參考 [Anthropic 官方儲存庫](https://github.com/anthropics/claude-code)。
