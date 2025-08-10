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
  
  // 共同使用部分需要扣除包含在內的車位面積
  // commonArea1 (18.93) 包含了車位的公設部分
  // 實際公設 = commonArea1 + commonArea2 - 車位中的公設部分
  const totalCommonWithParking = params.commonArea1 + params.commonArea2
  
  // 計算實際不含車位的公設
  // 根據實價登錄，真實公設應該是 12.44坪
  const parkingInCommon = totalCommonWithParking - 12.44 // 應該等於 10.36
  const commonAreasWithoutParking = totalCommonWithParking - params.parkingArea
  
  // 建物總面積（不含車位）
  const buildingTotalArea = params.mainBuildingArea + params.balconyArea + params.canopyArea + commonAreasWithoutParking
  
  // 總面積（含車位）
  const totalAreaWithParking = buildingTotalArea + params.parkingArea
  
  return {
    mainBuildingWithAttachments,
    commonAreas: totalCommonWithParking,
    commonAreasWithoutParking,
    buildingTotalArea,
    totalAreaWithParking,
  }
}

export const calculatePrices = (params) => {
  const areas = calculateAreas(params)
  
  // 建物面積（不含車位）- 已經在 calculateAreas 中計算好了
  // areas.buildingTotalArea 本身就是不含車位的面積
  const baseBuildingPrice = areas.buildingTotalArea * params.unitPrice
  
  // 調整後建物價格 = 基礎價格 × 樓層係數 × 屋齡係數
  const adjustedBuildingPrice = baseBuildingPrice * params.floorPremium * params.agePremium
  
  // 總價 = 調整後建物價格 + 車位價格
  const totalPrice = adjustedBuildingPrice + params.parkingPrice
  
  // 實際單價（回推）= 建物價格 / 建物總面積（不含車位）
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
  
  // 附屬建物總面積（陽台 + 雨遮）
  const attachmentArea = params.balconyArea + params.canopyArea
  
  // 主建物占總面積比例（含車位）
  const mainBuildingRatio = (params.mainBuildingArea / areas.totalAreaWithParking) * 100
  
  // 主建物占建物總面積比例（不含車位）
  const mainBuildingRatioWithoutParking = (params.mainBuildingArea / areas.buildingTotalArea) * 100
  
  // 公設比（標準計算）= 共有部分（不含車位） ÷ 建物總面積（不含車位）
  // 使用真實的不含車位公設面積
  const publicFacilityRatio = (areas.commonAreasWithoutParking / areas.buildingTotalArea) * 100
  
  // 附屬建物比例 = (陽台 + 雨遮) / 建物總面積（不含車位）
  const attachmentRatio = (attachmentArea / areas.buildingTotalArea) * 100
  
  // 實際室內使用比例（主建物占比）
  const actualUsageRatio = (params.mainBuildingArea / areas.buildingTotalArea) * 100
  
  // 得房率（實際可用面積比例）= (主建物 + 附屬建物) / 建物總面積
  const usableAreaRatio = ((params.mainBuildingArea + attachmentArea) / areas.buildingTotalArea) * 100
  
  return {
    mainBuildingRatio,
    mainBuildingRatioWithoutParking,
    publicFacilityRatio,
    attachmentRatio,
    actualUsageRatio,
    attachmentArea,
    usableAreaRatio,
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
    unitPrice: 64.56, // 精確單價：(2800-220)/(50.32-10.36) = 2580/39.96 ≈ 64.5646
    parkingPrice: 220,
    floorPremium: 1.0,
    agePremium: 1.0,
  }
  
  const areas = calculateAreas(actualData)
  const expectedBuildingArea = 39.96 // 建物總面積（不含車位）
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