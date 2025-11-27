# Claude Opus 4.5 遷移插件

> 將您的程式碼和提示詞從 Sonnet 4.x 和 Opus 4.1 遷移至 Opus 4.5

## 概述

此插件提供一個專門的技能，引導您將程式碼和提示詞從 Claude Sonnet 4.0、Sonnet 4.5 或 Opus 4.1 遷移至 Opus 4.5。專注於模型字串更新和針對已知 Opus 4.5 行為差異的提示詞調整。

## 使用方式

在 Claude Code 中說：

```
幫我將程式碼庫遷移至 Opus 4.5
```

或

```
Migrate my codebase to Opus 4.5
```

## 功能特點

### 模型字串更新

自動搜尋並更新以下平台的模型字串：

| 平台 | Opus 4.5 模型字串 |
|------|------------------|
| Anthropic API (1P) | `claude-opus-4-5-20251101` |
| AWS Bedrock | `anthropic.claude-opus-4-5-20251101-v1:0` |
| Google Vertex AI | `claude-opus-4-5@20251101` |
| Azure AI Foundry | `claude-opus-4-5-20251101` |

### 提示詞調整

針對 Opus 4.5 已知的行為差異提供調整建議：

1. **工具過度觸發** - 軟化如「CRITICAL」或「You MUST」等強硬語言
2. **過度工程化防範** - 防止建立不必要的檔案或抽象化
3. **程式碼探索** - 鼓勵在提出解決方案前檢視檔案
4. **前端設計** - 在需要時提升美學品質
5. **思考敏感度** - 在未啟用延伸思考時替換「think」相關術語

### Effort 參數

遷移時自動添加 `effort` 參數設定為 `"high"`，以獲得最佳效能。

## 插件結構

```
claude-opus-4-5-migration/
├── .claude-plugin/
│   └── plugin.json           # 插件元資料
├── README.md                 # 本文件
└── skills/
    └── claude-opus-4-5-migration/
        ├── SKILL.md          # 遷移技能定義
        └── references/
            ├── prompt-snippets.md  # 提示詞片段參考
            └── effort.md           # Effort 參數說明
```

## 注意事項

- **不會遷移**：任何 Haiku 模型（如 `claude-haiku-4-5-20251001`）
- 提示詞調整僅在使用者明確請求或報告特定問題時才會套用
- 預設情況下，僅更新模型字串

## 原始來源

此插件翻譯自 [Anthropic 官方 claude-code 儲存庫](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration)。

## 作者

- **原作者**：William Hu (whu@anthropic.com)
- **繁體中文翻譯**：Claude Plugin Marketplace 團隊
