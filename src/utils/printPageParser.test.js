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

// 瀏覽器全選複製的真實格式（含 tab 和換行）
const browserCopyText = `logo
地段位置或門牌:\t汐止區福德一路１７６巷００１５號四樓
社區名稱:\t采采良品
交易標的:\t房地(土地+建物)+車位
交易日期:\t108/12/31
交易總價:\t14,340,000\t元
交易單價約:\t320,565\t(元/坪)
交易總面積:\t50.51\t坪
主建物佔比(%):\t58.07%
交易棟筆數:\t
土地:\t2\t筆\t建物:\t1\t棟(戶)\t車位:\t1\t個
建物型態:\t住宅大樓(11層含以上有電梯)
屋齡:\t
建物現況格局:\t3房2廳2衛
主要用途:\t住家用
車位交易總價:\t144
樓別/樓高:\t四層/十四層
管理組織:\t有
有無電梯:\t有
備註:\t親友、員工、共有人或其他特殊關係間之交易;預售屋、或土地及建物分件登記案件;
交易明細
土地建物買賣  交易明細
土  地  資  料
土地區段位置\t土地移轉面積\t使用分區或編定
福德段270地號\t6.79坪 持分移轉(10224/920000)\t都市：第二種住宅區
福德段276地號\t0.00坪 持分移轉(15/600000)\t都市：第二種住宅區
建  物  資  料
屋齡\t建物移轉面積\t持分\t主要用途\t主要建材\t建築
完成年月\t總樓層數\t建物分層
0\t0.01坪\t\t共同使用部分，本共同使用部分項目有：防空避難室兼停車空間、水箱、電信、消防機房、無障礙梯安全梯、供行動不便者使用升降機、台電配電室、發電機房、排風管道、安全梯、無障礙廁所、管委會使用空間、梯廳、無障礙通路、雨遮、消防機房、電梯機房等１７項。\t鋼筋混凝土構造\t109/11\t十一層\t
0\t\t主建物\t0.02坪\t持分移轉\t店鋪\t鋼筋混凝土構造\t109/11\t十一層\t一層
0\t\t主建物\t0.03坪\t持分移轉\t辦公室\t鋼筋混凝土構造\t111/10\t十四層\t一層
0\t\t主建物\t23.32坪\t全筆移轉\t集合住宅\t鋼筋混凝土構造\t111/10\t十四層\t四層,陽台,雨遮
陽台\t3.08坪
雨遮\t0.47坪
0\t2.62坪\t\t共同使用部分，本共同使用部分項目有：防空避難室兼停車空間、車道、停車空間等３項。\t鋼筋混凝土構造\t111/10\t十四層\t
0\t6.65坪\t\t共同使用部分，本共同使用部分項目有：防空避難室兼停車空間、車道、停車空間等３項。\t鋼筋混凝土構造\t111/10\t十四層\t
0\t0.02坪\t\t共同使用部分，本共同使用部分項目有：行動不便者電梯、梯廳、無障礙安全梯、機房、水箱、垃圾車暫停空間、垃圾暫存室、電信機房、台電管道間、台電配電場所、停車空間、發電機房、緊急昇降機、排煙室、安全梯、管委會使用空間、公共服務空間、行動不便者樓梯、雨遮、消防機房、電梯機房等２１項。\t鋼筋混凝土構造\t111/10\t十四層\t
0\t14.28坪\t\t共同使用部分，本共同使用部分項目有：行動不便者電梯、梯廳、無障礙安全梯、機房、水箱、垃圾車暫停空間、垃圾暫存室、電信機房、台電管道間、台電配電場所、停車空間、發電機房、緊急昇降機、排煙室、安全梯、管委會使用空間、公共服務空間、行動不便者樓梯、雨遮、消防機房、電梯機房等２１項。\t鋼筋混凝土構造\t111/10\t十四層\t
車  位  資  料
車位類別\t車位交易價格\t車位面積\t所在樓層
坡道平面\t1,440,000元\t10.26坪\t地下四樓`

describe('parsePrintPageText - 瀏覽器全選複製格式', () => {
  it('應正確解析交易總價', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.totalPrice).toBe(14340000)
  })

  it('應正確解析車位價格', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.parkingPrice).toBe(144)
  })

  it('應正確解析樓別和樓高', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.currentFloor).toBe(4)
    expect(data.floors).toBe(14)
  })

  it('應正確加總多筆主建物面積', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.mainBuildingArea).toBeCloseTo(23.37, 2)
  })

  it('應正確解析陽台面積', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.balconyArea).toBe(3.08)
  })

  it('應正確解析雨遮面積', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.canopyArea).toBe(0.47)
  })

  it('應正確歸類車位相關公設', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.commonArea1).toBeCloseTo(9.27, 2)
  })

  it('應正確歸類一般公設', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.commonArea2).toBeCloseTo(14.31, 2)
  })

  it('應正確解析車位面積', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.parkingArea).toBe(10.26)
  })

  it('應正確解析土地面積', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.landArea).toBeCloseTo(6.79, 2)
  })

  it('應正確計算單價', () => {
    const { data } = parsePrintPageText(browserCopyText)
    expect(data.unitPrice).toBeCloseTo(32.06, 0)
  })
})

describe('parsePrintPageText - meta 描述性欄位解析（單行格式）', () => {
  it('應正確解析地段位置', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.address).toBe('汐止區福德一路１７６巷００１５號四樓')
  })

  it('應正確解析社區名稱', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.communityName).toBe('采采良品')
  })

  it('應正確解析交易標的', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.transactionTarget).toBe('房地(土地+建物)+車位')
  })

  it('應正確解析交易日期', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.transactionDate).toBe('108/12/31')
  })

  it('應正確解析交易單價', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.unitPricePerPing).toBe(320565)
  })

  it('應正確解析交易總面積', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.totalArea).toBe(50.51)
  })

  it('應正確解析主建物佔比', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.mainBuildingRatio).toBe('58.07%')
  })

  it('應正確解析建物型態', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.buildingType).toBe('住宅大樓(11層含以上有電梯)')
  })

  it('應正確解析建物現況格局', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.layout).toBe('3房2廳2衛')
  })

  it('應正確解析主要用途', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.mainUsage).toBe('住家用')
  })

  it('應正確解析管理組織', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.management).toBe('有')
  })

  it('應正確解析有無電梯', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.hasElevator).toBe('有')
  })

  it('應正確解析備註', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.note).toContain('親友、員工、共有人或其他特殊關係間之交易')
  })

  it('應正確解析建材', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.buildingMaterial).toBe('鋼筋混凝土構造')
  })

  it('應正確解析車位類別', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.parkingType).toBe('坡道平面')
  })

  it('應正確解析車位樓層', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.parkingFloor).toBe('地下四樓')
  })

  it('totalPriceRaw 應等於交易總價', () => {
    const { meta } = parsePrintPageText(sampleText)
    expect(meta.totalPriceRaw).toBe(14340000)
  })
})

describe('parsePrintPageText - meta 描述性欄位解析（瀏覽器 tab 格式）', () => {
  it('應正確解析地段位置', () => {
    const { meta } = parsePrintPageText(browserCopyText)
    expect(meta.address).toBe('汐止區福德一路１７６巷００１５號四樓')
  })

  it('應正確解析社區名稱', () => {
    const { meta } = parsePrintPageText(browserCopyText)
    expect(meta.communityName).toBe('采采良品')
  })

  it('應正確解析交易標的和日期', () => {
    const { meta } = parsePrintPageText(browserCopyText)
    expect(meta.transactionTarget).toBe('房地(土地+建物)+車位')
    expect(meta.transactionDate).toBe('108/12/31')
  })

  it('應正確解析建物型態和格局', () => {
    const { meta } = parsePrintPageText(browserCopyText)
    expect(meta.buildingType).toBe('住宅大樓(11層含以上有電梯)')
    expect(meta.layout).toBe('3房2廳2衛')
  })

  it('應正確解析車位類別和樓層', () => {
    const { meta } = parsePrintPageText(browserCopyText)
    expect(meta.parkingType).toBe('坡道平面')
    expect(meta.parkingFloor).toBe('地下四樓')
  })

  it('應正確解析建材', () => {
    const { meta } = parsePrintPageText(browserCopyText)
    expect(meta.buildingMaterial).toBe('鋼筋混凝土構造')
  })

  it('缺失欄位應回傳空字串', () => {
    const text = '交易總價: 10,000,000 元'
    const { meta } = parsePrintPageText(text)
    expect(meta.communityName).toBe('')
    expect(meta.address).toBe('')
    expect(meta.buildingType).toBe('')
  })
})

// 第三種格式：共同使用部分無描述，面積在標籤前面
const noDescCommonAreaText = `logo
地段位置或門牌:\t汐止區福德二路７５號七樓之２
社區名稱:\t長虹大鎮
交易標的:\t房地(土地+建物)+車位
交易日期:\t114/08/09
交易總價:\t26,000,000\t元
交易單價約:\t494,274\t(元/坪)
交易總面積:\t53.93\t坪
主建物佔比(%):\t60.26%
交易棟筆數:\t
土地:\t2\t筆\t建物:\t1\t棟(戶)\t車位:\t1\t個
建物型態:\t住宅大樓(11層含以上有電梯)
屋齡:\t16
建物現況格局:\t4房2廳2衛
主要用途:\t住家用
車位交易總價:\t150
樓別/樓高:\t七層/十四層
管理組織:\t有
有無電梯:\t有
備註:\t陽台外推;其他增建;
交易明細
土地建物買賣  交易明細
土  地  資  料
土地區段位置\t土地移轉面積\t使用分區或編定
福德段816地號\t5.84坪 持分移轉(299/10000)\t都市：第二種住宅區
福德段816-1地號\t0.01坪 持分移轉(299/10000)\t都市：道路用地
建  物  資  料
屋齡\t建物移轉面積\t持分\t主要用途\t主要建材\t建築
完成年月\t總樓層數\t建物分層
16\t\t主建物\t29.87坪\t全筆移轉\t住家用\t鋼筋混凝土造\t098/08\t十四層\t七層,陽台,雨遮
陽台\t3.96坪
雨遮\t1.07坪
16\t19.04坪\t\t共同使用部分\t鋼筋混凝土造\t098/08\t十四層\t
車  位  資  料
車位類別\t車位交易價格\t車位面積\t所在樓層
升降平面\t1,500,000元\t4.37坪\t地下二樓`

describe('parsePrintPageText - 無描述共同使用部分格式', () => {
  it('應正確解析交易總價', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.totalPrice).toBe(26000000)
  })

  it('應正確解析車位價格（元→萬元）', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.parkingPrice).toBe(150)
  })

  it('應正確解析車位面積', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.parkingArea).toBe(4.37)
  })

  it('應正確解析樓別和樓高', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.currentFloor).toBe(7)
    expect(data.floors).toBe(14)
  })

  it('應正確解析主建物面積', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.mainBuildingArea).toBe(29.87)
  })

  it('應正確解析陽台面積', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.balconyArea).toBe(3.96)
  })

  it('應正確解析雨遮面積', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.canopyArea).toBe(1.07)
  })

  it('應將無描述的共同使用部分放入 commonArea2', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.commonArea2).toBe(19.04)
  })

  it('應正確解析土地面積（加總兩筆）', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    expect(data.landArea).toBeCloseTo(5.85, 2)
  })

  it('應正確計算單價', () => {
    const { data } = parsePrintPageText(noDescCommonAreaText)
    // 公設不含車位 = 19.04 - 4.37 = 14.67
    // 建物總面積 = 29.87 + 3.96 + 1.07 + 14.67 = 49.57
    // 單價 = (2600 - 150) / 49.57 ≈ 49.43
    expect(data.unitPrice).toBeCloseTo(49.43, 0)
  })

  it('應正確解析建材（鋼筋混凝土造）', () => {
    const { meta } = parsePrintPageText(noDescCommonAreaText)
    expect(meta.buildingMaterial).toBe('鋼筋混凝土造')
  })

  it('應正確解析建築完成年月', () => {
    const { meta } = parsePrintPageText(noDescCommonAreaText)
    expect(meta.completionDate).toBe('098/08')
  })

  it('應正確解析車位類別和樓層', () => {
    const { meta } = parsePrintPageText(noDescCommonAreaText)
    expect(meta.parkingType).toBe('升降平面')
    expect(meta.parkingFloor).toBe('地下二樓')
  })

  it('應正確解析社區名稱', () => {
    const { meta } = parsePrintPageText(noDescCommonAreaText)
    expect(meta.communityName).toBe('長虹大鎮')
  })

  it('應正確解析備註', () => {
    const { meta } = parsePrintPageText(noDescCommonAreaText)
    expect(meta.note).toContain('陽台外推')
  })
})

// 第四種格式：「本共同使用部分之項目有」（無「共同使用部分，」前綴，有「之」字）
const altCommonAreaText = `logo
地段位置或門牌:    汐止區福德二路６７之２號十一樓
社區名稱:    幸福城市
交易標的:    房地(土地+建物)+車位
交易日期:    114/09/13
交易總價:    23,980,000    元
交易單價約:    608,417    (元/坪)
交易總面積:    44.45    坪
主建物佔比(%):    52.41%
交易棟筆數:
土地:    1    筆    建物:    1    棟(戶)    車位:    1    個
建物型態:    住宅大樓(11層含以上有電梯)
屋齡:    8
建物現況格局:    3房2廳2衛
主要用途:    住家用
車位交易總價:    250
樓別/樓高:    十一層/十五層
管理組織:    有
有無電梯:    有
備註:
交易明細
土地建物買賣  交易明細
土  地  資  料
土地區段位置    土地移轉面積    使用分區或編定
福德段172地號    5.53坪 持分移轉(68/10000)    都市：第二種住宅區
建  物  資  料
屋齡    建物移轉面積    持分    主要用途    主要建材    建築
完成年月    總樓層數    建物分層
8        主建物    18.50坪    全筆移轉    住家用    鋼筋混凝土構造    106/07    十五層    十一層,陽台,雨遮
陽台    2.93坪
雨遮    2.22坪
8    16.29坪        本共同使用部分之項目有：管委會空間、梯廳、大廳、防空避難室兼停車空間、梯間、垃圾儲存室、台電配電場所、停車空間、電信機房、水箱、發電機室、消防泵浦室、雨水回收機房、污水機房等１４項。    鋼筋混凝土構造    106/07    十五層
8    4.51坪        本共同使用部分之項目有：梯廳、梯間、機械室、水箱等４項。    鋼筋混凝土構造    106/07    十五層
車  位  資  料
車位類別    車位交易價格    車位面積    所在樓層
坡道平面    2,500,000元    9.15坪    地下二樓`

describe('parsePrintPageText - 「本共同使用部分之項目有」格式', () => {
  it('應正確解析交易總價', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.totalPrice).toBe(23980000)
  })

  it('應正確解析主建物面積', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.mainBuildingArea).toBe(18.50)
  })

  it('應正確解析陽台面積', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.balconyArea).toBe(2.93)
  })

  it('應正確解析雨遮面積', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.canopyArea).toBe(2.22)
  })

  it('應正確歸類一般公設（兩筆皆含一般關鍵字）', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    // 16.29 + 4.51 = 20.80（兩筆都含梯廳、水箱等一般關鍵字）
    expect(data.commonArea2).toBeCloseTo(20.80, 2)
  })

  it('車位相關公設應為 0', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.commonArea1).toBe(0)
  })

  it('應正確解析車位面積', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.parkingArea).toBe(9.15)
  })

  it('應正確解析車位價格', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.parkingPrice).toBe(250)
  })

  it('應正確解析樓別和樓高', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.currentFloor).toBe(11)
    expect(data.floors).toBe(15)
  })

  it('應正確解析土地面積', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    expect(data.landArea).toBe(5.53)
  })

  it('應正確計算單價', () => {
    const { data } = parsePrintPageText(altCommonAreaText)
    // 公設不含車位 = 20.80 - 9.15 = 11.65
    // 建物總面積 = 18.50 + 2.93 + 2.22 + 11.65 = 35.30
    // 單價 = (2398 - 250) / 35.30 ≈ 60.85
    expect(data.unitPrice).toBeCloseTo(60.85, 0)
  })

  it('應正確解析 meta 欄位', () => {
    const { meta } = parsePrintPageText(altCommonAreaText)
    expect(meta.address).toBe('汐止區福德二路６７之２號十一樓')
    expect(meta.communityName).toBe('幸福城市')
    expect(meta.transactionDate).toBe('114/09/13')
    expect(meta.parkingType).toBe('坡道平面')
    expect(meta.parkingFloor).toBe('地下二樓')
  })
})

// 第五種格式：車位無單獨定價（車位含在總價中）
const noParkingPriceText = `logo
地段位置或門牌:    汐止區福德二路５９號二樓
社區名稱:    幸福城市
交易標的:    房地(土地+建物)+車位
交易日期:    110/09/07
交易總價:    16,600,000    元
交易單價約:    373,458    (元/坪)
交易總面積:    44.45    坪
主建物佔比(%):    53.62%
交易棟筆數:
土地:    1    筆    建物:    1    棟(戶)    車位:    1    個
建物型態:    住宅大樓(11層含以上有電梯)
屋齡:    4
建物現況格局:    3房2廳2衛
主要用途:    住家用
車位交易總價:
樓別/樓高:    二層/十五層
管理組織:    有
有無電梯:    有
備註:
交易明細
土地建物買賣  交易明細
土  地  資  料
土地區段位置    土地移轉面積    使用分區或編定
福德段172地號    5.53坪 持分移轉(68/10000)    都市：第二種住宅區
建  物  資  料
屋齡    建物移轉面積    持分    主要用途    主要建材    建築
完成年月    總樓層數    建物分層
4        主建物    18.93坪    全筆移轉    住家用    鋼筋混凝土構造    106/07    十五層    二層,陽台,雨遮
陽台    2.15坪
雨遮    2.57坪
4    16.39坪        本共同使用部分之項目有：管委會空間、梯廳、大廳、防空避難室兼停車空間、梯間、垃圾儲存室、台電配電場所、停車空間、電信機房、水箱、發電機室、消防泵浦室、雨水回收機房、污水機房等１４項。    鋼筋混凝土構造    106/07    十五層
4    4.41坪        本共同使用部分之項目有：梯廳、梯間、機械室、水箱等４項。    鋼筋混凝土構造    106/07    十五層
車  位  資  料
車位類別    車位交易價格    車位面積    所在樓層
坡道平面        9.15坪    地下四樓`

describe('parsePrintPageText - 車位無單獨定價格式', () => {
  it('應正確解析車位面積（即使沒有價格）', () => {
    const { data } = parsePrintPageText(noParkingPriceText)
    expect(data.parkingArea).toBe(9.15)
  })

  it('車位價格應為 0', () => {
    const { data } = parsePrintPageText(noParkingPriceText)
    expect(data.parkingPrice).toBe(0)
  })

  it('公設比應正確扣除車位面積', () => {
    const { data } = parsePrintPageText(noParkingPriceText)
    // commonAreasWithoutParking = 20.80 - 9.15 = 11.65
    // buildingTotalArea = 18.93 + 2.15 + 2.57 + 11.65 = 35.30
    // 公設比 = 11.65 / 35.30 ≈ 33%（不應出現 46.8% 的異常值）
    const commonArea2 = data.commonArea1 + data.commonArea2
    const commonWithoutParking = commonArea2 - data.parkingArea
    const buildingTotal = data.mainBuildingArea + data.balconyArea + data.canopyArea + commonWithoutParking
    const ratio = (commonWithoutParking / buildingTotal) * 100
    expect(ratio).toBeCloseTo(33, 0)
  })

  it('總面積應與實價登錄吻合（44.45 坪）', () => {
    const { data } = parsePrintPageText(noParkingPriceText)
    const commonWithoutParking = data.commonArea1 + data.commonArea2 - data.parkingArea
    const buildingTotal = data.mainBuildingArea + data.balconyArea + data.canopyArea + commonWithoutParking
    const totalWithParking = buildingTotal + data.parkingArea
    expect(totalWithParking).toBeCloseTo(44.45, 1)
  })
})

// 第六種格式：「項目有」後無冒號 + 使用「陽臺」正體字
const noColonCommonAreaText = `logo
地段位置或門牌:    康寧街４５９巷１９號十三樓
社區名稱:    合康-冠東城B1-06F
交易標的:    房地(土地+建物)+車位
交易日期:    109/08/18
交易總價:    22,200,000    元
交易單價約:    384,238    (元/坪)
交易總面積:    62.02    坪
主建物佔比(%):    56.89%
交易棟筆數:
土地:    1    筆    建物:    1    棟(戶)    車位:    1    個
建物型態:    住宅大樓(11層含以上有電梯)
屋齡:
建物現況格局:    4房2廳2衛
主要用途:    住家用
車位交易總價:    215
樓別/樓高:    十三層/十九層
管理組織:    有
有無電梯:    有
備註:    建物第一次登記後移轉
交易明細
土地建物買賣  交易明細
土  地  資  料
土地區段位置    土地移轉面積    使用分區或編定
金龍段188地號    7.70坪 持分移轉(478/100000)    都市：商業區
建  物  資  料
屋齡    建物移轉面積    持分    主要用途    主要建材    建築
完成年月    總樓層數    建物分層
0        主建物    29.69坪    全筆移轉    集合住宅    鋼筋混凝土構造    109/09    十九層    十三層,陽臺,雨遮
陽臺    3.31坪
雨遮    2.46坪
0    15.88坪        共同使用部分，本共同使用部分之項目有車道、梯廳、門廊（空橋下）、門廊（頂蓋下）、走道、陽台、消防中繼機房、台電配電場所、公眾用梯廳、防災中心、計程車臨停車位、垃圾車車位、垃圾儲藏空間、防空避難室兼停車空間、電信機房、機房、停車空間、發電機房、消防機房、雨污水機房等二十項。    鋼筋混凝土構造    109/09    十九層
0    4.11坪        共同使用部分，本共同使用部分之項目有門廳、排煙室、緊急昇降機、行動不便昇降機、梯廳、特別安全梯、陽台、男廁、女廁、管委會使用空間、水箱、水箱室、機房等十三項。    鋼筋混凝土構造    109/09    十九層
0    6.57坪        共同使用部分，本共同使用部分之項目有行動不便昇降機、排煙室、緊急昇降機、梯廳、特別安全梯等五項。    鋼筋混凝土構造    109/09    十九層
車  位  資  料
車位類別    車位交易價格    車位面積    所在樓層
坡道平面    2,150,000元    9.84坪    地下二樓`

describe('parsePrintPageText - 「項目有」後無冒號格式', () => {
  it('應正確解析交易總價', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    expect(data.totalPrice).toBe(22200000)
  })

  it('應正確解析主建物面積', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    expect(data.mainBuildingArea).toBe(29.69)
  })

  it('應正確解析陽臺面積（正體字）', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    expect(data.balconyArea).toBe(3.31)
  })

  it('應正確解析雨遮面積', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    expect(data.canopyArea).toBe(2.46)
  })

  it('應正確歸類共同使用部分（三筆皆含一般關鍵字）', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    // 15.88 + 4.11 + 6.57 = 26.56
    expect(data.commonArea2).toBeCloseTo(26.56, 2)
  })

  it('車位相關公設應為 0', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    expect(data.commonArea1).toBe(0)
  })

  it('應正確解析車位面積和價格', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    expect(data.parkingArea).toBe(9.84)
    expect(data.parkingPrice).toBe(215)
  })

  it('應正確解析樓別和樓高', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    expect(data.currentFloor).toBe(13)
    expect(data.floors).toBe(19)
  })

  it('應正確解析土地面積', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    expect(data.landArea).toBe(7.70)
  })

  it('應正確計算單價', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    // 公設不含車位 = 26.56 - 9.84 = 16.72
    // 建物總面積 = 29.69 + 3.31 + 2.46 + 16.72 = 52.18
    // 單價 = (2220 - 215) / 52.18 ≈ 38.42
    expect(data.unitPrice).toBeCloseTo(38.42, 0)
  })

  it('總面積應與實價登錄吻合（62.02 坪）', () => {
    const { data } = parsePrintPageText(noColonCommonAreaText)
    const commonWithoutParking = data.commonArea1 + data.commonArea2 - data.parkingArea
    const buildingTotal = data.mainBuildingArea + data.balconyArea + data.canopyArea + commonWithoutParking
    const totalWithParking = buildingTotal + data.parkingArea
    expect(totalWithParking).toBeCloseTo(62.02, 1)
  })

  it('應正確解析 meta 欄位', () => {
    const { meta } = parsePrintPageText(noColonCommonAreaText)
    expect(meta.address).toBe('康寧街４５９巷１９號十三樓')
    expect(meta.communityName).toBe('合康-冠東城B1-06F')
    expect(meta.transactionDate).toBe('109/08/18')
    expect(meta.parkingType).toBe('坡道平面')
    expect(meta.parkingFloor).toBe('地下二樓')
    expect(meta.buildingMaterial).toBe('鋼筋混凝土構造')
  })
})

// 第七種格式：「陽臺」正體字 + 有冒號 + 車位無樓層資訊
const traditionalBalconyText = `logo
地段位置或門牌:    汐止區湖前街３１巷１７號七樓
社區名稱:    耀東城
交易標的:    房地(土地+建物)+車位
交易日期:    108/09/28
交易總價:    21,700,000    元
交易單價約:    396,532    (元/坪)
交易總面積:    59.90    坪
主建物佔比(%):    58.82%
交易棟筆數:
土地:    1    筆    建物:    1    棟(戶)    車位:    1    個
建物型態:    住宅大樓(11層含以上有電梯)
屋齡:
建物現況格局:    3房2廳2衛
主要用途:    住家用
車位交易總價:    210
樓別/樓高:    七層/十七層
管理組織:    有
有無電梯:
備註:    建物第一次登記後移轉
交易明細
土地建物買賣  交易明細
土  地  資  料
土地區段位置    土地移轉面積    使用分區或編定
金龍段231地號    8.65坪 持分移轉(1260/100000)    都市：住
建  物  資  料
屋齡    建物移轉面積    持分    主要用途    主要建材    建築
完成年月    總樓層數    建物分層
0        主建物    29.08坪    全筆移轉    集合住宅    鋼筋混凝土構造    109/01    十七層    七層,陽臺,雨遮
陽臺    3.11坪
雨遮    1.67坪
0    20.01坪        共同使用部分，本共同使用部分之項目有：管委會使用空間、特別安全梯、梯廳、排煙室、特安全梯、管理員室、自來水箱、消防水箱、電梯機房、防空避難室兼停車空間、台電配電場所、自行車停車位、垃圾暫存室、垃圾車暫停車位、裝卸車位、排風、進風、防災中心、停車空間、消防機房、緊急發電機室、電信機房、機房、污水機房、安全梯等２５項。    鋼筋混凝土構造    109/01    十七層
0    6.05坪        共同使用部分，本共同使用部分之項目有：梯廳、排煙室、特別安全梯等３項。    鋼筋混凝土構造    109/01    十七層
車  位  資  料
車位類別    車位交易價格    車位面積    所在樓層
坡道平面    2,100,000元    10.48坪    `

describe('parsePrintPageText - 「陽臺」正體字格式', () => {
  it('應正確解析陽臺面積（正體字）', () => {
    const { data } = parsePrintPageText(traditionalBalconyText)
    expect(data.balconyArea).toBe(3.11)
  })

  it('應正確解析主建物面積', () => {
    const { data } = parsePrintPageText(traditionalBalconyText)
    expect(data.mainBuildingArea).toBe(29.08)
  })

  it('應正確歸類共同使用部分', () => {
    const { data } = parsePrintPageText(traditionalBalconyText)
    expect(data.commonArea1).toBe(0)
    expect(data.commonArea2).toBeCloseTo(26.06, 2)
  })

  it('應正確解析車位（無樓層資訊）', () => {
    const { data, meta } = parsePrintPageText(traditionalBalconyText)
    expect(data.parkingArea).toBe(10.48)
    expect(data.parkingPrice).toBe(210)
    expect(meta.parkingType).toBe('坡道平面')
    expect(meta.parkingFloor).toBe('')
  })

  it('總面積與單價應正確', () => {
    const { data } = parsePrintPageText(traditionalBalconyText)
    const cw = data.commonArea1 + data.commonArea2 - data.parkingArea
    const bt = data.mainBuildingArea + data.balconyArea + data.canopyArea + cw
    const total = bt * data.unitPrice + data.parkingPrice
    // 含車位 59.92 ≈ 實價登錄 59.90（四捨五入差異）
    expect(bt + data.parkingArea).toBeCloseTo(59.90, 0)
    // 單價 ≈ 39.65 萬/坪
    expect(data.unitPrice).toBeCloseTo(39.64, 0)
    // 總價 ≈ 2170 萬
    expect(total).toBeCloseTo(2170, -1)
  })

  it('應正確解析 meta 欄位', () => {
    const { meta } = parsePrintPageText(traditionalBalconyText)
    expect(meta.address).toBe('汐止區湖前街３１巷１７號七樓')
    expect(meta.communityName).toBe('耀東城')
    expect(meta.transactionDate).toBe('108/09/28')
    expect(meta.buildingMaterial).toBe('鋼筋混凝土構造')
    expect(meta.completionDate).toBe('109/01')
  })
})
