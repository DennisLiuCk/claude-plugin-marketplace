# Agent SDK 開發插件

一個全面的插件，用於創建和驗證 Python 和 TypeScript 的 Claude Agent SDK 應用程式。

## 概述

Agent SDK 開發插件簡化了構建 Agent SDK 應用程式的整個生命週期，從初始腳手架到根據最佳實踐進行驗證。它幫助您快速使用最新的 SDK 版本啟動新項目，並確保您的應用程式遵循官方文檔模式。

## 功能特性

### 命令：`/new-sdk-app`

互動式命令，引導您創建新的 Claude Agent SDK 應用程式。

**功能：**
- 詢問有關您項目的澄清問題（語言、名稱、代理類型、起點）
- 檢查並安裝最新的 SDK 版本
- 創建所有必要的項目文件和配置
- 設置適當的環境文件（.env.example、.gitignore）
- 提供針對您用例量身定制的工作示例
- 運行類型檢查（TypeScript）或語法驗證（Python）
- 使用適當的驗證器代理自動驗證設置

**用法：**
```bash
/new-sdk-app my-project-name
```

或簡單地：
```bash
/new-sdk-app
```

該命令將互動式地詢問您：
1. 語言選擇（TypeScript 或 Python）
2. 項目名稱（如果未提供）
3. 代理類型（編碼、業務、自定義）
4. 起點（最小、基本或特定示例）
5. 工具偏好（npm/yarn/pnpm 或 pip/poetry）

**示例：**
```bash
/new-sdk-app customer-support-agent
# → 為客戶支持代理創建新的 Agent SDK 項目
# → 設置 TypeScript 或 Python 環境
# → 安裝最新的 SDK 版本
# → 自動驗證設置
```

### 代理：`agent-sdk-verifier-py`

徹底驗證 Python Agent SDK 應用程式的正確設置和最佳實踐。

**驗證檢查：**
- SDK 安裝和版本
- Python 環境設置（requirements.txt、pyproject.toml）
- 正確的 SDK 使用和模式
- 代理初始化和配置
- 環境和安全性（.env、API 密鑰）
- 錯誤處理和功能
- 文檔完整性

**何時使用：**
- 創建新的 Python SDK 項目後
- 修改現有的 Python SDK 應用程式後
- 部署 Python SDK 應用程式之前

**用法：**
代理在 `/new-sdk-app` 創建 Python 項目後自動運行，或者您可以通過詢問來觸發它：
```
"驗證我的 Python Agent SDK 應用程式"
"檢查我的 SDK 應用程式是否遵循最佳實踐"
```

**輸出：**
提供全面的報告，包括：
- 總體狀態（通過 / 帶警告通過 / 失敗）
- 阻止功能的關鍵問題
- 關於次優模式的警告
- 已通過檢查的列表
- 帶有 SDK 文檔參考的具體建議

### 代理：`agent-sdk-verifier-ts`

徹底驗證 TypeScript Agent SDK 應用程式的正確設置和最佳實踐。

**驗證檢查：**
- SDK 安裝和版本
- TypeScript 配置（tsconfig.json）
- 正確的 SDK 使用和模式
- 類型安全和導入
- 代理初始化和配置
- 環境和安全性（.env、API 密鑰）
- 錯誤處理和功能
- 文檔完整性

**何時使用：**
- 創建新的 TypeScript SDK 項目後
- 修改現有的 TypeScript SDK 應用程式後
- 部署 TypeScript SDK 應用程式之前

**用法：**
代理在 `/new-sdk-app` 創建 TypeScript 項目後自動運行，或者您可以通過詢問來觸發它：
```
"驗證我的 TypeScript Agent SDK 應用程式"
"檢查我的 SDK 應用程式是否遵循最佳實踐"
```

**輸出：**
提供全面的報告，包括：
- 總體狀態（通過 / 帶警告通過 / 失敗）
- 阻止功能的關鍵問題
- 關於次優模式的警告
- 已通過檢查的列表
- 帶有 SDK 文檔參考的具體建議

## 工作流程示例

以下是使用此插件的典型工作流程：

1. **創建新項目：**
```bash
/new-sdk-app code-reviewer-agent
```

2. **回答互動式問題：**
```
語言：TypeScript
代理類型：編碼代理（代碼審查）
起點：具有常用功能的基本代理
```

3. **自動驗證：**
該命令自動運行 `agent-sdk-verifier-ts` 以確保一切都正確設置。

4. **開始開發：**
```bash
# 設置您的 API 密鑰
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# 運行您的代理
npm start
```

5. **更改後驗證：**
```
"驗證我的 SDK 應用程式"
```

## 安裝

此插件包含在 Claude Code 存儲庫中。要使用它：

1. 確保已安裝 Claude Code
2. 插件命令和代理自動可用

## 最佳實踐

- **始終使用最新的 SDK 版本**：`/new-sdk-app` 檢查並安裝最新版本
- **部署前驗證**：在部署到生產環境之前運行驗證器代理
- **保護 API 密鑰**：永遠不要提交 `.env` 文件或硬編碼 API 密鑰
- **遵循 SDK 文檔**：驗證器代理根據官方模式進行檢查
- **類型檢查 TypeScript 項目**：定期運行 `npx tsc --noEmit`
- **測試您的代理**：為您的代理功能創建測試用例

## 資源

- [Agent SDK 概述](https://docs.claude.com/en/api/agent-sdk/overview)
- [TypeScript SDK 參考](https://docs.claude.com/en/api/agent-sdk/typescript)
- [Python SDK 參考](https://docs.claude.com/en/api/agent-sdk/python)
- [Agent SDK 示例](https://docs.claude.com/en/api/agent-sdk/examples)

## 疑難排解

### TypeScript 項目中的類型錯誤

**問題**：創建後 TypeScript 項目出現類型錯誤

**解決方案**：
- `/new-sdk-app` 命令自動運行類型檢查
- 如果錯誤持續存在，請檢查您是否使用最新的 SDK 版本
- 驗證您的 `tsconfig.json` 是否符合 SDK 要求

### Python 導入錯誤

**問題**：無法從 `claude_agent_sdk` 導入

**解決方案**：
- 確保您已安裝依賴項：`pip install -r requirements.txt`
- 如果使用虛擬環境，請激活它
- 檢查 SDK 是否已安裝：`pip show claude-agent-sdk`

### 驗證失敗並出現警告

**問題**：驗證器代理報告警告

**解決方案**：
- 查看報告中的具體警告
- 檢查提供的 SDK 文檔參考
- 警告不會阻止功能，但指示需要改進的區域

## 作者

Ashwin Bhat (ashwin@anthropic.com)

## 版本

1.0.0
