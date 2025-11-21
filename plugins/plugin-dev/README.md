# 插件開發工具包

用於創建 Claude Code 插件的全面工具包，包括代理、命令、技能、鉤子和 MCP 集成。

## 概述

插件開發工具包提供工具、模板和最佳實踐，用於構建 Claude Code 插件。它包括用於創建和驗證插件組件的專業代理和技能。

## 功能

### 命令

- `/create-plugin` - 使用互動提示創建新插件

### 代理

- `agent-creator` - 幫助創建新的 Claude Code 代理
- `plugin-validator` - 驗證插件結構和配置
- `skill-reviewer` - 審查和改進技能定義

### 技能

- **agent-development** - 創建和驗證 Claude Code 代理
- **command-development** - 開發斜杠命令
- **hook-development** - 實現插件鉤子
- **mcp-integration** - 集成 MCP 服務器
- **plugin-settings** - 管理插件設置
- **plugin-structure** - 組織插件結構
- **skill-development** - 創建可重用技能

## 快速開始

創建新插件：
```bash
/create-plugin my-plugin-name
```

該命令將引導您完成創建插件所需組件的過程。

## 文檔

每個技能都包含詳細的文檔、示例和參考資料。探索 `skills/` 目錄以了解有關每個插件組件類型的更多信息。

## 最佳實踐

- 使用描述性命名約定
- 提供全面的文檔
- 包括使用示例
- 在發布前驗證插件
- 遵循 Claude Code 插件指南

## 資源

- [Claude Code 插件文檔](https://docs.claude.com/en/docs/claude-code/plugins)
- [MCP 文檔](https://modelcontextprotocol.io)

## 作者

Ashwin Bhat (ashwin@anthropic.com)

## 版本

1.0.0
