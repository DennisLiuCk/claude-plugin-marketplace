---
description: 清理已從遠端刪除的本地分支
allowedTools:
  - 'Bash(git fetch:*)'
  - 'Bash(git branch:*)'
  - 'Bash(git worktree:*)'
---

# 指示

清理所有標記為 "[gone]" 的本地分支（即已從遠端刪除的分支）。

**步驟**：
1. 執行 `git fetch --prune` 來更新遠端分支資訊
2. 列出所有標記為 "[gone]" 的分支
3. 刪除這些分支及其相關的工作樹（如果有）

**重要提示**：
- 在刪除前確認分支確實已從遠端刪除
- 小心處理有未提交變更的分支
- 提供已刪除分支的清單
