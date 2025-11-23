# Legacy Hero Java 插件

深度分析 Java Spring Boot 遺留專案的專業工具，為新進工程師提供詳盡的代碼教學文件。

## 概述

Legacy Hero Java 是專為分析 Java Spring Boot 遺留專案設計的綜合性插件。它能夠深入追蹤代碼流程、解釋業務邏輯、補充技術知識，並生成詳盡的繁體中文教學文件，幫助新進工程師快速理解複雜的遺留系統。

## 核心特色

### 正確性優先

- **文件審核機制**：所有分析文件都經過專門的 `documentation-reviewer` agent 嚴格審核
- **代碼驗證**：每一個代碼引用、技術陳述都有實際代碼證據支持
- **零容忍錯誤**：只有通過審核的文件才能交付給使用者

### 詳細解釋

- **假設新手**：文件撰寫假設讀者完全不了解專案
- **逐行說明**：重要代碼都有詳細的註釋和說明
- **流程圖示**：提供清晰的流程圖和架構圖

### 知識補充

- **技術概念**：解釋 Spring Boot、JPA、Spring Security 等框架概念
- **設計模式**：說明代碼中使用的設計模式
- **最佳實踐**：提供業界最佳實踐的建議

### 繁體中文輸出

- 所有分析報告使用繁體中文撰寫
- 保持技術術語的準確性
- 文字清晰易懂

## 功能組件

### 八個專門的 Agents

1. **project-scanner** (藍色)
   - 掃描 Spring Boot 專案結構
   - 識別 Maven/Gradle 配置和依賴
   - 建立完整的專案地圖

2. **endpoint-analyzer** (綠色)
   - 分析 REST API endpoints
   - 追蹤 Controller → Service → Repository 流程
   - 說明認證、授權和異常處理

3. **entity-analyzer** (黃色)
   - 分析 JPA Entities 和資料模型
   - 說明 Entity 關聯（@OneToMany, @ManyToOne 等）
   - 追蹤資料庫映射

4. **service-flow-tracer** (青色)
   - 追蹤業務邏輯流程
   - 分析跨 Service 的複雜流程
   - 識別事務邊界

5. **knowledge-enricher** (橘色)
   - 補充 Spring Boot 相關概念
   - 解釋 Java annotations
   - 提供設計模式說明

6. **documentation-writer** (藍綠色) - **已優化！**
   - 優先生成結構化的 Markdown 文件（.md）
   - 使用 Mermaid 語法繪製專業流程圖和序列圖
   - 提供完整的代碼片段和詳細說明
   - 文件保存在 `docs/` 目錄，便於版本控制

7. **documentation-reviewer** (紅色) - **關鍵！**
   - 嚴格審核文件正確性
   - 驗證所有代碼引用
   - 確保流程追蹤完整
   - 只有通過審核的文件才能交付

8. **legacy-orchestrator** (紫色)
   - 協調整個分析流程
   - 管理多個 agents 的執行
   - 整合所有分析結果

### 五個快速命令

#### `/legacy-hero`
啟動完整的遺留代碼分析工作流程。

**使用範例**：
```
/legacy-hero
我想分析這個專案的訂單管理模組
```

#### `/analyze-endpoint <endpoint>`
快速分析指定的 REST API endpoint。

**使用範例**：
```
/analyze-endpoint /api/orders/{id}
/analyze-endpoint POST /api/users/login
```

#### `/analyze-entity <entity>`
分析指定的 JPA Entity 及其關聯。

**使用範例**：
```
/analyze-entity Order
/analyze-entity User
```

#### `/analyze-service <service>`
分析指定的 Service 業務邏輯。

**使用範例**：
```
/analyze-service OrderService
/analyze-service PaymentService
```

#### `/analyze-flow <keyword>`
分析包含關鍵字的完整業務流程。

**使用範例**：
```
/analyze-flow 訂單處理
/analyze-flow 使用者認證
```

## 安裝方式

### NPM 安裝（推薦）

```bash
npx @claude-plugin/install github:DennisLiuCk/claude-plugin-marketplace/plugins/legacy-hero-java
```

### 手動安裝

```bash
git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git
cp -r claude-plugin-marketplace/plugins/legacy-hero-java ~/.claude/plugins/
```

## 使用指南

### 場景一：分析 API Endpoint

```
使用者：幫我分析 /api/orders POST 創建訂單的 API

Claude：
[啟動 legacy-orchestrator]

階段一：理解需求
- 目標：分析創建訂單 API endpoint
- URL: POST /api/orders

階段二：專案掃描
[啟動 project-scanner agent...]
- 找到 OrderController
- 找到 OrderService
- 找到 OrderRepository

階段三：深度分析
[啟動 endpoint-analyzer agent...]
- 追蹤完整請求流程
- 分析資料驗證
- 檢查權限控制
- 追蹤資料庫操作

階段四：知識補充
[啟動 knowledge-enricher agent...]
- 補充 Spring MVC 概念
- 解釋 @Transactional
- 說明 DTO 模式

階段五：文件撰寫
[啟動 documentation-writer agent...]
- 生成 Markdown 文件：docs/api-create-order-analysis.md
- 使用 Mermaid 繪製序列圖和流程圖
- 包含完整的代碼追蹤和說明

階段六：品質審核
[啟動 documentation-reviewer agent...]
- 驗證所有代碼引用：通過
- 檢查流程完整性：通過
- 確認技術陳述準確性：通過
- 審核結果：通過

階段七：交付報告
[提供詳細的 API 分析報告，包含...]
```

### 場景二：理解複雜業務流程

```
使用者：我需要理解訂單處理的完整流程

Claude：
[啟動 legacy-orchestrator]

階段一：理解需求
- 目標：分析訂單處理業務流程
- 範圍：從創建訂單到訂單完成

階段二：專案掃描
[掃描相關元件...]
- OrderService
- InventoryService
- PaymentService
- ShippingService

階段三：深度分析
[啟動 service-flow-tracer agent...]
- 追蹤跨 Service 的調用鏈
- 分析事務邊界
- 識別同步/非同步操作
- 記錄異常處理

階段四：知識補充
[補充業務流程相關概念...]
- 訂單狀態機
- 庫存扣減策略
- 分散式事務處理

階段五-七：文件撰寫、審核、交付
[生成完整的業務流程文件...]
```

## 七階段工作流程

### 階段一：理解需求
- 確認分析目標（endpoint/entity/service/flow）
- 釐清分析範圍和深度

### 階段二：專案掃描
- 使用 `project-scanner` 建立專案地圖
- 識別相關的元件和檔案

### 階段三：深度分析
- 根據目標類型調用專門 agent
- 追蹤完整的代碼流程
- 記錄所有關鍵細節

### 階段四：知識補充
- 補充相關的技術概念
- 解釋設計模式和最佳實踐
- 提供領域知識

### 階段五：文件撰寫
- **生成結構化的 Markdown 文件**（優先使用 Write 工具創建 .md 文件）
- 文件保存在 `docs/` 目錄下，遵循命名規範
- 使用 Mermaid 語法繪製流程圖、序列圖和架構圖
- 提供完整的代碼片段、行號引用和詳細說明
- 包含表情符號增強可讀性

### 階段六：品質審核（關鍵！）
- 嚴格審核文件正確性
- 驗證所有代碼引用
- 確保沒有錯誤或遺漏
- **只有通過審核的文件才能交付**### 階段七：交付報告
- 提供完整的分析報告
- 建議後續學習方向
- 指出可以深入分析的部分

## 分析報告範例

### API Endpoint 分析報告

```markdown
# API Endpoint 分析報告：POST /api/orders

## 端點摘要

- **HTTP 方法**：POST
- **URL 路徑**：/api/orders
- **功能**：創建新訂單
- **Controller**：OrderController.java:67
- **需要認證**：是 (JWT Token)
- **需要角色**：ROLE_USER

## 完整請求流程

客戶端請求
    ↓
[1] JWT 認證過濾器 - 驗證 Token
    ↓
[2] OrderController.createOrder()
    ├─ 參數驗證：@Valid CreateOrderRequest
    ├─ 授權檢查：@PreAuthorize
    └─ 調用 Service
        ↓
[3] OrderService.createOrder()
    ├─ 業務驗證
    ├─ 庫存檢查 → InventoryService
    ├─ 價格計算
    ├─ 創建訂單實體
    └─ 調用 Repository
        ↓
[4] OrderRepository.save()
    └─ JPA 持久化
        ↓
[5] 返回 OrderResponse

## 詳細代碼追蹤

### [1] JWT 認證
[詳細說明...]

### [2] Controller 層
[代碼 + 詳細註釋...]

### [3] Service 層業務邏輯
[代碼 + 業務流程說明...]

## 知識補充

### Spring MVC 請求處理
[概念解釋...]

### @Transactional 事務管理
[概念解釋...]

### DTO 模式
[為什麼使用 DTO...]

## 總結與建議
[總結 + 學習建議...]
```

## 適用場景

### 適合使用的情況

1. **新進工程師入職**- 需要快速理解遺留專案
   - 學習專案的架構和設計模式

2. **維護遺留系統**- 需要修改既有功能但不了解邏輯
   - 需要追蹤 bug 的根本原因

3. **技術債務清理**- 需要重構代碼前先理解現狀
   - 需要評估重構的影響範圍

4. **知識轉移**- 資深工程師離職前的知識傳承
   - 團隊內部的技術分享

### 不適合的情況

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
分析 /api/orders POST 創建訂單的完整流程
```

**不好的請求**：
```
分析這個專案
```
（範圍太大，建議拆分）

### 2. 循序漸進

1. 先使用 `/legacy-hero` 掃描整個專案
2. 再針對特定模組使用專門命令
3. 最後深入分析關鍵業務流程

### 3. 保存分析報告

- documentation-writer 會自動生成 Markdown 文件到 `docs/` 目錄
- 這些文件可以直接提交到版本控制系統（Git）
- 作為專案文件的一部分，幫助其他團隊成員理解
- Markdown 格式便於在 GitHub/GitLab 上直接查看
- 支援 Mermaid 圖表，無需額外工具即可渲染

### 4. 結合實際調試

- 分析報告提供理論理解
- 結合實際運行和調試加深理解
- 可以驗證分析報告的正確性

## 品質保證

### 文件審核標準

每份分析文件都會經過以下審核：

1. **代碼一致性驗證**- 所有檔案路徑必須存在
   - 所有行號必須正確
   - 所有代碼片段必須與實際代碼一致

2. **流程完整性檢查**- 調用鏈不能有遺漏
   - 資料流轉必須清楚
   - 異常處理必須記錄

3. **技術準確性驗證**- 框架版本必須正確
   - Annotations 使用必須準確
   - 技術概念解釋必須正確

4. **完整性評估**- 安全機制必須說明
   - 事務邊界必須標註
   - 重要配置必須記錄

**只有通過所有檢查的文件才會交付！**## 疑難排解

### 問題：找不到指定的 endpoint

**解決方案**：
1. 確認 endpoint URL 是否正確
2. 檢查是否使用了 base path
3. 使用 `/legacy-hero` 先掃描專案查看所有端點

### 問題：分析報告太長

這是正常的！詳細的分析報告才能幫助新手完全理解。
- 可以使用 Ctrl+F 搜尋關鍵字
- 可以先看「摘要」部分快速了解
- 可以保存為文件慢慢研讀

### 問題：需要分析多個相關模組

**建議**：
1. 先使用 `/analyze-flow` 分析整體流程
2. 再針對特定元件使用專門命令深入分析

## 版本資訊

- **版本**：1.0.0
- **作者**：Dennis Liu (繁體中文版)
- **適用**：Java Spring Boot 2.x / 3.x
- **最後更新**：2025

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

## 授權

此插件基於 Anthropic 官方 claude-code 插件開發，採用相同授權條款。
