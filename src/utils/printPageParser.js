import { chineseToNumber } from './chineseNumerals'

const parseParkingRelated = (desc) => {
  const generalKeywords = ['電梯', '梯廳', '機房', '水箱', '管委會', '垃圾', '電信', '台電', '安全梯', '排煙', '消防', '公共服務']
  const hasGeneral = generalKeywords.some(k => desc.includes(k))
  if (hasGeneral) return false
  const parkingKeywords = ['停車空間', '車道', '停車場']
  const hasParking = parkingKeywords.some(k => desc.includes(k))
  return hasParking
}

const parseNumber = (str) => {
  if (!str) return 0
  return parseFloat(str.replace(/,/g, '')) || 0
}

export const parsePrintPageText = (text) => {
  if (!text || !text.trim()) {
    return { error: '請貼上實價登錄列印頁面的內容' }
  }

  if (!text.includes('交易總價')) {
    return { error: '無法識別為實價登錄格式，請確認是否已完整複製列印頁面內容' }
  }

  const result = {
    mainBuildingArea: 0,
    balconyArea: 0,
    canopyArea: 0,
    commonArea1: 0,
    commonArea2: 0,
    parkingArea: 0,
    parkingPrice: 0,
    unitPrice: 0,
    landArea: 0,
    currentFloor: 0,
    floors: 0,
    totalPrice: 0,
    floorPremium: 1,
    agePremium: 1,
  }

  // 1. 交易總價（支援 tab/空白分隔）
  const totalPriceMatch = text.match(/交易總價:\s*([\d,]+)\s*元/)
  if (totalPriceMatch) {
    result.totalPrice = parseNumber(totalPriceMatch[1])
  }

  // 2. 車位交易總價（摘要區，單位為萬元）
  const parkingPriceSummaryMatch = text.match(/車位交易總價:\s*([\d,]+)/)
  if (parkingPriceSummaryMatch) {
    result.parkingPrice = parseNumber(parkingPriceSummaryMatch[1])
  }

  // 車位詳細資料（車位資料表格，單位為元，支援 tab 分隔）
  const parkingDetailMatch = text.match(/車位交易價格[\s\S]*?([\d,]+)\s*元\s+([\d.]+)\s*坪/)
  if (parkingDetailMatch) {
    result.parkingPrice = parseNumber(parkingDetailMatch[1])
    result.parkingArea = parseFloat(parkingDetailMatch[2])
  }

  // 3. 樓別/樓高
  const floorMatch = text.match(/樓別\/樓高:\s*(.+?)\/(.+?)(?:\s|$)/)
  if (floorMatch) {
    result.currentFloor = chineseToNumber(floorMatch[1].trim())
    result.floors = chineseToNumber(floorMatch[2].trim())
  }

  // 4. 主建物面積（可能有多筆，需加總；支援「主建物\t23.32坪」或「主建物23.32坪」）
  const mainBuildingMatches = text.matchAll(/主建物\s*([\d.]+)\s*坪/g)
  for (const m of mainBuildingMatches) {
    result.mainBuildingArea += parseFloat(m[1])
  }
  result.mainBuildingArea = Math.round(result.mainBuildingArea * 100) / 100

  // 陽台（支援「陽台\t3.08坪」或「陽台3.08坪」）
  const balconyMatch = text.match(/陽台\s*([\d.]+)\s*坪/)
  if (balconyMatch) {
    result.balconyArea = parseFloat(balconyMatch[1])
  }

  // 雨遮（支援「雨遮\t0.47坪」或「雨遮0.47坪」）
  const canopyMatch = text.match(/雨遮\s*([\d.]+)\s*坪/)
  if (canopyMatch) {
    result.canopyArea = parseFloat(canopyMatch[1])
  }

  // 5. 共同使用部分分類
  const commonAreaPattern = /([\d.]+)\s*坪\s+共同使用部分[，,]本共同使用部分項目有[：:]([^。]+)/g
  let commonMatch
  while ((commonMatch = commonAreaPattern.exec(text)) !== null) {
    const area = parseFloat(commonMatch[1])
    const desc = commonMatch[2]
    if (parseParkingRelated(desc)) {
      result.commonArea1 += area
    } else {
      result.commonArea2 += area
    }
  }
  result.commonArea1 = Math.round(result.commonArea1 * 100) / 100
  result.commonArea2 = Math.round(result.commonArea2 * 100) / 100

  // 6. 土地面積（僅從土地資料區塊提取）
  const landSectionMatch = text.match(/土\s*地\s*資\s*料([\s\S]*?)建\s*物\s*資\s*料/)
  if (landSectionMatch) {
    const landSection = landSectionMatch[1]
    const landMatches = landSection.matchAll(/([\d.]+)坪\s+持分移轉/g)
    for (const m of landMatches) {
      const area = parseFloat(m[1])
      if (area > 0) {
        result.landArea += area
      }
    }
    result.landArea = Math.round(result.landArea * 100) / 100
  }

  // 7. 計算單價（萬元/坪）
  // 先將車位價格統一為萬元
  let parkingPriceWan = result.parkingPrice
  if (parkingPriceWan >= 10000) {
    parkingPriceWan = parkingPriceWan / 10000
  }

  const totalCommon = result.commonArea1 + result.commonArea2
  const commonAreasWithoutParking = totalCommon - result.parkingArea
  const buildingTotalArea = result.mainBuildingArea + result.balconyArea + result.canopyArea +
    Math.max(0, commonAreasWithoutParking)

  const totalPriceWan = result.totalPrice / 10000

  if (buildingTotalArea > 0 && totalPriceWan > 0) {
    result.unitPrice = Math.round(
      ((totalPriceWan - parkingPriceWan) / buildingTotalArea) * 100
    ) / 100
  }

  // 將價格統一為萬元
  if (result.parkingPrice >= 10000) {
    result.parkingPrice = Math.round(result.parkingPrice / 10000)
  }

  // 8. 描述性欄位（meta）
  const meta = {
    address: '',
    communityName: '',
    transactionTarget: '',
    transactionDate: '',
    totalPriceRaw: result.totalPrice,
    unitPricePerPing: 0,
    totalArea: 0,
    mainBuildingRatio: '',
    buildingType: '',
    layout: '',
    mainUsage: '',
    management: '',
    hasElevator: '',
    note: '',
    buildingMaterial: '',
    completionDate: '',
    parkingType: '',
    parkingFloor: '',
  }

  const metaPatterns = [
    ['address', /地段位置或門牌:\s*(.+?)(?:\s*社區名稱|$)/],
    ['communityName', /社區名稱:\s*(.+?)(?:\s*交易標的|$)/],
    ['transactionTarget', /交易標的:\s*(.+?)(?:\s*交易日期|$)/],
    ['transactionDate', /交易日期:\s*(\S+)/],
    ['unitPricePerPing', /交易單價約:\s*([\d,]+)/],
    ['totalArea', /交易總面積:\s*([\d.]+)/],
    ['mainBuildingRatio', /主建物佔比\(%\):\s*(\S+)/],
    ['buildingType', /建物型態:\s*(.+?)(?:\s*屋齡|$)/],
    ['layout', /建物現況格局:\s*(.+?)(?:\s*主要用途|$)/],
    ['mainUsage', /主要用途:\s*(.+?)(?:\s*車位交易總價|$)/],
    ['management', /管理組織:\s*(.+?)(?:\s*有無電梯|$)/],
    ['hasElevator', /有無電梯:\s*(.+?)(?:\s*備註|$)/],
    ['note', /備註:\s*(.+?)(?:\s*交易明細|$)/],
  ]

  for (const [key, pattern] of metaPatterns) {
    const match = text.match(pattern)
    if (match) {
      const val = match[1].trim()
      if (key === 'unitPricePerPing') {
        meta[key] = parseNumber(val)
      } else if (key === 'totalArea') {
        meta[key] = parseFloat(val) || 0
      } else {
        meta[key] = val
      }
    }
  }

  // 建材和完成年月（從主建物所在行擷取，取最後一筆主建物的資訊）
  const buildingMaterialMatch = text.match(/(鋼筋混凝土構造|鋼骨構造|鋼骨鋼筋混凝土構造|加強磚造|磚造|木造)/)
  if (buildingMaterialMatch) {
    meta.buildingMaterial = buildingMaterialMatch[1]
  }

  // 建築完成年月（取主建物那筆，格式如 111/10）
  const completionMatches = [...text.matchAll(/(\d{2,3})\/(\d{1,2})\s+十/g)]
  if (completionMatches.length > 0) {
    const last = completionMatches[completionMatches.length - 1]
    meta.completionDate = `${last[1]}/${last[2]}`
  }

  // 車位類別和樓層（從車位資料區塊後的所有內容）
  const parkingSectionMatch = text.match(/車\s*位\s*資\s*料([\s\S]*)$/)
  if (parkingSectionMatch) {
    const parkingSection = parkingSectionMatch[1]
    const parkingTypeMatch = parkingSection.match(/(坡道平面|坡道機械|升降平面|升降機械|塔式車位|一樓平面)/)
    if (parkingTypeMatch) {
      meta.parkingType = parkingTypeMatch[1]
    }
    const parkingFloorMatch = parkingSection.match(/(地下[一二三四五六七八九十\d]+樓|地上[一二三四五六七八九十\d]+樓)/)
    if (parkingFloorMatch) {
      meta.parkingFloor = parkingFloorMatch[1]
    }
  }

  return { data: result, meta }
}
