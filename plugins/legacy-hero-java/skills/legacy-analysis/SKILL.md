---
name: legacy-analysis
description: 深度分析 Java Spring Boot 遺留專案，為新進工程師提供詳盡的代碼教學文件
---

# Legacy Analysis Skill

當使用者需要理解 Java Spring Boot 遺留專案時，啟動此 skill。

## 適用場景

- 新進工程師需要理解現有專案
- 需要深入了解特定 API endpoint 的運作方式
- 需要理解複雜的業務流程
- 需要了解 Entity 關聯和資料模型

## 執行流程

1. 詢問使用者想分析的目標（endpoint/entity/service/flow）
2. 啟動 `legacy-orchestrator` agent 協調分析流程
3. 確保所有分析文件通過品質審核
4. 提供繁體中文的詳細教學文件

## 核心原則

- **正確性優先**：所有資訊必須經過驗證
- **詳細解釋**：假設讀者是專案新手
- **知識補充**：提供相關的技術背景知識
- **繁體中文輸出**：完整的繁體中文文件
