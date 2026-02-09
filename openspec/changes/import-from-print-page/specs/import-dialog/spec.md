## ADDED Requirements

### Requirement: Import button in main UI
應用程式 SHALL 在參數調整區顯示「從實價登錄匯入」按鈕。

#### Scenario: Button visibility
- **WHEN** 使用者開啟房價計算器
- **THEN** 參數調整區 SHALL 顯示「從實價登錄匯入」按鈕

#### Scenario: Open import dialog
- **WHEN** 使用者點擊「從實價登錄匯入」按鈕
- **THEN** 系統 SHALL 開啟匯入對話框

### Requirement: Text input area
匯入對話框 SHALL 提供文字輸入區域，讓使用者貼上實價登錄列印頁面的純文字內容。

#### Scenario: Display textarea
- **WHEN** 匯入對話框開啟
- **THEN** 對話框 SHALL 顯示多行文字輸入區域，附帶操作提示「請將實價登錄列印頁面的內容全選複製後貼上」

#### Scenario: Parse button
- **WHEN** 使用者在文字區域貼上內容
- **THEN** 對話框 SHALL 顯示「解析」按鈕

### Requirement: Preview parsed results
解析完成後，系統 SHALL 顯示結構化的預覽結果供使用者確認。

#### Scenario: Display parsed fields
- **WHEN** 解析成功
- **THEN** 對話框 SHALL 顯示所有已解析的欄位值，包含：主建物面積、陽台面積、雨遮面積、共同使用部分1（車位相關）、共同使用部分2（一般公設）、車位面積、交易總價、車位價格、計算的單價、樓別、總樓層、土地面積

#### Scenario: Editable preview fields
- **WHEN** 預覽結果顯示
- **THEN** 使用者 SHALL 可以修改任何欄位值

#### Scenario: Display parse error
- **WHEN** 解析失敗
- **THEN** 對話框 SHALL 顯示錯誤訊息，使用者可重新貼上或關閉

### Requirement: Apply parsed data to form
使用者確認後，系統 SHALL 將解析結果填入計算器表單。

#### Scenario: Apply all fields
- **WHEN** 使用者在預覽畫面點擊「填入表單」按鈕
- **THEN** 系統 SHALL 將所有欄位值填入對應的表單輸入欄位，並關閉對話框

#### Scenario: Cancel import
- **WHEN** 使用者點擊「取消」或關閉對話框
- **THEN** 系統 SHALL 不修改任何表單欄位

### Requirement: Dialog close behavior
對話框 SHALL 支援多種關閉方式。

#### Scenario: Close via cancel button
- **WHEN** 使用者點擊「取消」按鈕
- **THEN** 對話框 SHALL 關閉，不影響表單

#### Scenario: Close via overlay click
- **WHEN** 使用者點擊對話框外部區域
- **THEN** 對話框 SHALL 關閉，不影響表單
