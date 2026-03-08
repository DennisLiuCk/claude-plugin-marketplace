# Skill Creator 技能建立器

> 來自 [Anthropic 官方](https://github.com/anthropics/skills/tree/main/skills/skill-creator)的技能建立工具，翻譯為繁體中文版本。

本插件提供完整的技能（Skill）開發工作流程，包含建立、測試、迭代改進和描述優化等功能。無論你是想從零開始建立一個新技能，還是想改進現有技能的品質，這個工具都能引導你完成整個流程。

## 導讀：什麼是 Skill？

在 Claude Code 的插件生態系統中，**Skill（技能）** 是四種核心組件之一。理解它與其他組件的差異，是撰寫好技能的第一步。

### 四種插件組件比較

| 組件 | 觸發方式 | 用途 | 範例 |
|------|---------|------|------|
| **Command（命令）** | 使用者手動輸入 `/command` | 執行特定操作 | `/commit`、`/create-plugin` |
| **Agent（代理）** | 由 Claude 自動選擇 | 專門的 AI 助手 | code-explorer、plugin-validator |
| **Hook（鉤子）** | 事件觸發（如檔案編輯） | 攔截和檢查操作 | 安全掃描、格式檢查 |
| **Skill（技能）** | Claude 根據描述自動啟用 | 提供領域專業知識和工作流程 | 前端設計指引、技能建立指導 |

### Skill 的獨特之處

Skill 最大的特點是**自動觸發**。當使用者的請求與技能描述匹配時，Claude 會自動讀取並運用該技能的指導。使用者不需要記住任何命令 —— 技能會在需要時自然出現。

### 三層載入架構

Skill 使用漸進式披露（Progressive Disclosure），這是 Anthropic 設計的核心概念：

```
第一層：元資料（始終在 Claude 的上下文中）
├── name: "skill-name"
└── description: "何時觸發、做什麼"（約 100 字）
     ↓ 當 Claude 決定使用此技能時
第二層：SKILL.md 本文（載入到上下文中）
├── 詳細指令和工作流程
└── 理想控制在 500 行以內
     ↓ 按需引用
第三層：附帶資源（按需載入，無限制）
├── scripts/    → 可執行的工具腳本
├── references/ → 參考文件
└── assets/     → 範本、圖示等
```

**為什麼這很重要？** Claude 的上下文視窗是有限的。第一層（描述）始終存在，所以要精簡但足夠觸發。第二層只在技能啟用時載入。第三層只在需要時讀取。這種設計讓技能可以包含大量內容而不浪費上下文空間。

## 導讀：Skill 的結構剖析

### YAML Frontmatter

每個 SKILL.md 必須以 YAML frontmatter 開頭：

```yaml
---
name: my-skill
description: >
  這個描述決定了 Claude 何時會啟用此技能。
  要包含具體的觸發情境，而不只是功能描述。
---
```

**重點：`description` 是觸發機制**

Claude 看到所有已安裝技能的名稱和描述。當使用者的請求與描述匹配時，Claude 才會讀取技能的完整內容。因此：

- 描述要「積極」—— Anthropic 發現 Claude 傾向於「觸發不足」，所以描述應該稍微主動一些
- 包含具體的使用情境，而不只是「這個技能做 X」
- 控制在 1024 字元以內（硬限制）

**好的描述範例：**
```
建立新技能、修改和改進現有技能、衡量技能效能。
當使用者想要建立技能、撰寫 skill、技能開發、技能測試、
或想要將工作流程轉換為可重複使用的技能時使用此技能。
```

**不好的描述範例：**
```
一個用於建立技能的工具。
```

### Markdown 指令主體

frontmatter 之後是技能的完整指令。這是 Claude 在啟用技能時會讀取的內容。

### 附帶資源

技能可以包含額外的檔案：

```
my-skill/
├── SKILL.md
├── scripts/
│   └── validate.py      ← 可程式化執行的工具
├── references/
│   └── api-docs.md       ← 需要時讀取的參考文件
└── assets/
    └── template.html     ← 用於輸出的範本
```

## 導讀：撰寫最佳實踐

以下是從 Anthropic 官方 skill-creator 中提煉的關鍵撰寫原則：

### 1. 解釋「為什麼」而非強制「必須」

LLM 是聰明的。當你解釋原因時，它們能夠泛化到新的情境。

```markdown
# 不好的寫法
ALWAYS use kebab-case for file names. NEVER use camelCase.

# 好的寫法
使用 kebab-case 命名檔案（如 my-skill.md），因為這與 Claude Code
的插件系統一致，也避免了不同作業系統對大小寫敏感度的差異。
```

### 2. 保持精簡

SKILL.md 理想控制在 500 行以內。如果需要更多內容，使用 `references/` 目錄存放詳細文件，並在 SKILL.md 中清楚說明何時讀取它們。

### 3. 使用祈使語氣

```markdown
# 好的
讀取使用者的輸入檔案並分析其結構。

# 不好的
你應該讀取使用者的輸入檔案，然後你應該分析其結構。
```

### 4. 從測試中學習

skill-creator 的核心理念是**迭代**：
1. 寫草稿
2. 用真實的測試提示詞測試
3. 讓使用者評估結果
4. 根據回饋改進
5. 重複直到滿意

不要期望一次就寫出完美的技能。好的技能是迭代出來的。

### 5. 避免過擬合

當你在少數測試案例上反覆迭代時，容易寫出只適用於那些案例的指令。要從具體的回饋中概括出通用的原則。

## 導讀：評估系統

skill-creator 包含一套完整的評估系統，用於量化測試技能的效果。

### 評估流程概覽

```
1. 建立測試案例 (evals.json)
     ↓
2. 並行執行：有技能 vs 無技能（基線）
     ↓
3. 評分代理 (grader) 驗證斷言
     ↓
4. 彙總為基準測試 (benchmark.json)
     ↓
5. 分析代理 (analyzer) 發現模式
     ↓
6. 檢視器展示結果給使用者審查
     ↓
7. 使用者回饋 → 改進技能 → 重複
```

### 三個專門代理

| 代理 | 角色 | 說明 |
|------|------|------|
| **Grader（評分者）** | 驗證結果 | 檢查每個斷言是否通過，提供證據，並批判評估本身的品質 |
| **Comparator（比較者）** | 盲測比較 | 在不知道來源的情況下判斷兩個輸出的優劣 |
| **Analyzer（分析者）** | 深度分析 | 分析為什麼一個版本更好，生成可操作的改進建議 |

### 描述優化

技能完成後，可以使用自動化工具優化觸發描述：

1. 生成 20 個測試查詢（混合應觸發和不應觸發的）
2. 自動化循環測試不同的描述版本
3. 使用訓練/測試分割避免過擬合
4. 選擇在保留測試集上表現最好的描述

## 安裝

```bash
# CLI 安裝（推薦）
claude plugin install github:DennisLiuCk/claude-plugin-marketplace/plugins/skill-creator

# 手動安裝
git clone https://github.com/DennisLiuCk/claude-plugin-marketplace.git
cp -r claude-plugin-marketplace/plugins/skill-creator ~/.claude/plugins/
```

## 使用方式

安裝後，技能會在相關情境中自動啟用。例如：

- 「我想建立一個新的技能」
- 「幫我把這個工作流程做成 skill」
- 「優化這個技能的描述」
- 「測試這個技能的效果」

## 插件結構

```
skill-creator/
├── .claude-plugin/plugin.json    # 插件元資料
├── README.md                     # 本文件（導讀 + 教學）
├── skills/skill-creator/
│   └── SKILL.md                  # 核心技能定義（繁體中文）
├── agents/                       # 三個專門代理
│   ├── analyzer.md               # 事後分析代理
│   ├── comparator.md             # 盲測比較代理
│   └── grader.md                 # 評分代理
├── references/
│   └── schemas.md                # JSON 結構定義文件
├── scripts/                      # Python 工具腳本
│   ├── utils.py                  # 共用工具
│   ├── run_eval.py               # 觸發評估執行器
│   ├── run_loop.py               # 評估 + 改進循環
│   ├── quick_validate.py         # 技能快速驗證
│   ├── improve_description.py    # 描述改進器
│   ├── generate_report.py        # HTML 報告生成器
│   ├── aggregate_benchmark.py    # 基準測試彙總
│   └── package_skill.py          # 技能打包器
├── eval-viewer/                  # 評估結果檢視器
│   ├── generate_review.py        # 生成審查介面
│   └── viewer.html               # 審查介面範本
└── LICENSE.txt                   # Apache 2.0 授權
```

## 延伸閱讀

- [Anthropic 官方 skill-creator 原始碼](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
- [Claude Code 插件文件](https://docs.claude.com/en/docs/claude-code/plugins)
- [Claude Code Skills 文件](https://docs.claude.com/en/docs/claude-code/skills)

## 授權

本插件基於 [Apache License 2.0](LICENSE.txt) 授權，原始碼來自 Anthropic 官方倉庫。
繁體中文翻譯與導讀內容由社群維護。
