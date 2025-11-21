#!/usr/bin/env python3
"""hookify 插件的 UserPromptSubmit 鉤子執行器。

此腳本在用戶提交提示時由 Claude Code 調用。
它讀取 .claude/hookify.*.local.md 文件並評估規則。
"""

import os
import sys
import json

# 關鍵：將插件根目錄添加到 Python 路徑以進行導入
PLUGIN_ROOT = os.environ.get('CLAUDE_PLUGIN_ROOT')
if PLUGIN_ROOT:
    parent_dir = os.path.dirname(PLUGIN_ROOT)
    if parent_dir not in sys.path:
        sys.path.insert(0, parent_dir)
    if PLUGIN_ROOT not in sys.path:
        sys.path.insert(0, PLUGIN_ROOT)

try:
    from hookify.core.config_loader import load_rules
    from hookify.core.rule_engine import RuleEngine
except ImportError as e:
    error_msg = {"systemMessage": f"Hookify 導入錯誤：{e}"}
    print(json.dumps(error_msg), file=sys.stdout)
    sys.exit(0)


def main():
    """UserPromptSubmit 鉤子的主入口點。"""
    try:
        # 從 stdin 讀取輸入
        input_data = json.load(sys.stdin)

        # 加載用戶提示規則
        rules = load_rules(event='prompt')

        # 評估規則
        engine = RuleEngine()
        result = engine.evaluate_rules(rules, input_data)

        # 始終輸出 JSON（即使為空）
        print(json.dumps(result), file=sys.stdout)

    except Exception as e:
        error_output = {
            "systemMessage": f"Hookify 錯誤：{str(e)}"
        }
        print(json.dumps(error_output), file=sys.stdout)

    finally:
        # 始終退出 0
        sys.exit(0)


if __name__ == '__main__':
    main()
