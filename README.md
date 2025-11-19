# Claude Code 繁體中文插件市場

歡迎來到 Claude Code 繁體中文插件市場！這個儲存庫提供了專為繁體中文使用者設計的 Claude Code 插件集合，幫助您更輕鬆地學習和使用 Claude Code 的各種功能。

## 關於此專案

此專案基於 Anthropic 官方的 [claude-code](https://github.com/anthropics/claude-code) 儲存庫，將其中的金標準插件翻譯成繁體中文版本，包括：

- 命令提示詞
- 代理指令
- 鉤子腳本
- 技能說明

## 專案目標

1. **降低學習門檻**：提供繁體中文介面，讓華語使用者更容易理解和使用 Claude Code 插件
2. **保持品質標準**：複製官方儲存庫的金標準，確保插件品質
3. **促進本地化**：針對繁體中文使用者的需求進行適當調整

## 可用插件

### 開發工具
- **commit-commands** - 簡化 Git 工作流程的命令集
- **feature-dev** - 系統化的功能開發工作流程
- **plugin-dev** - 插件開發工具包

### 安全與品質
- **security-guidance** - 編輯檔案時的安全提醒系統

## 安裝方式

### 使用 NPM 安裝

```bash
# 安裝特定插件
npx @claude-plugin/install github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands

# 或安裝多個插件
npx @claude-plugin/install \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/security-guidance
```

### 手動安裝

1. 複製此儲存庫：
```bash
git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git
```

2. 將插件目錄複製到您的專案：
```bash
cp -r claude-plugin-marketplace/plugins/commit-commands ~/.claude/plugins/
```

## 使用說明

安裝插件後，您可以在 Claude Code 中使用相應的斜線命令：

- `/commit` - 建立 Git 提交
- `/commit-push-pr` - 提交、推送並建立 Pull Request
- `/feature-dev` - 啟動功能開發工作流程
- 更多命令請參考各插件的 README 檔案

## 儲存庫結構

```
claude-plugin-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # 市場配置檔案
├── plugins/                       # 插件目錄
│   ├── commit-commands/          # Git 工作流程命令
│   ├── security-guidance/        # 安全提醒
│   ├── feature-dev/              # 功能開發工作流程
│   └── plugin-dev/               # 插件開發工具
└── README.md                      # 本檔案
```

## 貢獻指南

歡迎提交 Issue 和 Pull Request！如果您發現翻譯錯誤或有改進建議，請隨時提出。

### 貢獻步驟

1. Fork 此儲存庫
2. 建立您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的變更 (`git commit -m '新增某個很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟一個 Pull Request

## 授權

本專案基於原始 [anthropics/claude-code](https://github.com/anthropics/claude-code) 儲存庫的授權條款。

## 相關資源

- [Claude Code 官方文件](https://docs.claude.com/en/docs/claude-code)
- [Claude Code GitHub 儲存庫](https://github.com/anthropics/claude-code)
- [Anthropic 官方網站](https://www.anthropic.com)

## 支援

如果您遇到問題或需要協助：

1. 查看各插件的 README 檔案
2. 在 GitHub Issues 中搜尋類似問題
3. 建立新的 Issue 詳細描述您的問題

---

**注意**：此專案為社群維護的繁體中文版本，非 Anthropic 官方專案。如需官方支援，請參考 [Anthropic 官方儲存庫](https://github.com/anthropics/claude-code)。
