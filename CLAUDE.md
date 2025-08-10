# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

房價計算器 (Home Price Calculator) - 基於台灣實價登錄資料的React應用程式，提供精確的房地產價格計算和面積比例分析。

## Development Commands

```bash
# Run development server (auto-increments port if 5173 is occupied)
npm run dev

# Run all tests
npm test

# Run specific test file
npm test src/utils/priceCalculator.test.js

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
**重要**：共同使用部分原始數據包含車位，需扣除
```javascript
// 原始：commonArea1 (18.93) + commonArea2 (3.87) = 22.80坪
// 扣除車位：22.80 - parkingArea (10.36) = 12.44坪
commonAreasWithoutParking = totalCommonWithParking - parkingArea
buildingTotalArea = mainBuilding + balcony + canopy + commonAreasWithoutParking
// 結果：23.43 + 2.81 + 1.28 + 12.44 = 39.96坪
```

### calculatePrices - 價格計算
**注意**：`buildingTotalArea` 已經是不含車位的面積，不需再扣除
```javascript
baseBuildingPrice = buildingTotalArea × unitPrice  // 39.96 × 64.56
adjustedBuildingPrice = baseBuildingPrice × floorPremium × agePremium
totalPrice = adjustedBuildingPrice + parkingPrice  // 2579.82 + 220 ≈ 2800
```

### calculateRatios - 比例分析
```javascript
publicFacilityRatio = commonAreasWithoutParking / buildingTotalArea  // 12.44 ÷ 39.96 = 31.13%
usableAreaRatio = (mainBuilding + balcony + canopy) / buildingTotalArea  // 27.52 ÷ 39.96 = 68.87%
```

## UI Implementation Details

### 公式顯示增強 (App.jsx)
1. **建物總面積公式**：需顯示共同使用部分的詳細扣除過程
   - 顯示 `(18.93 + 3.87 - 10.36)` 的計算過程
   
2. **比例計算公式框**：使用 `formula-box` 組件
   - 公設比：完整顯示分子分母和計算結果
   - 得房率：分步顯示加總過程

3. **價格顯示修正**：
   - 基礎價格顯示：`baseBuildingPrice`
   - 調整後價格：`adjustedBuildingPrice`
   - 避免使用 `prices.totalPrice` 直接顯示，改用 `parseFloat` 確保精確度

### 狀態管理
```javascript
// 初始參數定義避免重複
const initialParams = { /* ... */ }
const [parameters, setParameters] = useState(initialParams)

// Lazy initialization 防止初始空物件問題
const [areas, setAreas] = useState(() => calculateAreas(initialParams))
const [prices, setPrices] = useState(() => calculatePrices(initialParams))
```

## Critical Validation Points

測試驗證的關鍵數值（全部測試通過）：
- 建物總面積：39.96坪（不是50.32）
- 公設比：31.13%（不是45.31%）
- 總價：2799.82 ≈ 2800萬元
- 單價：64.56萬元/坪

## Known Issues & Fixes

### 問題1：建物價格顯示1910.98
**原因**：重複扣除車位面積 (39.96 - 10.36) × 64.56 = 1910.98
**解法**：確保 `calculatePrices` 直接使用 `areas.buildingTotalArea`

### 問題2：公設比顯示45.31%
**原因**：使用總公設(22.80)而非扣除車位後的公設(12.44)
**解法**：使用 `areas.commonAreasWithoutParking`

### 問題3：總價不等於2800
**原因**：單價計算錯誤或面積計算錯誤
**解法**：確認單價64.56，建物面積39.96