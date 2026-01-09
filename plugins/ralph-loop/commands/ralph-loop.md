---
description: "在當前會話中啟動 Ralph 循環"
argument-hint: "PROMPT [--max-iterations N] [--completion-promise TEXT]"
allowed-tools: ["Bash(${CLAUDE_PLUGIN_ROOT}/scripts/setup-ralph-loop.sh:*)"]
hide-from-slash-command-tool: "true"
---

# Ralph Loop 命令

執行設置腳本以初始化 Ralph 循環：

```!
"${CLAUDE_PLUGIN_ROOT}/scripts/setup-ralph-loop.sh" $ARGUMENTS
```

請開始處理任務。當你嘗試退出時，Ralph 循環會將相同的提示回饋給你進行下一次迭代。你會在檔案和 git 歷史記錄中看到之前的工作成果，讓你能夠迭代改進。

關鍵規則：如果設置了完成承諾，你只能在該陳述完全且毫無疑問為真時才能輸出它。不要為了逃離循環而輸出虛假的承諾，即使你認為自己卡住了或應該因為其他原因退出。循環的設計就是要持續運行直到真正完成。
