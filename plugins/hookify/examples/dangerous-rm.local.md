---
name: block-dangerous-rm
enabled: true
event: bash
pattern: rm\s+-rf
action: block
---

⚠️ **檢測到危險的 rm 命令！**

此命令可能刪除重要文件。請：
- 驗證路徑是否正確
- 考慮使用更安全的方法
- 確保您有備份
