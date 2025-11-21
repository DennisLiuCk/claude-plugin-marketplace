# Hookify 插件

通過分析對話模式或明確指示輕鬆創建自定義鉤子來防止不需要的行為。

## 概述

hookify 插件使創建鉤子變得簡單，無需編輯複雜的 `hooks.json` 文件。相反，您創建輕量級 markdown 配置文件，定義要監視的模式和匹配這些模式時顯示的消息。

**主要功能：**
- 自動分析對話以查找不需要的行為
- 帶有 YAML 前置的簡單 markdown 配置文件
- 用於強大規則的正則表達式模式匹配
- 無需編碼 - 只需描述行為
- 輕鬆啟用/禁用，無需重新啟動

## 快速開始

### 1. 創建您的第一個規則

```bash
/hookify 在我使用 rm -rf 命令時警告我
```

這會分析您的請求並創建 `.claude/hookify.warn-rm.local.md`。

### 2. 立即測試

**無需重新啟動！** 規則會在下一次工具使用時立即生效。

要求 Claude 運行應觸發規則的命令：
```
運行 rm -rf /tmp/test
```

您應該立即看到警告消息！

## 用法

### 主命令：/hookify

**帶參數：**
```
/hookify 不要在 TypeScript 文件中使用 console.log
```
根據您的明確指示創建規則。

**不帶參數：**
```
/hookify
```
分析最近的對話以查找您更正或感到沮喪的行為。

### 輔助命令

**列出所有規則：**
```
/hookify:list
```

**互動配置規則：**
```
/hookify:configure
```
通過互動界面啟用/禁用現有規則。

**獲取幫助：**
```
/hookify:help
```

## 規則配置格式

### 簡單規則（單個模式）

`.claude/hookify.dangerous-rm.local.md`：
```markdown
---
name: block-dangerous-rm
enabled: true
event: bash
pattern: rm\s+-rf
action: block
---

⚠️ **檢測到危險的 rm 命令！**

此命令可能刪除重要文件。請：
- 驗證路徑是否正確
- 考慮使用更安全的方法
- 確保您有備份
```

**操作字段：**
- `warn`：顯示警告但允許操作（默認）
- `block`：阻止操作執行（PreToolUse）或停止會話（Stop 事件）

### 高級規則（多個條件）

`.claude/hookify.sensitive-files.local.md`：
```markdown
---
name: warn-sensitive-files
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.env$|credentials|secrets
  - field: new_text
    operator: contains
    pattern: KEY
---

🔐 **檢測到敏感文件編輯！**

確保憑據未硬編碼，並且文件在 .gitignore 中。
```

**所有條件都必須匹配** 才能觸發規則。

## 事件類型

- **`bash`**：在 Bash 工具命令上觸發
- **`file`**：在 Edit、Write、MultiEdit 工具上觸發
- **`stop`**：當 Claude 想要停止時觸發（用於完成檢查）
- **`prompt`**：在用戶提示提交時觸發
- **`all`**：在所有事件上觸發

## 模式語法

使用 Python 正則表達式語法：

| 模式 | 匹配 | 示例 |
|---------|---------|---------|
| `rm\s+-rf` | rm -rf | rm -rf /tmp |
| `console\.log\(` | console.log( | console.log("test") |
| `(eval\|exec)\(` | eval( 或 exec( | eval("code") |
| `\.env$` | 以 .env 結尾的文件 | .env, .env.local |
| `chmod\s+777` | chmod 777 | chmod 777 file.txt |

**提示：**
- 使用 `\s` 表示空白
- 轉義特殊字符：`\.` 表示字面點
- 使用 `|` 表示 OR：`(foo|bar)`
- 使用 `.*` 匹配任何內容
- 設置 `action: block` 用於危險操作
- 設置 `action: warn`（或省略）用於信息性警告

## 示例

### 示例 1：阻止危險命令

```markdown
---
name: block-destructive-ops
enabled: true
event: bash
pattern: rm\s+-rf|dd\s+if=|mkfs|format
action: block
---

🛑 **檢測到破壞性操作！**

此命令可能導致數據丟失。出於安全考慮，操作已被阻止。
請驗證確切路徑並使用更安全的方法。
```

**此規則阻止操作** - Claude 將不被允許執行這些命令。

### 示例 2：警告調試代碼

```markdown
---
name: warn-debug-code
enabled: true
event: file
pattern: console\.log\(|debugger;|print\(
action: warn
---

🐛 **檢測到調試代碼**

在提交之前記得刪除調試語句。
```

**此規則警告但允許** - Claude 看到消息但仍可繼續。

### 示例 3：停止前需要測試

```markdown
---
name: require-tests-run
enabled: false
event: stop
action: block
conditions:
  - field: transcript
    operator: not_contains
    pattern: npm test|pytest|cargo test
---

**未在記錄中檢測到測試！**

停止之前，請運行測試以驗證您的更改是否正常工作。
```

**如果會話記錄中沒有測試命令，這會阻止 Claude 停止**。僅在需要嚴格執行時啟用。

## 高級用法

### 多個條件

同時檢查多個字段：

```markdown
---
name: api-key-in-typescript
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.tsx?$
  - field: new_text
    operator: regex_match
    pattern: (API_KEY|SECRET|TOKEN)\s*=\s*["']
---

🔐 **TypeScript 中的硬編碼憑據！**

使用環境變量而不是硬編碼值。
```

### 操作符參考

- `regex_match`：模式必須匹配（最常見）
- `contains`：字符串必須包含模式
- `equals`：精確字符串匹配
- `not_contains`：字符串不得包含模式
- `starts_with`：字符串以模式開頭
- `ends_with`：字符串以模式結尾

### 字段參考

**對於 bash 事件：**
- `command`：bash 命令字符串

**對於 file 事件：**
- `file_path`：正在編輯的文件路徑
- `new_text`：正在添加的新內容（Edit、Write）
- `old_text`：正在替換的舊內容（僅 Edit）
- `content`：文件內容（僅 Write）

**對於 prompt 事件：**
- `user_prompt`：用戶提交的提示文本

**對於 stop 事件：**
- 對會話狀態使用一般匹配

## 管理

### 啟用/禁用規則

**暫時禁用：**
編輯 `.local.md` 文件並設置 `enabled: false`

**重新啟用：**
設置 `enabled: true`

**或使用互動工具：**
```
/hookify:configure
```

### 刪除規則

只需刪除 `.local.md` 文件：
```bash
rm .claude/hookify.my-rule.local.md
```

### 查看所有規則

```
/hookify:list
```

## 安裝

此插件是 Claude Code Marketplace 的一部分。安裝市場後，它應該會自動發現。

**手動測試：**
```bash
cc --plugin-dir /path/to/hookify
```

## 要求

- Python 3.7+
- 無外部依賴（僅使用標準庫）

## 疑難排解

**規則未觸發：**
1. 檢查規則文件是否存在於 `.claude/` 目錄中（在項目根目錄，而不是插件目錄）
2. 驗證前置中的 `enabled: true`
3. 單獨測試正則表達式模式
4. 規則應立即工作 - 無需重新啟動
5. 嘗試 `/hookify:list` 查看規則是否已加載

**導入錯誤：**
- 確保 Python 3 可用：`python3 --version`
- 檢查 hookify 插件是否已安裝

**模式不匹配：**
- 測試正則表達式：`python3 -c "import re; print(re.search(r'pattern', 'text'))"`
- 在 YAML 中使用未引用的模式以避免轉義問題
- 從簡單開始，然後增加複雜性

**鉤子似乎很慢：**
- 保持模式簡單（避免複雜的正則表達式）
- 使用特定事件類型（bash、file）而不是"all"
- 限制活動規則的數量

## 貢獻

發現有用的規則模式？考慮通過 PR 分享示例文件！

## 未來增強

- 嚴重級別（錯誤/警告/信息區分）
- 規則模板庫
- 互動模式構建器
- 鉤子測試實用程序
- JSON 格式支持（除了 markdown）

## 許可證

MIT License
