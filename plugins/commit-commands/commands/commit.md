---
description: 建立一個 Git 提交
allowedTools:
  - 'Bash(git add:*)'
  - 'Bash(git status:*)'
  - 'Bash(git commit:*)'
---

# 背景資訊

以下是目前的 Git 狀態：

```
${GIT_STATUS}
```

以下是目前的 Git 差異（包括已暫存和未暫存的變更）：

```
${GIT_DIFF}
```

目前分支：${GIT_BRANCH}

最近的提交記錄：

```
${GIT_LOG}
```

# 指示

根據上面顯示的變更，建立一個 Git 提交。

**重要提示**：
- 您可以在單一回應中呼叫多個工具
- 您必須在單一訊息中使用多個工具呼叫來暫存和提交，並使用單一訊息
- 不要使用其他工具
- 不要輸出額外的溝通內容
