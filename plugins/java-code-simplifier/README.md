# Java Code Simplifier - Java/Spring Boot 程式碼簡化專家

> 專為 Java/Spring Boot 專案設計的程式碼簡化代理，運用企業級最佳實踐提升程式碼品質，同時嚴格保持原有功能不變

## 概述

Java Code Simplifier 是一個專業的程式碼簡化代理，專為 Java 和 Spring Boot 生態系統設計。此代理深諳 Spring Framework 的設計哲學，能夠分析程式碼並運用業界最佳實踐來改進其結構、可讀性和可維護性，同時絕不改變程式碼的行為。

此插件基於官方 `code-simplifier` 插件的 prompt engineering 策略，針對 Java/Spring Boot 專案進行客製化。

## 功能特點

- **功能完整性保證**：絕不改變程式碼的任何行為
- **Spring Boot 最佳實踐**：遵循 Spring 官方推薦的架構模式
- **分層架構驗證**：確保 Controller/Service/Repository 職責分離
- **自主運作**：在程式碼修改後主動進行優化分析

## 核心原則

### 1. 保持功能完整
絕不改變程式碼的行為 - 只改變實現方式。所有 API 契約、業務邏輯結果、異常處理行為和交易邊界都必須維持原狀。

### 2. 遵循 Spring Boot 慣例
- 嚴格的分層架構（Controller → Service → Repository）
- 建構子注入優於欄位注入
- Entity 與 DTO 分離
- 正確使用 Optional
- Service 層管理 @Transactional
- 使用 @ControllerAdvice 統一異常處理
- 避免 N+1 查詢問題

### 3. 提升清晰度
- 減少不必要的複雜度和巢狀結構
- 消除冗餘的程式碼和抽象層
- 使用 Stream API 簡化集合操作
- 選擇清晰而非簡短

### 4. 維持平衡
避免過度簡化：不為了「減少行數」而犧牲可讀性，不移除有助於測試的介面抽象，不創造過於「聰明」的解決方案。

## 使用方式

```
請簡化這個 Service 類別
優化這個 Controller 的程式碼結構
檢視並簡化我最近修改的 Java 程式碼
```

## 插件結構

```
java-code-simplifier/
├── .claude-plugin/
│   └── plugin.json
├── agents/
│   └── java-code-simplifier.md
└── README.md
```

## 作者

- **原版 code-simplifier**：Anthropic
- **Java/Spring Boot 版本**：Claude Plugin Marketplace (社群版)

## 授權

此插件遵循 MIT 授權條款。

## 相關資源

- [Spring Boot 參考指南](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [原版 code-simplifier 插件](../code-simplifier/)
