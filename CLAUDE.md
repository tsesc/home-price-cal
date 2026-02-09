# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

房價計算器 (Home Price Calculator) - 基於台灣實價登錄資料的 React 應用程式，提供房地產價格計算、面積比例分析，以及從實價登錄列印頁面匯入資料功能。部署於 GitHub Pages。

## Development Commands

```bash
npm run dev              # 開發伺服器 (Vite, port 5173)
npm test -- --run        # 跑全部測試（單次）
npm test -- --run src/utils/printPageParser.test.js  # 跑單一測試檔
npm run build            # 生產建置
npm run deploy           # 部署至 GitHub Pages (自動先 build)
```

## Architecture

**Stack**: React 19 + Vite 7 + Vitest, 無狀態管理庫，純 CSS（無 CSS 框架）

### 核心模組

- `src/utils/priceCalculator.js` — 面積/價格/比例計算邏輯（calculateAreas, calculatePrices, calculateRatios）
- `src/utils/printPageParser.js` — 實價登錄列印頁面純文字解析器（parsePrintPageText）
- `src/utils/chineseNumerals.js` — 中文數字轉阿拉伯數字（chineseToNumber，用於樓層解析）
- `src/components/ImportDialog.jsx` — 匯入對話框 UI
- `src/App.jsx` — 主應用，含表單、計算公式顯示、結果摘要

### 資料流

1. `parameters` state（App.jsx）→ 透過 `useEffect` 觸發三個計算函式 → `areas`/`prices`/`ratios` state → 渲染結果
2. 匯入功能：使用者貼上文字 → `parsePrintPageText` 解析 → 預覽可編輯 → `handleImportApply` 回填 `parameters`

## 關鍵計算邏輯

**車位面積扣除規則**（最容易出錯的地方）：
- `commonArea1` + `commonArea2` 是原始公設總面積（含車位公設）
- `commonAreasWithoutParking = commonArea1 + commonArea2 - parkingArea`
- `buildingTotalArea = mainBuilding + balcony + canopy + commonAreasWithoutParking`（不含車位）
- `buildingTotalArea` 已經不含車位，計算價格時不需再扣除

**共同使用部分分類**（printPageParser.js）：
- 描述僅含停車相關關鍵字（停車空間、車道）→ `commonArea1`（車位相關公設）
- 描述含一般公共設施關鍵字（電梯、梯廳、機房等）→ `commonArea2`（一般公設）
- 土地面積解析限定在「土地資料」和「建物資料」之間的文字區塊，避免誤匹配建物持分移轉

## 部署

GitHub Pages，base path 為 `/home-price-cal/`（設定在 vite.config.js）。`npm run deploy` 使用 gh-pages 套件推送 dist 目錄。
