---
description: 高效分析 Java Spring Boot 專案的調用鏈與流程圖（單一檔案輸出）
allowed-tools:
  - Task
  - TodoWrite
  - Read
  - Write
  - Glob
  - Grep
  - Bash
---

# Legacy Java Domain Flow Analyzer

專注於**調用鏈追蹤與流程圖生成**的高效領域分析工具。

**使用方式**：
```
/legacy-analyzer:analyze-java-domain-flow 商品建立
/legacy-analyzer:analyze-java-domain-flow 訂單取消
/legacy-analyzer:analyze-java-domain-flow 用戶登入
```

**與 analyze-java-domain 的差異**：
| 比較項目 | analyze-java-domain | analyze-java-domain-flow |
|---------|---------------------|--------------------------|
| 輸出檔案 | 6 個 Markdown 檔案 (~850行) | 單一檔案 (~300行) |
| 執行時間 | 4-6 分鐘 | 2-3 分鐘 |
| 核心內容 | 完整領域文件 | 調用鏈 + 流程圖 |
| 資料模型 | 詳細 DTO/Entity 說明 | 僅列出涉及類別 |
| 業務規則 | 完整規則文件 | 不包含 |

---

## 搜尋範圍

**只搜尋**：`.java`、`.xml`（MyBatis Mapper）
**排除**：`pom.xml`、`.yml`、`.properties`

---

要執行此操作，請精確遵循以下步驟：

## 階段 1: 入口點發現（Haiku，~30秒）

1. **解析使用者輸入**，產生搜尋策略：

   ```json
   {
     "domain": "商品建立",
     "keywords": {
       "chinese": ["商品", "產品", "建立", "新增"],
       "english": ["Product", "Item", "Create", "Add", "Save"],
       "patterns": ["create.*Product", "add.*Product", "Product.*Controller"]
     }
   }
   ```

2. 使用 **Haiku 代理**快速定位入口點：

   **搜尋策略**（必須限制檔案類型）：
   ```
   Grep: pattern="@(Post|Put|Get|Delete)Mapping.*{keyword}" glob="*.java"
   Grep: pattern="class.*{keyword}.*(Controller|Service)" glob="*.java"
   ```

   **輸出入口點 JSON**：
   ```json
   {
     "entry_points": [
       {
         "file": "ProductController.java",
         "method": "createProduct",
         "http": "POST /api/products",
         "line": 67
       }
     ],
     "related_classes": ["ProductController", "ProductService", "ProductRepository"]
   }
   ```

3. **如果找不到入口點**，終止並建議：
   ```
   找不到與「{關鍵字}」相關的程式碼。
   建議：使用英文關鍵字如 "Product" 或 "Order"
   ```

---

## 階段 2: 調用鏈追蹤（Sonnet，~1-2分鐘）

4. 對每個入口點（最多 3 個），啟動 **Sonnet 代理**並行追蹤。

   **追蹤規則**：
   - 從 Controller → Service → Repository → MyBatis XML
   - 最大深度：5 層
   - 只追蹤專案內程式碼（遇到框架類別標記為「框架內建」停止）

   **追蹤步驟**：

   a. 讀取 Controller 方法，找出調用的 Service
   b. 讀取 Service 實現類別，找出調用的 Repository/其他 Service
   c. 讀取 Repository，識別 JPA 方法或 MyBatis Mapper
   d. 如果是 MyBatis，讀取對應的 XML Mapper 檔案

   **輸出調用鏈 JSON**：
   ```json
   {
     "chain_id": "chain-1",
     "entry": "POST /api/products → ProductController.createProduct",
     "nodes": [
       {
         "level": 0,
         "layer": "Controller",
         "class": "ProductController",
         "method": "createProduct(ProductDTO)",
         "file": "src/.../ProductController.java:67-85",
         "calls": ["productService.create"]
       },
       {
         "level": 1,
         "layer": "Service",
         "class": "ProductServiceImpl",
         "method": "create(ProductDTO)",
         "file": "src/.../ProductServiceImpl.java:45-78",
         "annotations": ["@Transactional"],
         "logic": "檢查名稱重複 → 轉換 DTO → 保存",
         "calls": ["productRepo.existsByName", "productRepo.save"]
       },
       {
         "level": 2,
         "layer": "Repository",
         "class": "ProductRepository",
         "method": "save(Product)",
         "file": "src/.../ProductRepository.java:12",
         "type": "JPA 內建方法"
       }
     ],
     "classes_involved": ["ProductController", "ProductServiceImpl", "ProductRepository", "Product", "ProductDTO"]
   }
   ```

5. 收集所有調用鏈結果

---

## 階段 3: 流程驗證與評分（Haiku，~20秒）

6. 對每條調用鏈啟動 **Haiku 代理**進行驗證評分：

   **驗證維度**：
   - **路徑完整性 (40%)**：調用鏈是否從入口到資料層完整
   - **證據準確性 (40%)**：檔案路徑和行號是否正確
   - **邏輯清晰度 (20%)**：流程描述是否清楚

   **輸出評分 JSON**：
   ```json
   {
     "chain_id": "chain-1",
     "scores": {
       "completeness": 95,
       "accuracy": 90,
       "clarity": 85
     },
     "total": 91,
     "status": "verified"
   }
   ```

   **狀態判定**：
   - `total >= 80`：verified (已驗證)
   - `total >= 60`：partial (部分驗證)
   - `total < 60`：unverified (未驗證，標記警告)

---

## 階段 4: 流程圖與文件生成（Sonnet，~1分鐘）

7. 啟動 **Sonnet 代理**生成單一 Markdown 文件。

   **文件結構**（目標 ~300 行）：

   ```markdown
   # {領域名稱} 調用鏈分析

   > 自動生成於 {timestamp} | 驗證狀態: {N} 條已驗證

   ## 快速概覽

   | 項目 | 數值 |
   |------|------|
   | 入口點 | {N} 個 |
   | 調用鏈 | {M} 條 |
   | 涉及類別 | {K} 個 |
   | 平均深度 | {D} 層 |

   ## 入口點總覽

   | HTTP 方法 | 路徑 | Controller.方法 | 驗證狀態 |
   |-----------|------|-----------------|----------|
   | POST | /api/products | ProductController.createProduct | verified |

   ---

   ## 調用鏈 1: {簡短描述}

   **入口**: `POST /api/products` → `ProductController.createProduct`
   **狀態**: verified (91分)

   ### 流程圖

   ```mermaid
   sequenceDiagram
       participant C as Controller
       participant S as Service
       participant R as Repository
       participant DB as Database

       C->>S: productService.create(dto)
       S->>S: 檢查名稱重複
       S->>R: productRepo.existsByName(name)
       R->>DB: SELECT EXISTS
       DB-->>R: boolean
       R-->>S: false
       S->>R: productRepo.save(product)
       R->>DB: INSERT
       DB-->>R: Product
       R-->>S: Product
       S-->>C: ProductDTO
   ```

   ### 調用層級

   | 層級 | 類別.方法 | 檔案位置 | 說明 |
   |------|----------|----------|------|
   | 0 | ProductController.createProduct | ProductController.java:67 | 接收請求 |
   | 1 | ProductServiceImpl.create | ProductServiceImpl.java:45 | 業務邏輯 |
   | 2 | ProductRepository.save | ProductRepository.java:12 | 資料存取 |

   ### 關鍵邏輯 (`ProductServiceImpl.java:50-55`)

   ```java
   if (productRepo.existsByName(dto.getName())) {
       throw new ProductExistsException();
   }
   Product product = mapper.toEntity(dto);
   return productRepo.save(product);
   ```

   ---

   ## 整體架構圖

   ```mermaid
   flowchart TD
       subgraph Controller Layer
           A[ProductController]
       end
       subgraph Service Layer
           B[ProductServiceImpl]
       end
       subgraph Repository Layer
           C[ProductRepository]
       end
       subgraph Database
           D[(products)]
       end

       A -->|createProduct| B
       B -->|existsByName| C
       B -->|save| C
       C --> D
   ```

   ---

   ## 涉及類別清單

   | 類別 | 類型 | 檔案位置 |
   |------|------|----------|
   | ProductController | Controller | src/.../ProductController.java |
   | ProductServiceImpl | Service | src/.../ProductServiceImpl.java |
   | ProductRepository | Repository | src/.../ProductRepository.java |
   | Product | Entity | src/.../Product.java |
   | ProductDTO | DTO | src/.../ProductDTO.java |

   ---

   ## 驗證摘要

   | 調用鏈 | 完整性 | 準確性 | 清晰度 | 總分 | 狀態 |
   |--------|--------|--------|--------|------|------|
   | chain-1: 建立商品 | 95 | 90 | 85 | 91 | verified |
   ```

   **文件撰寫規則**：
   - 使用繁體中文
   - 每條調用鏈必須有 **Mermaid sequenceDiagram**
   - 文件末尾必須有 **整體架構 flowchart**
   - 程式碼片段限制 5-10 行
   - 所有檔案引用必須包含行號
   - **禁止**：改善建議、效能優化、測試策略

8. 將文件寫入：`.legacy-analysis/flow-{keyword}-{timestamp}/DOMAIN-FLOW.md`

---

## 完成

9. 顯示完成摘要：

   ```
   ╔═══════════════════════════════════════════════════════════╗
   ║     Domain Flow Analyzer - 分析完成                        ║
   ╚═══════════════════════════════════════════════════════════╝

   🎯 分析領域: {領域關鍵字}

   📁 輸出位置: .legacy-analysis/flow-{keyword}-{timestamp}/DOMAIN-FLOW.md

   📊 分析結果:
     - 入口點: {N} 個
     - 調用鏈: {M} 條 (已驗證: {V} 條)
     - 涉及類別: {K} 個
     - 平均驗證分數: {score}

   📈 調用鏈概覽:
     1. POST /api/products → ProductController.createProduct [91分]
     2. ...

   🔗 快速導覽:
     - 整體架構圖: DOMAIN-FLOW.md#整體架構圖
     - 調用鏈詳解: DOMAIN-FLOW.md#調用鏈-1-{描述}

   💡 特色:
     - 單一檔案輸出（約 300 行）
     - 包含 Mermaid 序列圖與架構圖
     - 所有調用鏈經過驗證評分
   ```

---

## 執行時間估算

| 階段 | 時間 | 模型 |
|------|------|------|
| 入口點發現 | ~30秒 | Haiku |
| 調用鏈追蹤 | ~1-2分鐘 | Sonnet (並行) |
| 流程驗證 | ~20秒 | Haiku (並行) |
| 文件生成 | ~1分鐘 | Sonnet |
| **總計** | **~2-3分鐘** | |

---

## 與 analyze-java-domain 的配合使用

```
場景 1: 快速了解流程
  → 使用 analyze-java-domain-flow（2-3分鐘）
  → 獲得調用鏈圖表

場景 2: 深度了解領域
  → 先用 analyze-java-domain-flow 掌握流程
  → 再用 analyze-java-domain 獲得完整文件
```

---

## 重要注意事項

- **核心輸出**：調用鏈 + Mermaid 流程圖（不包含資料模型、業務規則詳解）
- **單一檔案**：所有內容整合到一個 Markdown 檔案
- **驗證機制**：每條調用鏈都有驗證評分，確保準確性
- **效率優先**：比 analyze-java-domain 快約 50%
