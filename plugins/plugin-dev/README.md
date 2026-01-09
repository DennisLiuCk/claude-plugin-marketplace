# 插件開發工具包

用於開發 Claude Code 插件的全面工具包，提供專業技能、代理和完整的工作流程命令。

## 概述

插件開發工具包提供七個專業技能來幫助您構建高品質的 Claude Code 插件：

1. **Hook Development** - 進階鉤子 API 和事件驅動自動化
2. **MCP Integration** - Model Context Protocol 伺服器整合
3. **Plugin Structure** - 插件組織和清單配置
4. **Plugin Settings** - 使用 .claude/plugin-name.local.md 檔案的配置模式
5. **Command Development** - 創建帶有 frontmatter 和參數的斜線命令
6. **Agent Development** - 使用 AI 輔助生成創建自主代理
7. **Skill Development** - 創建具有漸進式揭露和強觸發的技能

每個技能都遵循最佳實踐，包含漸進式揭露：精簡的核心文檔、詳細的參考資料、工作範例和工具腳本。

## 引導式工作流程命令

### /plugin-dev:create-plugin

用於從頭開始創建插件的全面、端對端工作流程命令。

**8 階段流程：**
1. **發現** - 理解插件目的和需求
2. **組件規劃** - 確定所需的技能、命令、代理、鉤子、MCP
3. **詳細設計** - 指定每個組件並解決模糊之處
4. **結構創建** - 設置目錄和清單
5. **組件實現** - 使用 AI 輔助代理創建每個組件
6. **驗證** - 運行 plugin-validator 和組件特定檢查
7. **測試** - 驗證插件在 Claude Code 中工作
8. **文檔** - 完成 README 並準備分發

**用法：**
```bash
/plugin-dev:create-plugin [可選描述]

# 範例：
/plugin-dev:create-plugin
/plugin-dev:create-plugin 管理資料庫遷移的插件
```

## 代理

### agent-creator

幫助創建新的 Claude Code 代理，使用經過驗證的模式自動化代理配置生成。

**觸發短語：**
- 「創建代理」
- 「生成代理」
- 「建立新代理」
- 「幫我做一個代理...」

### plugin-validator

全面驗證 Claude Code 插件結構、配置和組件。

**觸發短語：**
- 「驗證我的插件」
- 「檢查插件結構」
- 「驗證 plugin.json」

### skill-reviewer

審查和改進技能定義以確保最大效能和可靠性。

**觸發短語：**
- 「審查我的技能」
- 「檢查技能品質」
- 「改進技能描述」

## 技能

### 1. Hook Development

**觸發短語：**「創建鉤子」、「添加 PreToolUse 鉤子」、「驗證工具使用」、「實現基於提示的鉤子」

**涵蓋內容：**
- 基於提示的鉤子（推薦）
- 命令鉤子用於確定性驗證
- 所有鉤子事件
- 安全最佳實踐

### 2. MCP Integration

**觸發短語：**「添加 MCP 伺服器」、「整合 MCP」、「配置 .mcp.json」

**涵蓋內容：**
- MCP 伺服器配置
- 所有伺服器類型：stdio、SSE、HTTP、WebSocket
- 環境變數展開
- 驗證模式

### 3. Plugin Structure

**觸發短語：**「插件結構」、「plugin.json 清單」、「自動發現」

**涵蓋內容：**
- 標準插件目錄結構
- plugin.json 清單格式
- 組件組織
- ${CLAUDE_PLUGIN_ROOT} 用法

### 4. Plugin Settings

**觸發短語：**「插件設定」、「儲存插件配置」、「.local.md 檔案」

**涵蓋內容：**
- .claude/plugin-name.local.md 模式
- YAML frontmatter + markdown 內容結構
- bash 腳本的解析技術
- 原子檔案更新和驗證

### 5. Command Development

**觸發短語：**「創建斜線命令」、「添加命令」、「命令 frontmatter」

**涵蓋內容：**
- 斜線命令結構和 markdown 格式
- YAML frontmatter 欄位
- 動態參數和檔案引用
- 命令組織和命名空間

### 6. Agent Development

**觸發短語：**「創建代理」、「添加代理」、「編寫子代理」

**涵蓋內容：**
- 代理檔案結構
- 所有 frontmatter 欄位
- 帶有 <example> 區塊的描述格式
- 系統提示設計模式
- AI 輔助代理生成

### 7. Skill Development

**觸發短語：**「創建技能」、「添加技能到插件」、「編寫新技能」

**涵蓋內容：**
- 技能結構（帶有 YAML frontmatter 的 SKILL.md）
- 漸進式揭露原則
- 帶有具體短語的強觸發描述
- 捆綁資源組織

## 開發工作流程

插件開發工具包支援您的整個插件開發生命週期：

```
┌─────────────────────┐
│  設計結構           │  → plugin-structure 技能
│  (清單、佈局)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  添加組件           │
│  (命令、代理、      │  → 所有技能提供指導
│   技能、鉤子)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  整合服務           │  → mcp-integration 技能
│  (MCP 伺服器)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  添加自動化         │  → hook-development 技能
│  (鉤子、驗證)       │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  測試與驗證         │  → hook-development 工具
│                     │
└─────────────────────┘
```

## 插件結構

```
plugin-dev/
├── .claude-plugin/
│   └── plugin.json      # 插件元資料
├── commands/
│   └── create-plugin.md # 創建插件工作流程
├── agents/
│   ├── agent-creator.md    # 代理創建器
│   ├── plugin-validator.md # 插件驗證器
│   └── skill-reviewer.md   # 技能審查器
└── README.md            # 本文件
```

## 最佳實踐

所有技能強調：

**安全優先**
- 鉤子中的輸入驗證
- MCP 伺服器使用 HTTPS/WSS
- 憑證使用環境變數
- 最小權限原則

**可攜性**
- 到處使用 ${CLAUDE_PLUGIN_ROOT}
- 僅使用相對路徑
- 環境變數替換

**測試**
- 部署前驗證配置
- 使用範例輸入測試鉤子
- 使用偵錯模式（`claude --debug`）

**文檔**
- 清晰的 README 檔案
- 記錄的環境變數
- 用法範例

## 資源

- [Claude Code 插件文檔](https://docs.claude.com/en/docs/claude-code/plugins)
- [MCP 文檔](https://modelcontextprotocol.io)

## 作者

- **原作者**：Daisy Hollman (daisy@anthropic.com)
- **繁體中文版**：Claude Plugin Marketplace

## 版本

1.1.0

## 授權

MIT 授權 - 詳見儲存庫
