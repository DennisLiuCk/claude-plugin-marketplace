# Effort 參數（Beta）

Effort 參數控制模型花費 token 的積極程度。

**遷移時添加設定為 `"high"` 的 effort。這是 Opus 4.5 最佳效能的預設配置。**

Effort 影響所有類型的 token：思考、文字回應和函數呼叫。

## Effort 級別

| Effort 級別 | 用途 |
|-------------|------|
| `high` | 最佳效能，深度推理（預設） |
| `medium` | 成本/延遲與效能的平衡 |
| `low` | 簡單、大量的查詢；顯著節省 token |

## 實作方式

需要在 API 呼叫中使用 beta 標誌 `effort-2025-11-24`。

### Python SDK

```python
response = client.messages.create(
    model="claude-opus-4-5-20251101",
    max_tokens=1024,
    betas=["effort-2025-11-24"],
    output_config={
        "effort": "high"  # 或 "medium" 或 "low"
    },
    messages=[...]
)
```

### TypeScript SDK

```typescript
const response = await client.messages.create({
    model: "claude-opus-4-5-20251101",
    max_tokens: 1024,
    betas: ["effort-2025-11-24"],
    output_config: {
        effort: "high"  // 或 "medium" 或 "low"
    },
    messages: [...]
});
```

### 原始 API

```json
{
    "model": "claude-opus-4-5-20251101",
    "max_tokens": 1024,
    "anthropic-beta": "effort-2025-11-24",
    "output_config": {
        "effort": "high"
    },
    "messages": [...]
}
```

## Effort 與 Thinking Budget 的關係

Effort 獨立於 thinking budget 分配運作。高 effort 但沒有 thinking token 會產生更多輸出 token，但不會有內部推理 token。

## 建議

1. 先決定 effort 級別，然後設定 thinking budget
2. 最佳結果：高 effort + 高 thinking budget
3. 成本/延遲優化：中等 effort
4. 簡單大量查詢：低 effort
