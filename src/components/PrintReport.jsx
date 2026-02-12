import React from 'react'
import { createPortal } from 'react-dom'

const formatPrice = (val) => {
  if (!val && val !== 0) return '-'
  return Number(val).toLocaleString()
}

export default function PrintReport({
  transactionData,
  parameters,
  areas,
  prices,
  ratios,
  onClose,
  onPrint,
}) {
  const meta = transactionData || {}
  const mapImage = meta.mapImageDataUrl || null
  const now = new Date()
  const timestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return createPortal(
    <>
      <div className="print-backdrop" onClick={onClose}></div>
      <div className="print-modal">
        <div className="print-toolbar">
          <button className="import-btn-secondary" onClick={onClose}>關閉</button>
          <button className="import-btn-primary" onClick={onPrint}>列印報告</button>
        </div>
        <div className="print-content">{/* 這層包住所有要列印的內容 */}

          {/* 1. 標題區 */}
          <div className="print-title-section">
          <h1 className="print-main-title">實價登錄分析報告</h1>
          {meta.address && <p className="print-address">{meta.address}</p>}
          <div className="print-title-meta">
            {meta.communityName && <span className="print-tag">{meta.communityName}</span>}
            {meta.transactionDate && <span className="print-tag">交易日期：{meta.transactionDate}</span>}
          </div>
          </div>

          {/* 2. 交易摘要 */}
          <div className="print-section">
            <h2 className="print-section-title">交易摘要</h2>
            <table className="print-table">
              <tbody>
                <tr>
                  <td className="print-table-label">交易標的</td>
                  <td>{meta.transactionTarget || '-'}</td>
                  <td className="print-table-label">交易總價</td>
                  <td>{meta.totalPriceRaw ? `${formatPrice(meta.totalPriceRaw)} 元` : '-'}</td>
                </tr>
                <tr>
                  <td className="print-table-label">交易單價</td>
                  <td>{meta.unitPricePerPing ? `${formatPrice(meta.unitPricePerPing)} 元/坪` : '-'}</td>
                  <td className="print-table-label">交易總面積</td>
                  <td>{meta.totalArea ? `${meta.totalArea} 坪` : '-'}</td>
                </tr>
                <tr>
                  <td className="print-table-label">主建物佔比</td>
                  <td>{meta.mainBuildingRatio || '-'}</td>
                  <td className="print-table-label">樓別/樓高</td>
                  <td>{parameters.currentFloor}/{parameters.floors} 樓</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3. 建物資訊 */}
          <div className="print-section">
            <h2 className="print-section-title">建物資訊</h2>
            <table className="print-table">
              <tbody>
                <tr>
                  <td className="print-table-label">建物型態</td>
                  <td>{meta.buildingType || '-'}</td>
                  <td className="print-table-label">現況格局</td>
                  <td>{meta.layout || '-'}</td>
                </tr>
                <tr>
                  <td className="print-table-label">主要用途</td>
                  <td>{meta.mainUsage || '-'}</td>
                  <td className="print-table-label">主要建材</td>
                  <td>{meta.buildingMaterial || '-'}</td>
                </tr>
                <tr>
                  <td className="print-table-label">建築完成年月</td>
                  <td>{meta.completionDate || '-'}</td>
                  <td className="print-table-label">管理組織</td>
                  <td>{meta.management || '-'}</td>
                </tr>
                <tr>
                  <td className="print-table-label">有無電梯</td>
                  <td>{meta.hasElevator || '-'}</td>
                  <td className="print-table-label">車位類別</td>
                  <td>{meta.parkingType || '-'}{meta.parkingFloor ? `（${meta.parkingFloor}）` : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. 面積明細表 */}
          <div className="print-section">
            <h2 className="print-section-title">面積明細</h2>
            <table className="print-table print-table-bordered">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>面積（坪）</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>主建物</td>
                  <td>{parameters.mainBuildingArea}</td>
                </tr>
                <tr>
                  <td>陽台</td>
                  <td>{parameters.balconyArea}</td>
                </tr>
                <tr>
                  <td>雨遮</td>
                  <td>{parameters.canopyArea}</td>
                </tr>
                <tr>
                  <td>共同使用部分（車位相關）</td>
                  <td>{parameters.commonArea1}</td>
                </tr>
                <tr>
                  <td>共同使用部分（一般公設）</td>
                  <td>{parameters.commonArea2}</td>
                </tr>
                <tr>
                  <td>車位</td>
                  <td>{parameters.parkingArea}</td>
                </tr>
                <tr>
                  <td>土地面積</td>
                  <td>{parameters.landArea}</td>
                </tr>
                <tr className="print-table-total">
                  <td>建物總面積（不含車位）</td>
                  <td>{areas.buildingTotalArea?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. 價格計算結果 */}
          <div className="print-section">
            <h2 className="print-section-title">價格計算</h2>
            <table className="print-table print-table-bordered">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>數值</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>單價</td>
                  <td>{parameters.unitPrice} 萬元/坪</td>
                </tr>
                <tr>
                  <td>樓層溢價係數</td>
                  <td>{parameters.floorPremium}</td>
                </tr>
                <tr>
                  <td>屋齡折舊係數</td>
                  <td>{parameters.agePremium}</td>
                </tr>
                <tr>
                  <td>建物價格</td>
                  <td>{prices.adjustedBuildingPrice?.toFixed(2)} 萬元</td>
                </tr>
                <tr>
                  <td>車位價格</td>
                  <td>{parameters.parkingPrice} 萬元</td>
                </tr>
                <tr className="print-table-total">
                  <td>房屋總價</td>
                  <td>{prices.totalPrice?.toFixed(0)} 萬元</td>
                </tr>
                <tr>
                  <td>實際單價（不含車位）</td>
                  <td>{prices.actualUnitPrice?.toFixed(2)} 萬元/坪</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6. 面積比例分析 */}
          <div className="print-section">
            <h2 className="print-section-title">面積比例分析</h2>
            <table className="print-table print-table-bordered">
              <thead>
                <tr>
                  <th>項目</th>
                  <th>比例</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>公設比</td>
                  <td>{ratios.publicFacilityRatio?.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td>得房率</td>
                  <td>{ratios.usableAreaRatio?.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td>實際室內空間（主建物）</td>
                  <td>{ratios.actualUsageRatio?.toFixed(1)}%</td>
                </tr>
                <tr>
                  <td>附屬建物比例（陽台+雨遮）</td>
                  <td>{ratios.attachmentRatio?.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 7. 地圖圖片 */}
          {mapImage && (
            <div className="print-section">
              <h2 className="print-section-title">物件位置</h2>
              <div className="print-map-image">
                <img src={mapImage} alt="物件位置地圖" />
              </div>
            </div>
          )}

          {/* 8. 備註 */}
          {meta.note && (
            <div className="print-section">
              <h2 className="print-section-title">備註</h2>
              <p className="print-note">{meta.note}</p>
            </div>
          )}

          {/* 頁尾 */}
          <div className="print-footer">
            <p>{timestamp} 由房價計算器產生</p>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
