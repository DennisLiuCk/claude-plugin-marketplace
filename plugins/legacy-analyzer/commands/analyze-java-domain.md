---
description: 分析 Legacy Java Spring Boot 專案中的特定領域邏輯與業務流程
allowed-tools:
  - Task
  - TodoWrite
  - Read
  - Write
  - Glob
  - Grep
  - Bash
---

# Legacy Java Domain Analyzer

針對使用者指定的領域/功能關鍵字，深度分析 Java Spring Boot 專案中的相關邏輯與完整調用鏈。

**使用方式**：
```
/legacy-analyzer:analyze-java-domain 請分析商品建立的流程
/legacy-analyzer:analyze-java-domain 分析訂單取消邏輯
/legacy-analyzer:analyze-java-domain 整理用戶註冊流程
```

**與 analyze-java 的差異**：
- `analyze-java`：掃描全專案，生成完整文件（7-9 分鐘）
- `analyze-java-domain`：定向搜尋特定領域，深度追蹤調用鏈（3-5 分鐘）

---

## 搜尋範圍限制

**只搜尋以下檔案類型**：
- `.java` - Java 原始碼（Controller, Service, Repository, Entity 等）
- `.xml` - MyBatis Mapper 檔案（SQL 查詢邏輯）

**排除的檔案**：
- `pom.xml` - Maven 依賴定義
- `build.gradle` - Gradle 依賴定義
- `.yml` / `.yaml` / `.properties` - 配置檔（與領域邏輯無關）

**Grep 搜尋時必須使用 glob 參數限制範圍**：
```
# 正確方式
Grep: pattern="關鍵字" glob="*.java"
Grep: pattern="關鍵字" glob="*.xml" （排除 pom.xml 的結果）

# 錯誤方式（不要這樣做）
Grep: pattern="關鍵字" （會搜尋所有檔案）
```

---

要執行此操作，請精確遵循以下步驟：

## 準備工作

1. **解析使用者輸入**，識別：
   - **領域關鍵字**（Domain Keywords）：如「商品建立」、「訂單取消」、「用戶註冊」
   - **搜尋關鍵字**（Search Keywords）：從領域關鍵字推導出可能的：
     - 中文詞彙：商品、產品、建立、新增、創建
     - 英文詞彙：Product, Item, Goods, Create, Add, Insert
     - 方法名：createProduct, addProduct, insertProduct, saveProduct
     - 類別名：ProductController, ProductService, ProductRepository
     - API 路徑：/product, /products, /api/product

   **輸出搜尋策略 JSON**：
   ```json
   {
     "user_query": "商品建立的流程",
     "domain": "商品建立",
     "search_keywords": {
       "chinese": ["商品", "產品", "建立", "新增", "創建"],
       "english": ["Product", "Item", "Goods", "Create", "Add", "Save"],
       "method_patterns": ["create.*Product", "add.*Product", "save.*Product", "insert.*Product"],
       "class_patterns": ["Product.*Controller", "Product.*Service", "Product.*Repository"],
       "api_patterns": ["/product", "/products", "POST.*product"]
     }
   }
   ```

2. 使用 TodoWrite 建立待辦事項清單

3. 創建工作目錄：`.legacy-analysis/domain-{keyword}-{timestamp}/`
   - keyword：領域關鍵字的英文簡寫（如 product-create）

---

## 階段 1: 快速資格檢查與入口點發現

4. 使用 **Haiku 代理**快速檢查專案並找出入口點：

   **代理任務**：
   - 確認是 Spring Boot 專案（檢查 pom.xml 或 build.gradle）
   - 使用 Grep 搜尋所有搜尋關鍵字，統計匹配數量
   - 識別最可能的**入口點**（Entry Points）：
     - Controller 類別中包含關鍵字的方法
     - API 端點（@RequestMapping, @PostMapping, @GetMapping）

   **搜尋策略**（必須限制檔案類型）：
   ```
   # 搜尋 Controller 中的相關端點（只搜尋 .java）
   Grep: pattern="@(Post|Put|Get|Delete)Mapping.*product" glob="*.java"
   Grep: pattern="@RequestMapping.*product" glob="*.java"

   # 搜尋 Service 中的相關方法（只搜尋 .java）
   Grep: pattern="(create|add|save|insert).*Product" glob="*.java"

   # 搜尋類別定義（只搜尋 .java）
   Grep: pattern="class.*Product.*(Controller|Service|Repository)" glob="*.java"

   # 搜尋 MyBatis Mapper 中的相關 SQL（只搜尋 .xml，排除 pom.xml）
   Grep: pattern="<(select|insert|update|delete).*product" glob="*.xml"
   # 注意：過濾結果時排除 pom.xml
   ```

   **輸出入口點 JSON**：
   ```json
   {
     "project_valid": true,
     "total_matches": 45,
     "entry_points": [
       {
         "type": "controller",
         "file": "src/main/java/com/example/controller/ProductController.java",
         "method": "createProduct",
         "http_method": "POST",
         "path": "/api/products",
         "line": 67
       },
       {
         "type": "controller",
         "file": "src/main/java/com/example/controller/ProductController.java",
         "method": "addProduct",
         "http_method": "POST",
         "path": "/api/products/add",
         "line": 112
       }
     ],
     "related_classes": [
       "ProductController",
       "ProductService",
       "ProductServiceImpl",
       "ProductRepository",
       "Product",
       "ProductDTO"
     ]
   }
   ```

   **如果匹配數量 = 0**，輸出建議並終止：
   ```
   ❌ 找不到與「{領域關鍵字}」相關的程式碼

   建議嘗試：
   1. 使用不同的關鍵字（如「商品」改為「Product」或「Item」）
   2. 確認專案中是否有此功能
   3. 使用 /legacy-analyzer:analyze-java 進行全專案掃描
   ```

5. 將入口點資訊寫入：`.legacy-analysis/domain-{keyword}-{timestamp}/01-entry-points.json`

---

## 階段 2: 深度調用鏈追蹤

6. 對於每個入口點，啟動一個 **Sonnet 代理**進行深度追蹤。

   **如果入口點 <= 3 個**：全部並行啟動
   **如果入口點 > 3 個**：只追蹤最重要的 3 個（根據 HTTP 方法優先級：POST > PUT > DELETE > GET）

   **每個追蹤代理的任務**：

   從入口點開始，遞歸追蹤完整的調用鏈：

   ```
   Controller.method()
     ↓ 調用
   Service.method()
     ↓ 調用
   Repository.method()
     ↓ 操作
   Entity
   ```

   **追蹤步驟**：

   a. **讀取入口 Controller 方法**：
      - 使用 Read 讀取 Controller 檔案（.java）
      - 找到目標方法
      - 識別方法內調用的 Service

   b. **追蹤 Service 層**：
      - 讀取 Service 介面和實現類別（.java）
      - 分析業務邏輯
      - 識別調用的 Repository 和其他 Service

   c. **追蹤 Repository 層**：
      - 讀取 Repository 介面（.java）
      - 識別自定義查詢方法
      - **如果使用 MyBatis**：搜尋對應的 Mapper XML 檔案
        ```
        # 根據 Repository/Mapper 介面名稱搜尋對應的 XML
        Glob: pattern="**/ProductMapper.xml"
        # 或搜尋 XML 中的 namespace
        Grep: pattern="namespace.*ProductMapper" glob="*.xml"
        ```

   d. **追蹤 MyBatis Mapper XML**（如果存在）：
      - 讀取 Mapper XML 檔案
      - 分析 SQL 語句（select, insert, update, delete）
      - 識別動態 SQL（if, choose, foreach）
      - 記錄 resultMap 和參數映射

   e. **分析相關 Entity**：
      - 讀取涉及的 Entity 類別（.java）
      - 分析欄位和關聯關係

   f. **識別橫切關注點**：
      - @Transactional 事務邊界
      - 異常處理
      - 驗證邏輯（@Valid）
      - 日誌記錄

   **輸出調用鏈 JSON**：
   ```json
   {
     "entry_point": {
       "file": "ProductController.java",
       "method": "createProduct",
       "line": 67
     },
     "call_chain": [
       {
         "level": 0,
         "type": "controller",
         "class": "ProductController",
         "method": "createProduct(ProductDTO)",
         "file": "src/.../ProductController.java",
         "lines": "67-85",
         "annotations": ["@PostMapping", "@Valid"],
         "description": "接收商品建立請求，驗證輸入",
         "calls": ["productService.createProduct"]
       },
       {
         "level": 1,
         "type": "service",
         "class": "ProductServiceImpl",
         "method": "createProduct(ProductDTO)",
         "file": "src/.../ProductServiceImpl.java",
         "lines": "45-78",
         "annotations": ["@Transactional"],
         "description": "核心業務邏輯：檢查商品名稱重複、設定預設值、保存商品",
         "calls": ["productRepository.existsByName", "productRepository.save"],
         "business_rules": [
           "商品名稱不可重複",
           "價格必須大於 0",
           "庫存預設為 0"
         ]
       },
       {
         "level": 2,
         "type": "repository",
         "class": "ProductRepository",
         "method": "save(Product)",
         "file": "src/.../ProductRepository.java",
         "lines": "12",
         "description": "JPA 內建方法，保存 Entity 到資料庫",
         "calls": []
       },
       {
         "level": 2,
         "type": "mybatis-mapper",
         "class": "ProductMapper",
         "method": "insertProduct",
         "file": "src/main/resources/mapper/ProductMapper.xml",
         "lines": "25-35",
         "sql_type": "insert",
         "description": "MyBatis INSERT 語句，將商品資料插入 products 表",
         "sql_snippet": "INSERT INTO products (name, price, stock) VALUES (#{name}, #{price}, #{stock})",
         "dynamic_sql": false,
         "calls": []
       }
     ],
     "mybatis_mappers": [
       {
         "interface": "ProductMapper.java",
         "xml": "src/main/resources/mapper/ProductMapper.xml",
         "statements": [
           {"id": "insertProduct", "type": "insert", "line": 25},
           {"id": "selectByName", "type": "select", "line": 40}
         ]
       }
     ],
     "entities_involved": [
       {
         "class": "Product",
         "file": "src/.../entity/Product.java",
         "table": "products",
         "key_fields": ["id", "name", "price", "stock", "categoryId"]
       },
       {
         "class": "ProductDTO",
         "file": "src/.../dto/ProductDTO.java",
         "purpose": "請求/響應資料傳輸物件"
       }
     ],
     "cross_cutting": {
       "transaction": "@Transactional on ProductServiceImpl.createProduct",
       "validation": "@Valid on request body",
       "exception_handling": "throws ProductAlreadyExistsException"
     }
   }
   ```

   **重要規則**：
   - ❗ 每個方法引用必須有實際檔案路徑和行號
   - ❗ 使用 Read 驗證每個檔案內容
   - ❗ 如果追蹤到第三方庫（如 JpaRepository），標記為「框架內建」不再深入
   - ❗ 最大追蹤深度：5 層（防止無限遞歸）
   - ❗ 只返回 JSON，不執行 Write 操作
   - ❗ **只讀取 .java 和 .xml 檔案**（排除 pom.xml）
   - ❗ MyBatis Mapper XML 通常位於 `src/main/resources/mapper/` 或類似目錄

7. 等待所有追蹤代理完成，收集結果

8. 合併所有調用鏈並寫入：`.legacy-analysis/domain-{keyword}-{timestamp}/02-call-chains.json`

---

## 階段 3: 發現提取與評分

9. 從調用鏈中提取**發現（Findings）**：

   將調用鏈轉換為結構化發現，每個發現代表一個重要的知識點：

   **發現類型**：
   - `entry-point`：API 入口點
   - `business-logic`：業務邏輯
   - `data-operation`：資料操作
   - `validation`：驗證規則
   - `transaction`：事務管理
   - `exception`：異常處理
   - `entity`：資料模型
   - `mybatis-sql`：MyBatis SQL 語句（來自 .xml mapper）
   - `mybatis-dynamic`：MyBatis 動態 SQL（if, choose, foreach）

   **發現格式**（與 analyze-java 相容）：
   ```json
   {
     "finding_id": "DOMAIN-001",
     "type": "entry-point",
     "title": "商品建立 API 端點",
     "description": "POST /api/products 端點接收商品建立請求，使用 @Valid 驗證輸入的 ProductDTO",
     "evidence": [
       {
         "file": "src/main/java/com/example/controller/ProductController.java",
         "lines": "67-85",
         "snippet": "@PostMapping\npublic ResponseEntity<Product> createProduct(@Valid @RequestBody ProductDTO dto)"
       }
     ],
     "importance": "high",
     "call_chain_ref": "chain-1"
   }
   ```

10. 對每個發現啟動 **Haiku 代理**進行評分（與 analyze-java 相同的評分機制）：

    **評分維度**：
    - 證據強度 (40%)：檔案路徑驗證、行號準確性
    - 重要性 (30%)：對理解領域邏輯的重要程度
    - 完整性 (15%)：描述是否清晰完整
    - 準確性 (15%)：技術描述是否正確

    **輸出格式**：
    ```json
    {
      "finding_id": "DOMAIN-001",
      "scores": {
        "evidence": 95,
        "importance": 90,
        "completeness": 85,
        "accuracy": 95
      },
      "total_score": 92.25,
      "confidence_level": "very_high"
    }
    ```

11. ⚠️ **MANDATORY**: 等待所有評分完成，不可跳過

12. 將評分結果寫入：`.legacy-analysis/domain-{keyword}-{timestamp}/03-scores.json`

---

## 階段 4: 過濾與整理

13. 應用過濾規則（與 analyze-java 相同）：
    - 保留 total_score >= 75
    - evidence < 60 強制丟棄
    - accuracy < 50 強制丟棄
    - importance >= 90 且 evidence >= 70 例外保留

14. 按調用鏈順序組織發現：
    - 將發現按其在調用鏈中的位置排序
    - 標記發現之間的關聯關係

15. 寫入結構化資料：`.legacy-analysis/domain-{keyword}-{timestamp}/04-structured.json`

---

## 階段 5: 領域文件生成

16. 使用 **Sonnet 代理**生成領域分析文件：

    **輸入**：
    - 結構化發現 JSON（04-structured.json）
    - 調用鏈 JSON（02-call-chains.json）
    - 入口點 JSON（01-entry-points.json）
    - 使用者原始查詢

    **文件結構**：

    ### 1. 領域概述
    - 領域名稱和簡介
    - 涉及的主要功能
    - 相關 API 端點列表

    ### 2. 核心流程圖
    - 使用 Mermaid flowchart 展示整體流程
    - 使用 Mermaid sequenceDiagram 展示詳細調用序列

    範例：
    ```mermaid
    sequenceDiagram
        participant Client as 客戶端
        participant Controller as ProductController
        participant Service as ProductService
        participant Repository as ProductRepository
        participant DB as 資料庫

        Client->>Controller: POST /api/products
        Controller->>Controller: @Valid 驗證 ProductDTO
        Controller->>Service: createProduct(dto)
        Service->>Service: 檢查商品名稱是否重複
        Service->>Repository: existsByName(name)
        Repository->>DB: SELECT
        DB-->>Repository: false
        Service->>Repository: save(product)
        Repository->>DB: INSERT
        DB-->>Repository: Product
        Repository-->>Service: Product
        Service-->>Controller: Product
        Controller-->>Client: 201 Created
    ```

    ### 3. 調用鏈詳解
    對於每一層調用：
    - 類別和方法名稱
    - 檔案路徑（可點擊連結）
    - 程式碼片段
    - 功能說明
    - 重要註解（@Transactional, @Valid 等）

    ### 4. 業務規則
    - 列出所有識別出的業務規則
    - 每條規則的程式碼位置
    - 規則的驗證方式

    ### 5. 資料模型
    - 涉及的 Entity 類別
    - Entity 關係圖（Mermaid erDiagram）
    - 主要欄位說明

    ### 6. 異常處理
    - 可能拋出的異常
    - 異常處理邏輯
    - 錯誤響應格式

    ### 7. 新手指南
    - 如何修改此流程
    - 相關檔案清單
    - 測試此功能的方式

    ### 8. 附錄
    - 發現清單（含評分）
    - 檔案路徑索引

    **撰寫風格**：
    - 使用繁體中文
    - 假設讀者不了解此專案
    - 大量使用圖表
    - 所有程式碼引用必須有檔案路徑

17. 將文件寫入：`.legacy-analysis/domain-{keyword}-{timestamp}/05-DOMAIN-ANALYSIS.md`

---

## 完成

18. 顯示完成摘要：

    ```
    ╔═══════════════════════════════════════════════════════════╗
    ║     Legacy Domain Analyzer - 領域分析完成                   ║
    ╚═══════════════════════════════════════════════════════════╝

    🎯 分析領域: {領域關鍵字}

    📁 工作目錄: .legacy-analysis/domain-{keyword}-{timestamp}/

    📄 生成的文件:
      ├─ 01-entry-points.json      (入口點 {N} 個)
      ├─ 02-call-chains.json       (調用鏈 {M} 條)
      ├─ 03-scores.json            (評分結果)
      ├─ 04-structured.json        (結構化發現 {K} 個)
      └─ 05-DOMAIN-ANALYSIS.md     (領域分析文件) ⭐

    📊 分析統計:
      - 總執行時間: {X} 分 {Y} 秒
      - 追蹤的調用鏈: {M} 條
      - 發現總數: {N} 個
      - 高質量發現: {K} 個
      - 平均置信度: {score}

    🔗 主要入口點:
      1. POST /api/products → ProductController.createProduct
      2. ...

    🎯 下一步建議:
      1. 閱讀領域分析文件: 05-DOMAIN-ANALYSIS.md
      2. 對照程式碼理解完整流程
      3. 如需分析其他領域，再次執行此命令
      4. 如需全專案分析，使用 /legacy-analyzer:analyze-java

    💡 提示:
      - 本文件專注於「{領域關鍵字}」相關邏輯
      - 所有檔案路徑都已驗證存在
      - 調用鏈已追蹤到 Repository 層
    ```

---

## 重要注意事項

- **並行執行**：
  - 階段 2 的追蹤代理（最多 3 個）並行啟動
  - 階段 3 的評分代理全部並行啟動

- **與 analyze-java 的互補性**：
  - 先用 `analyze-java-domain` 理解特定功能
  - 如需全局視角，再用 `analyze-java`
  - 兩者輸出格式相容，可以合併

- **搜尋策略優化**：
  - 使用多種關鍵字變體（中英文、駝峰、下劃線）
  - 使用正則表達式匹配方法名模式
  - 從 Controller 開始追蹤，確保找到完整流程

- **深度優先 vs 廣度優先**：
  - 此命令採用深度優先策略
  - 完整追蹤一條調用鏈後再追蹤下一條
  - 最大深度 5 層，避免過度追蹤

- **時間估算**：
  - 階段 1: 約 30 秒（Haiku 快速掃描）
  - 階段 2: 約 2-3 分鐘（Sonnet 深度追蹤，最多 3 條鏈）
  - 階段 3: 約 10-20 秒（Haiku 評分）
  - 階段 4: 約 10 秒（主 session 處理）
  - 階段 5: 約 1-2 分鐘（Sonnet 文件生成）
  - **總計: 約 3-5 分鐘**
