# Code Simplifier 程式碼簡化專家

> 簡化和優化程式碼以提升清晰度、一致性和可維護性，同時保持原有功能不變

## 概述

Code Simplifier 是一個專業的程式碼簡化代理，專注於提升程式碼品質而不改變其行為。此代理會分析最近修改的程式碼，並運用最佳實踐來改進其結構、可讀性和可維護性。

## 功能特點

- **功能保持**：確保所有優化都不會改變程式碼的原有行為
- **專案標準遵循**：自動應用專案中定義的編碼標準
- **清晰度提升**：減少不必要的複雜度和巢狀結構
- **平衡優化**：避免過度簡化導致的可維護性問題
- **自主運作**：在程式碼修改後主動進行優化

## 核心原則

### 1. 保持功能完整性

絕不改變程式碼的功能，只改變實現方式。所有原有的功能、輸出和行為都必須保持不變。

### 2. 遵循專案標準

- 使用 ES 模組，搭配適當的 import 排序和副檔名
- 優先使用 `function` 關鍵字而非箭頭函式
- 為頂層函式使用明確的回傳類型註解
- 遵循適當的 React 元件模式，使用明確的 Props 類型
- 使用適當的錯誤處理模式
- 保持一致的命名慣例

### 3. 提升清晰度

- 減少不必要的複雜度和巢狀結構
- 消除冗餘的程式碼和抽象層
- 透過清晰的變數和函式名稱提升可讀性
- 整合相關邏輯
- 避免巢狀的三元運算子，優先使用 switch 或 if/else

### 4. 維持平衡

避免過度簡化可能導致的問題：
- 降低程式碼的清晰度或可維護性
- 產生過於「聰明」而難以理解的解決方案
- 將過多的關注點整合到單一函式或元件中
- 移除有助於程式碼組織的有益抽象層

## 使用方式

### 基本使用

代理會自動分析最近修改的程式碼並提供優化建議：

```
請簡化這段程式碼
```

### 指定範圍

如果需要優化特定範圍的程式碼：

```
請檢視並簡化 src/components 目錄下的所有元件
```

### 配合 PR 審查

在提交 Pull Request 前使用：

```
請在提交前檢視並簡化我修改的所有程式碼
```

## 優化流程

1. **識別**：找出最近修改的程式碼區段
2. **分析**：評估提升優雅度和一致性的機會
3. **應用**：運用專案特定的最佳實踐和編碼標準
4. **驗證**：確保所有功能保持不變
5. **確認**：驗證優化後的程式碼更簡潔且更易於維護
6. **記錄**：僅記錄影響理解的重大變更

## 範例

### 優化前

```javascript
const processData = (items) => {
  const result = items.filter(item => item.active === true).map(item => {
    return item.value > 10 ? item.value * 2 : item.value < 5 ? item.value * 3 : item.value;
  });
  return result;
};
```

### 優化後

```javascript
function processData(items) {
  return items
    .filter(item => item.active)
    .map(item => {
      if (item.value > 10) {
        return item.value * 2;
      }
      if (item.value < 5) {
        return item.value * 3;
      }
      return item.value;
    });
}
```

## 插件結構

```
code-simplifier/
├── .claude-plugin/
│   └── plugin.json      # 插件元資料
├── agents/
│   └── code-simplifier.md  # 代理定義
└── README.md            # 本文件
```

## 作者

- **原作者**：Anthropic
- **繁體中文版**：Claude Plugin Marketplace

## 授權

此插件遵循 MIT 授權條款。

## 相關資源

- [官方 Claude Code 文件](https://docs.claude.com/en/docs/claude-code)
- [原始插件倉庫](https://github.com/anthropics/claude-plugins-official)
