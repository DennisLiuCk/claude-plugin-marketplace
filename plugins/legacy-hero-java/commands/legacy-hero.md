---
description: 啟動完整的 Java Spring Boot 遺留代碼分析工作流程
---

# Legacy Hero Java - 遺留代碼分析工作流程

歡迎使用 Legacy Hero Java！這個工作流程將幫助您深入理解 Java Spring Boot 遺留專案的代碼邏輯。

## 工作流程

### 階段一：理解需求

**目標**：確認要分析什麼

請告訴我您想分析的目標：
- 特定的 API endpoint（例如：`/api/orders/{id}`）
- 特定的 Entity（例如：`Order`）
- 特定的 Service（例如：`OrderService`）
- 特定的業務流程（例如：「訂單處理流程」）

### 階段二：專案掃描

啟動 `project-scanner` agent 掃描整個專案結構，建立專案地圖。

### 階段三：深度分析

根據您的目標，啟動對應的專門 agent：
- API 端點分析 → `endpoint-analyzer`
- Entity 分析 → `entity-analyzer`  
- 業務流程追蹤 → `service-flow-tracer`

### 階段四：知識補充

啟動 `knowledge-enricher` agent 補充相關的技術概念和領域知識。

### 階段五：文件撰寫

啟動 `documentation-writer` agent 生成詳細的教學文件。

### 階段六：品質審核

**重要**：啟動 `documentation-reviewer` agent 審核文件正確性。
只有通過審核的文件才會交付給您。

### 階段七：交付報告

提供完整的分析報告，包含：
- 完整的代碼流程追蹤
- 詳細的技術說明
- 領域知識補充
- 後續學習建議

## 使用範例

```
我想分析 /api/users/login 這個登入 API 的完整流程
```

或

```
幫我理解 Order entity 和相關的業務邏輯
```

## 核心承諾

✅ **正確性優先**：所有文件都經過嚴格審核
✅ **詳細解釋**：假設您是專案新手，提供充分說明
✅ **知識補充**：不只是代碼，還有相關的技術知識
✅ **繁體中文**：完整的繁體中文教學文件

開始您的遺留代碼探索之旅吧！
