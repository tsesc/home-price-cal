import React from 'react'
import './RecordTabs.css'

export default function RecordTabs({ records, activeRecordId, onSelect, onDelete, onNew }) {
  if (records.length === 0) return null

  return (
    <div className="record-tabs">
      <div className="record-tabs-list">
        {records.map((record) => (
          <button
            key={record.id}
            className={`record-tab ${record.id === activeRecordId ? 'active' : ''}`}
            onClick={() => onSelect(record.id)}
            title={record.name || '未命名'}
          >
            <span className="record-tab-name">{record.name || '未命名'}</span>
            <span
              className="record-tab-close"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(record.id)
              }}
            >
              &times;
            </span>
          </button>
        ))}
      </div>
      <button className="record-tab-new" onClick={onNew} title="新增紀錄">
        +
      </button>
    </div>
  )
}
