import React, { useState, useEffect } from 'react'
import './App.css'
import { calculateAreas, calculatePrices, calculateRatios } from './utils/priceCalculator'
import ImportDialog from './components/ImportDialog'
import PrintReport from './components/PrintReport'

const STORAGE_KEY = 'home-price-cal'

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

function App() {
  const defaultParams = {
    mainBuildingArea: 23.43,
    balconyArea: 2.81,
    canopyArea: 1.28,
    commonArea1: 18.93,
    commonArea2: 3.87,
    parkingArea: 10.36,
    unitPrice: 64.56,
    parkingPrice: 220,
    landArea: 7.01,
    landShareRatio: 1580 / 100000,
    floors: 14,
    currentFloor: 3,
    buildingAge: 6,
    floorPremium: 1,
    agePremium: 1,
  }

  const saved = loadSavedState()
  const initialParams = saved?.parameters ?? defaultParams
  const initialTransaction = saved?.transactionData ?? null

  const [parameters, setParameters] = useState(initialParams)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [transactionData, setTransactionData] = useState(initialTransaction)
  const [showPrintReport, setShowPrintReport] = useState(false)

  // 初始化時就計算，避免空物件問題
  const [areas, setAreas] = useState(() => calculateAreas(initialParams))
  const [prices, setPrices] = useState(() => calculatePrices(initialParams))
  const [ratios, setRatios] = useState(() => calculateRatios(initialParams))

  // 持久化到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ parameters, transactionData }))
    } catch { /* quota exceeded - ignore */ }
  }, [parameters, transactionData])

  useEffect(() => {
    const calculatedAreas = calculateAreas(parameters)
    const calculatedPrices = calculatePrices(parameters)
    const calculatedRatios = calculateRatios(parameters)

    setAreas(calculatedAreas)
    setPrices(calculatedPrices)
    setRatios(calculatedRatios)
  }, [parameters])

  const handleParameterChange = (key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }))
  }

  const handleMetaChange = (key, value) => {
    setTransactionData(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleImportApply = ({ data, meta, mapImageDataUrl }) => {
    setParameters(prev => ({
      ...prev,
      mainBuildingArea: data.mainBuildingArea,
      balconyArea: data.balconyArea,
      canopyArea: data.canopyArea,
      commonArea1: data.commonArea1,
      commonArea2: data.commonArea2,
      parkingArea: data.parkingArea,
      parkingPrice: data.parkingPrice,
      unitPrice: data.unitPrice,
      landArea: data.landArea,
      currentFloor: data.currentFloor,
      floors: data.floors,
    }))
    setTransactionData({ ...meta, mapImageDataUrl })
    setShowImportDialog(false)
  }

  return (
    <div className="container">
      <h1>房價計算器</h1>
      
      <div className="calculator-wrapper">
        <div className="parameters-section">
          <h2>參數調整</h2>
          <button className="import-btn" onClick={() => setShowImportDialog(true)}>
            從實價登錄匯入
          </button>
          <button
            className="report-btn"
            onClick={() => setShowPrintReport(true)}
            disabled={!transactionData?.address}
          >
            產生報告
          </button>

          {transactionData && (
            <div className="parameter-group transaction-info-group">
              <h3>交易資訊</h3>
              {[
                ['address', '地段位置'],
                ['communityName', '社區名稱'],
                ['transactionTarget', '交易標的'],
                ['transactionDate', '交易日期'],
                ['buildingType', '建物型態'],
                ['layout', '格局'],
                ['mainUsage', '主要用途'],
                ['buildingMaterial', '主要建材'],
                ['completionDate', '建築完成年月'],
                ['management', '管理組織'],
                ['hasElevator', '有無電梯'],
                ['parkingType', '車位類別'],
                ['parkingFloor', '車位樓層'],
              ].map(([key, label]) => (
                <div className="parameter" key={key}>
                  <label>{label}</label>
                  <input
                    type="text"
                    value={transactionData[key] || ''}
                    onChange={(e) => handleMetaChange(key, e.target.value)}
                    className="text-input"
                  />
                </div>
              ))}
              <div className="parameter parameter-wide">
                <label>備註</label>
                <textarea
                  value={transactionData.note || ''}
                  onChange={(e) => handleMetaChange('note', e.target.value)}
                  className="text-input note-input"
                  rows={2}
                />
              </div>
              {transactionData.mapImageDataUrl && (
                <div className="parameter parameter-wide map-image-section">
                  <label>地圖截圖</label>
                  <div className="map-image-preview">
                    <img src={transactionData.mapImageDataUrl} alt="地圖截圖" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="parameter-group">
            <h3>建物面積（坪）</h3>
            <div className="parameter">
              <label>主建物面積</label>
              <input
                type="number"
                value={parameters.mainBuildingArea}
                onChange={(e) => handleParameterChange('mainBuildingArea', e.target.value)}
                step="0.01"
              />
            </div>
            <div className="parameter">
              <label>陽台面積</label>
              <input
                type="number"
                value={parameters.balconyArea}
                onChange={(e) => handleParameterChange('balconyArea', e.target.value)}
                step="0.01"
              />
            </div>
            <div className="parameter">
              <label>雨遮面積</label>
              <input
                type="number"
                value={parameters.canopyArea}
                onChange={(e) => handleParameterChange('canopyArea', e.target.value)}
                step="0.01"
              />
            </div>
            <div className="parameter">
              <label>共同使用部分1</label>
              <input
                type="number"
                value={parameters.commonArea1}
                onChange={(e) => handleParameterChange('commonArea1', e.target.value)}
                step="0.01"
              />
            </div>
            <div className="parameter">
              <label>共同使用部分2</label>
              <input
                type="number"
                value={parameters.commonArea2}
                onChange={(e) => handleParameterChange('commonArea2', e.target.value)}
                step="0.01"
              />
            </div>
            <div className="parameter">
              <label>車位面積</label>
              <input
                type="number"
                value={parameters.parkingArea}
                onChange={(e) => handleParameterChange('parkingArea', e.target.value)}
                step="0.01"
              />
            </div>
          </div>

          <div className="parameter-group">
            <h3>價格參數</h3>
            <div className="parameter">
              <label>單價（萬元/坪）</label>
              <input
                type="number"
                value={parameters.unitPrice}
                onChange={(e) => handleParameterChange('unitPrice', e.target.value)}
                step="0.01"
              />
            </div>
            <div className="parameter">
              <label>車位價格（萬元）</label>
              <input
                type="number"
                value={parameters.parkingPrice}
                onChange={(e) => handleParameterChange('parkingPrice', e.target.value)}
                step="1"
              />
            </div>
          </div>

          <div className="parameter-group">
            <h3>其他參數</h3>
            <div className="parameter">
              <label>土地面積（坪）</label>
              <input
                type="number"
                value={parameters.landArea}
                onChange={(e) => handleParameterChange('landArea', e.target.value)}
                step="0.01"
              />
            </div>
            <div className="parameter">
              <label>樓層溢價係數</label>
              <input
                type="number"
                value={parameters.floorPremium}
                onChange={(e) => handleParameterChange('floorPremium', e.target.value)}
                step="0.01"
                min="0.8"
                max="1.3"
              />
            </div>
            <div className="parameter">
              <label>屋齡折舊係數</label>
              <input
                type="number"
                value={parameters.agePremium}
                onChange={(e) => handleParameterChange('agePremium', e.target.value)}
                step="0.01"
                min="0.7"
                max="1.1"
              />
            </div>
            <div className="parameter">
              <label>屋齡（年）</label>
              <input
                type="number"
                value={parameters.buildingAge}
                onChange={(e) => handleParameterChange('buildingAge', e.target.value)}
                step="0.1"
              />
            </div>
            <div className="parameter">
              <label>所在樓層</label>
              <input
                type="number"
                value={parameters.currentFloor}
                onChange={(e) => handleParameterChange('currentFloor', e.target.value)}
                step="0.5"
              />
            </div>
            <div className="parameter">
              <label>總樓層數</label>
              <input
                type="number"
                value={parameters.floors}
                onChange={(e) => handleParameterChange('floors', e.target.value)}
                step="0.5"
              />
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2>計算結果</h2>
          
          <div className="formula-display">
            <h3>計算公式</h3>
            <div className="formula">
              <p><strong>建物總面積（不含車位）</strong> = 主建物 + 陽台 + 雨遮 + 共同使用部分（不含車位）</p>
              <p className="calculation">= {parameters.mainBuildingArea} + {parameters.balconyArea} + {parameters.canopyArea} + {areas.commonAreasWithoutParking?.toFixed(2)}</p>
              <p className="calculation">= {parameters.mainBuildingArea} + {parameters.balconyArea} + {parameters.canopyArea} + ({parameters.commonArea1} + {parameters.commonArea2} - {parameters.parkingArea})</p>
              <p className="result">= {parameters.mainBuildingArea} + {parameters.balconyArea} + {parameters.canopyArea} + {areas.commonAreasWithoutParking?.toFixed(2)} = {areas.buildingTotalArea?.toFixed(2)} 坪</p>
            </div>
            
            <div className="formula">
              <p><strong>總面積（含車位）</strong> = 建物總面積 + 車位面積</p>
              <p className="calculation">= {areas.buildingTotalArea?.toFixed(2)} + {parameters.parkingArea}</p>
              <p className="result">= {areas.totalAreaWithParking?.toFixed(2)} 坪</p>
            </div>
            
            <div className="formula">
              <p><strong>建物價格</strong> = 建物面積（不含車位）× 單價 × 樓層溢價係數 × 屋齡折舊係數</p>
              <p className="calculation">= {areas.buildingTotalArea?.toFixed(2)} × {parameters.unitPrice} × {parameters.floorPremium} × {parameters.agePremium}</p>
              <p className="result">= {prices.baseBuildingPrice?.toFixed(2)} × {parameters.floorPremium} × {parameters.agePremium} = {prices.adjustedBuildingPrice?.toFixed(2)} 萬元</p>
            </div>
            
            <div className="formula">
              <p><strong>房屋總價</strong> = 建物價格 + 車位價格</p>
              <p className="calculation">= {prices.adjustedBuildingPrice?.toFixed(2)} + {parameters.parkingPrice}</p>
              <p className="result">= {(parseFloat(prices.adjustedBuildingPrice) + parseFloat(parameters.parkingPrice)).toFixed(2)} 萬元</p>
            </div>
          </div>

          <div className="summary">
            <h3>總價摘要</h3>
            <div className="summary-item">
              <span>建物總面積（不含車位）</span>
              <span className="value">{areas.buildingTotalArea?.toFixed(2)} 坪</span>
            </div>
            <div className="summary-item">
              <span>總面積（含車位）</span>
              <span className="value">{areas.totalAreaWithParking?.toFixed(2)} 坪</span>
            </div>
            <div className="summary-item">
              <span>建物價格</span>
              <span className="value">{prices.adjustedBuildingPrice?.toFixed(0)} 萬元</span>
            </div>
            <div className="summary-item">
              <span>車位價格</span>
              <span className="value">{parameters.parkingPrice} 萬元</span>
            </div>
            <div className="summary-item total">
              <span>房屋總價</span>
              <span className="value">{prices.totalPrice?.toFixed(0)} 萬元</span>
            </div>
            <div className="summary-item">
              <span>實際單價（不含車位）</span>
              <span className="value">{prices.actualUnitPrice?.toFixed(2)} 萬元/坪</span>
            </div>
          </div>

          <div className="ratio-display">
            <h3>面積比例分析</h3>
            
            <div className="formula-box">
              <h4>公設比計算</h4>
              <p className="formula-text">
                公設比 = 共有部分（不含車位）÷ 建物總面積（不含車位）× 100%
              </p>
              <p className="calculation-text">
                = {areas.commonAreasWithoutParking?.toFixed(2)} ÷ {areas.buildingTotalArea?.toFixed(2)} × 100%
              </p>
              <p className="result-text">
                = <strong>{ratios.publicFacilityRatio?.toFixed(2)}%</strong>
              </p>
            </div>

            <div className="formula-box">
              <h4>得房率計算</h4>
              <p className="formula-text">
                得房率 = (主建物 + 陽台 + 雨遮) ÷ 建物總面積（不含車位）× 100%
              </p>
              <p className="calculation-text">
                = ({parameters.mainBuildingArea} + {parameters.balconyArea} + {parameters.canopyArea}) ÷ {areas.buildingTotalArea?.toFixed(2)} × 100%
              </p>
              <p className="calculation-text">
                = {(parameters.mainBuildingArea + parameters.balconyArea + parameters.canopyArea).toFixed(2)} ÷ {areas.buildingTotalArea?.toFixed(2)} × 100%
              </p>
              <p className="result-text">
                = <strong>{ratios.usableAreaRatio?.toFixed(2)}%</strong>
              </p>
            </div>

            <div className="ratio-item special">
              <span>實際室內空間（主建物）</span>
              <span className="value">{ratios.actualUsageRatio?.toFixed(1)}%</span>
            </div>
            <div className="ratio-item">
              <span>附屬建物比例（陽台+雨遮）</span>
              <span className="value">{ratios.attachmentRatio?.toFixed(1)}%</span>
            </div>
            <div className="ratio-item">
              <span>主建物占總面積（含車位）</span>
              <span className="value">{ratios.mainBuildingRatio?.toFixed(1)}%</span>
            </div>
            <div className="ratio-item">
              <span>共同使用部分（不含車位）</span>
              <span className="value">{areas.commonAreasWithoutParking?.toFixed(2)} 坪</span>
            </div>
          </div>
        </div>
      </div>

      {showImportDialog && (
        <ImportDialog
          onApply={handleImportApply}
          onClose={() => setShowImportDialog(false)}
        />
      )}

      <div className="app-version">v{__APP_VERSION__}</div>

      {showPrintReport && (
        <PrintReport
          transactionData={transactionData}
          parameters={parameters}
          areas={areas}
          prices={prices}
          ratios={ratios}
          onClose={() => setShowPrintReport(false)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  )
}

export default App