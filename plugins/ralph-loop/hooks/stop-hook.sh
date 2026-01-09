#!/bin/bash

# Ralph Loop Stop Hook
# 當 ralph-loop 處於活動狀態時阻止會話退出
# 將 Claude 的輸出回饋作為輸入以繼續循環

set -euo pipefail

# 從 stdin 讀取鉤子輸入（進階 stop 鉤子 API）
HOOK_INPUT=$(cat)

# 檢查 ralph-loop 是否處於活動狀態
RALPH_STATE_FILE=".claude/ralph-loop.local.md"

if [[ ! -f "$RALPH_STATE_FILE" ]]; then
  # 沒有活動的循環 - 允許退出
  exit 0
fi

# 解析 markdown frontmatter（--- 之間的 YAML）並提取值
FRONTMATTER=$(sed -n '/^---$/,/^---$/{ /^---$/d; p; }' "$RALPH_STATE_FILE")
ITERATION=$(echo "$FRONTMATTER" | grep '^iteration:' | sed 's/iteration: *//')
MAX_ITERATIONS=$(echo "$FRONTMATTER" | grep '^max_iterations:' | sed 's/max_iterations: *//')
# 提取 completion_promise 並移除周圍的引號（如果存在）
COMPLETION_PROMISE=$(echo "$FRONTMATTER" | grep '^completion_promise:' | sed 's/completion_promise: *//' | sed 's/^"\(.*\)"$/\1/')

# 在算術運算前驗證數值欄位
if [[ ! "$ITERATION" =~ ^[0-9]+$ ]]; then
  echo "警告：Ralph loop 狀態檔案損壞" >&2
  echo "   檔案：$RALPH_STATE_FILE" >&2
  echo "   問題：'iteration' 欄位不是有效的數字（值為：'$ITERATION'）" >&2
  echo "" >&2
  echo "   這通常表示狀態檔案被手動編輯或損壞。" >&2
  echo "   Ralph 循環正在停止。請重新執行 /ralph-loop 重新開始。" >&2
  rm "$RALPH_STATE_FILE"
  exit 0
fi

if [[ ! "$MAX_ITERATIONS" =~ ^[0-9]+$ ]]; then
  echo "警告：Ralph loop 狀態檔案損壞" >&2
  echo "   檔案：$RALPH_STATE_FILE" >&2
  echo "   問題：'max_iterations' 欄位不是有效的數字（值為：'$MAX_ITERATIONS'）" >&2
  echo "" >&2
  echo "   這通常表示狀態檔案被手動編輯或損壞。" >&2
  echo "   Ralph 循環正在停止。請重新執行 /ralph-loop 重新開始。" >&2
  rm "$RALPH_STATE_FILE"
  exit 0
fi

# 檢查是否達到最大迭代次數
if [[ $MAX_ITERATIONS -gt 0 ]] && [[ $ITERATION -ge $MAX_ITERATIONS ]]; then
  echo "停止：Ralph 循環已達到最大迭代次數（$MAX_ITERATIONS）。"
  rm "$RALPH_STATE_FILE"
  exit 0
fi

# 從鉤子輸入獲取轉錄路徑
TRANSCRIPT_PATH=$(echo "$HOOK_INPUT" | jq -r '.transcript_path')

if [[ ! -f "$TRANSCRIPT_PATH" ]]; then
  echo "警告：Ralph loop 找不到轉錄檔案" >&2
  echo "   預期位置：$TRANSCRIPT_PATH" >&2
  echo "   這是異常情況，可能表示 Claude Code 內部問題。" >&2
  echo "   Ralph 循環正在停止。" >&2
  rm "$RALPH_STATE_FILE"
  exit 0
fi

# 從轉錄讀取最後一個助手訊息（JSONL 格式 - 每行一個 JSON）
# 首先檢查是否有任何助手訊息
if ! grep -q '"role":"assistant"' "$TRANSCRIPT_PATH"; then
  echo "警告：Ralph loop 在轉錄中找不到助手訊息" >&2
  echo "   轉錄：$TRANSCRIPT_PATH" >&2
  echo "   這是異常情況，可能表示轉錄格式問題" >&2
  echo "   Ralph 循環正在停止。" >&2
  rm "$RALPH_STATE_FILE"
  exit 0
fi

# 使用明確的錯誤處理提取最後一個助手訊息
LAST_LINE=$(grep '"role":"assistant"' "$TRANSCRIPT_PATH" | tail -1)
if [[ -z "$LAST_LINE" ]]; then
  echo "警告：Ralph loop 無法提取最後一個助手訊息" >&2
  echo "   Ralph 循環正在停止。" >&2
  rm "$RALPH_STATE_FILE"
  exit 0
fi

# 使用錯誤處理解析 JSON
LAST_OUTPUT=$(echo "$LAST_LINE" | jq -r '
  .message.content |
  map(select(.type == "text")) |
  map(.text) |
  join("\n")
' 2>&1)

# 檢查 jq 是否成功
if [[ $? -ne 0 ]]; then
  echo "警告：Ralph loop 無法解析助手訊息 JSON" >&2
  echo "   錯誤：$LAST_OUTPUT" >&2
  echo "   這可能表示轉錄格式問題" >&2
  echo "   Ralph 循環正在停止。" >&2
  rm "$RALPH_STATE_FILE"
  exit 0
fi

if [[ -z "$LAST_OUTPUT" ]]; then
  echo "警告：Ralph loop 助手訊息不包含文字內容" >&2
  echo "   Ralph 循環正在停止。" >&2
  rm "$RALPH_STATE_FILE"
  exit 0
fi

# 檢查完成承諾（僅在設置時）
if [[ "$COMPLETION_PROMISE" != "null" ]] && [[ -n "$COMPLETION_PROMISE" ]]; then
  # 使用 Perl 從 <promise> 標籤提取文字以支援多行
  # -0777 讀取整個輸入，s 標誌使 . 匹配換行符
  # .*? 是非貪婪的（取第一個標籤），空白正規化
  PROMISE_TEXT=$(echo "$LAST_OUTPUT" | perl -0777 -pe 's/.*?<promise>(.*?)<\/promise>.*/$1/s; s/^\s+|\s+$//g; s/\s+/ /g' 2>/dev/null || echo "")

  # 使用 = 進行字面字串比較（不是模式匹配）
  # [[ ]] 中的 == 進行 glob 模式匹配，會被 *, ?, [ 字符破壞
  if [[ -n "$PROMISE_TEXT" ]] && [[ "$PROMISE_TEXT" = "$COMPLETION_PROMISE" ]]; then
    echo "完成：Ralph 循環偵測到 <promise>$COMPLETION_PROMISE</promise>"
    rm "$RALPH_STATE_FILE"
    exit 0
  fi
fi

# 未完成 - 繼續循環使用相同的提示
NEXT_ITERATION=$((ITERATION + 1))

# 提取提示（結束 --- 之後的所有內容）
# 跳過第一個 --- 行，跳過直到第二個 --- 行，然後列印之後的所有內容
# 使用 i>=2 而非 i==2 以處理提示內容中的 ---
PROMPT_TEXT=$(awk '/^---$/{i++; next} i>=2' "$RALPH_STATE_FILE")

if [[ -z "$PROMPT_TEXT" ]]; then
  echo "警告：Ralph loop 狀態檔案損壞或不完整" >&2
  echo "   檔案：$RALPH_STATE_FILE" >&2
  echo "   問題：找不到提示文字" >&2
  echo "" >&2
  echo "   這通常表示：" >&2
  echo "     • 狀態檔案被手動編輯" >&2
  echo "     • 檔案在寫入過程中損壞" >&2
  echo "" >&2
  echo "   Ralph 循環正在停止。請重新執行 /ralph-loop 重新開始。" >&2
  rm "$RALPH_STATE_FILE"
  exit 0
fi

# 更新 frontmatter 中的迭代次數（跨 macOS 和 Linux 可攜）
# 建立暫存檔案，然後原子性替換
TEMP_FILE="${RALPH_STATE_FILE}.tmp.$$"
sed "s/^iteration: .*/iteration: $NEXT_ITERATION/" "$RALPH_STATE_FILE" > "$TEMP_FILE"
mv "$TEMP_FILE" "$RALPH_STATE_FILE"

# 建立包含迭代次數和完成承諾資訊的系統訊息
if [[ "$COMPLETION_PROMISE" != "null" ]] && [[ -n "$COMPLETION_PROMISE" ]]; then
  SYSTEM_MSG="Ralph 迭代 $NEXT_ITERATION | 要停止：輸出 <promise>$COMPLETION_PROMISE</promise>（僅當陳述為真時 - 不要說謊來退出！）"
else
  SYSTEM_MSG="Ralph 迭代 $NEXT_ITERATION | 未設置完成承諾 - 循環無限運行"
fi

# 輸出 JSON 以阻止停止並將提示回饋
# "reason" 欄位包含將發送回 Claude 的提示
jq -n \
  --arg prompt "$PROMPT_TEXT" \
  --arg msg "$SYSTEM_MSG" \
  '{
    "decision": "block",
    "reason": $prompt,
    "systemMessage": $msg
  }'

# 退出 0 表示鉤子執行成功
exit 0
