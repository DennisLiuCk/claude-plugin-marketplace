# Legacy Hero Java v2 插件

深度分析 Java Spring Boot 遺留專案的進階工具。**v2.0 全新架構**：解決文件持久化問題、消除幻覺、階段性用戶確認、並行分析加速。

## 版本 2.0 的重大改進

### v1 的失敗教訓

Legacy Hero Java v1.x 存在嚴重的技術問題：

**問題：文件無法持久化**
```
實際情況（v1）：
✅ DELIVERY_SUMMARY.md - 存在（主 session 創建）
❌ 01-project-scan.md - 不存在（subagent 創建，未持久化）
❌ 02-service-flow.md - 不存在（subagent 創建，未持久化）
❌ 03-knowledge.md - 不存在（subagent 創建，未持久化）
❌ REVIEW_REPORT.md - 不存在（subagent 創建，未持久化）
```

**根本原因**：
- Task 工具的 subprocess 中執行的 Write 操作不會持久化到主文件系統
- 只有文本輸出會返回，文件操作等副作用不會傳遞
- Plugin v1.1.0 試圖解決但失敗了

### v2 的解決方案

**核心架構變更：主 Session 中心化文件管理**

```
v1 架構（失敗）：
Orchestrator → 調用 Subagent → Subagent 使用 Write → ❌ 文件消失

v2 架構（成功）：
Orchestrator → 調用 Subagent → Subagent 返回文本 → Orchestrator 使用 Write → ✅ 文件持久化
```

**四大改進**：

1. **文件持久化保證**
   - ✅ Orchestrator（主 session）負責所有 Write 操作
   - ✅ Subagent 只返回純文本報告
   - ✅ 100% 確保文件持久化到文件系統

2. **階段性用戶確認**
   - ✅ 四個大階段：掃描 → 分析 → 知識 → 文件
   - ✅ 每階段完成後等待用戶確認
   - ✅ 用戶可調整方向或深入特定部分

3. **並行處理加速**
   - ✅ 識別可並行的任務（多個 endpoint/service）
   - ✅ 使用獨立 subagent 並行執行
   - ✅ 避免單一 agent context 過載

4. **防幻覺驗證機制**
   - ✅ 每個階段都有 review agent 驗證
   - ✅ 所有引用必須包含真實的檔案路徑和行號
   - ✅ Review agent 使用 Read/Glob/Grep 驗證真實性
   - ✅ 零容忍錯誤和不存在的內容

## 核心特色

### 正確性優先

- **多層審核機制**：每個階段都有專門的 reviewer agent 嚴格審核
- **真實性驗證**：所有代碼引用、技術陳述都必須有實際證據
- **零容忍錯誤**：只有通過審核的內容才會持久化
- **文件保證持久化**：所有分析結果真實存在於文件系統

### 用戶參與式流程

- **階段性確認**：每個大階段完成後詢問用戶
- **靈活調整**：用戶可隨時調整分析方向
- **透明化進度**：清晰展示每個階段的成果
- **可追溯性**：所有中間結果都保留

### 高效並行處理

- **智能任務調度**：自動識別可並行的分析任務
- **獨立上下文**：每個 subagent 有獨立 context
- **加速分析**：多個 endpoint/service 同時分析
- **避免過載**：漸進式分析，一次聚焦特定範圍

### 詳細繁體中文教學

- **假設新手**：文件撰寫假設讀者完全不了解專案
- **逐行說明**：重要代碼都有詳細的註釋和說明
- **流程圖示**：使用 Mermaid 提供清晰的流程圖和序列圖
- **知識補充**：解釋 Spring Boot、JPA、設計模式等概念

## 工作目錄結構

每次分析創建獨立的工作目錄：

```
.legacy-hero-workspace/
└── session-{timestamp}/
    ├── 01-project-scan.md              # 專案掃描報告
    ├── 02-{type}-analysis-{name}.md    # 深度分析報告
    │   ├── 02-endpoint-analysis-create-order.md
    │   ├── 02-endpoint-analysis-get-order.md
    │   ├── 02-service-analysis-order-service.md
    │   └── 02-entity-analysis-order.md
    ├── 03-knowledge-enrichment.md      # 技術知識補充
    ├── 04-documentation-draft.md       # 文件草稿
    ├── 05-documentation-final.md       # 最終文件（推薦閱讀）
    ├── review-reports/                  # 審核報告目錄
    │   ├── scan-review.md
    │   ├── analysis-review.md
    │   ├── knowledge-review.md
    │   └── documentation-review.md
    └── session-manifest.json            # 會話清單
```

**所有文件都真實存在，可以查看、編輯、提交到 Git！**

## 四階段工作流程

### 階段一：需求理解和專案掃描

**目標**：建立完整的專案地圖

1. **理解用戶需求**
   - 釐清分析目標（endpoint/entity/service/flow/全專案）
   - 確認分析範圍和深度

2. **專案掃描**
   - 啟動 `project-scanner` agent 掃描專案
   - 識別建構工具（Maven/Gradle）
   - 分析依賴和配置
   - 掃描目錄結構和 Spring 元件

3. **品質審核**
   - 啟動 `scan-reviewer` agent 驗證掃描結果
   - 驗證檔案路徑真實性
   - 確認元件統計準確性

4. **寫入文件**
   - Orchestrator 將報告寫入：`01-project-scan.md`
   - 審核報告寫入：`review-reports/scan-review.md`

5. **【用戶確認】**
   - 展示專案掃描摘要
   - 詢問是否繼續下一階段

### 階段二：深度分析（支援並行）

**目標**：深入分析目標元件

1. **確定分析目標**
   - 根據用戶需求選擇分析類型
   - 可能的類型：Endpoint, Service, Entity, Flow

2. **並行啟動專門 agents**
   - 如果有多個獨立目標，並行執行
   - `endpoint-analyzer`：分析 REST API
   - `service-analyzer`：分析業務邏輯
   - `entity-analyzer`：分析資料模型

3. **追蹤完整流程**
   - Controller → Service → Repository → Database
   - 記錄認證、授權、驗證、異常處理
   - 分析事務邊界和資料流轉

4. **品質審核**
   - 啟動 `analysis-reviewer` 為每份報告審核
   - 驗證所有代碼引用和行號
   - 確認流程追蹤完整性

5. **寫入文件**
   - 每個分析寫入獨立文件：`02-{type}-analysis-{name}.md`
   - 審核報告寫入：`review-reports/analysis-review.md`

6. **【用戶確認】**
   - 展示所有分析摘要
   - 詢問是否繼續下一階段

### 階段三：知識補充

**目標**：補充相關技術知識

1. **技術知識補充**
   - 啟動 `knowledge-enricher` agent
   - 補充 Spring Boot 相關概念
   - 解釋 Java Annotations
   - 說明設計模式
   - 提供最佳實踐建議

2. **品質審核**
   - 啟動 `knowledge-reviewer` 驗證
   - 確認知識補充針對專案實際技術
   - 驗證技術概念解釋準確性

3. **寫入文件**
   - 知識補充寫入：`03-knowledge-enrichment.md`
   - 審核報告寫入：`review-reports/knowledge-review.md`

4. **【用戶確認】**
   - 展示補充的知識點
   - 詢問是否繼續下一階段

### 階段四：文件生成和最終審核

**目標**：生成完整的教學文件

1. **整合所有分析**
   - Orchestrator 讀取所有前序文件
   - 啟動 `documentation-writer` agent
   - 整合成連貫的教學文件

2. **文件撰寫**
   - 假設讀者是新進工程師
   - 使用 Mermaid 繪製流程圖和序列圖
   - 提供完整的代碼解釋
   - 添加知識補充章節

3. **嚴格審核**
   - 啟動 `documentation-reviewer` 審核
   - **零容忍錯誤**：驗證所有引用、流程、技術陳述
   - 如不通過：修正後重新審核

4. **寫入最終文件**
   - 草稿寫入：`04-documentation-draft.md`
   - 最終文件寫入：`05-documentation-final.md`
   - 審核報告寫入：`review-reports/documentation-review.md`
   - 生成會話清單：`session-manifest.json`

5. **【用戶最終確認】**
   - 展示完整的分析流程摘要
   - 提供所有文件清單和路徑
   - 建議後續深入方向

## 功能組件

### 十個專門的 Agents

**協調類**：
1. **legacy-orchestrator-v2** (紫色)
   - 協調整個流程
   - **負責所有文件寫入操作**（v2 核心）
   - 管理階段性用戶確認
   - 並行任務調度

**分析類**（只返回文本，不寫文件）：
2. **project-scanner** (藍色)
   - 掃描 Spring Boot 專案結構
   - 識別依賴、配置、元件

3. **endpoint-analyzer** (綠色)
   - 分析 REST API endpoints
   - 追蹤完整請求流程

4. **service-analyzer** (青色)
   - 分析 Service 業務邏輯
   - 追蹤跨 Service 調用

5. **entity-analyzer** (黃色)
   - 分析 JPA Entity 資料模型
   - 說明 Entity 關聯

6. **knowledge-enricher** (橘色)
   - 補充技術概念
   - 解釋設計模式和最佳實踐

7. **documentation-writer** (藍綠色)
   - 整合分析結果
   - 生成教學文件

**審核類**（驗證正確性）：
8. **scan-reviewer** (紅色)
   - 審核專案掃描報告

9. **analysis-reviewer** (紅色)
   - 審核分析報告（endpoint/service/entity）

10. **knowledge-reviewer** (紅色)
    - 審核知識補充文檔

11. **documentation-reviewer** (紅色)
    - 嚴格審核最終教學文件
    - **零容忍錯誤**

### 五個快速命令

#### `/legacy-hero-v2`
啟動完整的 v2 分析流程（四階段含用戶確認）。

**使用範例**：
```
/legacy-hero-v2 分析這個專案的訂單管理模組
```

#### `/lh-scan`
只執行階段一：專案掃描。

**使用範例**：
```
/lh-scan
```

#### `/lh-analyze-endpoint <endpoint>`
分析指定的 REST API endpoint（完整四階段）。

**使用範例**：
```
/lh-analyze-endpoint POST /api/orders
/lh-analyze-endpoint GET /api/users/{id}
```

#### `/lh-analyze-service <service>`
分析指定的 Service 業務邏輯（完整四階段）。

**使用範例**：
```
/lh-analyze-service OrderService
/lh-analyze-service PaymentService
```

#### `/lh-analyze-entity <entity>`
分析指定的 JPA Entity 資料模型（完整四階段）。

**使用範例**：
```
/lh-analyze-entity Order
/lh-analyze-entity User
```

## 安裝方式

### NPM 安裝（推薦）

```bash
npx @claude-plugin/install github:DennisLiuCk/claude-plugin-marketplace/plugins/legacy-hero-java-v2
```

### 手動安裝

```bash
git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git
cp -r claude-plugin-marketplace/plugins/legacy-hero-java-v2 ~/.claude/plugins/
```

## 使用指南

### 場景一：完整分析 API Endpoint

```
使用者：/lh-analyze-endpoint POST /api/orders

Claude (Orchestrator):
╔═══════════════════════════════════════════════════════╗
║       Legacy Hero Java v2 - 開始分析                  ║
╚═══════════════════════════════════════════════════════╝

階段一：專案掃描
├─ 創建工作目錄：.legacy-hero-workspace/session-20250124-143022/
├─ 啟動 project-scanner agent...
├─ 掃描完成，寫入：01-project-scan.md
├─ 啟動 scan-reviewer 審核...
└─ 審核通過 ✓

專案掃描摘要：
  - Spring Boot 2.7.12
  - 15 個 @RestController
  - 20 個 @Service
  - 12 個 @Repository

【用戶確認】是否繼續進入階段二（深度分析）？

---

使用者：是的，繼續

Claude:
階段二：深度分析
├─ 目標：POST /api/orders
├─ 啟動 endpoint-analyzer agent...
├─ 追蹤完整流程：Controller → Service → Repository → Database
├─ 分析完成，寫入：02-endpoint-analysis-create-order.md
├─ 啟動 analysis-reviewer 審核...
│   ├─ 驗證引用：35 個引用全部通過 ✓
│   └─ 流程完整性：通過 ✓
└─ 審核通過 ✓

分析摘要：
  - 端點：POST /api/orders
  - Controller：OrderController.java:67
  - Service：OrderService.createOrder()
  - 事務管理：@Transactional
  - 調用鏈：OrderService → InventoryService → OrderRepository

【用戶確認】是否繼續進入階段三（知識補充）？

---

使用者：是的

Claude:
階段三：知識補充
├─ 啟動 knowledge-enricher agent...
├─ 補充 Spring MVC 概念
├─ 解釋 @Transactional 事務管理
├─ 說明 DTO 模式
├─ 補充完成，寫入：03-knowledge-enrichment.md
├─ 啟動 knowledge-reviewer 審核...
└─ 審核通過 ✓

【用戶確認】是否繼續進入階段四（文件生成）？

---

使用者：是的

Claude:
階段四：文件生成
├─ 整合所有分析結果...
├─ 啟動 documentation-writer agent...
├─ 生成教學文件草稿，寫入：04-documentation-draft.md
├─ 啟動 documentation-reviewer 審核...
│   ├─ 驗證所有代碼引用：50 個引用全部正確 ✓
│   ├─ 流程完整性：通過 ✓
│   ├─ 技術準確性：通過 ✓
│   └─ 教學質量：優秀 ✓
├─ 審核通過，寫入最終文件：05-documentation-final.md
└─ 生成會話清單：session-manifest.json

╔═══════════════════════════════════════════════════════╗
║         Legacy Hero Java v2 - 分析完成                ║
╚═══════════════════════════════════════════════════════╝

✅ 所有階段已完成並通過審核

📁 工作目錄：.legacy-hero-workspace/session-20250124-143022/

📄 生成的文件：
  階段一：專案掃描
    ✓ 01-project-scan.md
    ✓ review-reports/scan-review.md

  階段二：深度分析
    ✓ 02-endpoint-analysis-create-order.md
    ✓ review-reports/analysis-review.md

  階段三：知識補充
    ✓ 03-knowledge-enrichment.md
    ✓ review-reports/knowledge-review.md

  階段四：文件生成
    ✓ 04-documentation-draft.md
    ✓ 05-documentation-final.md ⭐ (推薦閱讀)
    ✓ review-reports/documentation-review.md

  會話清單
    ✓ session-manifest.json

🎯 後續建議：
  - 可以深入分析 GET /api/orders/{id}
  - 可以補充分析 OrderService 的其他方法
  - 可以分析 Order Entity 的關聯

是否需要繼續分析其他部分？
```

### 場景二：並行分析多個 Endpoints

```
使用者：/legacy-hero-v2 分析所有訂單相關的 API

Claude (Orchestrator):
階段一：專案掃描
[完成...]

【用戶確認】是否繼續進入階段二？

---

使用者：是的

Claude:
階段二：深度分析（並行處理）
├─ 識別訂單相關 endpoints：
│   ├─ POST /api/orders（創建訂單）
│   ├─ GET /api/orders/{id}（查詢訂單）
│   └─ PUT /api/orders/{id}/status（更新訂單狀態）
│
├─ 並行啟動 3 個 endpoint-analyzer agents...
│   ├─ Agent 1：分析 POST /api/orders
│   ├─ Agent 2：分析 GET /api/orders/{id}
│   └─ Agent 3：分析 PUT /api/orders/{id}/status
│
├─ 所有分析完成！
│   ├─ 寫入：02-endpoint-analysis-create-order.md
│   ├─ 寫入：02-endpoint-analysis-get-order.md
│   └─ 寫入：02-endpoint-analysis-update-order-status.md
│
├─ 並行啟動 3 個 analysis-reviewer agents...
└─ 所有審核通過 ✓

【用戶確認】是否繼續進入階段三？
```

## v2 vs v1 對比

| 特性 | v1 | v2 |
|-----|----|----|
| **文件持久化** | ❌ Subagent 寫入的文件消失 | ✅ 主 session 寫入，100% 持久化 |
| **用戶控制** | ❌ 全自動，無法中途調整 | ✅ 四階段確認，隨時調整方向 |
| **並行處理** | ❌ 順序執行，速度慢 | ✅ 智能並行，速度快 |
| **防幻覺** | ⚠️ 基本驗證 | ✅ 多層審核，零容忍錯誤 |
| **透明度** | ⚠️ 黑盒操作 | ✅ 階段清晰，進度透明 |
| **可追溯性** | ❌ 中間結果可能丟失 | ✅ 所有中間結果保留 |
| **靈活性** | ❌ 固定流程 | ✅ 可選擇階段，可調整範圍 |

## 適用場景

### 適合使用

1. **新進工程師入職**
   - 需要快速理解遺留專案
   - 學習專案的架構和設計模式

2. **維護遺留系統**
   - 需要修改既有功能但不了解邏輯
   - 需要追蹤 bug 的根本原因

3. **技術債務清理**
   - 需要重構代碼前先理解現狀
   - 需要評估重構的影響範圍

4. **知識轉移**
   - 資深工程師離職前的知識傳承
   - 團隊內部的技術分享

### 不適合

1. **全新專案**：不需要分析遺留代碼
2. **簡單專案**：代碼量很小，直接閱讀即可
3. **非 Spring Boot 專案**：此插件專門針對 Spring Boot

## 技術要求

### 支援的技術棧

- **框架**：Spring Boot 2.x / 3.x
- **建構工具**：Maven / Gradle
- **資料庫**：JPA (Hibernate) + 任何 RDBMS
- **安全**：Spring Security (Optional)

### 專案結構要求

標準的 Spring Boot 專案結構：
```
src/main/java/
├── controller/
├── service/
├── repository/
├── model/entity/
└── model/dto/
```

## 最佳實踐

### 1. 明確分析目標

**好的請求**：
```
/lh-analyze-endpoint POST /api/orders
分析創建訂單的完整流程
```

**不好的請求**：
```
分析這個專案
```
（範圍太大，建議先掃描後再選擇特定模組）

### 2. 善用階段性確認

- 每個階段完成後，先查看生成的文件
- 根據發現調整下一階段的分析範圍
- 可以要求補充特定部分的分析

### 3. 利用並行處理

- 如果要分析多個相關 endpoints，一次性提出
- Orchestrator 會自動並行處理，節省時間

### 4. 保存分析結果

- 將 `.legacy-hero-workspace/` 提交到 Git
- 作為專案文件的一部分
- 幫助其他團隊成員理解專案

### 5. 結合實際調試

- 分析報告提供理論理解
- 結合實際運行和調試加深理解
- 可以驗證分析報告的正確性

## 品質保證

### 多層審核機制

1. **Scan Reviewer**
   - 驗證檔案路徑存在
   - 確認元件統計準確
   - 檢查配置資訊正確

2. **Analysis Reviewer**
   - 驗證所有代碼引用（檔案路徑 + 行號）
   - 確認流程追蹤完整
   - 檢查技術陳述準確

3. **Knowledge Reviewer**
   - 確認知識補充針對專案實際技術
   - 驗證技術概念解釋正確
   - 檢查無過時資訊

4. **Documentation Reviewer**（零容忍錯誤）
   - 驗證所有引用的真實性
   - 確認流程完整性
   - 評估教學質量

**只有通過所有審核的內容才會持久化！**

## 疑難排解

### 問題：找不到指定的 endpoint

**解決方案**：
1. 確認 endpoint URL 是否正確
2. 使用 `/lh-scan` 先掃描專案查看所有端點
3. 檢查是否使用了 base path

### 問題：分析過程中斷

**解決方案**：
- 所有中間結果都已持久化在工作目錄
- 可以查看 `session-manifest.json` 了解完成的階段
- 可以繼續未完成的階段

### 問題：需要調整分析範圍

**解決方案**：
- 利用階段性確認機制
- 每階段完成後可以調整方向
- 或使用特定命令（如 `/lh-analyze-endpoint`）

### 問題：審核未通過

**解決方案**：
- Orchestrator 會自動修正並重新審核
- 如仍有問題，會展示問題清單
- 用戶可以根據問題手動調整

## 版本資訊

- **版本**：2.0.0
- **作者**：Dennis Liu (繁體中文版)
- **基於**：Legacy Hero Java v1.x（完全重新設計）
- **適用**：Java Spring Boot 2.x / 3.x
- **最後更新**：2025

## 變更日誌

### v2.0.0 (2025-01-24)
- 全新架構：主 session 中心化文件管理
- 新增：階段性用戶確認機制
- 新增：並行處理支援
- 新增：多層審核驗證系統
- 修復：v1.x 文件無法持久化問題
- 改進：防幻覺機制，零容忍錯誤

### v1.1.0 (2025-01-23)
- 嘗試新增檔案持久化系統（失敗）
- 未能解決 subprocess 限制問題

### v1.0.0 (2025-01-20)
- 初始版本
- 存在文件無法持久化問題

## 相關資源

### Spring Boot 官方文件

- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Spring Security](https://docs.spring.io/spring-security/reference/)

### 學習資源

- [Spring Boot 最佳實踐](https://spring.io/guides)
- [Java 設計模式](https://refactoring.guru/design-patterns/java)
- [JPA 與 Hibernate](https://hibernate.org/orm/documentation/)

## 意見回饋

如有任何問題、建議或改進想法，歡迎在 GitHub 建立 Issue！

**特別提醒**：如果發現分析結果有幻覺或錯誤，請立即回報。v2 的目標是 100% 準確性。

## 授權

此插件基於 Anthropic 官方 claude-code 插件開發，採用相同授權條款。
