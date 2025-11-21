---
name: warn-console-log
enabled: true
event: file
pattern: console\.log\(
action: warn
---

🔍 **檢測到 Console.log**

您正在添加 console.log 語句。請考慮：
- 這是用於調試還是應該使用適當的日誌記錄？
- 這會部署到生產環境嗎？
- 是否應該使用日誌記錄庫？
