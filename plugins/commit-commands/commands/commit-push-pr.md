---
description: 建立一個 Git 提交、推送到遠端，並開啟一個 Pull Request
allowedTools:
  - 'Bash(git checkout --branch:*)'
  - 'Bash(git add:*)'
  - 'Bash(git status:*)'
  - 'Bash(git push:*)'
  - 'Bash(git commit:*)'
  - 'Bash(gh pr create:*)'
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

# 指示

執行以下步驟：

1. 如果目前在 main 分支上，建立一個新分支
2. 暫存相關變更
3. 建立一個提交並附上適當的訊息
4. 推送分支到 origin
5. 使用 GitHub CLI 開啟一個 Pull Request

**重要提示**：
- 您有能力在單一回應中呼叫多個工具
- 您必須在單一訊息中完成以上所有步驟
- 不要使用其他工具
- 不要輸出額外的溝通內容
