## 1. 擴充 Parser 擷取完整欄位

- [x] 1.1 擴充 `parsePrintPageText` 回傳 `meta` 物件，包含所有描述性欄位（address, communityName, transactionTarget, transactionDate, buildingType, layout, mainUsage, management, hasElevator, note, totalPriceRaw, unitPricePerPing, totalArea, mainBuildingRatio）
- [x] 1.2 擴充 parser 擷取建物詳細欄位（buildingMaterial, completionDate）和車位欄位（parkingType, parkingFloor）
- [x] 1.3 撰寫 meta 欄位測試（單行格式 + 瀏覽器 tab 格式），確認現有 26 個測試全部通過

## 2. 擴充 ImportDialog

- [x] 2.1 擴充 ImportDialog 顯示 metadata 欄位（地段、社區名稱、交易標的、日期、建物型態、格局等），以可編輯文字輸入呈現
- [x] 2.2 新增地圖截圖上傳功能（file input），支援圖片預覽、2MB 大小限制、轉換為 Data URL
- [x] 2.3 修改 `onApply` callback 傳遞 `{ data, meta, mapImageDataUrl }`

## 3. 列印報告元件

- [x] 3.1 建立 `src/components/PrintReport.jsx`，包含完整報告佈局（標題區、交易摘要、建物資訊、面積明細表、計算結果、比例分析、地圖、備註、頁尾時間戳）
- [x] 3.2 新增列印報告 CSS 樣式，包含 `@media print` 規則（A4 紙張、隱藏非報告元素、分頁控制）
- [x] 3.3 實作列印按鈕觸發 `window.print()`

## 4. 整合至主應用

- [x] 4.1 在 App.jsx 新增 `transactionData` state，匯入時同時更新 `parameters` 和 `transactionData`
- [x] 4.2 新增「產生報告」按鈕（有 transactionData 時顯示），點擊顯示 PrintReport overlay
- [x] 4.3 傳遞 transactionData、parameters、areas、prices、ratios 給 PrintReport 元件
- [x] 4.4 端對端手動測試：完整匯入 → 報告產生 → 瀏覽器列印/PDF 輸出
