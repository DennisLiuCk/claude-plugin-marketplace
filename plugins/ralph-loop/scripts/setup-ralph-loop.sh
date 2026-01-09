#!/bin/bash

# Ralph Loop 設置腳本
# 為會話內 Ralph 循環建立狀態檔案

set -euo pipefail

# 解析參數
PROMPT_PARTS=()
MAX_ITERATIONS=0
COMPLETION_PROMISE="null"

# 解析選項和位置參數
while [[ $# -gt 0 ]]; do
  case $1 in
    -h|--help)
      cat << 'HELP_EOF'
Ralph Loop - 互動式自引用開發循環

用法：
  /ralph-loop [PROMPT...] [OPTIONS]

參數：
  PROMPT...    開始循環的初始提示（可以是多個不加引號的詞）

選項：
  --max-iterations <n>           自動停止前的最大迭代次數（預設：無限制）
  --completion-promise '<text>'  承諾短語（多詞使用引號）
  -h, --help                     顯示此說明訊息

說明：
  在當前會話中啟動 Ralph 循環。stop 鉤子會阻止退出並將你的輸出回饋
  作為輸入，直到完成或達到迭代限制。

  要表示完成，你必須輸出：<promise>你的短語</promise>

  適用於：
  - 你想看到進度的互動式迭代
  - 需要自我糾正和完善的任務
  - 學習 Ralph 的工作原理

範例：
  /ralph-loop 建立待辦事項 API --completion-promise 'DONE' --max-iterations 20
  /ralph-loop --max-iterations 10 修復認證錯誤
  /ralph-loop 重構快取層（永遠運行）
  /ralph-loop --completion-promise 'TASK COMPLETE' 建立 REST API

停止：
  只能通過達到 --max-iterations 或偵測到 --completion-promise
  沒有手動停止 - Ralph 預設無限運行！

監控：
  # 查看當前迭代：
  grep '^iteration:' .claude/ralph-loop.local.md

  # 查看完整狀態：
  head -10 .claude/ralph-loop.local.md
HELP_EOF
      exit 0
      ;;
    --max-iterations)
      if [[ -z "${2:-}" ]]; then
        echo "錯誤：--max-iterations 需要一個數字參數" >&2
        echo "" >&2
        echo "   有效範例：" >&2
        echo "     --max-iterations 10" >&2
        echo "     --max-iterations 50" >&2
        echo "     --max-iterations 0  (無限制)" >&2
        echo "" >&2
        echo "   你提供的是：--max-iterations（沒有數字）" >&2
        exit 1
      fi
      if ! [[ "$2" =~ ^[0-9]+$ ]]; then
        echo "錯誤：--max-iterations 必須是正整數或 0，收到：$2" >&2
        echo "" >&2
        echo "   有效範例：" >&2
        echo "     --max-iterations 10" >&2
        echo "     --max-iterations 50" >&2
        echo "     --max-iterations 0  (無限制)" >&2
        echo "" >&2
        echo "   無效：小數（10.5）、負數（-5）、文字" >&2
        exit 1
      fi
      MAX_ITERATIONS="$2"
      shift 2
      ;;
    --completion-promise)
      if [[ -z "${2:-}" ]]; then
        echo "錯誤：--completion-promise 需要一個文字參數" >&2
        echo "" >&2
        echo "   有效範例：" >&2
        echo "     --completion-promise 'DONE'" >&2
        echo "     --completion-promise 'TASK COMPLETE'" >&2
        echo "     --completion-promise 'All tests passing'" >&2
        echo "" >&2
        echo "   你提供的是：--completion-promise（沒有文字）" >&2
        echo "" >&2
        echo "   注意：多詞承諾必須使用引號！" >&2
        exit 1
      fi
      COMPLETION_PROMISE="$2"
      shift 2
      ;;
    *)
      # 非選項參數 - 收集所有作為提示部分
      PROMPT_PARTS+=("$1")
      shift
      ;;
  esac
done

# 用空格連接所有提示部分
PROMPT="${PROMPT_PARTS[*]}"

# 驗證提示非空
if [[ -z "$PROMPT" ]]; then
  echo "錯誤：未提供提示" >&2
  echo "" >&2
  echo "   Ralph 需要任務描述來工作。" >&2
  echo "" >&2
  echo "   範例：" >&2
  echo "     /ralph-loop 建立待辦事項的 REST API" >&2
  echo "     /ralph-loop 修復認證錯誤 --max-iterations 20" >&2
  echo "     /ralph-loop --completion-promise 'DONE' 重構程式碼" >&2
  echo "" >&2
  echo "   所有選項：/ralph-loop --help" >&2
  exit 1
fi

# 為 stop 鉤子建立狀態檔案（帶有 YAML frontmatter 的 markdown）
mkdir -p .claude

# 如果 completion_promise 包含特殊字符或不是 null，則為 YAML 加引號
if [[ -n "$COMPLETION_PROMISE" ]] && [[ "$COMPLETION_PROMISE" != "null" ]]; then
  COMPLETION_PROMISE_YAML="\"$COMPLETION_PROMISE\""
else
  COMPLETION_PROMISE_YAML="null"
fi

cat > .claude/ralph-loop.local.md <<EOF
---
active: true
iteration: 1
max_iterations: $MAX_ITERATIONS
completion_promise: $COMPLETION_PROMISE_YAML
started_at: "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
---

$PROMPT
EOF

# 輸出設置訊息
cat <<EOF
Ralph 循環已在此會話中啟動！

迭代：1
最大迭代次數：$(if [[ $MAX_ITERATIONS -gt 0 ]]; then echo $MAX_ITERATIONS; else echo "無限制"; fi)
完成承諾：$(if [[ "$COMPLETION_PROMISE" != "null" ]]; then echo "${COMPLETION_PROMISE//\"/}（僅在為真時輸出 - 不要說謊！）"; else echo "無（永遠運行）"; fi)

Stop 鉤子現在處於活動狀態。當你嘗試退出時，相同的提示會回饋給你。
你會在檔案中看到之前的工作成果，形成一個自引用循環，讓你在相同任務上迭代改進。

監控：head -10 .claude/ralph-loop.local.md

警告：此循環無法手動停止！它會無限運行，除非你設置
    --max-iterations 或 --completion-promise。

EOF

# 如果提供了則輸出初始提示
if [[ -n "$PROMPT" ]]; then
  echo ""
  echo "$PROMPT"
fi

# 如果設置則顯示完成承諾要求
if [[ "$COMPLETION_PROMISE" != "null" ]]; then
  echo ""
  echo "==============================================================="
  echo "關鍵 - Ralph 循環完成承諾"
  echo "==============================================================="
  echo ""
  echo "要完成此循環，請輸出這個確切的文字："
  echo "  <promise>$COMPLETION_PROMISE</promise>"
  echo ""
  echo "嚴格要求（請勿違反）："
  echo "  - 使用如上所示的 <promise> XML 標籤"
  echo "  - 陳述必須完全且毫無疑問為真"
  echo "  - 不要輸出虛假陳述來退出循環"
  echo "  - 即使你認為應該退出也不要說謊"
  echo ""
  echo "重要 - 不要規避循環："
  echo "  即使你認為自己卡住了、任務不可能完成或運行太久了，"
  echo "  你也絕對不能輸出虛假的承諾陳述。循環的設計就是要"
  echo "  持續運行直到承諾真正為真。相信這個過程。"
  echo ""
  echo "  如果循環應該停止，承諾陳述會自然變為真。"
  echo "  不要通過說謊來強制它。"
  echo "==============================================================="
fi
