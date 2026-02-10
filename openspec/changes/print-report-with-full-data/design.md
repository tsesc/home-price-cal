## Context

目前的匯入功能（`printPageParser.js` + `ImportDialog.jsx`）只擷取計算所需的數值欄位。實價登錄列印頁面還包含大量描述性資訊和一張地圖標示圖片，使用者希望完整保留並能產出自訂版本的列印報告。

現有架構：
- `parsePrintPageText(text)` 回傳 `{ data: { mainBuildingArea, balconyArea, ... } }`
- `ImportDialog` 顯示數值欄位預覽並填入主表單
- `App.jsx` 管理 `parameters` state（只有計算參數）

## Goals / Non-Goals

**Goals:**
- 擴充 parser 擷取所有描述性欄位（地段、社區、交易標的、日期、建物型態、格局、用途、備註、建材、建築完成年月等）
- 擴充 parser 擷取地圖圖片 URL（從原始 HTML 頁面）
- 將完整交易資料儲存在獨立的 state（`transactionData`），與計算參數 `parameters` 分離
- 建立列印報告元件，展示完整資訊 + 計算結果 + 地圖圖片
- 支援瀏覽器原生列印功能（window.print）產出 PDF

**Non-Goals:**
- 不直接用 JS 產生 PDF 檔案（不引入 jspdf 等套件）
- 不做伺服器端渲染或 API
- 不自動抓取網頁（使用者手動複製貼上文字即可）

## Decisions

### 1. 資料結構：分離交易描述與計算參數

將 parser 回傳值擴充為 `{ data: { ...計算欄位 }, meta: { ...描述欄位, mapImageUrl } }`。

`meta` 包含：
- `address` — 地段位置或門牌
- `communityName` — 社區名稱
- `transactionTarget` — 交易標的
- `transactionDate` — 交易日期
- `totalPriceRaw` — 交易總價原始值（元）
- `unitPricePerPing` — 交易單價（元/坪）
- `totalArea` — 交易總面積（坪）
- `mainBuildingRatio` — 主建物佔比
- `buildingType` — 建物型態
- `layout` — 建物現況格局
- `mainUsage` — 主要用途
- `management` — 管理組織
- `hasElevator` — 有無電梯
- `note` — 備註
- `buildingMaterial` — 主要建材
- `completionDate` — 建築完成年月
- `parkingType` — 車位類別
- `parkingFloor` — 車位所在樓層
- `landDetails` — 土地明細陣列 [{ location, area, zoning }]
- `mapImageUrl` — 地圖圖片 URL（從 HTML img src 擷取）

**理由**：計算邏輯不需要這些欄位，分離可避免影響現有功能。

### 2. 地圖圖片：使用者貼上文字 + 手動上傳圖片

實價登錄頁面的地圖圖片是透過 Google Maps Static API 產生的 `<img>` 標籤。純文字複製無法包含圖片。

方案：在 ImportDialog 中新增「上傳地圖截圖」的 file input，讓使用者可以手動截圖上傳。同時，parser 嘗試從文字中擷取可能的經緯度資訊（如果有的話）。

**理由**：純文字複製無法帶圖片；直接跨域請求 Google Maps 會有 CORS 問題。使用者截圖最簡單可靠。

### 3. 列印報告：獨立頁面 + `@media print` 樣式

建立 `PrintReport` 元件，透過 `window.print()` 觸發瀏覽器列印。使用 `@media print` 隱藏非報告元素，只顯示報告內容。

報告佈局：
1. 標題區（地段、社區、交易日期）
2. 交易摘要區（交易標的、總價、單價、面積等）
3. 計算結果區（從現有 App 的計算結果帶入）
4. 面積明細表（主建物、陽台、雨遮、公設、車位）
5. 地圖圖片區（如有上傳）
6. 備註區

**理由**：不需額外依賴，瀏覽器原生列印已可產出高品質 PDF。

### 4. State 管理

在 `App.jsx` 新增 `transactionData` state 儲存 `meta` 資訊和地圖圖片（Data URL）。匯入時同時更新 `parameters` 和 `transactionData`。

```
App state:
  parameters: { mainBuildingArea, ..., unitPrice, ... }  // 既有，計算用
  transactionData: { address, communityName, ..., mapImageDataUrl }  // 新增，報告用
  showPrintReport: boolean  // 控制報告顯示
```

## Risks / Trade-offs

- **圖片大小**：截圖以 Data URL 存在記憶體中，大圖可能影響效能 → 限制上傳圖片大小（最大 2MB），並壓縮為適當解析度
- **列印排版**：不同瀏覽器列印結果可能有差異 → 使用簡單的 CSS 佈局，避免複雜的 flexbox/grid
- **Parser 向下相容**：擴充 parser 不能影響現有回傳值 → `meta` 是新增欄位，`data` 維持不變
