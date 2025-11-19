# Commit Commands 插件

使用簡單命令簡化您的 Git 工作流程，包括提交、推送和建立 Pull Request。

## 功能特色

此插件提供三個核心命令來自動化常見的 Git 操作：

### `/commit` - 智慧提交

自動分析您的變更並根據儲存庫現有的提交風格建立提交。它會：
- 自動暫存相關檔案
- 分析變更內容並生成適當的提交訊息
- 遵循儲存庫的提交訊息慣例
- 避免提交敏感檔案（如 `.env`、`credentials.json` 等）

### `/commit-push-pr` - 完整工作流程

執行從提交到 PR 建立的完整流程：
1. 如有需要，建立新分支
2. 提交變更
3. 推送到遠端
4. 使用 GitHub CLI 開啟 Pull Request
5. 自動生成 PR 描述（包括摘要和測試計畫）

### `/clean_gone` - 清理分支

移除已從遠端刪除的本地分支：
- 清理標記為 "[gone]" 的分支
- 移除相關的工作樹
- 保持分支列表整潔有序

## 系統需求

- 已安裝並配置 Git
- GitHub CLI (`gh`) - PR 建立功能所需
- 已配置遠端的 Git 儲存庫

## 安裝方式

使用 NPM 安裝：

```bash
npx @claude-plugin/install github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands
```

或手動安裝：

```bash
cp -r plugins/commit-commands ~/.claude/plugins/
```

## 使用說明

### 快速提交

```
使用者：我修改了登入功能，請幫我提交這些變更
Claude：[執行 /commit 命令]
```

### 完整 PR 工作流程

```
使用者：我完成了新功能開發，請提交並建立 PR
Claude：[執行 /commit-push-pr 命令]
```

### 清理過期分支

```
使用者：清理所有已合併的分支
Claude：[執行 /clean_gone 命令]
```

## 最佳實踐

### 提交前檢查
- 在提交前檢查暫存的變更
- 讓 Claude 分析並匹配儲存庫的提交風格
- 善用自動化處理例行提交

### PR 建立
- 確保變更完整且已測試
- 提供清晰的功能描述
- 檢查自動生成的 PR 描述並視需要調整

### 分支清理
- 在合併多個 Pull Request 後定期執行
- 在執行清理前確認不需要保留的分支
- 檢查清理結果確保正確的分支被刪除

## 工作流程範例

### 開發流程

```
1. 進行程式碼變更
2. 執行 /commit 建立提交
3. 繼續開發和提交
4. 完成後執行 /commit-push-pr 建立 PR
```

### 功能分支開發

```
1. 在功能分支上工作
2. 多次使用 /commit 記錄進度
3. 完成後使用 /commit-push-pr 推送並建立 PR
4. PR 合併後使用 /clean_gone 清理本地分支
```

### 維護工作流程

```
1. 定期執行 /clean_gone 保持分支整潔
2. 使用 /commit 處理小型修復
3. 使用 /commit-push-pr 處理需要審查的變更
```

## 提交訊息風格

此插件會自動分析您儲存庫的提交歷史並匹配現有的風格。常見的提交訊息慣例包括：

- **傳統式提交**：`feat: 新增使用者登入功能`
- **簡短描述式**：`新增使用者登入功能`
- **詳細描述式**：包含多行說明和變更原因

## 疑難排解

### GitHub CLI 未安裝

如果 `/commit-push-pr` 失敗並顯示 `gh: command not found`：

```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
winget install GitHub.cli
```

### 未配置遠端

如果推送失敗：

```bash
# 新增遠端
git remote add origin <repository-url>

# 或設定上游分支
git push -u origin <branch-name>
```

### 提交訊息問題

如果生成的提交訊息不符合預期：
- 確保儲存庫有足夠的提交歷史供參考
- 手動調整提交訊息風格
- 在專案中建立提交訊息範本

## 技術細節

### 允許的 Bash 命令

每個命令僅允許特定的 Git 操作：

**commit 命令**：
- `git add`
- `git status`
- `git commit`

**commit-push-pr 命令**：
- `git checkout --branch`
- `git add`
- `git status`
- `git push`
- `git commit`
- `gh pr create`

**clean_gone 命令**：
- `git fetch`
- `git branch`
- `git worktree`

## 版本資訊

- **版本**：1.0.0
- **作者**：Anthropic (繁體中文版)
- **授權**：請參考原始儲存庫授權

## 相關資源

- [Git 官方文件](https://git-scm.com/doc)
- [GitHub CLI 文件](https://cli.github.com/manual/)
- [Claude Code 插件文件](https://docs.claude.com/en/docs/claude-code/plugins)

## 意見回饋

如遇到問題或有改進建議，請在 GitHub 儲存庫中建立 Issue。
