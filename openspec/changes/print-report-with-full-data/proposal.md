## Why

目前匯入功能只擷取計算所需的數值欄位（面積、價格、樓層），但實價登錄列印頁面還包含許多重要的描述性資訊（地段、社區名稱、交易標的、備註等）以及地圖標示圖片。使用者需要完整保留這些資訊以便日後查閱比對，並希望能產出自定義的列印報告（PDF）。

## What Changes

- 擴充 `printPageParser` 解析更多文字欄位：地段位置、社區名稱、交易標的、交易日期、建物型態、建物現況格局、主要用途、備註等
- 擴充 `ImportDialog` 增加描述性欄位的顯示與編輯
- 新增地圖截圖擷取功能：透過讀取實價登錄列印頁面中的地圖圖片 URL，在匯入時一併保存
- 新增列印報告元件 `PrintReport`，整合所有資料（描述欄位、計算結果、地圖圖片），可透過瀏覽器列印功能產出 PDF
- 在主應用新增「產生報告」按鈕觸發列印報告

## Capabilities

### New Capabilities
- `full-data-parser`: 擴充文字解析器以擷取所有實價登錄欄位（描述性 + 數值性），並支援地圖圖片 URL 擷取
- `print-report`: 列印報告元件，整合完整交易資訊與計算結果，支援瀏覽器列印/PDF 輸出

### Modified Capabilities

（無現有 specs 需修改）

## Impact

- `src/utils/printPageParser.js` — 擴充解析邏輯，回傳更多欄位
- `src/utils/printPageParser.test.js` — 新增描述性欄位測試
- `src/components/ImportDialog.jsx` — 擴充 UI 顯示完整資訊
- `src/components/PrintReport.jsx` — 新增列印報告元件
- `src/App.jsx` — 整合報告功能，管理完整交易資料 state
- `src/App.css` — 列印報告樣式（含 `@media print`）
