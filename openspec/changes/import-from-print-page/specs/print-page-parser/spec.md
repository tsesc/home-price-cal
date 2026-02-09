## ADDED Requirements

### Requirement: Parse transaction summary
系統 SHALL 從實價登錄列印頁面的純文字中提取交易摘要資訊，包含：交易總價（元）、車位交易總價（萬元）、交易總面積（坪）、樓別、樓高（總樓層數）。

#### Scenario: Parse standard transaction summary
- **WHEN** 輸入文字包含「交易總價: 14,340,000 元」和「車位交易總價: 144」和「樓別/樓高: 四層/十四層」
- **THEN** 解析結果 SHALL 為 totalPrice=14340000, parkingPrice=1440000, currentFloor=4, floors=14

#### Scenario: Parse transaction with no parking
- **WHEN** 輸入文字包含「交易總價: 10,000,000 元」但不含車位交易總價
- **THEN** 解析結果 SHALL 為 totalPrice=10000000, parkingPrice=0

### Requirement: Parse building areas from detail section
系統 SHALL 從建物資料表格區塊中提取各類建物面積，支援多筆建物記錄加總。

#### Scenario: Parse main building with attachments
- **WHEN** 建物資料包含「主建物23.32坪」、「陽台3.08坪」、「雨遮0.47坪」
- **THEN** 解析結果 SHALL 為 mainBuildingArea=23.32, balconyArea=3.08, canopyArea=0.47

#### Scenario: Aggregate multiple main building entries
- **WHEN** 建物資料包含「主建物0.02坪」、「主建物0.03坪」、「主建物23.32坪」
- **THEN** mainBuildingArea SHALL 為三者加總 23.37

#### Scenario: Parse building with no canopy
- **WHEN** 建物資料包含主建物和陽台但無雨遮
- **THEN** canopyArea SHALL 為 0

### Requirement: Classify common area entries
系統 SHALL 將共同使用部分依描述內容分為車位相關公設和一般公設兩類。

#### Scenario: Classify parking-related common area
- **WHEN** 共同使用部分描述僅包含「防空避難室兼停車空間、車道、停車空間」
- **THEN** 該筆面積 SHALL 歸類為車位相關公設（對應 commonArea1）

#### Scenario: Classify general common area
- **WHEN** 共同使用部分描述包含「電梯、梯廳、機房、水箱」等一般公共設施
- **THEN** 該筆面積 SHALL 歸類為一般公設（對應 commonArea2）

#### Scenario: Aggregate multiple common area entries of same type
- **WHEN** 有多筆車位相關共同使用部分（如 2.62坪 和 6.65坪）
- **THEN** commonArea1 SHALL 為所有車位相關公設面積加總 9.27

### Requirement: Parse parking area from parking section
系統 SHALL 從車位資料區塊提取車位面積。

#### Scenario: Parse single parking spot
- **WHEN** 車位資料包含「車位面積: 10.26坪」
- **THEN** parkingArea SHALL 為 10.26

#### Scenario: No parking data
- **WHEN** 文字內容不包含車位資料區塊
- **THEN** parkingArea SHALL 為 0

### Requirement: Parse land area
系統 SHALL 從土地資料區塊提取土地移轉面積。

#### Scenario: Parse single land parcel
- **WHEN** 土地資料包含「6.79坪 持分移轉」
- **THEN** landArea SHALL 為 6.79

#### Scenario: Parse multiple land parcels
- **WHEN** 土地資料包含「6.79坪」和「0.00坪」
- **THEN** landArea SHALL 為非零面積加總 6.79

### Requirement: Calculate unit price
系統 SHALL 自動計算不含車位的單價。

#### Scenario: Calculate unit price for standard transaction
- **WHEN** 交易總價=14340000, 車位價格=1440000, 建物總面積（不含車位）=40.24
- **THEN** unitPrice SHALL 為 (14340000 - 1440000) / 40.24 / 10000 ≈ 32.06 萬元/坪

### Requirement: Handle parse errors gracefully
系統 SHALL 在解析失敗時提供有意義的錯誤訊息。

#### Scenario: Empty input
- **WHEN** 輸入為空字串
- **THEN** 系統 SHALL 回傳錯誤訊息「請貼上實價登錄列印頁面的內容」

#### Scenario: Invalid format
- **WHEN** 輸入文字不包含「交易總價」關鍵字
- **THEN** 系統 SHALL 回傳錯誤訊息指出無法識別為實價登錄格式

### Requirement: Convert Chinese numerals to Arabic
系統 SHALL 將樓層的中文數字轉換為阿拉伯數字。

#### Scenario: Convert standard floor numbers
- **WHEN** 樓別為「四層」且樓高為「十四層」
- **THEN** currentFloor SHALL 為 4, floors SHALL 為 14

#### Scenario: Convert complex Chinese numerals
- **WHEN** 樓別為「十二層」且樓高為「二十五層」
- **THEN** currentFloor SHALL 為 12, floors SHALL 為 25
