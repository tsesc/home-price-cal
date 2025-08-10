/**
 * 房價計算器核心邏輯
 * 
 * 根據實價登錄資料的計算邏輯：
 * 1. 建物總面積 = 主建物 + 附屬建物（陽台、雨遮）+ 共同使用部分
 * 2. 房屋單價通常指的是（總價 - 車位價格）/ 建物總面積
 * 3. 總價 = 建物總價 + 車位價格
 */

export const calculateAreas = (params) => {
  const mainBuildingWithAttachments = params.mainBuildingArea + params.balconyArea + params.canopyArea
  const commonAreas = params.commonArea1 + params.commonArea2
  const buildingTotalArea = mainBuildingWithAttachments + commonAreas
  const totalAreaWithParking = buildingTotalArea + params.parkingArea
  
  return {
    mainBuildingWithAttachments,
    commonAreas,
    buildingTotalArea,
    totalAreaWithParking,
  }
}

export const calculatePrices = (params) => {
  const areas = calculateAreas(params)
  
  // 基礎建物價格 = 建物總面積 × 單價
  const baseBuildingPrice = areas.buildingTotalArea * params.unitPrice
  
  // 調整後建物價格 = 基礎價格 × 樓層係數 × 屋齡係數
  const adjustedBuildingPrice = baseBuildingPrice * params.floorPremium * params.agePremium
  
  // 總價 = 調整後建物價格 + 車位價格
  const totalPrice = adjustedBuildingPrice + params.parkingPrice
  
  // 實際單價（回推）= 建物價格 / 建物總面積
  const actualUnitPrice = adjustedBuildingPrice / areas.buildingTotalArea
  
  return {
    baseBuildingPrice,
    adjustedBuildingPrice,
    totalPrice,
    actualUnitPrice,
  }
}

export const calculateRatios = (params) => {
  const areas = calculateAreas(params)
  
  // 主建物占建物總面積比例
  const mainBuildingRatio = (params.mainBuildingArea / areas.totalAreaWithParking) * 100
  
  // 主建物占建物總面積比例（扣除車位）
  const mainBuildingRatioWithoutParking = (params.mainBuildingArea / areas.buildingTotalArea) * 100
  
  // 公設比 = 公共設施面積 / 建物總面積（不含車位）
  const publicFacilityRatio = (areas.commonAreas / areas.buildingTotalArea) * 100
  
  // 附屬建物比例 = (陽台 + 雨遮) / 建物總面積（不含車位）
  const attachmentRatio = ((params.balconyArea + params.canopyArea) / areas.buildingTotalArea) * 100
  
  return {
    mainBuildingRatio,
    mainBuildingRatioWithoutParking,
    publicFacilityRatio,
    attachmentRatio,
  }
}

// 驗證函數：根據實價登錄資料驗證計算
export const validateWithActualData = () => {
  const actualData = {
    mainBuildingArea: 23.43,
    balconyArea: 2.81,
    canopyArea: 1.28,
    commonArea1: 18.93,
    commonArea2: 3.87,
    parkingArea: 10.36,
    unitPrice: 51.28, // 修正：(2800-220)/50.31 ≈ 51.28
    parkingPrice: 220,
    floorPremium: 1.0,
    agePremium: 1.0,
  }
  
  const areas = calculateAreas(actualData)
  const expectedBuildingArea = 50.31 // 實際資料顯示的建物總面積
  const actualBuildingArea = Math.round(areas.buildingTotalArea * 100) / 100
  
  // 驗證面積計算
  const areaValidation = Math.abs(actualBuildingArea - expectedBuildingArea) < 0.1
  
  // 驗證總價計算
  const prices = calculatePrices(actualData)
  const expectedTotalPrice = 2800 // 實際總價
  const calculatedTotalPrice = Math.round(prices.totalPrice)
  const priceValidation = Math.abs(calculatedTotalPrice - expectedTotalPrice) < 50 // 容許誤差50萬
  
  return {
    areaValidation,
    priceValidation,
    actualBuildingArea,
    expectedBuildingArea,
    calculatedTotalPrice,
    expectedTotalPrice,
    details: {
      areas,
      prices,
    }
  }
}