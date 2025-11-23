---
description: 快速分析指定的 Service 業務邏輯
---

# 分析 Service 業務邏輯

快速分析指定的 Service 類別的業務邏輯和流程。

## 使用方式

```bash
/analyze-service OrderService
/analyze-service PaymentService
/analyze-service UserService
```

## 分析內容

1. **Service 結構**：方法列表、依賴注入
2. **業務邏輯**：核心業務方法的詳細邏輯
3. **事務管理**：@Transactional 配置和影響
4. **服務依賴**：調用的其他 Service
5. **Repository 調用**：資料存取操作
6. **異常處理**：業務驗證和錯誤處理

## 輸出

詳細的 Service 分析報告，包含：
- Service 方法列表
- 業務流程圖
- 事務邊界標註
- 服務間調用關係
- 完整的代碼說明

**注意**：所有分析經過文件審核，確保正確性。
