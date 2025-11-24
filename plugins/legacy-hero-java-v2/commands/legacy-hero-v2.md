---
description: 啟動 Legacy Hero Java v2 完整分析流程（四階段含用戶確認）
---

請啟動 **legacy-orchestrator-v2** agent 來執行完整的 Java Spring Boot 專案分析。

使用者需求：${PROMPT}

重要提示給 orchestrator：
- 這是 v2 版本，您負責所有文件寫入操作
- Subagent 只返回純文本報告，不執行 Write
- 每個大階段完成後，等待用戶確認再繼續
- 使用並行處理加速獨立任務
- 零容忍錯誤和幻覺，所有內容必須通過 review
