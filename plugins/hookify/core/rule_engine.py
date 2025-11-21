#!/usr/bin/env python3
"""hookify 插件的規則評估引擎。"""

import re
import sys
from functools import lru_cache
from typing import List, Dict, Any, Optional

# 從本地模塊導入
from hookify.core.config_loader import Rule, Condition


# 緩存編譯的正則表達式（最多 128 個模式）
@lru_cache(maxsize=128)
def compile_regex(pattern: str) -> re.Pattern:
    """使用緩存編譯正則表達式模式。

    參數：
        pattern：正則表達式模式字符串

    返回：
        編譯的正則表達式模式
    """
    return re.compile(pattern, re.IGNORECASE)


class RuleEngine:
    """根據鉤子輸入數據評估規則。"""

    def __init__(self):
        """初始化規則引擎。"""
        # 不再需要實例緩存 - 使用全局 lru_cache
        pass

    def evaluate_rules(self, rules: List[Rule], input_data: Dict[str, Any]) -> Dict[str, Any]:
        """評估所有規則並返回合併結果。

        檢查所有規則並累積匹配。阻止規則優先於警告規則。
        所有匹配規則的消息都被合併。

        參數：
            rules：要評估的 Rule 對象列表
            input_data：鉤子輸入 JSON（tool_name、tool_input 等）

        返回：
            帶有 systemMessage、hookSpecificOutput 等的響應字典。
            如果沒有規則匹配，則為空字典 {}。
        """
        hook_event = input_data.get('hook_event_name', '')
        blocking_rules = []
        warning_rules = []

        for rule in rules:
            if self._rule_matches(rule, input_data):
                if rule.action == 'block':
                    blocking_rules.append(rule)
                else:
                    warning_rules.append(rule)

        # 如果有任何阻止規則匹配，則阻止操作
        if blocking_rules:
            messages = [f"**[{r.name}]**\n{r.message}" for r in blocking_rules]
            combined_message = "\n\n".join(messages)

            # 根據事件類型使用適當的阻止格式
            if hook_event == 'Stop':
                return {
                    "decision": "block",
                    "reason": combined_message,
                    "systemMessage": combined_message
                }
            elif hook_event in ['PreToolUse', 'PostToolUse']:
                return {
                    "hookSpecificOutput": {
                        "hookEventName": hook_event,
                        "permissionDecision": "deny"
                    },
                    "systemMessage": combined_message
                }
            else:
                # 對於其他事件，只顯示消息
                return {
                    "systemMessage": combined_message
                }

        # 如果只有警告，顯示它們但允許操作
        if warning_rules:
            messages = [f"**[{r.name}]**\n{r.message}" for r in warning_rules]
            return {
                "systemMessage": "\n\n".join(messages)
            }

        # 沒有匹配 - 允許操作
        return {}

    def _rule_matches(self, rule: Rule, input_data: Dict[str, Any]) -> bool:
        """檢查規則是否匹配輸入數據。

        參數：
            rule：要評估的規則
            input_data：鉤子輸入數據

        返回：
            如果規則匹配則為 True，否則為 False
        """
        # 提取工具信息
        tool_name = input_data.get('tool_name', '')
        tool_input = input_data.get('tool_input', {})

        # 如果指定，檢查工具匹配器
        if rule.tool_matcher:
            if not self._matches_tool(rule.tool_matcher, tool_name):
                return False

        # 如果沒有條件，不匹配
        # （規則必須至少有一個條件才有效）
        if not rule.conditions:
            return False

        # 所有條件都必須匹配
        for condition in rule.conditions:
            if not self._check_condition(condition, tool_name, tool_input, input_data):
                return False

        return True

    def _matches_tool(self, matcher: str, tool_name: str) -> bool:
        """檢查 tool_name 是否匹配匹配器模式。

        參數：
            matcher：像 "Bash"、"Edit|Write"、"*" 這樣的模式
            tool_name：實際工具名稱

        返回：
            如果匹配則為 True
        """
        if matcher == '*':
            return True

        # 在 | 上分割以進行 OR 匹配
        patterns = matcher.split('|')
        return tool_name in patterns

    def _check_condition(self, condition: Condition, tool_name: str,
                        tool_input: Dict[str, Any], input_data: Dict[str, Any] = None) -> bool:
        """檢查單個條件是否匹配。

        參數：
            condition：要檢查的條件
            tool_name：正在使用的工具
            tool_input：工具輸入字典
            input_data：完整的鉤子輸入數據（用於 Stop 事件等）

        返回：
            如果條件匹配則為 True
        """
        # 提取要檢查的字段值
        field_value = self._extract_field(condition.field, tool_name, tool_input, input_data)
        if field_value is None:
            return False

        # 應用操作符
        operator = condition.operator
        pattern = condition.pattern

        if operator == 'regex_match':
            return self._regex_match(pattern, field_value)
        elif operator == 'contains':
            return pattern in field_value
        elif operator == 'equals':
            return pattern == field_value
        elif operator == 'not_contains':
            return pattern not in field_value
        elif operator == 'starts_with':
            return field_value.startswith(pattern)
        elif operator == 'ends_with':
            return field_value.endswith(pattern)
        else:
            # 未知操作符
            return False

    def _extract_field(self, field: str, tool_name: str,
                      tool_input: Dict[str, Any], input_data: Dict[str, Any] = None) -> Optional[str]:
        """從工具輸入或鉤子輸入數據中提取字段值。

        參數：
            field：字段名稱，如 "command"、"new_text"、"file_path"、"reason"、"transcript"
            tool_name：正在使用的工具（對於 Stop 事件可能為空）
            tool_input：工具輸入字典
            input_data：完整鉤子輸入（用於訪問 transcript_path、reason 等）

        返回：
            字符串形式的字段值，如果未找到則為 None
        """
        # 直接 tool_input 字段
        if field in tool_input:
            value = tool_input[field]
            if isinstance(value, str):
                return value
            return str(value)

        # 對於 Stop 事件和其他非工具事件，檢查 input_data
        if input_data:
            # Stop 事件特定字段
            if field == 'reason':
                return input_data.get('reason', '')
            elif field == 'transcript':
                # 如果提供路徑，則讀取記錄文件
                transcript_path = input_data.get('transcript_path')
                if transcript_path:
                    try:
                        with open(transcript_path, 'r') as f:
                            return f.read()
                    except FileNotFoundError:
                        print(f"警告：未找到記錄文件：{transcript_path}", file=sys.stderr)
                        return ''
                    except PermissionError:
                        print(f"警告：讀取記錄時權限被拒絕：{transcript_path}", file=sys.stderr)
                        return ''
                    except (IOError, OSError) as e:
                        print(f"警告：讀取記錄 {transcript_path} 時出錯：{e}", file=sys.stderr)
                        return ''
                    except UnicodeDecodeError as e:
                        print(f"警告：記錄 {transcript_path} 中的編碼錯誤：{e}", file=sys.stderr)
                        return ''
            elif field == 'user_prompt':
                # 對於 UserPromptSubmit 事件
                return input_data.get('user_prompt', '')

        # 按工具類型處理特殊情況
        if tool_name == 'Bash':
            if field == 'command':
                return tool_input.get('command', '')

        elif tool_name in ['Write', 'Edit']:
            if field == 'content':
                # Write 使用 'content'，Edit 有 'new_string'
                return tool_input.get('content') or tool_input.get('new_string', '')
            elif field == 'new_text' or field == 'new_string':
                return tool_input.get('new_string', '')
            elif field == 'old_text' or field == 'old_string':
                return tool_input.get('old_string', '')
            elif field == 'file_path':
                return tool_input.get('file_path', '')

        elif tool_name == 'MultiEdit':
            if field == 'file_path':
                return tool_input.get('file_path', '')
            elif field in ['new_text', 'content']:
                # 連接所有編輯
                edits = tool_input.get('edits', [])
                return ' '.join(e.get('new_string', '') for e in edits)

        return None

    def _regex_match(self, pattern: str, text: str) -> bool:
        """使用正則表達式檢查模式是否匹配文本。

        參數：
            pattern：正則表達式模式
            text：要匹配的文本

        返回：
            如果模式匹配則為 True
        """
        try:
            # 使用緩存的編譯正則表達式（LRU 緩存，最多 128 個模式）
            regex = compile_regex(pattern)
            return bool(regex.search(text))

        except re.error as e:
            print(f"無效的正則表達式模式 '{pattern}'：{e}", file=sys.stderr)
            return False


# 用於測試
if __name__ == '__main__':
    from hookify.core.config_loader import Condition, Rule

    # 測試規則評估
    rule = Rule(
        name="test-rm",
        enabled=True,
        event="bash",
        conditions=[
            Condition(field="command", operator="regex_match", pattern=r"rm\s+-rf")
        ],
        message="危險的 rm 命令！"
    )

    engine = RuleEngine()

    # 測試匹配輸入
    test_input = {
        "tool_name": "Bash",
        "tool_input": {
            "command": "rm -rf /tmp/test"
        }
    }

    result = engine.evaluate_rules([rule], test_input)
    print("匹配結果：", result)

    # 測試非匹配輸入
    test_input2 = {
        "tool_name": "Bash",
        "tool_input": {
            "command": "ls -la"
        }
    }

    result2 = engine.evaluate_rules([rule], test_input2)
    print("非匹配結果：", result2)
