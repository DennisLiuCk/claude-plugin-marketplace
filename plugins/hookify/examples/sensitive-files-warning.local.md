---
name: warn-sensitive-files
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.env$|\.env\.|credentials|secrets
---

🔐 **檢測到敏感文件**

您正在編輯可能包含敏感數據的文件：
- 確保憑據未硬編碼
- 使用環境變量來存儲機密
- 驗證此文件在 .gitignore 中
- 考慮使用機密管理器
