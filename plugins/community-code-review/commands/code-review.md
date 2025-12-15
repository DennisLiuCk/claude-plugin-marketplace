---
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git show:*), Bash(git blame:*), Bash(git rev-parse:*), Bash(git ls-files:*), Bash(git merge-base:*), Bash(cat:*), Bash(find:*), Bash(grep:*)
description: 對一個或多個提交進行程式碼審查
---

為指定的提交提供程式碼審查。

支援的輸入格式：
- 單一提交：`abc1234` 或 `HEAD`
- 提交範圍：`main..feature-branch` 或 `HEAD~5..HEAD`
- 多個提交：`abc1234 def5678`

要執行此操作，請精確遵循以下步驟：

1. 啟動一個 Haiku 代理檢查以下任一條件是否為真：
   - 提交不存在
   - 提交範圍為空
   - 提交範圍包含超過 20 個提交且未獲得使用者確認

   如果任何條件為真，請停止且不要繼續。

2. 啟動一個 Haiku 代理返回所有相關 CLAUDE.md 文件的文件路徑列表（不是內容），包括：
   - 根目錄的 CLAUDE.md 文件（如果存在）
   - 提交修改的文件所在目錄中的任何 CLAUDE.md 文件

3. 啟動一個 Sonnet 代理查看提交並返回變更摘要

4. 並行啟動 4 個代理獨立審查變更。每個代理應返回問題列表，其中每個問題包含描述和標記原因（例如「CLAUDE.md 遵守情況」、「錯誤」）。代理應執行以下操作：

   代理 1 + 2：CLAUDE.md 合規性 Sonnet 代理
   並行審計變更以確保符合 CLAUDE.md。注意：評估文件的 CLAUDE.md 合規性時，您應該只考慮與該文件或其父目錄共享路徑的 CLAUDE.md 文件。

   代理 3：Opus 錯誤代理（與代理 4 並行的子代理）
   掃描明顯的錯誤。僅關注差異本身，不要閱讀額外的上下文。只標記重大錯誤；忽略吹毛求疵和可能的誤報。不要標記您無法在 git diff 範圍外驗證的問題。

   代理 4：Opus 錯誤代理（與代理 3 並行的子代理）
   尋找引入程式碼中存在的問題。這可能是安全問題、不正確的邏輯等。只尋找變更程式碼範圍內的問題。

   **關鍵：我們只需要高信號問題。** 這意味著：
   - 會在執行時導致錯誤行為的客觀錯誤
   - 清晰、明確的 CLAUDE.md 違規，您可以引用被違反的確切規則

   我們不需要：
   - 主觀的擔憂或「建議」
   - CLAUDE.md 未明確要求的風格偏好
   - 「可能」是問題的潛在問題
   - 任何需要解釋或判斷的事項

   如果您不確定某個問題是否真實，請不要標記它。誤報會削弱信任並浪費審查者的時間。

   除上述外，每個子代理都應被告知提交訊息。這將有助於提供關於作者意圖的上下文。

5. 對於上一步中代理 3 和 4 發現的每個問題，啟動並行子代理來驗證該問題。這些子代理應獲得提交訊息以及問題描述。代理的工作是審查問題以高置信度驗證所述問題確實是問題。例如，如果標記了「變數未定義」這樣的問題，子代理的工作是驗證程式碼中確實如此。另一個例子是 CLAUDE.md 問題。代理應驗證被違反的 CLAUDE.md 規則適用於此文件且確實被違反。對於錯誤和邏輯問題使用 Opus 子代理，對於 CLAUDE.md 違規使用 Sonnet 代理。

   此外，驗證者應透過與基礎提交比較，檢查問題是否是預存的（在提交範圍之前就存在）。

6. 過濾掉步驟 5 中未被驗證的任何問題。此步驟將為我們的審查提供高信號問題列表。

7. 最後，輸出程式碼審查報告。
   編寫報告時，請遵循以下準則：
   a. 保持輸出簡潔
   b. 避免使用表情符號
   c. 為每個問題引用相關程式碼，包含提交 SHA、文件路徑和行範圍
   d. 引用 CLAUDE.md 違規時，您必須引用被違反的 CLAUDE.md 確切文字（例如，CLAUDE.md 說：「使用 snake_case 作為變數名稱」）

在步驟 4 和 5 中評估問題時使用此列表（這些是誤報，不要標記）：

- 預存問題（在提交範圍之前就存在的問題）
- 看起來像錯誤但實際上正確的東西
- 資深工程師不會標記的迂腐吹毛求疵
- 檢查工具會捕獲的問題（不要執行檢查工具來驗證）
- 一般程式碼質量問題（例如缺乏測試覆蓋率、一般安全問題），除非在 CLAUDE.md 中明確要求
- CLAUDE.md 中提到但在程式碼中明確禁用的問題（例如透過 lint 忽略註釋）

注意事項：

- 使用 `git` 命令與儲存庫互動
- 開始前先建立待辦事項列表
- 您必須為每個問題引用完整的提交 SHA、文件路徑和行範圍
- 對於您的最終報告，請精確遵循以下格式（假設本例中您發現了 3 個問題）：

---

## Code review

發現 3 個問題：

1. <錯誤簡要描述>（CLAUDE.md 說：「<CLAUDE.md 的確切引用>」）

   `<full_commit_sha>:<path/to/file>#L<start>-L<end>`

   To view: `git show <full_commit_sha>:<path/to/file> | sed -n '<start>,<end>p'`

2. <錯誤簡要描述>（some/other/CLAUDE.md 說：「<CLAUDE.md 的確切引用>」）

   `<full_commit_sha>:<path/to/file>#L<start>-L<end>`

   To view: `git show <full_commit_sha>:<path/to/file> | sed -n '<start>,<end>p'`

3. <錯誤簡要描述>（bug：<原因>）

   `<full_commit_sha>:<path/to/file>#L<start>-L<end>`

   To view: `git show <full_commit_sha>:<path/to/file> | sed -n '<start>,<end>p'`

Generated with Claude Code

---

- 如果沒有發現問題，請精確遵循以下格式：

---

## Code review

未發現問題。已檢查錯誤和 CLAUDE.md 合規性。

Generated with Claude Code

---

- 引用程式碼時，請精確遵循以下格式：`<full_sha>:<path>#L<start>-L<end>`，例如 `1d54823877c4de72b2316a64032a54afc404e619:src/auth.ts#L13-L17`
- 需要完整的 git sha（40 個字元）
- 您必須提供完整的 sha。不要在引用中使用 HEAD 或分支名稱。
- 始終包含 `To view:` 命令，以便使用者可以輕鬆檢視程式碼
