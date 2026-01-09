---
description: "取消活動中的 Ralph 循環"
allowed-tools: ["Bash(test -f .claude/ralph-loop.local.md:*)", "Bash(rm .claude/ralph-loop.local.md)", "Read(.claude/ralph-loop.local.md)"]
hide-from-slash-command-tool: "true"
---

# 取消 Ralph

要取消 Ralph 循環：

1. 使用 Bash 檢查 `.claude/ralph-loop.local.md` 是否存在：`test -f .claude/ralph-loop.local.md && echo "EXISTS" || echo "NOT_FOUND"`

2. **如果 NOT_FOUND**：說「沒有找到活動的 Ralph 循環。」

3. **如果 EXISTS**：
   - 讀取 `.claude/ralph-loop.local.md` 以獲取 `iteration:` 欄位中的當前迭代次數
   - 使用 Bash 刪除檔案：`rm .claude/ralph-loop.local.md`
   - 報告：「已取消 Ralph 循環（之前在第 N 次迭代）」，其中 N 是迭代值
