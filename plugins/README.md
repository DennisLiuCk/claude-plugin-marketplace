# Claude Code 插件集合

歡迎來到 Claude Code 繁體中文插件集合！這些插件專為繁體中文使用者設計，提供完整的繁體中文文件和說明。

## 插件概覽

### 開發工具

#### commit-commands
**簡化 Git 工作流程的命令集**

提供三個強大的命令來自動化常見的 Git 操作：
- `/commit` - 智慧分析變更並建立提交
- `/commit-push-pr` - 完整的提交、推送和 PR 建立流程
- `/clean_gone` - 清理已刪除的本地分支

**適用場景**：
- 日常開發工作流程
- 團隊協作專案
- 需要遵循提交訊息慣例

[查看詳細文件](./commit-commands/README.md)

---

#### feature-dev
**系統化的功能開發工作流程**

包含七個階段的完整開發流程，搭配三個專門代理：

**專門代理**：
- **code-explorer**：深入分析程式碼庫，追蹤執行路徑，理解架構
- **code-architect**：設計功能架構，評估多種方案，推薦最佳解決方案
- **code-reviewer**：審查程式碼品質，發現問題，提供改進建議

**七個階段**：
1. 發現與理解
2. 程式碼庫探索
3. 提出澄清問題
4. 架構設計
5. 實作
6. 品質審查
7. 總結

**適用場景**：
- 中大型功能開發
- 需要深入理解程式碼庫
- 重要且影響廣泛的變更
- 學習新專案

[查看詳細文件](./feature-dev/README.md)

---

### 安全與品質

#### security-guidance
**安全提醒鉤子系統**

在編輯檔案時自動檢測並警告潛在的安全問題。

**檢測模式**：
- GitHub Actions 工作流程注入
- 子程序執行漏洞（exec）
- 動態程式碼評估（eval、new Function）
- 基於 DOM 的 XSS
- Python Pickle 反序列化
- 作業系統命令注入
- SQL 注入風險
- 硬編碼密鑰

**特色**：
- 工作階段感知（每個問題只警告一次）
- 詳細的修復建議和程式碼範例
- 支援停用特定警告
- 自動清理舊狀態

**適用場景**：
- 安全性要求高的專案
- 學習安全編碼最佳實踐
- 團隊開發中的自動安全檢查

[查看詳細文件](./security-guidance/README.md)

---

## 安裝指南

### 方法一：使用 NPM 安裝單個插件

```bash
npx @claude-plugin/install github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands
```

### 方法二：安裝多個插件

```bash
npx @claude-plugin/install \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/commit-commands \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/security-guidance \
  github:DennisLiuCk/claude-plugin-marketplace/plugins/feature-dev
```

### 方法三：手動安裝

1. 複製儲存庫：
```bash
git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git
```

2. 複製插件到 Claude 插件目錄：
```bash
# 安裝單個插件
cp -r claude-plugin-marketplace/plugins/commit-commands ~/.claude/plugins/

# 或安裝所有插件
cp -r claude-plugin-marketplace/plugins/* ~/.claude/plugins/
```

## 插件架構

每個插件遵循標準結構：

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # 插件元資料
├── commands/                # 斜線命令（可選）
│   └── command-name.md
├── agents/                  # 專門代理（可選）
│   └── agent-name.md
├── hooks/                   # 鉤子腳本（可選）
│   ├── hooks.json
│   └── hook-script.py
└── README.md               # 插件文件
```

### 元件說明

#### plugin.json
定義插件的基本資訊：
- 名稱和版本
- 描述
- 作者資訊

#### 命令（Commands）
斜線命令讓您快速執行特定任務。格式：
- Markdown 檔案
- YAML frontmatter 定義元資料
- 內容為 Claude 的指示

#### 代理（Agents）
專門代理自主處理複雜任務。格式：
- Markdown 檔案
- YAML frontmatter 定義代理屬性
- 內容為代理的系統提示

#### 鉤子（Hooks）
事件驅動的自動化腳本。類型：
- preToolUse：工具使用前執行
- postToolUse：工具使用後執行
- 其他事件鉤子

## 使用建議

### 新手推薦

如果您是 Claude Code 新手，建議按此順序安裝：

1. **commit-commands** - 最實用，立即提升 Git 工作效率
2. **security-guidance** - 學習安全編碼最佳實踐
3. **feature-dev** - 當需要開發複雜功能時使用

### 進階使用

#### 組合使用插件

這些插件可以很好地配合使用：

**開發新功能**：
1. 使用 `/feature-dev` 啟動開發流程
2. `security-guidance` 在實作時自動檢查安全性
3. 完成後使用 `/commit-push-pr` 提交和建立 PR

**日常開發**：
1. `security-guidance` 持續監控程式碼安全
2. 使用 `/commit` 快速提交變更
3. 需要時用 `code-reviewer` 代理審查程式碼

#### 自訂配置

每個插件都可以自訂：

**commit-commands**：
- 修改允許的工具
- 調整提交訊息格式

**security-guidance**：
- 新增自訂安全模式
- 調整信心閾值
- 停用特定檢查

**feature-dev**：
- 調整工作流程階段
- 自訂代理提示
- 修改代理可用工具

## 插件比較

| 插件 | 類型 | 複雜度 | 學習曲線 | 日常使用頻率 |
|------|------|--------|----------|--------------|
| commit-commands | 命令 | 低 | 低 | 高 |
| security-guidance | 鉤子 | 中 | 低 | 自動 |
| feature-dev | 命令+代理 | 高 | 中 | 中 |

## 常見問題

### 一般問題

**Q：這些插件與官方插件有什麼不同？**

A：內容完全基於官方插件，主要差異是：
- 完整的繁體中文文件和說明
- 繁體中文的提示詞和指示
- 針對繁體中文使用者的範例

**Q：可以同時安裝多個插件嗎？**

A：可以！這些插件設計為相互補充，可以一起使用。

**Q：插件會自動更新嗎？**

A：目前需要手動更新。定期檢查儲存庫以獲取最新版本。

### 安裝問題

**Q：安裝後看不到命令怎麼辦？**

A：確認：
1. 插件已複製到正確的目錄（`~/.claude/plugins/`）
2. 重新啟動 Claude Code
3. 檢查 plugin.json 格式是否正確

**Q：權限錯誤怎麼處理？**

A：對於鉤子腳本，需要執行權限：
```bash
chmod +x ~/.claude/plugins/security-guidance/hooks/security_reminder_hook.py
```

### 使用問題

**Q：命令沒有按預期工作？**

A：檢查：
1. 提供足夠的上下文資訊
2. 確認命令語法正確
3. 查看插件 README 中的使用範例

**Q：如何停用特定插件？**

A：從插件目錄中移除或重新命名：
```bash
mv ~/.claude/plugins/plugin-name ~/.claude/plugins/plugin-name.disabled
```

## 貢獻指南

### 回報問題

如果發現問題：
1. 在 GitHub 建立 Issue
2. 提供詳細的錯誤資訊
3. 包含重現步驟
4. 附上環境資訊

### 改進插件

歡迎提交改進：
1. Fork 儲存庫
2. 建立功能分支
3. 進行變更
4. 提交 Pull Request

### 翻譯品質

如發現翻譯錯誤或有更好的表達方式：
1. 建立 Issue 說明
2. 或直接提交 PR 修正

## 最佳實踐

### 開發工作流程

建議的日常開發流程：

1. **早上開始工作**
   - 檢查並清理分支：`/clean_gone`

2. **開發新功能**
   - 複雜功能：`/feature-dev`
   - 簡單功能：直接實作

3. **實作過程中**
   - `security-guidance` 自動檢查安全性
   - 定期提交：`/commit`

4. **功能完成**
   - 最終審查
   - 建立 PR：`/commit-push-pr`

### 團隊協作

在團隊中使用：

1. **統一工具**
   - 團隊成員安裝相同插件
   - 確保一致的工作流程

2. **分享知識**
   - 分享代理報告作為文件
   - 討論審查發現

3. **建立標準**
   - 基於插件建立團隊標準
   - 自訂配置以符合團隊需求

## 學習資源

### 官方文件

- [Claude Code 官方文件](https://docs.claude.com/en/docs/claude-code)
- [插件開發指南](https://docs.claude.com/en/docs/claude-code/plugins)
- [代理開發指南](https://docs.claude.com/en/docs/claude-code/agents)

### 最佳實踐

- [Git 提交訊息慣例](https://www.conventionalcommits.org/)
- [OWASP 安全指南](https://owasp.org/)
- [程式碼審查最佳實踐](https://google.github.io/eng-practices/review/)

## 路線圖

### 即將推出

- **plugin-dev**：插件開發工具包
- 更多安全檢查模式
- 效能最佳化建議
- 測試覆蓋率分析

### 未來計畫

- 整合更多官方插件
- 自訂工作流程範本
- 團隊協作功能
- 視覺化報告

## 版本歷史

### v1.0.0（目前版本）

初始版本，包含：
- commit-commands 插件
- security-guidance 插件
- feature-dev 插件
- 完整繁體中文文件

## 授權

本專案基於原始 [anthropics/claude-code](https://github.com/anthropics/claude-code) 儲存庫的授權條款。

## 支援

### 獲取幫助

- 查看各插件的詳細 README
- 在 GitHub Issues 搜尋類似問題
- 建立新的 Issue 描述您的問題

### 社群

- GitHub Discussions：討論使用經驗
- Issue Tracker：回報錯誤和建議功能

---

**注意**：此為社群維護的繁體中文版本，非 Anthropic 官方專案。如需官方支援，請參考 [Anthropic 官方儲存庫](https://github.com/anthropics/claude-code)。

感謝您使用 Claude Code 繁體中文插件！希望這些工具能提升您的開發效率。
