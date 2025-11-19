#!/usr/bin/env python3
"""
安全提醒鉤子 - Claude Code

此鉤子在檔案編輯前檢測潛在的安全漏洞。
它會分析檔案內容並警告常見的安全問題。
"""

import json
import sys
import os
import re
from pathlib import Path
from datetime import datetime, timedelta

# 定義安全模式及其警告訊息
SECURITY_PATTERNS = [
    {
        "name": "GitHub Actions 工作流程注入",
        "pattern": r'\$\{\{\s*github\.(event|head_ref|base_ref)',
        "description": "GitHub Actions 工作流程中的潛在命令注入",
        "warning": """
⚠️  安全警告：GitHub Actions 工作流程注入

偵測到在 shell 命令中使用未經淨化的 GitHub 事件內容。
這可能導致命令注入漏洞。

建議：
- 避免直接在 shell 命令中使用 ${{{{ github.event.* }}}}
- 使用環境變數並適當地引用
- 考慮使用 GitHub Actions 的內建功能

參考：https://securitylab.github.com/research/github-actions-untrusted-input/
""",
        "confidence": 0.9
    },
    {
        "name": "子程序執行",
        "pattern": r'\.exec\s*\(',
        "description": "使用不安全的子程序執行方法",
        "warning": """
⚠️  安全警告：不安全的子程序執行

偵測到使用 .exec()，這可能導致 shell 注入漏洞。

建議：
- 改用 execFile() 或 spawn()
- 如果必須使用 exec()，請驗證和淨化所有輸入
- 考慮使用白名單方式處理命令

Node.js 範例：
// 不安全
exec(`command ${userInput}`)

// 較安全
execFile('command', [arg1, arg2])
""",
        "confidence": 0.8
    },
    {
        "name": "動態程式碼評估",
        "pattern": r'(new\s+Function|eval)\s*\(',
        "description": "使用 eval 或 new Function",
        "warning": """
⚠️  安全警告：動態程式碼評估

偵測到使用 eval() 或 new Function()，這可能導致程式碼注入漏洞。

建議：
- 避免使用 eval() 和 new Function()
- 使用 JSON.parse() 處理 JSON 資料
- 使用靜態程式碼分析工具
- 如果無法避免，嚴格驗證輸入

替代方案：
- 使用物件字面量或 Map
- 使用範本引擎（如 Handlebars、Mustache）
- 重構程式碼以避免動態評估
""",
        "confidence": 0.95
    },
    {
        "name": "基於 DOM 的 XSS",
        "pattern": r'(dangerouslySetInnerHTML|innerHTML|document\.write)\s*[=\(]',
        "description": "潛在的跨站腳本（XSS）漏洞",
        "warning": """
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

React 安全範例：
// 不安全
<div dangerouslySetInnerHTML={{{{__html: userInput}}}} />

// 較安全
<div>{{userInput}}</div>  // 自動轉義
""",
        "confidence": 0.85
    },
    {
        "name": "Python Pickle 反序列化",
        "pattern": r'pickle\.loads?\s*\(',
        "description": "不安全的 pickle 反序列化",
        "warning": """
⚠️  安全警告：不安全的反序列化

偵測到使用 pickle.load() 或 pickle.loads()，這可能導致任意程式碼執行。

風險：
- Pickle 可以執行任意 Python 程式碼
- 不受信任的 pickle 資料可能包含惡意載荷
- 攻擊者可能獲得系統完全控制權

建議：
- 永遠不要反序列化不受信任的資料
- 使用 JSON 或其他安全的序列化格式
- 如果必須使用 pickle，驗證資料來源
- 考慮使用 hmac 簽名驗證資料完整性

替代方案：
import json
data = json.loads(json_string)  # 安全的替代方案
""",
        "confidence": 0.9
    },
    {
        "name": "作業系統命令注入",
        "pattern": r'os\.system\s*\(',
        "description": "潛在的命令注入漏洞",
        "warning": """
⚠️  安全警告：作業系統命令注入

偵測到使用 os.system()，這容易受到命令注入攻擊。

風險：
- Shell 元字元可能被利用執行任意命令
- 使用者輸入未經淨化可能導致系統入侵
- 可能洩露敏感資訊

建議：
- 使用 subprocess.run() 並傳遞參數列表
- 永遠不要直接拼接使用者輸入到命令中
- 使用 shlex.quote() 淨化輸入
- 實施最小權限原則

安全範例：
# 不安全
os.system(f"ls {user_input}")

# 較安全
subprocess.run(['ls', user_input], check=True)
""",
        "confidence": 0.9
    },
    {
        "name": "SQL 注入風險",
        "pattern": r'(execute|query)\s*\(\s*[\'"`].*%s.*[\'"`]|f[\'"`].*SELECT.*FROM',
        "description": "潛在的 SQL 注入漏洞",
        "warning": """
⚠️  安全警告：SQL 注入風險

偵測到可能的 SQL 注入漏洞。

風險：
- 字串拼接可能導致 SQL 注入
- 攻擊者可能讀取、修改或刪除資料庫資料
- 可能繞過身份驗證和授權

建議：
- 使用參數化查詢或預備語句
- 使用 ORM（如 SQLAlchemy、Django ORM）
- 永遠不要直接拼接使用者輸入到 SQL 查詢
- 實施最小權限資料庫存取

安全範例：
# 不安全
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")

# 較安全
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
""",
        "confidence": 0.85
    },
    {
        "name": "硬編碼密鑰",
        "pattern": r'(password|secret|api[_-]?key|token)\s*=\s*[\'"`][A-Za-z0-9+/=]{8,}[\'"`]',
        "description": "可能的硬編碼敏感資訊",
        "warning": """
⚠️  安全警告：硬編碼敏感資訊

偵測到可能的硬編碼密碼、金鑰或令牌。

風險：
- 敏感資訊可能被提交到版本控制系統
- 原始碼洩露可能導致未授權存取
- 難以輪換和管理密鑰

建議：
- 使用環境變數儲存敏感資訊
- 使用密鑰管理服務（如 AWS Secrets Manager、HashiCorp Vault）
- 永遠不要將密鑰提交到版本控制
- 使用 .env 檔案並將其加入 .gitignore

最佳實踐：
# 不安全
api_key = "sk_live_abc123xyz789"

# 較安全
api_key = os.getenv('API_KEY')
""",
        "confidence": 0.95
    }
]


def load_session_state(session_id):
    """載入此工作階段已顯示警告的狀態"""
    state_dir = Path.home() / '.claude'
    state_dir.mkdir(exist_ok=True)
    state_file = state_dir / f'security_warnings_state_{session_id}.json'

    # 清理超過 30 天的舊狀態檔案
    cleanup_old_state_files(state_dir)

    if state_file.exists():
        try:
            with open(state_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    return {}


def save_session_state(session_id, state):
    """儲存此工作階段已顯示警告的狀態"""
    state_dir = Path.home() / '.claude'
    state_dir.mkdir(exist_ok=True)
    state_file = state_dir / f'security_warnings_state_{session_id}.json'

    with open(state_file, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False)


def cleanup_old_state_files(state_dir):
    """清理超過 30 天的狀態檔案"""
    try:
        cutoff = datetime.now() - timedelta(days=30)
        for file in state_dir.glob('security_warnings_state_*.json'):
            if datetime.fromtimestamp(file.stat().st_mtime) < cutoff:
                file.unlink()
    except:
        pass


def check_security_patterns(file_path, content):
    """檢查內容中的安全模式"""
    warnings = []

    for pattern_info in SECURITY_PATTERNS:
        pattern = pattern_info["pattern"]
        if re.search(pattern, content, re.MULTILINE | re.IGNORECASE):
            warnings.append({
                "name": pattern_info["name"],
                "description": pattern_info["description"],
                "warning": pattern_info["warning"],
                "confidence": pattern_info["confidence"],
                "file": file_path
            })

    return warnings


def main():
    """主要執行函式"""
    # 檢查是否啟用安全提醒
    if os.getenv('ENABLE_SECURITY_REMINDER', 'true').lower() == 'false':
        sys.exit(0)

    try:
        # 從 stdin 讀取輸入
        input_data = json.loads(sys.stdin.read())

        session_id = input_data.get('sessionId', 'default')
        tool_name = input_data.get('toolName', '')
        file_path = input_data.get('filePath', '')

        # 載入工作階段狀態
        session_state = load_session_state(session_id)

        # 提取檔案內容
        content = ""
        if tool_name == "Write":
            content = input_data.get('content', '')
        elif tool_name == "Edit":
            content = input_data.get('newString', '')
        elif tool_name == "MultiEdit":
            edits = input_data.get('edits', [])
            content = '\n'.join([edit.get('newString', '') for edit in edits])

        # 檢查安全模式
        warnings = check_security_patterns(file_path, content)

        # 過濾已顯示過的警告
        new_warnings = []
        for warning in warnings:
            warning_key = f"{file_path}:{warning['name']}"
            if warning_key not in session_state:
                new_warnings.append(warning)
                session_state[warning_key] = True

        # 如果有新警告，顯示並阻止執行
        if new_warnings:
            # 儲存狀態
            save_session_state(session_id, session_state)

            # 顯示警告
            print("=" * 80, file=sys.stderr)
            print(f"檔案：{file_path}", file=sys.stderr)
            print("=" * 80, file=sys.stderr)

            for warning in new_warnings:
                print(warning['warning'], file=sys.stderr)
                print("-" * 80, file=sys.stderr)

            print("\n如果您確定這些變更是安全的，可以繼續執行。", file=sys.stderr)
            print("若要停用此警告，請設定環境變數：ENABLE_SECURITY_REMINDER=false", file=sys.stderr)
            print("=" * 80, file=sys.stderr)

            # 返回代碼 2 表示阻止但允許重試
            sys.exit(2)

        # 沒有警告或已顯示過，允許繼續
        sys.exit(0)

    except Exception as e:
        # 發生錯誤時不阻止執行
        print(f"安全檢查發生錯誤：{e}", file=sys.stderr)
        sys.exit(0)


if __name__ == '__main__':
    main()
