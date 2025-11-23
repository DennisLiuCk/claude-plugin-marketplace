---
description: 快速分析指定的 REST API endpoint
---

# 分析 API Endpoint

快速分析指定的 Spring Boot REST API endpoint。

## 使用方式

```bash
/analyze-endpoint /api/orders/{id}
```

或

```bash  
/analyze-endpoint POST /api/orders
```

## 分析內容

1. **端點定位**：找到對應的 Controller 和 handler 方法
2. **流程追蹤**：Controller → Service → Repository
3. **資料流分析**：Request → DTO → Entity → Response
4. **安全機制**：認證和授權檢查
5. **異常處理**：可能的異常和錯誤響應
6. **資料庫查詢**：實際執行的 SQL
7. **知識補充**：相關的 Spring Boot 概念

## 輸出

詳細的 API 端點分析報告（繁體中文），包含：
- 完整的請求處理流程
- 每一層的代碼說明
- 流程圖和架構圖
- 技術知識補充

**注意**：所有分析都會經過文件審核，確保正確性。
