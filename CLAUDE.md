# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

房價計算器 (Home Price Calculator) - 用於計算台灣房地產實價的React應用程式，基於實價登錄資料建立精確的計算模型。

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

位於 `src/utils/priceCalculator.js`，包含三個核心計算函數：

### 1. calculateAreas - 面積計算
- 建物總面積（不含車位）= 主建物 + 陽台 + 雨遮 + 公設1 + 公設2
- 總面積（含車位）= 建物總面積 + 車位面積

### 2. calculatePrices - 價格計算
- 基礎建物價格 = 建物總面積 × 單價
- 調整後建物價格 = 基礎價格 × 樓層溢價係數 × 屋齡折舊係數
- 總價 = 調整後建物價格 + 車位價格

### 3. calculateRatios - 比例分析
- 主建物占比（含/不含車位）
- 公設比 = 公共設施面積 ÷ 建物總面積 × 100%
- 附屬建物比例 = (陽台 + 雨遮) ÷ 建物總面積 × 100%

## Important Data Validation

基於實價登錄的驗證數據（README.md）：
- 總價：2,800萬元
- 車位價格：220萬元（10.36坪）
- 建物總面積（含車位）：50.32坪（實際計算值）
- 建物面積（不含車位）：39.96坪
- **使用單價：64.56萬元/坪**（確保總價精確為2800）
- **實價登錄顯示：64.59萬元/坪**（可能有四捨五入）

計算驗證：
- 精確單價：2580 ÷ 39.96 = 64.5646萬元/坪
- 總價驗證：39.96 × 64.56 + 220 ≈ 2800萬元 ✓

## Key Implementation Details

1. **狀態管理**：使用React hooks管理參數狀態，所有計算即時更新
2. **測試覆蓋**：包含18個單元測試，涵蓋面積、價格、比例計算及邊界條件
3. **調整係數**：
   - 樓層溢價係數範圍：0.9-1.2
   - 屋齡折舊係數範圍：0.8-1.0

## Architecture

```
src/
├── App.jsx           # 主要UI組件，包含參數輸入和結果顯示
├── utils/
│   ├── priceCalculator.js      # 核心計算邏輯
│   └── priceCalculator.test.js # 單元測試
└── test/
    └── setup.js      # 測試環境配置
```

## Critical Formulas

實價登錄資料中的關鍵比例：
- 主建物面積占建物移轉總面積：46.56%
- 主建物面積占建物移轉總面積（扣除車位）：58.64%
- 公設比：約45.31%