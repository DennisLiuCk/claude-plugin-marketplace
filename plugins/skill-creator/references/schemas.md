# JSON 結構定義 (Schemas)

本文件定義了 skill-creator 使用的 JSON 結構。

---

## evals.json

定義技能的評估集。位於技能目錄內的 `evals/evals.json`。

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's example prompt",
      "expected_output": "Description of expected result",
      "files": ["evals/files/sample1.pdf"],
      "expectations": [
        "The output includes X",
        "The skill used script Y"
      ]
    }
  ]
}
```

**欄位說明：**
- `skill_name`：與技能 frontmatter 中的名稱匹配
- `evals[].id`：唯一整數識別碼
- `evals[].prompt`：要執行的任務
- `evals[].expected_output`：人類可讀的成功描述
- `evals[].files`：可選的輸入檔案路徑列表（相對於技能根目錄）
- `evals[].expectations`：可驗證的陳述列表

---

## history.json

在改進模式中追蹤版本進展。位於工作空間根目錄。

```json
{
  "started_at": "2026-01-15T10:30:00Z",
  "skill_name": "pdf",
  "current_best": "v2",
  "iterations": [
    {
      "version": "v0",
      "parent": null,
      "expectation_pass_rate": 0.65,
      "grading_result": "baseline",
      "is_current_best": false
    },
    {
      "version": "v1",
      "parent": "v0",
      "expectation_pass_rate": 0.75,
      "grading_result": "won",
      "is_current_best": false
    },
    {
      "version": "v2",
      "parent": "v1",
      "expectation_pass_rate": 0.85,
      "grading_result": "won",
      "is_current_best": true
    }
  ]
}
```

**欄位說明：**
- `started_at`：改進開始的 ISO 時間戳記
- `skill_name`：正在改進的技能名稱
- `current_best`：最佳表現者的版本識別碼
- `iterations[].version`：版本識別碼（v0、v1...）
- `iterations[].parent`：衍生自的父版本
- `iterations[].expectation_pass_rate`：來自評分的通過率
- `iterations[].grading_result`：「baseline」、「won」、「lost」或「tie」
- `iterations[].is_current_best`：是否為目前最佳版本

---

## grading.json

來自評分代理的輸出。位於 `<run-dir>/grading.json`。

```json
{
  "expectations": [
    {
      "text": "The output includes the name 'John Smith'",
      "passed": true,
      "evidence": "Found in transcript Step 3: 'Extracted names: John Smith, Sarah Johnson'"
    },
    {
      "text": "The spreadsheet has a SUM formula in cell B10",
      "passed": false,
      "evidence": "No spreadsheet was created. The output was a text file."
    }
  ],
  "summary": {
    "passed": 2,
    "failed": 1,
    "total": 3,
    "pass_rate": 0.67
  },
  "execution_metrics": {
    "tool_calls": {
      "Read": 5,
      "Write": 2,
      "Bash": 8
    },
    "total_tool_calls": 15,
    "total_steps": 6,
    "errors_encountered": 0,
    "output_chars": 12450,
    "transcript_chars": 3200
  },
  "timing": {
    "executor_duration_seconds": 165.0,
    "grader_duration_seconds": 26.0,
    "total_duration_seconds": 191.0
  },
  "claims": [
    {
      "claim": "The form has 12 fillable fields",
      "type": "factual",
      "verified": true,
      "evidence": "Counted 12 fields in field_info.json"
    }
  ],
  "user_notes_summary": {
    "uncertainties": ["Used 2023 data, may be stale"],
    "needs_review": [],
    "workarounds": ["Fell back to text overlay for non-fillable fields"]
  },
  "eval_feedback": {
    "suggestions": [
      {
        "assertion": "The output includes the name 'John Smith'",
        "reason": "A hallucinated document that mentions the name would also pass"
      }
    ],
    "overall": "Assertions check presence but not correctness."
  }
}
```

**欄位說明：**
- `expectations[]`：已評分的期望值及證據
  - `text`：原始期望值文字
  - `passed`：布林值 —— 期望值是否通過
  - `evidence`：支持判定的具體引用或描述
- `summary`：彙總通過/失敗計數
  - `pass_rate`：通過比例（0.0 到 1.0）
- `execution_metrics`：工具使用和輸出大小（來自執行者的 metrics.json）
- `timing`：實際經過的時間（來自 timing.json）
- `claims`：從輸出中提取和驗證的聲明
  - `type`：「factual」、「process」或「quality」
- `user_notes_summary`：執行者標記的問題
- `eval_feedback`：（可選）評估的改進建議，僅在評分者識別出值得提出的問題時出現

---

## metrics.json

來自執行者代理的輸出。位於 `<run-dir>/outputs/metrics.json`。

```json
{
  "tool_calls": {
    "Read": 5,
    "Write": 2,
    "Bash": 8,
    "Edit": 1,
    "Glob": 2,
    "Grep": 0
  },
  "total_tool_calls": 18,
  "total_steps": 6,
  "files_created": ["filled_form.pdf", "field_values.json"],
  "errors_encountered": 0,
  "output_chars": 12450,
  "transcript_chars": 3200
}
```

**欄位說明：**
- `tool_calls`：每種工具類型的計數
- `total_tool_calls`：所有工具呼叫的總和
- `total_steps`：主要執行步驟的數量
- `files_created`：建立的輸出檔案列表
- `errors_encountered`：執行期間的錯誤數量
- `output_chars`：輸出檔案的總字元數
- `transcript_chars`：記錄的字元數

---

## timing.json

執行的實際計時。位於 `<run-dir>/timing.json`。

**如何捕捉：** 當子代理任務完成時，任務通知包含 `total_tokens` 和 `duration_ms`。立即儲存這些 —— 它們不會在其他地方持久化，事後無法恢復。

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3,
  "executor_start": "2026-01-15T10:30:00Z",
  "executor_end": "2026-01-15T10:32:45Z",
  "executor_duration_seconds": 165.0,
  "grader_start": "2026-01-15T10:32:46Z",
  "grader_end": "2026-01-15T10:33:12Z",
  "grader_duration_seconds": 26.0
}
```

---

## benchmark.json

基準測試模式的輸出。位於 `benchmarks/<timestamp>/benchmark.json`。

```json
{
  "metadata": {
    "skill_name": "pdf",
    "skill_path": "/path/to/pdf",
    "executor_model": "claude-sonnet-4-20250514",
    "analyzer_model": "most-capable-model",
    "timestamp": "2026-01-15T10:30:00Z",
    "evals_run": [1, 2, 3],
    "runs_per_configuration": 3
  },
  "runs": [
    {
      "eval_id": 1,
      "eval_name": "Ocean",
      "configuration": "with_skill",
      "run_number": 1,
      "result": {
        "pass_rate": 0.85,
        "passed": 6,
        "failed": 1,
        "total": 7,
        "time_seconds": 42.5,
        "tokens": 3800,
        "tool_calls": 18,
        "errors": 0
      },
      "expectations": [
        {"text": "...", "passed": true, "evidence": "..."}
      ],
      "notes": [
        "Used 2023 data, may be stale"
      ]
    }
  ],
  "run_summary": {
    "with_skill": {
      "pass_rate": {"mean": 0.85, "stddev": 0.05, "min": 0.80, "max": 0.90},
      "time_seconds": {"mean": 45.0, "stddev": 12.0, "min": 32.0, "max": 58.0},
      "tokens": {"mean": 3800, "stddev": 400, "min": 3200, "max": 4100}
    },
    "without_skill": {
      "pass_rate": {"mean": 0.35, "stddev": 0.08, "min": 0.28, "max": 0.45},
      "time_seconds": {"mean": 32.0, "stddev": 8.0, "min": 24.0, "max": 42.0},
      "tokens": {"mean": 2100, "stddev": 300, "min": 1800, "max": 2500}
    },
    "delta": {
      "pass_rate": "+0.50",
      "time_seconds": "+13.0",
      "tokens": "+1700"
    }
  },
  "notes": [
    "Assertion 'Output is a PDF file' passes 100% in both configurations",
    "Eval 3 shows high variance (50% +/- 40%)",
    "Skill adds 13s average execution time but improves pass rate by 50%"
  ]
}
```

**欄位說明：**
- `metadata`：關於基準測試執行的資訊
  - `evals_run`：評估名稱或 ID 的列表
  - `runs_per_configuration`：每個配置的執行次數（例如 3）
- `runs[]`：個別執行結果
  - `configuration`：必須是 `"with_skill"` 或 `"without_skill"`（檢視器使用此確切字串進行分組和顏色編碼）
  - `result`：巢狀物件，包含 `pass_rate`、`passed`、`total`、`time_seconds`、`tokens`、`errors`
- `run_summary`：每個配置的統計彙總
  - `delta`：差異字串如 `"+0.50"`、`"+13.0"`、`"+1700"`
- `notes`：來自分析代理的自由格式觀察

**重要：** 檢視器會精確讀取這些欄位名稱。使用 `config` 而不是 `configuration`，或將 `pass_rate` 放在執行的頂層而不是巢套在 `result` 下，將導致檢視器顯示空白/零值。手動生成 benchmark.json 時始終參考此 schema。

---

## comparison.json

盲測比較者的輸出。位於 `<grading-dir>/comparison-N.json`。

```json
{
  "winner": "A",
  "reasoning": "Output A provides a complete solution with proper formatting...",
  "rubric": {
    "A": {
      "content": { "correctness": 5, "completeness": 5, "accuracy": 4 },
      "structure": { "organization": 4, "formatting": 5, "usability": 4 },
      "content_score": 4.7,
      "structure_score": 4.3,
      "overall_score": 9.0
    },
    "B": {
      "content": { "correctness": 3, "completeness": 2, "accuracy": 3 },
      "structure": { "organization": 3, "formatting": 2, "usability": 3 },
      "content_score": 2.7,
      "structure_score": 2.7,
      "overall_score": 5.4
    }
  },
  "output_quality": {
    "A": { "score": 9, "strengths": ["..."], "weaknesses": ["..."] },
    "B": { "score": 5, "strengths": ["..."], "weaknesses": ["..."] }
  }
}
```

---

## analysis.json

事後分析代理的輸出。位於 `<grading-dir>/analysis.json`。

```json
{
  "comparison_summary": {
    "winner": "A",
    "winner_skill": "path/to/winner/skill",
    "loser_skill": "path/to/loser/skill",
    "comparator_reasoning": "Brief summary of why comparator chose winner"
  },
  "winner_strengths": ["..."],
  "loser_weaknesses": ["..."],
  "instruction_following": {
    "winner": { "score": 9, "issues": ["..."] },
    "loser": { "score": 6, "issues": ["..."] }
  },
  "improvement_suggestions": [
    {
      "priority": "high",
      "category": "instructions",
      "suggestion": "Replace vague instruction with explicit steps",
      "expected_impact": "Would eliminate ambiguity"
    }
  ],
  "transcript_insights": {
    "winner_execution_pattern": "...",
    "loser_execution_pattern": "..."
  }
}
```
