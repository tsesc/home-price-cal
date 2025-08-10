// 測試計算邏輯
const params = {
  mainBuildingArea: 23.43,
  balconyArea: 2.81,
  canopyArea: 1.28,
  commonArea1: 18.93,
  commonArea2: 3.87,
  parkingArea: 10.36,
  unitPrice: 64.56,
  parkingPrice: 220,
};

console.log('=== 原始數據 ===');
console.log('主建物:', params.mainBuildingArea);
console.log('陽台:', params.balconyArea);
console.log('雨遮:', params.canopyArea);
console.log('共同使用部分1:', params.commonArea1);
console.log('共同使用部分2:', params.commonArea2);
console.log('車位:', params.parkingArea);
console.log('單價:', params.unitPrice);
console.log('車位價格:', params.parkingPrice);

console.log('\n=== 計算過程 ===');

// Step 1: 計算共同使用部分（不含車位）
const totalCommon = params.commonArea1 + params.commonArea2;
console.log('共同使用部分總計 = ' + params.commonArea1 + ' + ' + params.commonArea2 + ' = ' + totalCommon);

const commonWithoutParking = totalCommon - params.parkingArea;
console.log('共同使用部分（不含車位）= ' + totalCommon + ' - ' + params.parkingArea + ' = ' + commonWithoutParking);

// Step 2: 計算建物總面積（不含車位）
const buildingArea = params.mainBuildingArea + params.balconyArea + params.canopyArea + commonWithoutParking;
console.log('\n建物總面積（不含車位）');
console.log('= 主建物 + 陽台 + 雨遮 + 公設（不含車位）');
console.log('= ' + params.mainBuildingArea + ' + ' + params.balconyArea + ' + ' + params.canopyArea + ' + ' + commonWithoutParking);
console.log('= ' + buildingArea.toFixed(2) + ' 坪');

// Step 3: 計算總面積（含車位）
const totalArea = buildingArea + params.parkingArea;
console.log('\n總面積（含車位）');
console.log('= 建物總面積 + 車位');
console.log('= ' + buildingArea.toFixed(2) + ' + ' + params.parkingArea);
console.log('= ' + totalArea.toFixed(2) + ' 坪');

// Step 4: 計算建物價格
const buildingPrice = buildingArea * params.unitPrice;
console.log('\n建物價格');
console.log('= 建物總面積 × 單價');
console.log('= ' + buildingArea.toFixed(2) + ' × ' + params.unitPrice);
console.log('= ' + buildingPrice.toFixed(2) + ' 萬元');

// Step 5: 計算總價
const totalPrice = buildingPrice + params.parkingPrice;
console.log('\n房屋總價');
console.log('= 建物價格 + 車位價格');
console.log('= ' + buildingPrice.toFixed(2) + ' + ' + params.parkingPrice);
console.log('= ' + totalPrice.toFixed(2) + ' 萬元');

console.log('\n=== 驗證 ===');
console.log('目標總價: 2800 萬元');
console.log('計算總價: ' + totalPrice.toFixed(0) + ' 萬元');
console.log('誤差: ' + Math.abs(2800 - totalPrice).toFixed(2) + ' 萬元');

// 檢查錯誤的計算
console.log('\n=== 檢查可能的錯誤 ===');
const wrongArea = buildingArea - params.parkingArea;  // 如果重複扣除車位
console.log('如果重複扣除車位: ' + wrongArea.toFixed(2) + ' 坪');
const wrongPrice = wrongArea * params.unitPrice;
console.log('錯誤的建物價格: ' + wrongPrice.toFixed(2) + ' 萬元');
console.log('這就是 1910.98 的來源！');