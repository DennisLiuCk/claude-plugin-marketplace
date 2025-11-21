---
description: 創建並設置新的 Claude Agent SDK 應用程式
argument-hint: [專案名稱]
---

您的任務是幫助用戶創建新的 Claude Agent SDK 應用程式。請仔細遵循以下步驟：

## 參考文檔

在開始之前，請查看官方文檔以確保您提供準確和最新的指導。使用 WebFetch 閱讀這些頁面：

1. **從概述開始**：https://docs.claude.com/en/api/agent-sdk/overview
2. **根據用戶的語言選擇，閱讀相應的 SDK 參考**：
   - TypeScript：https://docs.claude.com/en/api/agent-sdk/typescript
   - Python：https://docs.claude.com/en/api/agent-sdk/python
3. **閱讀概述中提到的相關指南**，例如：
   - 流式與單一模式
   - 權限
   - 自定義工具
   - MCP 集成
   - 子代理
   - 會話
   - 根據用戶需求的任何其他相關指南

**重要**：在安裝之前，始終檢查並使用最新版本的套件。在安裝之前使用 WebSearch 或 WebFetch 驗證當前版本。

## 收集需求

重要：一次詢問一個問題。在詢問下一個問題之前等待用戶的回應。這使用戶更容易回應。

按此順序提問（跳過用戶已通過參數提供的任何問題）：

1. **語言**（首先詢問）："您想使用 TypeScript 還是 Python？"

   - 在繼續之前等待回應

2. **項目名稱**（其次詢問）："您想如何命名您的項目？"

   - 如果提供了 $ARGUMENTS，則將其用作項目名稱並跳過此問題
   - 在繼續之前等待回應

3. **代理類型**（第三個詢問，但如果 #2 足夠詳細則跳過）："您正在構建什麼樣的代理？一些示例：

   - 編碼代理（SRE、安全審查、代碼審查）
   - 業務代理（客戶支持、內容創作）
   - 自定義代理（描述您的用例）"
   - 在繼續之前等待回應

4. **起點**（第四個詢問）："您想要：

   - 一個最小的 'Hello World' 示例來開始
   - 具有常用功能的基本代理
   - 基於您用例的特定示例"
   - 在繼續之前等待回應

5. **工具選擇**（第五個詢問）：讓用戶知道您將使用什麼工具，並與他們確認這些是他們想要使用的工具（例如，他們可能更喜歡 pnpm 或 bun 而不是 npm）。在執行需求時尊重用戶的偏好。

在回答所有問題後，繼續創建設置計劃。

## 設置計劃

根據用戶的答案，創建一個包括以下內容的計劃：

1. **項目初始化**：

   - 創建項目目錄（如果不存在）
   - 初始化套件管理器：
     - TypeScript：`npm init -y` 並設置 `package.json`，其中 type: "module" 和腳本（包括 "typecheck" 腳本）
     - Python：創建 `requirements.txt` 或使用 `poetry init`
   - 添加必要的配置文件：
     - TypeScript：使用適合 SDK 的適當設置創建 `tsconfig.json`
     - Python：如果需要，可選擇創建配置文件

2. **檢查最新版本**：

   - 在安裝之前，使用 WebSearch 或檢查 npm/PyPI 以查找最新版本
   - 對於 TypeScript：檢查 https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk
   - 對於 Python：檢查 https://pypi.org/project/claude-agent-sdk/
   - 告知用戶您正在安裝哪個版本

3. **SDK 安裝**：

   - TypeScript：`npm install @anthropic-ai/claude-agent-sdk@latest`（或指定最新版本）
   - Python：`pip install claude-agent-sdk`（pip 默認安裝最新版本）
   - 安裝後，驗證已安裝的版本：
     - TypeScript：檢查 package.json 或運行 `npm list @anthropic-ai/claude-agent-sdk`
     - Python：運行 `pip show claude-agent-sdk`

4. **創建起始文件**：

   - TypeScript：使用基本查詢示例創建 `index.ts` 或 `src/index.ts`
   - Python：使用基本查詢示例創建 `main.py`
   - 包括適當的導入和基本錯誤處理
   - 使用來自最新 SDK 版本的現代、最新的語法和模式

5. **環境設置**：

   - 創建帶有 `ANTHROPIC_API_KEY=your_api_key_here` 的 `.env.example` 文件
   - 將 `.env` 添加到 `.gitignore`
   - 解釋如何從 https://console.anthropic.com/ 獲取 API 密鑰

6. **可選：創建 .claude 目錄結構**：
   - 提供創建用於代理、命令和設置的 `.claude/` 目錄
   - 詢問他們是否需要任何示例子代理或斜杠命令

## 實施

在收集需求並獲得用戶對計劃的確認後：

1. 使用 WebSearch 或 WebFetch 檢查最新的套件版本
2. 執行設置步驟
3. 創建所有必要的文件
4. 安裝依賴項（始終使用最新的穩定版本）
5. 驗證已安裝的版本並告知用戶
6. 根據他們的代理類型創建工作示例
7. 在代碼中添加有用的註釋，解釋每個部分的作用
8. **在完成之前驗證代碼是否有效**：
   - 對於 TypeScript：
     - 運行 `npx tsc --noEmit` 以檢查類型錯誤
     - 修復所有類型錯誤，直到類型完全通過
     - 確保導入和類型正確
     - 只有在類型檢查通過且沒有錯誤時才繼續
   - 對於 Python：
     - 驗證導入是否正確
     - 檢查基本語法錯誤
   - **在代碼成功驗證之前，不要認為設置完成**

## 驗證

在創建所有文件並安裝依賴項後，使用適當的驗證器代理來驗證 Agent SDK 應用程式是否正確配置並準備好使用：

1. **對於 TypeScript 項目**：啟動 **agent-sdk-verifier-ts** 代理以驗證設置
2. **對於 Python 項目**：啟動 **agent-sdk-verifier-py** 代理以驗證設置
3. 代理將檢查 SDK 使用、配置、功能以及是否遵守官方文檔
4. 查看驗證報告並解決任何問題

## 入門指南

設置完成並驗證後，向用戶提供：

1. **後續步驟**：

   - 如何設置他們的 API 密鑰
   - 如何運行他們的代理：
     - TypeScript：`npm start` 或 `node --loader ts-node/esm index.ts`
     - Python：`python main.py`

2. **有用的資源**：

   - TypeScript SDK 參考鏈接：https://docs.claude.com/en/api/agent-sdk/typescript
   - Python SDK 參考鏈接：https://docs.claude.com/en/api/agent-sdk/python
   - 解釋關鍵概念：系統提示、權限、工具、MCP 服務器

3. **常見的後續步驟**：
   - 如何自定義系統提示
   - 如何通過 MCP 添加自定義工具
   - 如何配置權限
   - 如何創建子代理

## 重要注意事項

- **始終使用最新版本**：在安裝任何套件之前，通過 WebSearch 或直接檢查 npm/PyPI 來檢查最新版本
- **驗證代碼運行正確**：
  - 對於 TypeScript：運行 `npx tsc --noEmit` 並在完成之前修復所有類型錯誤
  - 對於 Python：驗證語法和導入是否正確
  - 在代碼通過驗證之前，不要認為任務完成
- 安裝後驗證已安裝的版本並告知用戶
- 檢查官方文檔以了解任何特定於版本的要求（Node.js 版本、Python 版本等）
- 在創建目錄/文件之前，始終檢查它們是否已存在
- 使用用戶首選的套件管理器（TypeScript 的 npm、yarn、pnpm；Python 的 pip、poetry）
- 確保所有代碼示例都是功能性的並包括適當的錯誤處理
- 使用與最新 SDK 版本兼容的現代語法和模式
- 使體驗互動和教育性
- **一次詢問一個問題** - 不要在單個回應中詢問多個問題

首先只詢問第一個需求問題。在繼續下一個問題之前等待用戶的答案。
