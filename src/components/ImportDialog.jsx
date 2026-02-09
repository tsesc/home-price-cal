import React, { useState } from 'react'
import { parsePrintPageText } from '../utils/printPageParser'

const fieldLabels = {
  mainBuildingArea: '主建物面積（坪）',
  balconyArea: '陽台面積（坪）',
  canopyArea: '雨遮面積（坪）',
  commonArea1: '共同使用部分1（車位相關）',
  commonArea2: '共同使用部分2（一般公設）',
  parkingArea: '車位面積（坪）',
  parkingPrice: '車位價格（萬元）',
  unitPrice: '單價（萬元/坪）',
  landArea: '土地面積（坪）',
  currentFloor: '所在樓層',
  floors: '總樓層數',
}

export default function ImportDialog({ onApply, onClose }) {
  const [rawText, setRawText] = useState('')
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')

  const handleParse = () => {
    const result = parsePrintPageText(rawText)
    if (result.error) {
      setError(result.error)
      setParsed(null)
    } else {
      setError('')
      setParsed(result.data)
    }
  }

  const handleFieldChange = (key, value) => {
    setParsed(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }))
  }

  const handleApply = () => {
    if (parsed) {
      onApply(parsed)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="import-overlay" onClick={handleOverlayClick}>
      <div className="import-dialog">
        <div className="import-header">
          <h3>從實價登錄匯入</h3>
          <button className="import-close-btn" onClick={onClose}>&times;</button>
        </div>

        {!parsed ? (
          <div className="import-input-section">
            <p className="import-hint">
              請將實價登錄列印頁面的內容全選複製後貼上
            </p>
            <textarea
              className="import-textarea"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="在此貼上實價登錄列印頁面的文字內容..."
              rows={10}
            />
            {error && <p className="import-error">{error}</p>}
            <div className="import-actions">
              <button className="import-btn-secondary" onClick={onClose}>取消</button>
              <button
                className="import-btn-primary"
                onClick={handleParse}
                disabled={!rawText.trim()}
              >
                解析
              </button>
            </div>
          </div>
        ) : (
          <div className="import-preview-section">
            <p className="import-hint">解析結果預覽，可修改後填入表單</p>
            <div className="import-fields">
              {Object.entries(fieldLabels).map(([key, label]) => (
                <div className="import-field" key={key}>
                  <label>{label}</label>
                  <input
                    type="number"
                    value={parsed[key]}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    step="0.01"
                  />
                </div>
              ))}
            </div>
            <div className="import-actions">
              <button className="import-btn-secondary" onClick={() => setParsed(null)}>
                重新貼上
              </button>
              <button className="import-btn-primary" onClick={handleApply}>
                填入表單
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
