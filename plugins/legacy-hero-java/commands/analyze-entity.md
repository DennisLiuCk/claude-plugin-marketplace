---
description: 快速分析指定的 JPA Entity 及其關聯
---

# 分析 JPA Entity

快速分析指定的 JPA Entity 類別和資料模型。

## 使用方式

```bash
/analyze-entity Order
/analyze-entity User
/analyze-entity Product
```

## 分析內容

1. **Entity 結構**：欄位定義、annotations、validation
2. **關聯映射**：@OneToMany, @ManyToOne 等關聯關係
3. **資料庫映射**：@Table, @Column, 索引和約束
4. **級聯操作**：CascadeType 和 FetchType 配置
5. **關聯 Entity**：追蹤相關的其他 Entity
6. **Repository 查詢**：使用此 Entity 的查詢方法

## 輸出

詳細的 Entity 分析報告，包含：
- Entity 關聯圖
- 資料庫 schema 映射
- 完整的欄位說明
- 關聯關係詳解
- 潛在的 N+1 查詢問題

**注意**：所有分析經過文件審核，確保正確性。
