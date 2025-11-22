# Security Guidance 插件

安全提醒鉤子，在編輯檔案時自動檢測並警告潛在的安全問題，包括命令注入、XSS、SQL 注入和不安全的程式碼模式。

## 功能特色

此插件提供即時的安全警告，幫助您在開發過程中避免常見的安全漏洞：

### 自動安全檢測

在每次檔案編輯操作（Write、Edit、MultiEdit）前自動執行，檢測以下安全問題：

1. **GitHub Actions 工作流程注入** - 檢測未經淨化的事件內容使用
2. **子程序執行漏洞** - 識別不安全的 `exec()` 呼叫
3. **動態程式碼評估** - 偵測 `eval()` 和 `new Function()` 的使用
4. **基於 DOM 的 XSS** - 發現 `dangerouslySetInnerHTML`、`innerHTML`、`document.write()` 等風險
5. **Python Pickle 反序列化** - 警告不安全的 pickle 使用
6. **作業系統命令注入** - 標記 `os.system()` 等危險呼叫
7. **SQL 注入風險** - 識別不安全的 SQL 查詢建構
8. **硬編碼密鑰** - 偵測硬編碼的密碼、API 金鑰和令牌

### 智慧警告系統

- **工作階段感知**：每個安全問題在同一工作階段中只警告一次
- **信心評分**：根據檢測模式的準確度提供信心等級
- **詳細建議**：為每種安全問題提供具體的修復建議和程式碼範例
- **自動清理**：自動清除超過 30 天的警告狀態檔案

## 系統需求

- Python 3.x
- Claude Code CLI

## 安裝方式

使用 NPM 安裝：

```bash
npx @claude-plugin/install github:DennisLiuCk/claude-plugin-marketplace/plugins/security-guidance
```

或手動安裝：

```bash
cp -r plugins/security-guidance ~/.claude/plugins/
```

## 使用說明

插件安裝後會自動啟用，無需額外配置。當 Claude 嘗試編輯檔案時，如果偵測到安全問題，會顯示警告訊息。

### 警告範例

```
================================================================================
檔案：src/api/user.js
================================================================================

⚠️  安全警告：潛在的 XSS 漏洞

偵測到使用可能導致跨站腳本攻擊的方法。

風險：
- dangerouslySetInnerHTML：React 中的 XSS 風險
- innerHTML：直接 DOM 操作的 XSS 風險
- document.write()：可能被利用注入惡意腳本

建議：
- 使用 textContent 而非 innerHTML
- 在 React 中使用 JSX 來渲染內容
- 如果必須渲染 HTML，使用 DOMPurify 等清理庫
- 實施內容安全政策（CSP）

如果您確定這些變更是安全的，可以繼續執行。
若要停用此警告，請設定環境變數：ENABLE_SECURITY_REMINDER=false
================================================================================
```

### 停用警告

如果需要暫時停用安全警告：

```bash
export ENABLE_SECURITY_REMINDER=false
```

若要永久停用，可將此環境變數加入您的 shell 設定檔（如 `.bashrc` 或 `.zshrc`）。

## 檢測模式詳解

### 1. GitHub Actions 工作流程注入

**檢測模式**：`${{ github.event.*` 在 shell 命令中

**風險**：攻擊者可透過 PR 標題、分支名稱等注入惡意命令

**安全做法**：
```yaml
# 不安全
- run: echo ${{ github.event.pull_request.title }}

# 安全
- env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: echo "$PR_TITLE"
```

### 2. 子程序執行漏洞

**檢測模式**：`.exec()` 呼叫

**風險**：Shell 元字元可能導致命令注入

**安全做法**：
```javascript
// 不安全
exec(`command ${userInput}`)

// 安全
execFile('command', [arg1, arg2])
```

### 3. 動態程式碼評估

**檢測模式**：`eval()` 或 `new Function()`

**風險**：可執行任意 JavaScript 程式碼

**安全做法**：
```javascript
// 不安全
eval(userInput)

// 安全
JSON.parse(userInput)  // 僅用於 JSON 資料
```

### 4. 基於 DOM 的 XSS

**檢測模式**：`innerHTML`、`dangerouslySetInnerHTML`、`document.write()`

**風險**：未經淨化的使用者輸入可能注入惡意腳本

**安全做法**：
```javascript
// 不安全
element.innerHTML = userInput

// 安全
element.textContent = userInput
// 或使用 DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput)
```

### 5. Python Pickle 反序列化

**檢測模式**：`pickle.load()` 或 `pickle.loads()`

**風險**：可執行任意 Python 程式碼

**安全做法**：
```python
# 不安全
data = pickle.loads(untrusted_data)

# 安全
data = json.loads(json_string)
```

### 6. 作業系統命令注入

**檢測模式**：`os.system()`

**風險**：Shell 注入攻擊

**安全做法**：
```python
# 不安全
os.system(f"ls {user_input}")

# 安全
subprocess.run(['ls', user_input], check=True)
```

### 7. SQL 注入

**檢測模式**：字串拼接的 SQL 查詢

**風險**：資料庫存取控制繞過

**安全做法**：
```python
# 不安全
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")

# 安全
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
```

### 8. 硬編碼密鑰

**檢測模式**：程式碼中的 `password`、`secret`、`api_key`、`token` 等

**風險**：密鑰洩露風險

**安全做法**：
```python
# 不安全
api_key = "sk_live_abc123xyz789"

# 安全
api_key = os.getenv('API_KEY')
```

## 工作原理

### 鉤子機制

插件使用 Claude Code 的 `preToolUse` 鉤子：

1. 當 Claude 嘗試執行 Edit、Write 或 MultiEdit 工具時
2. 鉤子攔截操作並分析檔案內容
3. 使用正則表達式匹配已知的不安全模式
4. 如果發現問題，顯示警告並暫停操作
5. 使用者確認後可繼續執行

### 狀態管理

- 警告狀態儲存在 `~/.claude/security_warnings_state_<session_id>.json`
- 每個工作階段獨立追蹤已顯示的警告
- 自動清理超過 30 天的狀態檔案

## 自訂配置

### 修改檢測模式

您可以編輯 `hooks/security_reminder_hook.py` 來新增或修改檢測模式：

```python
SECURITY_PATTERNS = [
    {
        "name": "自訂檢測模式",
        "pattern": r'your_regex_pattern',
        "description": "簡短描述",
        "warning": """
⚠️  安全警告：標題

詳細警告訊息...
""",
        "confidence": 0.85
    }
]
```

### 調整信心閾值

目前所有警告都會顯示。如需僅顯示高信心警告，可修改腳本：

```python
# 僅顯示信心 >= 0.9 的警告
if warning['confidence'] >= 0.9:
    new_warnings.append(warning)
```

## 最佳實踐

### 開發流程整合

1. **開發階段**：保持警告啟用，及早發現安全問題
2. **審查階段**：將安全警告視為程式碼審查的一部分
3. **部署前**：確保所有安全警告都已解決或確認安全

### 處理誤報

如果遇到誤報（False Positive）：

1. 確認程式碼確實安全
2. 新增註解說明為何安全
3. 考慮重構程式碼以使用更安全的替代方案
4. 如有必要，暫時停用該檔案的警告

### 團隊協作

- 在團隊中推廣使用此插件
- 定期審查和更新檢測模式
- 將安全警告整合到 CI/CD 流程中

## 疑難排解

### Python 未安裝

如果看到 `python3: command not found` 錯誤：

```bash
# macOS
brew install python3

# Linux
sudo apt install python3

# Windows
從 python.org 下載並安裝
```

### 權限問題

如果遇到權限錯誤：

```bash
chmod +x ~/.claude/plugins/security-guidance/hooks/security_reminder_hook.py
```

### 狀態檔案問題

如需重置警告狀態：

```bash
rm ~/.claude/security_warnings_state_*.json
```

## 限制與注意事項

### 已知限制

1. **正則表達式限制**：複雜的程式碼模式可能無法檢測
2. **上下文感知**：無法理解程式碼的完整上下文
3. **語言支援**：主要針對 JavaScript、Python、SQL
4. **誤報可能**：某些安全的程式碼可能觸發警告

### 不是替代品

此插件不能替代：
- 專業的安全審計
- 靜態應用程式安全測試（SAST）工具
- 動態應用程式安全測試（DAST）工具
- 人工程式碼審查

## 進階使用

### 與其他工具整合

可與以下工具配合使用：

- **ESLint**：JavaScript 靜態分析
- **Bandit**：Python 安全檢查
- **SonarQube**：綜合程式碼品質分析
- **Snyk**：依賴項漏洞掃描

### 自動化測試

在 CI/CD 中使用：

```yaml
# GitHub Actions 範例
- name: 執行安全檢查
  run: |
    python3 security_reminder_hook.py < test_input.json
```

## 版本資訊

- **版本**：1.0.0
- **作者**：David Dworken (繁體中文版)
- **最後更新**：2025

## 相關資源

### 安全最佳實踐

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [SANS Top 25](https://www.sans.org/top25-software-errors/)

### 工具與框架

- [DOMPurify](https://github.com/cure53/DOMPurify) - HTML 清理
- [Helmet.js](https://helmetjs.github.io/) - Node.js 安全
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python ORM

### Claude Code 文件

- [Claude Code 插件文件](https://docs.claude.com/en/docs/claude-code/plugins)
- [鉤子開發指南](https://docs.claude.com/en/docs/claude-code/hooks)

## 意見回饋與貢獻

如發現新的安全模式或有改進建議，歡迎：

1. 在 GitHub 建立 Issue
2. 提交 Pull Request
3. 分享使用經驗

您的回饋將幫助改進此插件，保護更多開發者的程式碼安全！
