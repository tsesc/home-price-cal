import { describe, it, expect } from 'vitest'
import { parsePrintPageText } from './printPageParser'

// 從參考頁面取得的真實文字
const sampleText = `地段位置或門牌: 汐止區福德一路１７６巷００１５號四樓 社區名稱: 采采良品 交易標的: 房地(土地+建物)+車位 交易日期: 108/12/31 交易總價: 14,340,000 元 交易單價約: 320,565 (元/坪) 交易總面積: 50.51 坪 主建物佔比(%): 58.07% 交易棟筆數: 土地: 2 筆 建物: 1 棟(戶) 車位: 1 個 建物型態: 住宅大樓(11層含以上有電梯) 屋齡: 建物現況格局: 3房2廳2衛 主要用途: 住家用 車位交易總價: 144 樓別/樓高: 四層/十四層 管理組織: 有 有無電梯: 有 備註: 親友、員工、共有人或其他特殊關係間之交易;預售屋、或土地及建物分件登記案件; 交易明細 土地建物買賣 交易明細 土 地 資 料 土地區段位置 土地移轉面積 使用分區或編定 福德段270地號 6.79坪 持分移轉(10224/920000) 都市：第二種住宅區 福德段276地號 0.00坪 持分移轉(15/600000) 都市：第二種住宅區 建 物 資 料 屋齡 建物移轉面積 持分 主要用途 主要建材 建築完成年月 總樓層數 建物分層 0 0.01坪 共同使用部分，本共同使用部分項目有：防空避難室兼停車空間、水箱、電信、消防機房、無障礙梯安全梯、供行動不便者使用升降機、台電配電室、發電機房、排風管道、安全梯、無障礙廁所、管委會使用空間、梯廳、無障礙通路、雨遮、消防機房、電梯機房等１７項。 鋼筋混凝土構造 109/11 十一層 0 主建物0.02坪 持分移轉 店鋪 鋼筋混凝土構造 109/11 十一層 一層 0 主建物0.03坪 持分移轉 辦公室 鋼筋混凝土構造 111/10 十四層 一層 0 主建物23.32坪 全筆移轉 集合住宅 鋼筋混凝土構造 111/10 十四層 四層,陽台,雨遮 陽台3.08坪 雨遮0.47坪 0 2.62坪 共同使用部分，本共同使用部分項目有：防空避難室兼停車空間、車道、停車空間等３項。 鋼筋混凝土構造 111/10 十四層 0 6.65坪 共同使用部分，本共同使用部分項目有：防空避難室兼停車空間、車道、停車空間等３項。 鋼筋混凝土構造 111/10 十四層 0 0.02坪 共同使用部分，本共同使用部分項目有：行動不便者電梯、梯廳、無障礙安全梯、機房、水箱、垃圾車暫停空間、垃圾暫存室、電信機房、台電管道間、台電配電場所、停車空間、發電機房、緊急昇降機、排煙室、安全梯、管委會使用空間、公共服務空間、行動不便者樓梯、雨遮、消防機房、電梯機房等２１項。 鋼筋混凝土構造 111/10 十四層 0 14.28坪 共同使用部分，本共同使用部分項目有：行動不便者電梯、梯廳、無障礙安全梯、機房、水箱、垃圾車暫停空間、垃圾暫存室、電信機房、台電管道間、台電配電場所、停車空間、發電機房、緊急昇降機、排煙室、安全梯、管委會使用空間、公共服務空間、行動不便者樓梯、雨遮、消防機房、電梯機房等２１項。 鋼筋混凝土構造 111/10 十四層 車 位 資 料 車位類別 車位交易價格 車位面積 所在樓層 坡道平面 1,440,000元 10.26坪 地下四樓`

describe('parsePrintPageText - 實價登錄文字解析', () => {
  describe('交易摘要解析', () => {
    it('應正確解析交易總價', () => {
      const { data } = parsePrintPageText(sampleText)
      expect(data.totalPrice).toBe(14340000)
    })

    it('應正確解析車位價格（從車位資料表）', () => {
      const { data } = parsePrintPageText(sampleText)
      expect(data.parkingPrice).toBe(144)
    })

    it('應正確解析樓別和樓高', () => {
      const { data } = parsePrintPageText(sampleText)
      expect(data.currentFloor).toBe(4)
      expect(data.floors).toBe(14)
    })
  })

  describe('建物面積解析', () => {
    it('應正確加總多筆主建物面積', () => {
      const { data } = parsePrintPageText(sampleText)
      // 0.02 + 0.03 + 23.32 = 23.37
      expect(data.mainBuildingArea).toBeCloseTo(23.37, 2)
    })

    it('應正確解析陽台面積', () => {
      const { data } = parsePrintPageText(sampleText)
      expect(data.balconyArea).toBe(3.08)
    })

    it('應正確解析雨遮面積', () => {
      const { data } = parsePrintPageText(sampleText)
      expect(data.canopyArea).toBe(0.47)
    })
  })

  describe('共同使用部分分類', () => {
    it('應正確歸類車位相關公設', () => {
      const { data } = parsePrintPageText(sampleText)
      // 2.62 + 6.65 = 9.27
      expect(data.commonArea1).toBeCloseTo(9.27, 2)
    })

    it('應正確歸類一般公設', () => {
      const { data } = parsePrintPageText(sampleText)
      // 0.01 + 0.02 + 14.28 = 14.31
      expect(data.commonArea2).toBeCloseTo(14.31, 2)
    })
  })

  describe('車位面積解析', () => {
    it('應正確解析車位面積', () => {
      const { data } = parsePrintPageText(sampleText)
      expect(data.parkingArea).toBe(10.26)
    })
  })

  describe('土地面積解析', () => {
    it('應正確解析土地面積（排除 0 坪）', () => {
      const { data } = parsePrintPageText(sampleText)
      expect(data.landArea).toBeCloseTo(6.79, 2)
    })
  })

  describe('單價計算', () => {
    it('應正確計算不含車位的單價', () => {
      const { data } = parsePrintPageText(sampleText)
      // 建物總面積（不含車位）= 23.37 + 3.08 + 0.47 + (9.27 + 14.31 - 10.26)
      // = 23.37 + 3.08 + 0.47 + 13.32 = 40.24
      // 單價 = (1434 - 144) / 40.24 = 1290 / 40.24 ≈ 32.06
      expect(data.unitPrice).toBeGreaterThan(0)
      expect(data.unitPrice).toBeCloseTo(32.06, 0)
    })
  })

  describe('錯誤處理', () => {
    it('空輸入應回傳錯誤', () => {
      const result = parsePrintPageText('')
      expect(result.error).toBe('請貼上實價登錄列印頁面的內容')
    })

    it('null 應回傳錯誤', () => {
      const result = parsePrintPageText(null)
      expect(result.error).toBe('請貼上實價登錄列印頁面的內容')
    })

    it('無效格式應回傳錯誤', () => {
      const result = parsePrintPageText('這是一段無關的文字')
      expect(result.error).toContain('無法識別')
    })
  })

  describe('預設值', () => {
    it('應設定 floorPremium 和 agePremium 為 1', () => {
      const { data } = parsePrintPageText(sampleText)
      expect(data.floorPremium).toBe(1)
      expect(data.agePremium).toBe(1)
    })
  })
})
