import React, { useState, useEffect, useCallback } from 'react'
import { parsePrintPageText } from '../utils/printPageParser'

const metaLabels = {
  address: '地段位置或門牌',
  communityName: '社區名稱',
  transactionTarget: '交易標的',
  transactionDate: '交易日期',
  buildingType: '建物型態',
  layout: '建物現況格局',
  mainUsage: '主要用途',
  buildingMaterial: '主要建材',
  completionDate: '建築完成年月',
  management: '管理組織',
  hasElevator: '有無電梯',
  parkingType: '車位類別',
  parkingFloor: '車位所在樓層',
  note: '備註',
}

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

const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error('圖片大小不能超過 2MB'))
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('讀取圖片失敗'))
    reader.readAsDataURL(file)
  })
}

export default function ImportDialog({ onApply, onClose }) {
  const [rawText, setRawText] = useState('')
  const [parsedData, setParsedData] = useState(null)
  const [parsedMeta, setParsedMeta] = useState(null)
  const [mapImageDataUrl, setMapImageDataUrl] = useState(null)
  const [imageError, setImageError] = useState('')
  const [error, setError] = useState('')

  const handleImageFromFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    try {
      setImageError('')
      const dataUrl = await readImageFile(file)
      setMapImageDataUrl(dataUrl)
    } catch (err) {
      setImageError(err.message)
      setMapImageDataUrl(null)
    }
  }, [])

  // 全域 paste 事件：支援 Ctrl+V 貼上圖片
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          handleImageFromFile(item.getAsFile())
          return
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handleImageFromFile])

  const handleParse = () => {
    const result = parsePrintPageText(rawText)
    if (result.error) {
      setError(result.error)
      setParsedData(null)
      setParsedMeta(null)
    } else {
      setError('')
      setParsedData(result.data)
      setParsedMeta(result.meta)
    }
  }

  const handleFieldChange = (key, value) => {
    setParsedData(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }))
  }

  const handleMetaChange = (key, value) => {
    setParsedMeta(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleImageUpload = (e) => {
    handleImageFromFile(e.target.files[0])
  }

  const handleRemoveImage = () => {
    setMapImageDataUrl(null)
    setImageError('')
  }

  const handleApply = () => {
    if (parsedData) {
      onApply({ data: parsedData, meta: parsedMeta, mapImageDataUrl })
    }
  }

  const handleReset = () => {
    setParsedData(null)
    setParsedMeta(null)
    setMapImageDataUrl(null)
    setImageError('')
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

        {!parsedData ? (
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

            <h4 className="import-section-title">交易資訊</h4>
            <div className="import-fields import-meta-fields">
              {Object.entries(metaLabels).map(([key, label]) => (
                <div className={`import-field ${key === 'note' ? 'import-field-wide' : ''}`} key={key}>
                  <label>{label}</label>
                  <input
                    type="text"
                    value={parsedMeta[key]}
                    onChange={(e) => handleMetaChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <h4 className="import-section-title">計算參數</h4>
            <div className="import-fields">
              {Object.entries(fieldLabels).map(([key, label]) => (
                <div className="import-field" key={key}>
                  <label>{label}</label>
                  <input
                    type="number"
                    value={parsedData[key]}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    step="0.01"
                  />
                </div>
              ))}
            </div>

            <h4 className="import-section-title">地圖截圖（選填）</h4>
            <div className="import-image-upload">
              <p className="import-image-hint">
                在實價登錄頁面的地圖上按右鍵 → 複製圖片，然後回到這裡按 Ctrl+V 貼上
              </p>
              {!mapImageDataUrl && (
                <div className="import-paste-zone">
                  <span>Ctrl+V 貼上圖片，或選擇檔案上傳</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
              {imageError && <p className="import-error">{imageError}</p>}
              {mapImageDataUrl && (
                <div className="import-image-preview">
                  <img src={mapImageDataUrl} alt="地圖截圖" />
                  <button className="import-image-remove" onClick={handleRemoveImage}>移除圖片</button>
                </div>
              )}
            </div>

            <div className="import-actions">
              <button className="import-btn-secondary" onClick={handleReset}>
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
