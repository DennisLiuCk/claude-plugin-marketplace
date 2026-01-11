# 更新日誌

本文件記錄 Claude Plugin Marketplace (繁體中文) 的所有重要變更。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [語意化版本](https://semver.org/lang/zh-TW/)。

## [1.5.0] - 2025-11-25

### 移除
- **legacy-hero-java 插件**（已棄用）
  - 深度分析 Java Spring Boot 遺留專案的原始版本
  - 此插件已被 legacy-analyzer 完全取代
- **legacy-hero-java-v2 插件**（已棄用）
  - legacy-hero-java 的改進版本
  - 此插件已被 legacy-analyzer 完全取代

### 改進
- **文件更新**
  - README.md 更新插件總數（13 → 14）
  - 新增 legacy-analyzer 插件到開發工具分類
  - 更新目錄結構，移除已棄用插件
  - scripts/generate-plugins-data.py 移除已棄用插件的圖示定義

### 技術細節
- marketplace.json 版本升級：1.1.0 → 1.5.0
- docs/js/data.js 重新生成，移除已棄用插件資料
- 插件總數：16 → 14

### 說明
legacy-hero-java 和 legacy-hero-java-v2 是早期開發的遺留專案分析工具。隨著 legacy-analyzer 插件的推出，這兩個插件已不再需要。legacy-analyzer 採用了更先進的多代理架構和置信度評分系統，提供更準確、更可靠的分析結果。

## [1.1.0] - 2025-11-22

### 新增
- **Issue Review 插件**（社群插件）
  - 專業的問題分析專家系統
  - 三階段分析流程：問題分析 → 程式碼調查 → 根本原因定位
  - 包含三個專門的分析代理：problem-analyzer、codebase-investigator、root-cause-finder
  - 智慧評分系統，為每個可能原因評分（0-100分）
  - 完整的繁體中文文件和使用指南

### 修正
- 修正所有文件中的年份錯誤（2024 → 2025）
  - docs/index.html
  - docs/README.md
  - SHOWCASE_WEBSITE.md
  - plugins/security-guidance/README.md
  - plugins/feature-dev/README.md
  - plugins/feature-dev/agents/code-architect.md
  - plugins/issue-review/ 相關檔案

### 改進
- **插件來源類型自動判斷**
  - 修改 `scripts/generate-plugins-data.py` 中的 `get_source_type()` 函式
  - 根據作者 email 自動判斷插件來源類型
  - 包含 `@anthropic.com` 的為官方插件（official）
  - 其他 email 為社群插件（community）
- **文件更新**
  - README.md 更新插件總數（12 → 13）
  - 新增 Issue Review 插件到生產力工具分類
  - 更新目錄結構，包含 issue-review 插件
  - docs/index.html 更新統計數據（12 → 13）

### 技術細節
- marketplace.json 版本升級：1.0.0 → 1.1.0
- docs/js/data.js 重新生成，包含最新的插件資料
- 所有版本標籤更新為 v1.1.0

## [1.0.0] - 2025-11-21

### 新增
- **首次發布 Claude Plugin Marketplace (繁體中文)**
- **12 個官方插件的繁體中文版本**：
  - **開發工具（5 個）**：
    - agent-sdk-dev - Claude Agent SDK 開發工具包
    - feature-dev - 七階段功能開發流程
    - frontend-design - 前端介面設計指引
    - ralph-loop - 互動式迭代開發循環
    - plugin-dev - 插件開發工具包
  - **生產力工具（4 個）**：
    - pr-review-toolkit - Pull Request 審查工具
    - commit-commands - Git 工作流程簡化命令
    - code-review - 自動化程式碼審查
    - hookify - 自訂規則系統
  - **安全工具（1 個）**：
    - security-guidance - 安全提醒鉤子
  - **學習工具（2 個）**：
    - explanatory-output-style - 解釋性輸出風格
    - learning-output-style - 互動式學習模式

### 文件
- 完整的繁體中文 README.md
- CLAUDE.md - AI 助手完整指南
- 每個插件的詳細說明文件
- 安裝與使用指南

### 基礎設施
- GitHub Pages 展示網站
  - 精緻的賽博工業主義設計風格
  - 插件篩選與搜尋功能
  - 響應式設計
- 自動化生成腳本
  - scripts/generate-plugins-data.py
  - 從 marketplace.json 生成 docs/js/data.js
- 插件市場配置
  - .claude-plugin/marketplace.json
  - 完整的插件元資料

---

## 版本說明

### [1.5.0] 主要亮點

此版本主要移除了兩個已棄用的插件 **legacy-hero-java** 和 **legacy-hero-java-v2**，這兩個插件已被更先進的 **legacy-analyzer** 完全取代。

**移除原因**：
- legacy-analyzer 採用多代理架構，分析更全面
- 置信度評分系統能有效過濾誤報
- 更好的文件持久化機制
- 階段性用戶確認流程更加完善

### [1.1.0] 主要亮點

此版本主要新增了第一個社群插件 **Issue Review**，這是一個專業的問題分析專家系統。同時修正了文件中的年份錯誤，並改進了插件來源類型的自動判斷機制。

**Issue Review 插件特色**：
- 處理不完整資訊：即使只有簡短的問題描述，也能系統化分析
- 多階段深入分析：從問題理解 → 程式碼調查 → 根本原因定位
- 客觀評分機制：為每個可能原因評分，優先分析最可能的
- 迭代驗證假設：逐一驗證假設，避免過早下結論

### [1.0.0] 主要亮點

首次發布完整的繁體中文插件市場，包含 12 個精選的官方插件翻譯版本。所有插件都經過完整的繁體中文化，包括說明文件、命令、代理和技能定義。

---

## 貢獻者

感謝以下貢獻者對本專案的付出：

- **Dennis Liu** - 專案維護者、Issue Review 插件作者
- **Anthropic 團隊** - 原始官方插件作者

---

## 授權資訊

本專案遵循原始 [anthropics/claude-code](https://github.com/anthropics/claude-code) 儲存庫的授權條款。

各個插件的授權資訊請參考對應插件目錄下的文件。
