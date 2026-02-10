# 台灣房價計算器

一個基於 React 的房價計算工具，專門設計用於台灣房地產市場的價格計算與分析。

🔗 **線上使用**：https://tsesc.github.io/home-price-cal/

## 功能特色

- **即時計算**：調整參數立即顯示計算結果
- **詳細公式顯示**：完整展示每個計算步驟
- **實價登錄匯入**：直接從內政部實價登錄網站複製貼上資料
- **地圖截圖**：支援複製貼上地圖截圖（Ctrl+V）
- **資料持久化**：自動儲存，重新整理後資料不遺失
- **列印報告**：產生完整的計算報告，可匯出為 PDF
- **面積比例分析**：
  - 公設比計算
  - 得房率計算
  - 主建物占比分析
- **價格調整係數**：
  - 樓層溢價係數
  - 屋齡折舊係數
- **完整的單元測試**：確保計算邏輯正確性

## 技術架構

- **前端框架**：React 19
- **建構工具**：Vite 7
- **測試框架**：Vitest
- **樣式**：純 CSS
- **部署**：GitHub Pages（自動部署）

## 安裝與執行

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 執行測試
```bash
npm test
```

### 建置專案
```bash
npm run build
```

### 預覽建置結果
```bash
npm run preview
```

## 計算邏輯說明

### 面積計算
- **建物總面積（不含車位）** = 主建物 + 陽台 + 雨遮 + 共同使用部分（不含車位）
- **總面積（含車位）** = 建物總面積 + 車位面積

### 價格計算
- **建物價格** = 建物面積 × 單價 × 樓層係數 × 屋齡係數
- **房屋總價** = 建物價格 + 車位價格

### 關鍵比例
- **公設比** = 共有部分（不含車位）÷ 建物總面積（不含車位）× 100%
- **得房率** = (主建物 + 附屬建物) ÷ 建物總面積（不含車位）× 100%

## 參數說明

### 面積參數
- 主建物面積：實際居住空間
- 陽台面積：陽台空間
- 雨遮面積：雨遮空間
- 共同使用部分：公共設施持分面積
- 車位面積：停車位面積

### 價格參數
- 單價：每坪價格（萬元/坪）
- 車位價格：車位總價（萬元）
- 樓層溢價係數：根據樓層調整（建議 0.9-1.2）
- 屋齡折舊係數：根據屋齡調整（建議 0.8-1.0）

## 專案結構

```
home-price-cal/
├── src/
│   ├── App.jsx                      # 主要應用程式元件
│   ├── App.css                      # 應用程式樣式
│   ├── components/
│   │   ├── ImportDialog.jsx        # 實價登錄匯入對話框
│   │   └── PrintReport.jsx         # 列印報告元件
│   └── utils/
│       ├── priceCalculator.js      # 核心計算邏輯
│       ├── priceCalculator.test.js # 單元測試
│       ├── printPageParser.js      # 實價登錄解析器
│       └── printPageParser.test.js # 解析器測試
├── public/                          # 靜態資源
├── package.json                     # 專案配置
└── vite.config.js                   # Vite 配置
```

## 文件說明

- [CALCULATION_FORMULA.md](./CALCULATION_FORMULA.md) - 詳細計算公式說明
- [RATIO_SUMMARY.md](./RATIO_SUMMARY.md) - 比例計算總結
- [CLAUDE.md](./CLAUDE.md) - 開發指引與注意事項

## 如何使用實價登錄匯入功能

1. 前往[內政部實價登錄網站](https://plvr.land.moi.gov.tw/DownloadOpenData)查詢物件
2. 開啟物件詳細頁面
3. 在列印頁面全選（Ctrl+A）並複製（Ctrl+C）
4. 在本工具點擊「從實價登錄匯入」按鈕
5. 貼上（Ctrl+V）複製的內容
6. 如需地圖截圖：
   - 在實價登錄頁面的地圖上右鍵 → 複製圖片
   - 回到本工具，在圖片區域按 Ctrl+V 貼上
7. 點擊「填入表單」即可自動帶入所有資料

## 貢獻

歡迎提交 Issue 和 Pull Request！

如果您發現計算錯誤、有功能建議或遇到任何問題，請隨時開啟 Issue 討論。

## 授權

MIT License

本專案採用 MIT 授權條款，歡迎自由使用、修改和分發。

## 聯絡資訊

- GitHub Issues：https://github.com/tsesc/home-price-cal/issues
- 線上工具：https://tsesc.github.io/home-price-cal/