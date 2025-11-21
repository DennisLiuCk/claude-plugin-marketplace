# Ralph Wiggum 插件

在 Claude Code 中實現迭代式、自引用 AI 開發循環的 Ralph Wiggum 技術。

## 什麼是 Ralph？

Ralph 是一種基於連續 AI 代理循環的開發方法。正如 Geoffrey Huntley 所描述的：**"Ralph 是一個 Bash 循環"** - 一個簡單的 `while true`，反覆向 AI 代理提供提示文件，允許它迭代改進其工作直到完成。

該技術以《辛普森一家》中的 Ralph Wiggum 命名，體現了儘管遇到挫折仍堅持迭代的理念。

### 核心概念

此插件使用 **Stop 鉤子** 實現 Ralph，該鉤子攔截 Claude 的退出嘗試：

```bash
# 您只需運行一次：
/ralph-loop "您的任務描述" --completion-promise "DONE"

# 然後 Claude Code 自動：
# 1. 處理任務
# 2. 嘗試退出
# 3. Stop 鉤子阻止退出
# 4. Stop 鉤子回饋相同的提示
# 5. 重複直到完成
```

循環發生在**您當前的會話內** - 您不需要外部 bash 循環。`hooks/stop-hook.sh` 中的 Stop 鉤子通過阻止正常會話退出來創建自引用反饋循環。

這創建了一個**自引用反饋循環**，其中：
- 提示在迭代之間從不改變
- Claude 之前的工作保存在文件中
- 每次迭代都看到修改後的文件和 git 歷史記錄
- Claude 通過讀取文件中自己過去的工作自主改進

## 快速開始

```bash
/ralph-loop "構建待辦事項的 REST API。要求：CRUD 操作、輸入驗證、測試。完成時輸出 <promise>COMPLETE</promise>。" --completion-promise "COMPLETE" --max-iterations 50
```

Claude 將：
- 迭代實現 API
- 運行測試並查看失敗
- 根據測試輸出修復錯誤
- 迭代直到滿足所有要求
- 完成時輸出完成承諾

## 命令

### /ralph-loop

在您當前的會話中啟動 Ralph 循環。

**用法：**
```bash
/ralph-loop "<提示>" --max-iterations <n> --completion-promise "<文本>"
```

**選項：**
- `--max-iterations <n>` - N 次迭代後停止（默認：無限制）
- `--completion-promise <文本>` - 表示完成的短語

### /cancel-ralph

取消活動的 Ralph 循環。

**用法：**
```bash
/cancel-ralph
```

## 提示編寫最佳實踐

### 1. 清晰的完成標準

❌ 不好："構建待辦事項 API 並使其良好。"

✅ 好：
```markdown
構建待辦事項的 REST API。

完成時：
- 所有 CRUD 端點工作
- 輸入驗證就位
- 測試通過（覆蓋率 > 80%）
- 帶有 API 文檔的 README
- 輸出：<promise>COMPLETE</promise>
```

### 2. 增量目標

❌ 不好："創建完整的電子商務平台。"

✅ 好：
```markdown
階段 1：用戶身份驗證（JWT、測試）
階段 2：產品目錄（列表/搜索、測試）
階段 3：購物車（添加/刪除、測試）

完成所有階段時輸出 <promise>COMPLETE</promise>。
```

### 3. 自我糾正

❌ 不好："為功能 X 編寫代碼。"

✅ 好：
```markdown
按照 TDD 實現功能 X：
1. 編寫失敗的測試
2. 實現功能
3. 運行測試
4. 如果有任何失敗，調試並修復
5. 如需要則重構
6. 重複直到全部通過
7. 輸出：<promise>COMPLETE</promise>
```

### 4. 逃生艙

始終使用 `--max-iterations` 作為安全網，以防止無法完成的任務的無限循環：

```bash
# 推薦：始終設置合理的迭代限制
/ralph-loop "嘗試實現功能 X" --max-iterations 20

# 在您的提示中，包括如果卡住該怎麼辦：
# "15 次迭代後，如果未完成：
#  - 記錄阻礙進度的內容
#  - 列出嘗試的內容
#  - 建議替代方法"
```

**注意**：`--completion-promise` 使用精確字符串匹配，因此您不能將其用於多個完成條件（如"SUCCESS"與"BLOCKED"）。始終依賴 `--max-iterations` 作為您的主要安全機制。

## 理念

Ralph 體現了幾個關鍵原則：

### 1. 迭代 > 完美
不要在第一次嘗試時追求完美。讓循環完善工作。

### 2. 失敗是數據
"確定性地差"意味著失敗是可預測且有信息量的。使用它們來調整提示。

### 3. 操作員技能很重要
成功取決於編寫良好的提示，而不僅僅是擁有良好的模型。

### 4. 堅持獲勝
不斷嘗試直到成功。循環自動處理重試邏輯。

## 何時使用 Ralph

**適合：**
- 具有明確成功標準的明確定義的任務
- 需要迭代和完善的任務（例如，使測試通過）
- 您可以離開的綠地項目
- 具有自動驗證的任務（測試、檢查工具）

**不適合：**
- 需要人工判斷或設計決策的任務
- 一次性操作
- 具有不明確成功標準的任務
- 生產調試（改用針對性調試）

## 實際結果

- 在 Y Combinator 黑客馬拉松測試中成功在一夜之間生成了 6 個存儲庫
- 以 297 美元的 API 成本完成了一份 5 萬美元的合同
- 使用這種方法在 3 個月內創建了整個編程語言（"cursed"）

## 了解更多

- 原始技術：https://ghuntley.com/ralph/
- Ralph Orchestrator：https://github.com/mikeyobrien/ralph-orchestrator

## 獲取幫助

在 Claude Code 中運行 `/help` 以獲取詳細的命令參考和示例。
