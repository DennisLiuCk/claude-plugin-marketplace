#!/usr/bin/env python3
"""hookify 插件的 PreToolUse 鉤子執行器。

此腳本在任何工具執行之前由 Claude Code 調用。
它讀取 .claude/hookify.*.local.md 文件並評估規則。
"""

import os
import sys
import json

# 關鍵：將插件根目錄添加到 Python 路徑以進行導入
# 我們需要添加插件目錄的父目錄，以便 Python 可以找到 "hookify" 套件
PLUGIN_ROOT = os.environ.get('CLAUDE_PLUGIN_ROOT')
if PLUGIN_ROOT:
    # 添加插件的父目錄
    parent_dir = os.path.dirname(PLUGIN_ROOT)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)

    # 如果我們有其他腳本，也添加 PLUGIN_ROOT 本身
    if PLUGIN_ROOT not in sys.path:
        sys.path.insert(0, PLUGIN_ROOT)

try:
    from hookify.core.config_loader import load_rules
    from hookify.core.rule_engine import RuleEngine
except ImportError as e:
    # 如果導入失敗，允許操作並記錄錯誤
    error_msg = {"systemMessage": f"Hookify 導入錯誤：{e}"}
    print(json.dumps(error_msg), file=sys.stdout)
    sys.exit(0)


def main():
    """PreToolUse 鉤子的主入口點。"""
    try:
        # 從 stdin 讀取輸入
        input_data = json.load(sys.stdin)

        # 確定用於過濾的事件類型
        # 對於 PreToolUse，我們使用 tool_name 來確定 "bash" 與 "file" 事件
        tool_name = input_data.get('tool_name', '')

        event = None
        if tool_name == 'Bash':
            event = 'bash'
        elif tool_name in ['Edit', 'Write', 'MultiEdit']:
            event = 'file'

        # 加載規則
        rules = load_rules(event=event)

        # 評估規則
        engine = RuleEngine()
        result = engine.evaluate_rules(rules, input_data)

        # 始終輸出 JSON（即使為空）
        print(json.dumps(result), file=sys.stdout)

    except Exception as e:
        # 出現任何錯誤時，允許操作並記錄
        error_output = {
            "systemMessage": f"Hookify 錯誤：{str(e)}"
        }
        print(json.dumps(error_output), file=sys.stdout)

    finally:
        # 始終退出 0 - 永遠不要因鉤子錯誤而阻止操作
        sys.exit(0)


if __name__ == '__main__':
    main()
