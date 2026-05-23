import React, { useState, useRef, useEffect } from 'react'
import './SaveRecordDialog.css'

export default function SaveRecordDialog({ defaultName, onSave, onClose }) {
  const [name, setName] = useState(defaultName)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.select()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(name.trim())
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="save-dialog-overlay" onClick={handleOverlayClick}>
      <form className="save-dialog" onSubmit={handleSubmit}>
        <h3 className="save-dialog-title">儲存紀錄</h3>
        <label className="save-dialog-label">紀錄名稱</label>
        <input
          ref={inputRef}
          type="text"
          className="save-dialog-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：冠東城B1、湖前街7F"
          autoFocus
        />
        <div className="save-dialog-actions">
          <button type="button" className="save-dialog-btn-cancel" onClick={onClose}>取消</button>
          <button type="submit" className="save-dialog-btn-save">儲存</button>
        </div>
      </form>
    </div>
  )
}
