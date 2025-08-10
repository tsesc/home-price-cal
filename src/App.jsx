import React, { useState, useEffect } from 'react'
import './App.css'
import { calculateAreas, calculatePrices, calculateRatios } from './utils/priceCalculator'

function App() {
  const [parameters, setParameters] = useState({
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
  })

  const [areas, setAreas] = useState({})
  const [prices, setPrices] = useState({})
  const [ratios, setRatios] = useState({})

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

  return (
    <div className="container">
      <h1>房價計算器</h1>
      
      <div className="calculator-wrapper">
        <div className="parameters-section">
          <h2>參數調整</h2>
          
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
                min="0.9"
                max="1.2"
              />
            </div>
            <div className="parameter">
              <label>屋齡折舊係數</label>
              <input
                type="number"
                value={parameters.agePremium}
                onChange={(e) => handleParameterChange('agePremium', e.target.value)}
                step="0.01"
                min="0.8"
                max="1"
              />
            </div>
            <div className="parameter">
              <label>屋齡（年）</label>
              <input
                type="number"
                value={parameters.buildingAge}
                onChange={(e) => handleParameterChange('buildingAge', e.target.value)}
                step="1"
              />
            </div>
            <div className="parameter">
              <label>所在樓層</label>
              <input
                type="number"
                value={parameters.currentFloor}
                onChange={(e) => handleParameterChange('currentFloor', e.target.value)}
                step="1"
              />
            </div>
            <div className="parameter">
              <label>總樓層數</label>
              <input
                type="number"
                value={parameters.floors}
                onChange={(e) => handleParameterChange('floors', e.target.value)}
                step="1"
              />
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2>計算結果</h2>
          
          <div className="formula-display">
            <h3>計算公式</h3>
            <div className="formula">
              <p><strong>建物總面積（不含車位）</strong> = 主建物 + 陽台 + 雨遮 + 共同使用部分1 + 共同使用部分2</p>
              <p className="calculation">= {parameters.mainBuildingArea} + {parameters.balconyArea} + {parameters.canopyArea} + {parameters.commonArea1} + {parameters.commonArea2}</p>
              <p className="result">= {areas.buildingTotalArea?.toFixed(2)} 坪</p>
            </div>
            
            <div className="formula">
              <p><strong>總面積（含車位）</strong> = 建物總面積 + 車位面積</p>
              <p className="calculation">= {areas.buildingTotalArea?.toFixed(2)} + {parameters.parkingArea}</p>
              <p className="result">= {areas.totalAreaWithParking?.toFixed(2)} 坪</p>
            </div>
            
            <div className="formula">
              <p><strong>建物價格</strong> = (建物總面積 - 車位面積) × 單價 × 樓層溢價係數 × 屋齡折舊係數</p>
              <p className="calculation">= ({areas.buildingTotalArea?.toFixed(2)} - {parameters.parkingArea}) × {parameters.unitPrice} × {parameters.floorPremium} × {parameters.agePremium}</p>
              <p className="result">= {prices.buildingAreaWithoutParking?.toFixed(2)} × {parameters.unitPrice} × {parameters.floorPremium} × {parameters.agePremium}</p>
              <p className="result">= {prices.adjustedBuildingPrice?.toFixed(0)} 萬元</p>
            </div>
            
            <div className="formula">
              <p><strong>房屋總價</strong> = 建物價格 + 車位價格</p>
              <p className="calculation">= {prices.adjustedBuildingPrice?.toFixed(0)} + {parameters.parkingPrice}</p>
              <p className="result">= {prices.totalPrice?.toFixed(0)} 萬元</p>
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
            <div className="ratio-item">
              <span>主建物占比（含車位）</span>
              <span className="value">{ratios.mainBuildingRatio?.toFixed(1)}%</span>
            </div>
            <div className="ratio-item">
              <span>主建物占比（不含車位）</span>
              <span className="value">{ratios.mainBuildingRatioWithoutParking?.toFixed(1)}%</span>
            </div>
            <div className="ratio-item">
              <span>公設比</span>
              <span className="value">{ratios.publicFacilityRatio?.toFixed(1)}%</span>
            </div>
            <div className="ratio-item">
              <span>附屬建物比例</span>
              <span className="value">{ratios.attachmentRatio?.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App