#!/usr/bin/env python3
"""hookify 插件的配置加載器。

加載並解析 .claude/hookify.*.local.md 文件。
"""

import os
import sys
import glob
import re
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field


@dataclass
class Condition:
    """匹配的單個條件。"""
    field: str  # "command", "new_text", "old_text", "file_path", 等
    operator: str  # "regex_match", "contains", "equals", 等
    pattern: str  # 要匹配的模式

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Condition':
        """從字典創建 Condition。"""
        return cls(
            field=data.get('field', ''),
            operator=data.get('operator', 'regex_match'),
            pattern=data.get('pattern', '')
        )


@dataclass
class Rule:
    """hookify 規則。"""
    name: str
    enabled: bool
    event: str  # "bash", "file", "stop", "all", 等
    pattern: Optional[str] = None  # 簡單模式（舊版）
    conditions: List[Condition] = field(default_factory=list)
    action: str = "warn"  # "warn" 或 "block"（未來）
    tool_matcher: Optional[str] = None  # 覆蓋工具匹配
    message: str = ""  # markdown 中的消息正文

    @classmethod
    def from_dict(cls, frontmatter: Dict[str, Any], message: str) -> 'Rule':
        """從前置字典和消息正文創建 Rule。"""
        # 處理簡單模式和複雜條件
        conditions = []

        # 新樣式：明確的條件列表
        if 'conditions' in frontmatter:
            cond_list = frontmatter['conditions']
            if isinstance(cond_list, list):
                conditions = [Condition.from_dict(c) for c in cond_list]

        # 舊樣式：簡單模式字段
        simple_pattern = frontmatter.get('pattern')
        if simple_pattern and not conditions:
            # 將簡單模式轉換為條件
            # 從事件推斷字段
            event = frontmatter.get('event', 'all')
            if event == 'bash':
                field = 'command'
            elif event == 'file':
                field = 'new_text'
            else:
                field = 'content'

            conditions = [Condition(
                field=field,
                operator='regex_match',
                pattern=simple_pattern
            )]

        return cls(
            name=frontmatter.get('name', 'unnamed'),
            enabled=frontmatter.get('enabled', True),
            event=frontmatter.get('event', 'all'),
            pattern=simple_pattern,
            conditions=conditions,
            action=frontmatter.get('action', 'warn'),
            tool_matcher=frontmatter.get('tool_matcher'),
            message=message.strip()
        )


def extract_frontmatter(content: str) -> tuple[Dict[str, Any], str]:
    """從 markdown 提取 YAML 前置和消息正文。

    返回 (frontmatter_dict, message_body)。

    通過保留縮進支持列表中的多行字典項。
    """
    if not content.startswith('---'):
        return {}, content

    # 在 --- 標記上分割
    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}, content

    frontmatter_text = parts[1]
    message = parts[2].strip()

    # 處理縮進列表項的簡單 YAML 解析器
    frontmatter = {}
    lines = frontmatter_text.split('\n')

    current_key = None
    current_list = []
    current_dict = {}
    in_list = False
    in_dict_item = False

    for line in lines:
        # 跳過空行和註釋
        stripped = line.strip()
        if not stripped or stripped.startswith('#'):
            continue

        # 檢查縮進級別
        indent = len(line) - len(line.lstrip())

        # 頂級鍵（無縮進或最小縮進）
        if indent == 0 and ':' in line and not line.strip().startswith('-'):
            # 保存之前的列表/字典（如果有）
            if in_list and current_key:
                if in_dict_item and current_dict:
                    current_list.append(current_dict)
                    current_dict = {}
                frontmatter[current_key] = current_list
                in_list = False
                in_dict_item = False
                current_list = []

            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            if not value:
                # 空值 - 後面跟列表或嵌套結構
                current_key = key
                in_list = True
                current_list = []
            else:
                # 簡單鍵值對
                value = value.strip('"').strip("'")
                if value.lower() == 'true':
                    value = True
                elif value.lower() == 'false':
                    value = False
                frontmatter[key] = value

        # 列表項（以 - 開頭）
        elif stripped.startswith('-') and in_list:
            # 保存之前的字典項（如果有）
            if in_dict_item and current_dict:
                current_list.append(current_dict)
                current_dict = {}

            item_text = stripped[1:].strip()

            # 檢查這是否是內聯字典（同一行上的 key: value）
            if ':' in item_text and ',' in item_text:
                # 內聯逗號分隔的字典："- field: command, operator: regex_match"
                item_dict = {}
                for part in item_text.split(','):
                    if ':' in part:
                        k, v = part.split(':', 1)
                        item_dict[k.strip()] = v.strip().strip('"').strip("'")
                current_list.append(item_dict)
                in_dict_item = False
            elif ':' in item_text:
                # 多行字典項的開始："- field: command"
                in_dict_item = True
                k, v = item_text.split(':', 1)
                current_dict = {k.strip(): v.strip().strip('"').strip("'")}
            else:
                # 簡單列表項
                current_list.append(item_text.strip('"').strip("'"))
                in_dict_item = False

        # 字典項的延續（在列表項下縮進）
        elif indent > 2 and in_dict_item and ':' in line:
            # 這是當前字典項的字段
            k, v = stripped.split(':', 1)
            current_dict[k.strip()] = v.strip().strip('"').strip("'")

    # 保存最終列表/字典（如果有）
    if in_list and current_key:
        if in_dict_item and current_dict:
            current_list.append(current_dict)
        frontmatter[current_key] = current_list

    return frontmatter, message


def load_rules(event: Optional[str] = None) -> List[Rule]:
    """從 .claude 目錄加載所有 hookify 規則。

    參數：
        event：可選事件過濾器（"bash"、"file"、"stop"等）

    返回：
        與事件匹配的已啟用 Rule 對象列表。
    """
    rules = []

    # 查找所有 hookify.*.local.md 文件
    pattern = os.path.join('.claude', 'hookify.*.local.md')
    files = glob.glob(pattern)

    for file_path in files:
        try:
            rule = load_rule_file(file_path)
            if not rule:
                continue

            # 如果指定，按事件過濾
            if event:
                if rule.event != 'all' and rule.event != event:
                    continue

            # 僅包含已啟用的規則
            if rule.enabled:
                rules.append(rule)

        except (IOError, OSError, PermissionError) as e:
            # 文件 I/O 錯誤 - 記錄並繼續
            print(f"警告：無法讀取 {file_path}：{e}", file=sys.stderr)
            continue
        except (ValueError, KeyError, AttributeError, TypeError) as e:
            # 解析錯誤 - 記錄並繼續
            print(f"警告：無法解析 {file_path}：{e}", file=sys.stderr)
            continue
        except Exception as e:
            # 意外錯誤 - 記錄類型詳細信息
            print(f"警告：加載 {file_path} 時出現意外錯誤（{type(e).__name__}）：{e}", file=sys.stderr)
            continue

    return rules


def load_rule_file(file_path: str) -> Optional[Rule]:
    """加載單個規則文件。

    返回：
        Rule 對象，如果文件無效則為 None。
    """
    try:
        with open(file_path, 'r') as f:
            content = f.read()

        frontmatter, message = extract_frontmatter(content)

        if not frontmatter:
            print(f"警告：{file_path} 缺少 YAML 前置（必須以 --- 開頭）", file=sys.stderr)
            return None

        rule = Rule.from_dict(frontmatter, message)
        return rule

    except (IOError, OSError, PermissionError) as e:
        print(f"錯誤：無法讀取 {file_path}：{e}", file=sys.stderr)
        return None
    except (ValueError, KeyError, AttributeError, TypeError) as e:
        print(f"錯誤：規則文件格式錯誤 {file_path}：{e}", file=sys.stderr)
        return None
    except UnicodeDecodeError as e:
        print(f"錯誤：{file_path} 編碼無效：{e}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"錯誤：解析 {file_path} 時出現意外錯誤（{type(e).__name__}）：{e}", file=sys.stderr)
        return None


# 用於測試
if __name__ == '__main__':
    import sys

    # 測試前置解析
    test_content = """---
name: test-rule
enabled: true
event: bash
pattern: "rm -rf"
---

⚠️ 檢測到危險命令！
"""

    fm, msg = extract_frontmatter(test_content)
    print("前置：", fm)
    print("消息：", msg)

    rule = Rule.from_dict(fm, msg)
    print("規則：", rule)
