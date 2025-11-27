---
name: claude-opus-4-5-migration
description: 將提示詞和程式碼從 Claude Sonnet 4.0、Sonnet 4.5 或 Opus 4.1 遷移至 Opus 4.5。當使用者想要更新其程式碼庫、提示詞或 API 呼叫以使用 Opus 4.5 時使用。處理模型字串更新和針對已知 Opus 4.5 行為差異的提示詞調整。不會遷移 Haiku 4.5。
---

# Opus 4.5 遷移指南

從 Sonnet 4.0、Sonnet 4.5 或 Opus 4.1 一次性遷移至 Opus 4.5。

## 遷移工作流程

1. 搜尋程式碼庫中的模型字串和 API 呼叫
2. 將模型字串更新為 Opus 4.5（參見下方平台特定字串）
3. 移除不支援的 beta 標頭
4. 添加設定為 `"high"` 的 effort 參數（參見 `references/effort.md`）
5. 總結所有已進行的變更
6. 告訴使用者：「如果您在使用 Opus 4.5 時遇到任何問題，請告訴我，我可以幫助調整您的提示詞。」

## 模型字串更新

識別程式碼庫使用的平台，然後相應地替換模型字串。

### 不支援的 Beta 標頭

如果存在 `context-1m-2025-08-07` beta 標頭，請將其移除——Opus 4.5 尚不支援此功能。留下註解說明：

```python
# 注意：1M 上下文 beta（context-1m-2025-08-07）尚不支援 Opus 4.5
```

### 目標模型字串（Opus 4.5）

| 平台 | Opus 4.5 模型字串 |
|------|------------------|
| Anthropic API (1P) | `claude-opus-4-5-20251101` |
| AWS Bedrock | `anthropic.claude-opus-4-5-20251101-v1:0` |
| Google Vertex AI | `claude-opus-4-5@20251101` |
| Azure AI Foundry | `claude-opus-4-5-20251101` |

### 要替換的來源模型字串

| 來源模型 | Anthropic API (1P) | AWS Bedrock | Google Vertex AI |
|----------|-------------------|-------------|------------------|
| Sonnet 4.0 | `claude-sonnet-4-20250514` | `anthropic.claude-sonnet-4-20250514-v1:0` | `claude-sonnet-4@20250514` |
| Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Opus 4.1 | `claude-opus-4-1-20250422` | `anthropic.claude-opus-4-1-20250422-v1:0` | `claude-opus-4-1@20250422` |

**不要遷移**：任何 Haiku 模型（例如 `claude-haiku-4-5-20251001`）。

## 提示詞調整

Opus 4.5 與之前的模型有已知的行為差異。「僅在使用者明確請求或報告特定問題時才套用這些修正。預設情況下，只更新模型字串。」

**整合指南**：添加片段時，不要只是將它們附加到提示詞後面。要深思熟慮地整合：

- 使用 XML 標籤（例如 `<code_guidelines>`、`<tool_usage>`）來組織新增內容
- 匹配現有提示詞的風格和結構
- 將片段放在邏輯位置（例如，編碼指南放在其他編碼指令附近）
- 如果提示詞已經使用 XML 標籤，將新內容添加到適當的現有標籤中，或建立一致的新標籤

### 1. 工具過度觸發

Opus 4.5 對系統提示詞更加敏感。在之前模型上用於防止觸發不足的強硬語言，現在可能導致過度觸發。

**適用情況**：使用者報告工具被過於頻繁或不必要地呼叫。

**尋找並軟化**：

- `CRITICAL:` → 移除或軟化
- `You MUST...` → `You should...`
- `ALWAYS do X` → `Do X`
- `NEVER skip...` → `Don't skip...`
- `REQUIRED` → 移除或軟化

僅套用於工具觸發指令。保留其他強調用法不變。

### 2. 過度工程化防範

Opus 4.5 傾向於建立額外的檔案、添加不必要的抽象化，或建構未請求的彈性功能。

**適用情況**：使用者報告出現不想要的檔案、過度抽象化，或未請求的功能。添加 `references/prompt-snippets.md` 中的片段。

### 3. 程式碼探索

Opus 4.5 可能過於保守地探索程式碼，在不讀取檔案的情況下提出解決方案。

**適用情況**：使用者報告模型在未檢視相關程式碼的情況下提出修正。添加 `references/prompt-snippets.md` 中的片段。

### 4. 前端設計

**適用情況**：使用者請求提升前端設計品質，或報告輸出看起來很通用。

添加 `references/prompt-snippets.md` 中的前端美學片段。

### 5. 思考敏感度

當延伸思考未啟用時（這是預設情況），Opus 4.5 對「think」這個詞及其變體特別敏感。延伸思考僅在 API 請求包含 `thinking` 參數時才會啟用。

**適用情況**：使用者在延伸思考未啟用（請求中沒有 `thinking` 參數）的情況下報告與「thinking」相關的問題。

將「think」替換為「consider」、「believe」或「evaluate」等替代詞。

## 參考資料

請參閱 `references/prompt-snippets.md` 取得每個要添加的片段的完整文字。

請參閱 `references/effort.md` 了解如何設定 effort 參數（僅在使用者請求時）。
