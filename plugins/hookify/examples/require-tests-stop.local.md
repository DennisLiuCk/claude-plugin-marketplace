---
name: require-tests-run
enabled: false
event: stop
action: block
conditions:
  - field: transcript
    operator: not_contains
    pattern: npm test|pytest|cargo test
---

**未在記錄中檢測到測試！**

停止之前，請運行測試以驗證您的更改是否正常工作。

查找測試命令，例如：
- `npm test`
- `pytest`
- `cargo test`

**注意：** 如果記錄中沒有測試命令，此規則會阻止停止。
僅在需要嚴格測試執行時啟用此規則。
