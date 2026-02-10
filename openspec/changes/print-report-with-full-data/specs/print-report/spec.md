## ADDED Requirements

### Requirement: PrintReport component SHALL render complete transaction report
`PrintReport` 元件 SHALL 以結構化佈局展示完整交易資訊，包含描述性欄位、計算結果、面積明細和地圖圖片。

報告佈局順序：
1. 標題區：地段位置、社區名稱、交易日期
2. 交易摘要：交易標的、交易總價、交易單價、交易總面積、主建物佔比
3. 建物資訊：建物型態、格局、主要用途、主要建材、建築完成年月、管理組織、電梯
4. 面積明細表：主建物、陽台、雨遮、公設（車位相關/一般）、車位
5. 價格計算結果：單價、建物價格、車位價格、總價、樓層溢價、屋齡折舊
6. 面積比例分析：公設比、得房率
7. 地圖圖片（如有）
8. 備註

#### Scenario: Render report with full data
- **WHEN** `PrintReport` receives `transactionData` with all metadata fields and `parameters`/`areas`/`prices`/`ratios`
- **THEN** report SHALL display all sections with correct values

#### Scenario: Render report without map image
- **WHEN** `transactionData.mapImageDataUrl` is null
- **THEN** map image section SHALL NOT be rendered
- **THEN** other sections SHALL render normally

#### Scenario: Render report without metadata
- **WHEN** `transactionData` is null or empty
- **THEN** report SHALL still display calculation results from `parameters`/`areas`/`prices`/`ratios`
- **THEN** metadata sections SHALL show placeholder text or be hidden

### Requirement: PrintReport SHALL support browser print to PDF
列印報告 SHALL 透過 `window.print()` 觸發瀏覽器列印功能，使用 `@media print` CSS 隱藏非報告元素。

#### Scenario: Print button triggers browser print
- **WHEN** user clicks "列印報告" button
- **THEN** `window.print()` SHALL be called
- **THEN** only PrintReport content SHALL be visible in print preview

#### Scenario: Print layout
- **WHEN** browser print dialog is active
- **THEN** report SHALL use A4 paper size
- **THEN** report SHALL have appropriate margins
- **THEN** tables and sections SHALL NOT break across pages unnecessarily
- **THEN** navigation, input fields, and other app UI SHALL be hidden

### Requirement: App SHALL manage transaction data state
`App.jsx` SHALL maintain a `transactionData` state for storing complete transaction metadata and map image, separate from calculation `parameters`.

#### Scenario: Import populates transaction data
- **WHEN** user imports data from ImportDialog
- **THEN** `parameters` SHALL be updated with numeric calculation fields (existing behavior)
- **THEN** `transactionData` SHALL be updated with metadata fields and map image

#### Scenario: Report button visibility
- **WHEN** `transactionData` contains valid metadata (address is not empty)
- **THEN** "產生報告" button SHALL be visible
- **WHEN** `transactionData` is null or has empty address
- **THEN** "產生報告" button SHALL be hidden or disabled

#### Scenario: Show print report
- **WHEN** user clicks "產生報告" button
- **THEN** app SHALL display `PrintReport` component as a full-page overlay
- **THEN** overlay SHALL include a close button and a print button

### Requirement: Report SHALL include generation timestamp
報告 SHALL 在頁尾顯示報告產生時間。

#### Scenario: Timestamp display
- **WHEN** report is rendered
- **THEN** footer SHALL display current date and time in format `YYYY/MM/DD HH:mm`
- **THEN** footer SHALL include text `由房價計算器產生`
