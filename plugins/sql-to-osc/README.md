# SQL to OSC 轉換插件

將 Flyway SQL 遷移腳本轉換為 OSC (Online Schema Change) 格式，自動處理資料庫架構變更語句。

## 功能

此技能專門用於將標準 SQL 遷移腳本轉換為 OSC 格式，支援：

- **ALTER TABLE 語句轉換**：自動移除 `USE` 和 `ALTER TABLE` 包裝語法
- **CREATE INDEX 轉換**：將 `CREATE INDEX...ON table` 轉換為 `ADD INDEX...` 格式
- **資料類型標準化**：自動將資料類型轉換為大寫格式
- **NULL 處理**：將 `NULL` 轉換為 `DEFAULT NULL`
- **多操作合併**：自動將同一資料表的多個操作合併為單行

## OSC 格式說明

OSC 格式使用 TAB 分隔的三欄結構：

```
{database}<TAB>{table}<TAB>{operations};
```

| 欄位 | 說明 |
|------|------|
| database | 資料庫名稱（從 `USE` 語句取得）|
| table | 資料表名稱（從 `ALTER TABLE` 取得）|
| operations | 以逗號分隔的操作列表，結尾加分號 |

## 轉換規則

| SQL 語法 | OSC 格式 |
|----------|----------|
| `USE db;` | 移除（db 放入第一欄）|
| `ALTER TABLE tbl` | 移除（tbl 放入第二欄）|
| `NULL` | `DEFAULT NULL` |
| `CREATE INDEX idx ON tbl (col)` | `ADD INDEX idx (col)` |
| `varchar` | `VARCHAR` |
| 多個操作 | 以逗號連接，無空格 |

## 用法

### 直接調用技能

```
"將 V1.0__alter_table.sql 轉換為 OSC 格式"
"OSC 轉換"
"幫我產生 osc.txt"
```

### 觸發關鍵字

Claude 會在以下情況自動使用此技能：
- 提及「OSC」或「Online Schema Change」
- 提及「轉換 OSC」或「osc.txt」
- 處理 Flyway ALTER TABLE/CREATE INDEX 語句需要轉換時

## 檔案慣例

### 來源檔案位置

```
src/main/resources/db/migration/
├── V1.0__init.sql
├── V1.1__alter_table.sql
└── V2.0__add_index.sql
```

### 輸出檔案位置

```
src/main/resources/db/osc/
└── osc-{YYYYMMDD}.txt    # 例如：osc-20251212.txt
```

## 輸出規格

| 項目 | 規格 |
|------|------|
| 編碼 | UTF-8（無 BOM）|
| 換行 | LF (`\n`) |
| 欄位分隔 | TAB (`\t`) |
| 操作分隔 | 逗號 (`,`)，無空格 |
| 行結尾 | 分號 (`;`) |

## 完整範例

### 輸入：`V1.0__alter_my_table.sql`

```sql
USE mydb;

ALTER TABLE MY_TABLE
    ADD COLUMN NEW_COL bigint(20) NULL AFTER EXISTING_COL;

CREATE INDEX MY_TABLE_NEW_COL_IDX ON MY_TABLE (NEW_COL);
```

### 輸出：`osc-20251212.txt`

```
mydb	MY_TABLE	ADD COLUMN NEW_COL BIGINT(20) DEFAULT NULL AFTER EXISTING_COL,ADD INDEX MY_TABLE_NEW_COL_IDX (NEW_COL);
```

## 轉換完成摘要

轉換完成後，技能會提供以下摘要：

```
✓ 轉換完成

來源: V1.0__alter_my_table.sql
輸出: src/main/resources/db/osc/osc-20251212.txt

影響資料表: MY_TABLE
操作統計:
  - ADD COLUMN: 1
  - ADD INDEX: 1
  - MODIFY COLUMN: 0
```

## 進階用法

### 批次轉換

```
"將 migration 資料夾中的所有 SQL 檔案轉換為 OSC"
```

### 指定輸出日期

```
"轉換為 OSC 格式，輸出至 osc-20251225.txt"
```

### 驗證模式

```
"檢查 osc.txt 格式是否正確"
```

## 注意事項

1. **僅支援 DDL 語句**：此技能僅處理 `ALTER TABLE` 和 `CREATE INDEX` 語句
2. **資料庫名稱**：必須有 `USE` 語句指定資料庫名稱
3. **資料表名稱**：從 `ALTER TABLE` 或 `CREATE INDEX...ON` 語句中提取
4. **操作順序**：保持原始 SQL 中的操作順序

## 作者

Dennis Liu (nossi1970@hotmail.com)
