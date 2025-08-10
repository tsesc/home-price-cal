# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

房價計算器 (Home Price Calculator) - 基於台灣實價登錄資料的React應用程式，提供精確的房地產價格計算和面積比例分析。

## Development Commands

```bash
# Run development server
npm run dev

# Run all tests
npm test

# Run tests with UI  
npm test:ui

# Run tests with coverage
npm test:coverage

# Build for production
npm build

# Preview production build
npm run preview
```

## Core Calculation Logic

核心計算邏輯位於 `src/utils/priceCalculator.js`：

### calculateAreas - 面積計算
關鍵點：共同使用部分需扣除車位面積
- `commonAreasWithoutParking = (commonArea1 + commonArea2) - parkingArea`
- `buildingTotalArea = 主建物 + 陽台 + 雨遮 + commonAreasWithoutParking`
- 實際數據：建物總面積 39.96坪（不含車位），總面積 50.32坪（含車位）

### calculatePrices - 價格計算  
- `baseBuildingPrice = buildingTotalArea × unitPrice`
- `adjustedBuildingPrice = baseBuildingPrice × floorPremium × agePremium`
- `totalPrice = adjustedBuildingPrice + parkingPrice`
- 注意：單價是針對不含車位的建物面積

### calculateRatios - 比例分析
- **公設比 = 12.44 ÷ 39.96 = 31.13%**（台灣標準計算）
- **得房率 = 27.52 ÷ 39.96 = 68.87%**（主建物+附屬建物）
- 主建物占比 = 23.43 ÷ 39.96 = 58.64%

## Critical Data Points

基於實價登錄的關鍵數據：
- **共同使用部分原始數據**：18.93 + 3.87 = 22.80坪（包含車位）
- **共同使用部分（不含車位）**：22.80 - 10.36 = 12.44坪
- **建物總面積（不含車位）**：23.43 + 2.81 + 1.28 + 12.44 = 39.96坪
- **單價**：(2800 - 220) ÷ 39.96 = 64.56萬元/坪

## UI Implementation Notes

### 公式顯示
- 公設比和得房率需顯示完整計算式（見 `App.jsx` 中的 `formula-box` 組件）
- 建物總面積計算需明確顯示共同使用部分的扣除過程

### 狀態初始化
- 使用 lazy initialization 避免初始渲染時的空物件問題
- `useState(() => calculateAreas(initialParams))`

## Test Coverage

18個單元測試涵蓋：
- 面積計算（特別注意公設扣除車位的邏輯）
- 價格計算（驗證總價 ≈ 2800萬）
- 比例計算（公設比應為31.13%，非45.31%）
- 邊界條件（零值、極端係數、無車位情況）

## Common Issues & Solutions

1. **公設比計算錯誤**：確保使用 `commonAreasWithoutParking` (12.44) 而非總公設 (22.80)
2. **建物價格顯示錯誤**：檢查是否重複扣除車位面積（29.60 × 64.56 = 1910.98 是錯誤的）
3. **總價不等於2800**：確認單價為 64.56 萬元/坪