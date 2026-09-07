/*
  DateRangeFilter.jsx
  -------------------
  Reusable date-range filter with preset options.
  Presets: Today, Last 7 Days, Last 30 Days, All Time, Custom.
*/

import React, { useState } from 'react'

const PRESETS = [
  { id: 'today',  label: 'Today' },
  { id: '7d',     label: 'Last 7 Days' },
  { id: '30d',    label: 'Last 30 Days' },
  { id: 'all',    label: 'All Time' },
  { id: 'custom', label: 'Custom' },
]

function DateRangeFilter({ onRangeChange, selectedPreset = 'all' }) {
  const [preset, setPreset] = useState(selectedPreset)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handlePresetChange = (id) => {
    setPreset(id)
    const now = new Date()
    let start = null

    switch (id) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'all':
        start = null
        break
      case 'custom':
        return // Don't fire callback for custom until dates are set
    }

    if (onRangeChange) {
      onRangeChange({ preset: id, startDate: start, endDate: now })
    }
  }

  const handleCustomApply = () => {
    if (startDate && endDate && onRangeChange) {
      onRangeChange({
        preset: 'custom',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => handlePresetChange(p.id)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            preset === p.id
              ? 'glass-tab-active'
              : 'glass-control text-[#8ea0b5] hover:text-white hover:border-white/20'
          }`}
        >
          {p.label}
        </button>
      ))}

      {preset === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="glass-control rounded-lg px-2.5 py-1.5 text-white font-mono text-[10px]"
          />
          <span className="text-[#8ea0b5] text-[10px] font-mono">→</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="glass-control rounded-lg px-2.5 py-1.5 text-white font-mono text-[10px]"
          />
          <button
            type="button"
            onClick={handleCustomApply}
            className="px-2.5 py-1.5 glass-btn-primary rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter
