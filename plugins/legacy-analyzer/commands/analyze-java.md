---
description: 分析 Legacy Java Spring Boot 專案並生成教學文件
allowedTools:
  - Task
  - TodoWrite
  - Read
  - Write
  - Glob
  - Grep
  - Bash
---

# Legacy Java Project Analyzer

為給定的 Java Spring Boot 專案生成詳細的分析文件，using multiple specialized agents with confidence-based scoring。

要執行此操作，請精確遵循以下步驟：

## 準備工作

1. 首先使用 TodoWrite 建立待辦事項清單，包含所有階段

2. 創建工作目錄：`.legacy-analysis/session-{timestamp}/`

## 階段 1: 資格預檢與快速掃描

3. 使用 Haiku 代理檢查專案是否適合分析。代理應檢查：
   - 專案根目錄是否存在 `pom.xml` 或 `build.gradle`？
   - 是否包含 Spring Boot 依賴？（檢查 spring-boot-starter）
   - Java 檔案數量是否適中？（使用 Glob 統計 **/*.java，應 < 1000）

   如果不符合任一條件，說明原因並終止。

4. 使用 Haiku 代理快速掃描專案結構。代理應：
   - 使用 Glob 找出所有 .java 檔案並統計數量
   - 使用 Grep 搜尋以下註解並統計數量：
     - `@RestController` 或 `@Controller`
     - `@Service`
     - `@Repository`
     - `@Entity`
   - 讀取 pom.xml 或 build.gradle 獲取：
     - Spring Boot 版本
     - 前 10 個主要依賴
   - 使用 Glob 列出主要 package（src/main/java 下的第一層目錄）

   返回專案摘要 JSON：
   ```json
   {
     "projectType": "Spring Boot",
     "springBootVersion": "2.7.12",
     "buildTool": "Maven",
     "totalJavaFiles": 245,
     "componentCounts": {
       "controllers": 15,
       "services": 20,
       "repositories": 12,
       "entities": 10
     },
     "mainPackages": [
       "com.example.order.controller",
       "com.example.order.service",
       "com.example.order.repository"
     ],
     "keyDependencies": [
       "spring-boot-starter-web",
       "spring-boot-starter-data-jpa",
       "mysql-connector-java"
     ]
   }
   ```

5. 將專案摘要寫入：`.legacy-analysis/session-{timestamp}/01-project-scan.json`

## 階段 2: 多視角並行分析

6. 啟動 **6 個並行 Sonnet 代理**來獨立分析專案。

   **所有代理的共同輸入**：
   - 專案摘要 JSON（來自步驟 4）
   - 專案根目錄路徑

   **所有代理的共同輸出格式**（JSON）：
   ```json
   {
     "analyst": "代理名稱",
     "findings": [
       {
         "finding_id": "分類前綴-編號",
         "type": "發現類型",
         "title": "簡短標題",
         "description": "詳細描述（2-3 句話）",
         "evidence": [
           {
             "file": "檔案相對路徑",
             "lines": "起始行-結束行",
             "snippet": "關鍵程式碼片段（可選）"
           }
         ],
         "importance": "high/medium/low",
         "notes": "額外說明（可選）"
       }
     ],
     "total_findings": 數量
   }
   ```

   **所有代理的重要規則**：
   - ❗ 每個發現必須有實際的檔案路徑和行號作為證據
   - ❗ 使用 Read 工具驗證檔案內容，確保引用正確
   - ❗ 使用 Glob/Grep 輔助搜尋，不要猜測
   - ❗ 如果無法確認，不要包含該發現
   - ❗ 只返回 JSON，不執行 Write 操作
   - ❗ 專注於自己的分析領域，不要越界

---

   **代理 #1：架構分析代理**

   職責：分析專案的整體架構和分層設計

   應分析：
   - Package 組織結構（使用 Glob 掃描目錄）
   - 分層架構識別：
     - Controller 層：處理 HTTP 請求
     - Service 層：業務邏輯
     - Repository 層：資料存取
     - Entity 層：資料模型
   - 識別架構模式（MVC、三層架構、DDD 等）
   - 層與層之間的依賴關係（通過讀取代表性類別）

   應使用工具：
   - Glob: 掃描 package 結構
   - Grep: 搜尋 @RestController, @Service, @Repository, @Entity
   - Read: 讀取 2-3 個代表性類別（每層一個）

   發現類型前綴：`ARCH-`

   發現類型：`architecture`

   預期發現數量：8-15 個

---

   **代理 #2：API 端點分析代理**

   職責：分析所有 REST API 端點和請求處理流程

   應分析：
   - 所有 @RestController 或 @Controller 類別（使用 Grep 找出）
   - 主要 API 端點：
     - HTTP 方法（GET/POST/PUT/DELETE）
     - 路徑和路徑參數
     - 請求/響應格式
   - 主要業務流程：
     - Controller → Service → Repository 的調用鏈
     - 事務管理（@Transactional）
   - 認證授權機制（如果有 Spring Security）
   - 異常處理（@ExceptionHandler, @ControllerAdvice）

   應使用工具：
   - Grep: 搜尋 @RestController, @RequestMapping, @GetMapping, @PostMapping
   - Read: 讀取所有 Controller 類別（或前 10 個如果太多）
   - Grep: 搜尋 @Transactional, @ExceptionHandler

   發現類型前綴：`API-`

   發現類型：`endpoint`

   預期發現數量：15-25 個（視 Controller 數量）

---

   **代理 #3：資料流分析代理**

   職責：分析資料模型和資料流轉

   應分析：
   - 所有 JPA Entity 類別（使用 Grep 找出 @Entity）
   - Entity 之間的關聯關係：
     - @OneToOne, @OneToMany, @ManyToOne, @ManyToMany
     - 關聯的方向和級聯設定
   - 資料流轉路徑：
     - DTO → Entity（轉換邏輯）
     - Entity → Database（Repository 操作）
   - Repository 介面和自定義查詢
   - 資料驗證邏輯（@Valid, @NotNull 等）

   應使用工具：
   - Grep: 搜尋 @Entity, @OneToMany, @ManyToOne
   - Read: 讀取所有 Entity 類別
   - Grep: 搜尋 @Repository, extends JpaRepository
   - Read: 讀取主要 Repository 介面

   發現類型前綴：`DATA-`

   發現類型：`entity` 或 `dataflow`

   預期發現數量：10-20 個

---

   **代理 #4：業務邏輯分析代理**

   職責：分析核心業務邏輯和 Service 層

   應分析：
   - 所有 @Service 類別（使用 Grep 找出）
   - 主要業務方法：
     - 方法簽名和參數
     - 業務規則和驗證
     - 複雜的業務邏輯
   - Service 之間的調用關係（依賴注入）
   - 事務管理：
     - @Transactional 的使用
     - 事務邊界
   - 業務異常處理

   應使用工具：
   - Grep: 搜尋 @Service, @Transactional
   - Read: 讀取所有 Service 類別（或主要的 5-10 個）
   - 分析依賴注入（@Autowired, 建構子注入）

   發現類型前綴：`BIZ-`

   發現類型：`service` 或 `business-logic`

   預期發現數量：15-25 個

---

   **代理 #5：配置分析代理**

   職責：分析專案配置和第三方整合

   應分析：
   - application.yml 或 application.properties：
     - 資料庫配置
     - Server 配置
     - 環境變數
   - Spring Boot 配置類別（@Configuration）：
     - Bean 定義
     - 第三方服務整合
   - Spring Security 配置（如果有）
   - 依賴管理（pom.xml 或 build.gradle）：
     - 主要依賴及版本
     - 第三方庫的用途

   應使用工具：
   - Read: 讀取 application.yml/properties
   - Grep: 搜尋 @Configuration, @Bean
   - Read: 讀取配置類別
   - Read: 讀取 pom.xml 或 build.gradle

   發現類型前綴：`CONF-`

   發現類型：`configuration` 或 `dependency`

   預期發現數量：8-15 個

---

   **代理 #6：模式識別代理**

   職責：識別設計模式和編碼最佳實踐

   應分析：
   - 設計模式的應用：
     - Factory Pattern（工廠模式）
     - Strategy Pattern（策略模式）
     - Builder Pattern（建造者模式）
     - Singleton Pattern（單例模式）
   - Spring 特定模式：
     - Dependency Injection（依賴注入）
     - AOP（面向切面編程，如果有 @Aspect）
   - 異常處理模式：
     - 全域異常處理器（@ControllerAdvice）
     - 自定義異常類別
   - 日誌記錄實踐（Logger 使用）
   - DTO 模式的使用

   應使用工具：
   - Grep: 搜尋常見模式關鍵字（Factory, Strategy, Builder, Singleton）
   - Read: 讀取包含模式的類別
   - Grep: 搜尋 @ControllerAdvice, @Aspect, @Pointcut
   - 分析代碼風格和命名慣例

   發現類型前綴：`PATTERN-`

   發現類型：`pattern` 或 `practice`

   預期發現數量：5-15 個

---

7. 等待所有 6 個代理完成，收集所有輸出

8. 合併所有發現清單為一個 JSON 陣列

9. 將合併的發現清單寫入：`.legacy-analysis/session-{timestamp}/02-findings-raw.json`

10. 統計總發現數量並報告（例如："收集到 102 個發現"）

## 階段 3: 獨立置信度評分

⚠️⚠️⚠️ **CRITICAL - THIS STAGE IS MANDATORY AND CANNOT BE SKIPPED** ⚠️⚠️⚠️

**為什麼這個階段是核心且不可跳過的：**

1. **這是整個插件的靈魂**
   - 置信度評分系統是本插件與其他分析工具的根本差異
   - 沒有評分 = 沒有質量保證 = 無法區分真實發現與幻覺
   - 跳過此階段違反了插件的核心設計原則

2. **防幻覺機制完全依賴此階段**
   - 第二層防護：評分代理使用 Glob 驗證檔案存在
   - 第三層防護：閾值過濾（score >= 75, evidence >= 60）
   - 沒有評分 = 防幻覺機制失效 = 可能產生錯誤文件

3. **成本和時間都非常合理**
   - Haiku 模型速度極快（每個評分 < 1 秒）
   - 100 個評分代理並行執行只需 10-20 秒
   - Haiku 成本極低（相比 Sonnet 便宜 50-100 倍）
   - 即使 200 個發現，總時間也只增加 10-15 秒

4. **不評分的嚴重後果**
   - 最終文件會包含所有未驗證的發現（包括幻覺、錯誤、瑣碎內容）
   - 過濾率 0%（承諾是 40-60%）
   - 無法信任檔案路徑和行號
   - 用戶體驗極差，失去插件價值

**明確的執行要求：**

❌ **絕對禁止以下行為**：
- 以「發現數量太多」為理由跳過評分
- 以「節省時間」為理由跳過評分
- 以「成本考量」為理由跳過評分
- 直接使用未評分的發現生成文件
- 進入階段 4 而不先完成階段 3

✅ **你 MUST 執行以下操作**：
- 對 **每一個發現** 啟動一個獨立的 Haiku 評分代理
- 等待 **所有** 評分代理完成
- 將所有評分結果寫入 `03-scores.json`
- 只有在 `03-scores.json` 存在後才能繼續下一階段

11. **REQUIRED**: 對於步驟 8 中的 **每一個發現**，啟動一個並行 **Haiku 代理**進行評分。
    **DO NOT SKIP ANY FINDINGS**, regardless of the total count.

    **每個評分代理的輸入**：
    - 單個發現 JSON（包含 finding_id, type, title, description, evidence, importance）
    - 專案摘要 JSON（作為上下文）

    **評分任務**：

    從四個維度對發現進行評分（0-100）：

    **a. 證據強度 (Evidence Strength)** - 權重 40%

    評分標準：
    - 90-100 分：完美證據
      - 有精確的檔案路徑和行號
      - 使用 Read 工具驗證檔案存在且內容匹配
      - 代碼片段準確無誤

    - 70-89 分：良好證據
      - 有檔案路徑和行號
      - 使用 Glob 確認檔案存在
      - 描述與代碼基本匹配

    - 50-69 分：基本證據
      - 有檔案路徑但行號範圍過大（> 50 行）
      - 通過推理得出，未直接驗證
      - 可能需要額外確認

    - 30-49 分：弱證據
      - 只有檔案路徑，沒有行號
      - 基於間接證據（如依賴推測）
      - 不確定性較高

    - 0-29 分：無效證據
      - 沒有檔案路徑或檔案不存在
      - 明顯的猜測或假設
      - 幻覺（fabrication）

    **評分方法**：使用 Glob 驗證檔案路徑是否存在。如果時間允許，使用 Read 讀取檔案驗證行號範圍和內容。

    ---

    **b. 重要性 (Importance)** - 權重 30%

    評分標準：
    - 90-100 分：極其重要
      - 核心業務邏輯（如訂單處理、支付流程）
      - 主要架構決策（如分層設計、依賴管理）
      - 新手必須理解的概念
      - 影響整個系統的設計

    - 70-89 分：很重要
      - 重要的業務流程
      - 關鍵的設計模式應用
      - 常見的 CRUD 操作
      - 第三方服務整合

    - 50-69 分：中等重要
      - 輔助功能
      - 一般的配置項目
      - 可選的理解點
      - 工具方法

    - 30-49 分：次要
      - 邊緣功能
      - 細節實現
      - 進階理解點

    - 0-29 分：不重要
      - 瑣碎細節
      - 與業務無關的內容
      - 可以忽略的資訊

    ---

    **c. 完整性 (Completeness)** - 權重 15%

    評分標準：
    - 90-100 分：非常完整
      - 描述清晰易懂
      - 包含完整的流程或調用鏈
      - 有充足的上下文
      - 提供了代碼範例

    - 70-89 分：基本完整
      - 描述清晰
      - 主要流程完整
      - 上下文充足

    - 50-69 分：部分完整
      - 描述較簡略
      - 流程不完整或片段化
      - 缺少部分上下文

    - 30-49 分：不完整
      - 描述模糊
      - 只有流程片段
      - 上下文不足

    - 0-29 分：非常不完整
      - 描述不清
      - 沒有流程資訊
      - 完全缺乏上下文

    ---

    **d. 準確性 (Accuracy)** - 權重 15%

    評分標準：
    - 90-100 分：完全準確
      - 技術描述正確無誤
      - 沒有錯誤或幻覺
      - 可以直接使用

    - 70-89 分：基本準確
      - 主要描述正確
      - 有小的不精確（如版本差異）
      - 需要微調

    - 50-69 分：部分準確
      - 有明顯錯誤
      - 需要修正才能使用
      - 部分資訊可能誤導

    - 30-49 分：不準確
      - 多處錯誤
      - 包含幻覺或猜測
      - 不可信

    - 0-29 分：完全錯誤
      - 完全不正確
      - 大量幻覺
      - 必須丟棄

    ---

    **計算最終分數**：

    ```
    total_score = evidence * 0.4 + importance * 0.3 + completeness * 0.15 + accuracy * 0.15
    ```

    **輸出格式**（JSON）：
    ```json
    {
      "finding_id": "ARCH-001",
      "scores": {
        "evidence": 95,
        "importance": 85,
        "completeness": 90,
        "accuracy": 95
      },
      "total_score": 91.25,
      "confidence_level": "very_high",
      "reasoning": "發現有明確的檔案路徑證據（已用 Glob 驗證存在），描述準確且清晰，對理解三層架構非常重要，新手必須知道。",
      "verified_files": [
        "src/main/java/com/example/order/controller/OrderController.java (verified)"
      ],
      "issues": []
    }
    ```

    **confidence_level 對應**：
    - very_high: total_score >= 85
    - high: 75 <= total_score < 85
    - medium: 60 <= total_score < 75
    - low: 45 <= total_score < 60
    - very_low: total_score < 45

12. **REQUIRED**: 等待 **所有** 評分代理完成，收集所有評分結果。
    不要只收集部分結果，必須等待全部完成。

13. **REQUIRED**: 將評分結果寫入：`.legacy-analysis/session-{timestamp}/03-scores.json`

14. 統計評分分佈（例如："58 個 >= 75, 44 個 < 75"）

## 階段 4: 過濾與結構化整合

🔒 **VALIDATION CHECKPOINT - 在繼續之前必須驗證** 🔒

14.5. **MANDATORY PRE-CHECK**: 在執行任何過濾操作前，你 MUST 先驗證以下條件：

    **檢查 1: 確認評分文件存在**
    ```
    使用 Read 工具檢查文件是否存在：
    .legacy-analysis/session-{timestamp}/03-scores.json
    ```

    **如果文件不存在**，你 MUST：
    - 立即停止執行
    - 輸出錯誤訊息：
      ```
      ❌❌❌ 致命錯誤：階段 3 評分被跳過 ❌❌❌

      檢測到缺少文件：03-scores.json

      這表示階段 3（獨立置信度評分）沒有被執行。
      沒有評分數據，無法進行質量過濾，無法保證最終文件質量。

      請檢查階段 3 的執行日誌，或重新執行完整流程。

      插件設計要求：所有階段必須依序完成，不可跳過。
      ```
    - **DO NOT PROCEED** 到步驟 15

    **檢查 2: 驗證評分數量一致性**

    使用 Read 工具讀取以下兩個文件：
    - `02-findings-raw.json` (原始發現數量)
    - `03-scores.json` (評分數量)

    驗證：評分數量 == 原始發現數量

    **如果數量不一致**，你 MUST：
    - 輸出警告訊息：
      ```
      ⚠️ 警告：評分數量與發現數量不一致

      原始發現: {N} 個
      評分結果: {M} 個
      差異: {N-M} 個發現未被評分

      可能原因：部分評分代理失敗

      將繼續執行，但請注意未評分的發現將被自動過濾。
      ```
    - 對於未評分的發現，自動賦予 total_score = 0（將被過濾）

    **只有在通過所有檢查後**，才能繼續執行步驟 15。

15. **REQUIRED**: 過濾發現，應用以下規則：

    **主要規則**：
    - 保留 total_score >= 75 的發現

    **額外規則**（強制）：
    - 如果 evidence < 60：強制丟棄（即使總分 >= 75）
      理由：沒有足夠證據，可能是幻覺

    - 如果 accuracy < 50：強制丟棄（即使總分 >= 75）
      理由：準確性太低，可能誤導讀者

    **例外規則**（保留）：
    - 如果 importance >= 90 且 evidence >= 70：保留（即使總分 < 75）
      理由：極其重要的發現，證據也足夠

    統計並報告過濾結果（例如："保留 58 個高質量發現，過濾掉 44 個低質量發現，過濾率 43.1%"）

16. 將保留的發現按類別分組：
    - architecture: 架構發現
    - endpoint: API 端點
    - entity: 資料模型
    - dataflow: 資料流轉
    - service: 業務邏輯
    - business-logic: 業務邏輯（同義詞）
    - configuration: 配置
    - dependency: 依賴
    - pattern: 設計模式
    - practice: 編碼實踐

17. 每個類別內按 total_score 降序排序（最高質量在前）

18. 識別發現之間的關聯關係（可選但推薦）：
    - 例如：API-001（創建訂單端點）→ BIZ-005（OrderService.createOrder）→ DATA-003（Order Entity）
    - 建立關聯圖以幫助理解完整流程

19. 生成結構化資料 JSON：
    ```json
    {
      "summary": {
        "total_findings_raw": 102,
        "total_findings_filtered": 58,
        "filter_rate": 0.431,
        "by_category": {
          "architecture": 8,
          "endpoint": 15,
          "entity": 7,
          "dataflow": 3,
          "service": 12,
          "configuration": 7,
          "pattern": 6
        },
        "average_score": 82.5
      },
      "findings_by_category": {
        "architecture": [ /* 發現陣列 */ ],
        "endpoint": [ /* 發現陣列 */ ],
        ...
      },
      "relationships": [
        {
          "from": "API-001",
          "to": ["BIZ-005", "DATA-003"],
          "type": "invokes"
        }
      ]
    }
    ```

20. **REQUIRED**: 將結構化資料寫入：`.legacy-analysis/session-{timestamp}/04-findings-structured.json`

## 階段 5: 教學文件生成

🔒 **FINAL VALIDATION CHECKPOINT - 文件生成前的最後檢查** 🔒

20.5. **MANDATORY FINAL CHECK**: 在啟動文件生成代理前，你 MUST 驗證所有必需文件已就緒：

    **檢查 1: 驗證所有階段的輸出文件存在**

    使用 Read 工具確認以下文件全部存在：
    - `01-project-scan.json` (階段 1 輸出)
    - `02-findings-raw.json` (階段 2 輸出)
    - `03-scores.json` (階段 3 輸出) ← **關鍵文件**
    - `04-findings-structured.json` (階段 4 輸出)

    **如果任何文件缺失**，你 MUST：
    - 立即停止執行
    - 輸出錯誤訊息：
      ```
      ❌❌❌ 致命錯誤：無法生成教學文件 ❌❌❌

      缺少必需的文件：{缺失的文件名}

      這表示前置階段沒有正確完成。
      無法在沒有完整數據的情況下生成教學文件。

      請重新執行完整的分析流程，確保所有階段依序完成。
      ```
    - **DO NOT START** 文件生成代理

    **檢查 2: 驗證結構化發現的質量**

    使用 Read 工具讀取 `04-findings-structured.json`，確認：
    - `summary.total_findings_filtered` > 0（至少有一些高質量發現）
    - `summary.filter_rate` 在 0.2-0.8 之間（過濾率正常）

    **如果過濾後發現數量 = 0**，你 MUST：
    - 輸出警告訊息：
      ```
      ⚠️ 警告：沒有任何發現通過質量過濾

      原始發現: {N} 個
      通過過濾: 0 個

      可能原因：
      1. 分析代理的發現質量極低（證據不足）
      2. 評分標準過於嚴格
      3. 專案過於簡單，沒有足夠的內容可分析

      建議：
      - 檢查 02-findings-raw.json 和 03-scores.json
      - 考慮手動調整過濾閾值（從 75 降至 65）
      - 或手動補充文件內容
      ```
    - 繼續生成文件，但文件內容會很少

    **檢查 3: 禁止使用未評分的發現**

    你 MUST 確認：
    - 文件生成代理的輸入 **只能** 是 `04-findings-structured.json`
    - **絕對禁止** 直接使用 `02-findings-raw.json`
    - **絕對禁止** 添加任何未在結構化發現中的資訊

    **只有在通過所有檢查後**，才能啟動文件生成代理。

21. **REQUIRED**: 使用 **Sonnet 代理**生成教學文件。

    **輸入**：
    - 結構化發現 JSON（來自步驟 20 的 `04-findings-structured.json`）← **唯一允許的輸入來源**
    - 專案摘要 JSON（來自步驟 5 的 `01-project-scan.json`）

    **任務**：

    生成完整的 Markdown 教學文件，假設讀者是完全不了解此專案的新進工程師。

    **文件結構**（必須包含）：

    ### 1. 專案概述
    - 專案基本資訊（名稱、類型、Spring Boot 版本、建構工具）
    - 專案規模（檔案數量、元件統計）
    - 專案結構（主要 package）
    - 核心模組列表

    ### 2. 快速開始
    - 如何運行專案（從 git clone 到 spring-boot:run）
    - 重要端點列表（健康檢查、API 文件）
    - 開發環境要求（JDK、Maven/Gradle、資料庫）

    ### 3. 架構說明
    - 整體架構圖（使用 Mermaid flowchart）
    - 分層設計說明（Controller/Service/Repository/Entity）
    - Package 組織結構
    - 架構優點

    範例 Mermaid 圖：
    ```mermaid
    graph TB
        Client[客戶端請求]
        Controller[Controller 層<br/>處理 HTTP 請求]
        Service[Service 層<br/>業務邏輯處理]
        Repository[Repository 層<br/>資料存取]
        DB[(MySQL 資料庫)]

        Client --> Controller
        Controller --> Service
        Service --> Repository
        Repository --> DB
    ```

    ### 4. API 端點清單

    對於每個重要的 API 端點（從 endpoint 類別的發現）：
    - HTTP 方法和路徑
    - 描述和用途
    - 請求範例（JSON）
    - 響應範例（JSON）
    - 業務流程序列圖（使用 Mermaid sequenceDiagram）
    - 關鍵程式碼片段（含檔案路徑連結）
    - 重要提示（如事務管理、異常處理）

    範例序列圖：
    ```mermaid
    sequenceDiagram
        participant Client
        participant Controller
        participant Service
        participant Repository
        participant DB

        Client->>Controller: POST /api/orders
        Controller->>Service: createOrder(OrderDTO)
        Service->>Service: 驗證庫存
        Service->>Repository: save(Order)
        Repository->>DB: INSERT
        DB-->>Repository: 成功
        Repository-->>Service: Order Entity
        Service-->>Controller: OrderResponseDTO
        Controller-->>Client: 201 Created
    ```

    ### 5. 核心業務流程

    選擇 2-3 個最重要的業務流程（基於 importance 分數）：
    - 流程整體說明
    - 詳細步驟分解
    - 完整序列圖
    - 涉及的類別和方法列表（含檔案路徑連結）
    - 程式碼片段和註解
    - 新手提示

    ### 6. 資料模型

    - Entity 關係圖（使用 Mermaid erDiagram）
    - 對於每個主要 Entity：
      - 資料表名稱
      - 主要欄位說明
      - 關聯關係說明
      - JPA 註解解釋（@Entity, @Table, @OneToMany 等）
      - 程式碼範例

    範例 ER 圖：
    ```mermaid
    erDiagram
        Order ||--o{ OrderItem : contains
        Order {
            Long id PK
            Long customerId
            String status
            Timestamp createdAt
        }
        OrderItem {
            Long id PK
            Long orderId FK
            Long productId
            int quantity
            decimal price
        }

        Customer ||--o{ Order : places
        Customer {
            Long id PK
            String name
            String email
        }
    ```

    ### 7. 關鍵配置

    - 資料庫配置（含 YAML/properties 範例）
    - Spring Security 配置（如果有）
    - 重要的 Bean 配置
    - 環境變數說明

    ### 8. 設計模式與最佳實踐

    對於每個識別出的設計模式：
    - 模式名稱和類型
    - 應用位置（檔案路徑）
    - 程式碼範例
    - 使用此模式的優點
    - 相關的最佳實踐

    ### 9. 新手入門指南

    - **我該從哪裡開始？**
      - 建議的學習順序（10 分鐘理解架構 → 30 分鐘追蹤一個流程 → ...）
      - 推薦先看哪些類別

    - **常見任務指南**
      - 如何添加新的 API 端點
      - 如何修改業務邏輯
      - 如何添加新的 Entity

    - **開發環境設置**
      - 所需工具清單
      - 資料庫設置步驟
      - 環境變數配置
      - 如何運行測試

    - **推薦的學習資源**
      - Spring Boot 官方文件連結
      - Spring Data JPA 文件連結
      - 相關教學資源

    ### 10. 附錄

    - **高質量發現清單**
      - 按類別列出所有發現（含 finding_id 和 score）

    - **文件變更歷史**
      - 初始版本生成時間
      - 後續手動更新記錄區

    - **檔案路徑索引**
      - 所有引用的檔案路徑清單（方便快速導航）

    ---

    **撰寫風格要求**：

    ✅ **假設讀者是新手**
    - 不假設任何先備知識
    - 解釋所有技術術語（如 JPA、DTO、依賴注入）
    - 提供充足的上下文

    ✅ **使用繁體中文**
    - 自然流暢的中文
    - 技術術語保留英文（如 Controller, Service, @Transactional）
    - 適當加入英文原文（如「依賴注入 (Dependency Injection)」）

    ✅ **大量使用圖表**
    - 每個複雜流程都應該有 Mermaid 圖
    - 圖表類型：flowchart（架構圖）、sequenceDiagram（序列圖）、erDiagram（ER 圖）
    - 圖表要清晰、標註完整

    ✅ **包含程式碼範例**
    - 關鍵程式碼片段（使用 ```java 語法高亮）
    - 適當的註解（特別是複雜邏輯）
    - 檔案路徑和行號（格式：`src/.../OrderController.java:67-85`）

    ✅ **可點擊的連結**
    - 所有檔案路徑都使用 Markdown 連結格式（如 `[OrderController.java](src/.../OrderController.java)`）
    - 使用相對路徑

    ✅ **結構清晰**
    - 使用 Markdown 標題階層（#, ##, ###）
    - 使用清單和表格組織資訊
    - 每個章節之間用 `---` 分隔

    ---

    **重要規則**：

    ❗ **CRITICAL RULE: 只使用高質量發現**
    - **MUST** 只能使用 total_score >= 75 的發現（來自 `04-findings-structured.json`）
    - **MUST NOT** 添加任何未在發現清單中的資訊
    - **MUST NOT** 直接使用 `02-findings-raw.json` 中的未評分發現
    - 如果某個面向沒有足夠的發現，明確說明「此部分資訊不足，建議手動補充」

    ❗ **CRITICAL RULE: 所有引用必須可驗證**
    - **MUST**: 每個程式碼範例都必須有檔案路徑
    - **MUST**: 每個流程圖都必須基於實際的發現
    - **MUST NOT**: 編造任何檔案路徑或類別名稱
    - **MUST NOT**: 添加未經驗證的代碼片段

    ❗ **保持客觀**
    - 如實描述專案現況
    - 不過度美化或批評
    - 基於事實陳述

    ❗ **Mermaid 語法正確**
    - 確保所有 Mermaid 圖表語法正確
    - 測試常見的 Mermaid 語法錯誤（如缺少引號、箭頭錯誤）

    ---

    **輸出**：

    返回完整的 Markdown 文件內容（純文本，不需要 JSON 包裝）

22. **REQUIRED**: 將生成的文件寫入：`.legacy-analysis/session-{timestamp}/05-PROJECT-ANALYSIS.md`

23. （可選）生成統計報告並寫入：`.legacy-analysis/session-{timestamp}/session-stats.json`
    ```json
    {
      "session_id": "session-20250125-143022",
      "start_time": "2025-01-25T14:30:22Z",
      "end_time": "2025-01-25T14:36:45Z",
      "duration_seconds": 383,
      "project_info": {
        "name": "Order Management System",
        "type": "Spring Boot",
        "total_java_files": 245
      },
      "analysis_stats": {
        "total_findings_raw": 102,
        "total_findings_filtered": 58,
        "filter_rate": 0.431,
        "average_score": 82.5,
        "by_category": { ... }
      },
      "agent_calls": {
        "qualification_check": 1,
        "quick_scan": 1,
        "analysis_agents": 6,
        "scoring_agents": 102,
        "documentation_generator": 1,
        "total": 111
      },
      "quality_metrics": {
        "file_path_verified_rate": 1.0,
        "average_evidence_score": 87.3,
        "average_importance_score": 78.5
      }
    }
    ```

## 完成

24. 顯示完成摘要，包含：

    ```
    ╔═══════════════════════════════════════════════════════╗
    ║       Legacy Project Analyzer - 分析完成               ║
    ╚═══════════════════════════════════════════════════════╝

    ✅ 所有階段已完成

    📁 工作目錄: .legacy-analysis/session-{timestamp}/

    📄 生成的文件:
      ├─ 01-project-scan.json          (專案掃描摘要)
      ├─ 02-findings-raw.json          (原始發現 102 個)
      ├─ 03-scores.json                (評分結果)
      ├─ 04-findings-structured.json   (結構化發現 58 個)
      ├─ 05-PROJECT-ANALYSIS.md        (最終教學文件) ⭐
      └─ session-stats.json            (統計資訊)

    📊 分析統計:
      - 總執行時間: 6 分 23 秒
      - 代理調用: 111 次 (2 Haiku + 6 Sonnet + 102 Haiku + 1 Sonnet)
      - 發現總數: 102 個
      - 高質量發現: 58 個 (56.9%)
      - 檔案路徑驗證率: 100%
      - 平均置信度分數: 82.5

    🎯 下一步建議:
      1. 閱讀最終文件: 05-PROJECT-ANALYSIS.md
      2. 根據文件理解專案架構和核心流程
      3. 動手運行專案並對照文件調試
      4. 如需深入特定模組，可補充手動分析

    💡 提示:
      - 本文件由 AI 自動生成，基於 58 個高質量發現
      - 所有引用的檔案路徑都已驗證存在
      - 如發現任何錯誤或遺漏，歡迎手動補充

    祝學習順利！ 🚀
    ```

## 重要注意事項

- **使用 TodoWrite 追蹤進度**：在步驟 1 建立待辦清單，並在完成每個階段時更新狀態

- **並行執行代理**（CRITICAL for performance）：
  - 階段 2 的 6 個分析代理 **MUST** 並行啟動（在單個回應中使用多個 Task 工具）
  - 階段 3 的 N 個評分代理 **MUST** 並行啟動（全部一次性啟動）
  - **DO NOT** 等待單個代理完成才啟動下一個
  - **DO NOT** 序列執行（會導致總時間從 7 分鐘變成 30+ 分鐘）

- **錯誤處理**：
  - 如果某個分析代理失敗，記錄錯誤但繼續其他代理
  - 如果某個評分代理失敗，該發現使用預設低分（0）並標記
  - 如果文件生成失敗，嘗試重試一次

- **檔案路徑格式**：
  - 使用相對路徑（相對於專案根目錄）
  - 格式：`src/main/java/com/example/order/controller/OrderController.java`
  - 不要使用絕對路徑或 Windows 路徑格式

- **時間估算**（所有階段都是必須的）：
  - 階段 1: 約 1 分鐘（Haiku）
  - 階段 2: 約 3-4 分鐘（6 個 Sonnet 並行）
  - 階段 3: 約 10-20 秒（N 個 Haiku 並行）← **不可跳過，時間極短**
  - 階段 4: 約 30 秒（主 session 處理）
  - 階段 5: 約 2-3 分鐘（1 個 Sonnet）
  - **總計: 約 7-9 分鐘（中型專案，100 個發現）**

  **關鍵時間說明**：
  - 階段 3 雖然處理 100+ 個發現，但因為 Haiku 極快且並行執行，只需 10-20 秒
  - 跳過階段 3 只能「節省」10-20 秒，但會失去整個插件的核心價值
  - 即使 200 個發現，階段 3 也只需 15-25 秒

- **成本優化**（設計已優化，無需手動調整）：
  - 階段 1: Haiku（快速、便宜）
  - 階段 2: Sonnet（推理能力強，用於深度分析）
  - 階段 3: Haiku（任務簡單、數量多、成本極低）← **100 個 Haiku 調用成本 < 1 個 Sonnet**
  - 階段 4: 無模型調用（主 session 處理）
  - 階段 5: Sonnet（需要創造力和結構化能力）

  **總成本分析**：
  - 中型專案（245 檔案）：約 2 Haiku + 6 Sonnet + 100 Haiku + 1 Sonnet
  - 等價成本：約 10-12 個 Sonnet 調用
  - 相比全用 Sonnet 的簡單方案：節省 60-70% 成本

- **質量保證**：
  - 所有發現都必須有檔案路徑證據
  - 評分代理會驗證檔案存在性
  - 閾值過濾確保只有高質量發現進入最終文件
  - 多層防護機制防止幻覺
