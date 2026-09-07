/*
  DataStatusBadge.jsx
  -------------------
  Reusable status indicator for connection/health/ingestion states.
  Supports: HEALTHY, WARNING, OFFLINE, ERROR, NOT_CONNECTED, CONNECTED,
            CONNECTING, DISCONNECTED, LIVE
*/

import React from 'react'

const STATUS_CONFIG = {
  HEALTHY:       { color: '#4edea3', bgClass: 'bg-emerald-500/15 border-emerald-500/30 text-[#4edea3]',  dotClass: 'bg-[#4edea3]', label: 'Healthy' },
  CONNECTED:     { color: '#4edea3', bgClass: 'bg-emerald-500/15 border-emerald-500/30 text-[#4edea3]',  dotClass: 'bg-[#4edea3]', label: 'Connected' },
  LIVE:          { color: '#4edea3', bgClass: 'bg-emerald-500/15 border-emerald-500/30 text-[#4edea3]',  dotClass: 'bg-[#4edea3]', label: 'Live' },
  WARNING:       { color: '#f59e0b', bgClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',      dotClass: 'bg-amber-400', label: 'Warning' },
  CONNECTING:    { color: '#4cd7f6', bgClass: 'bg-cyan-500/15 border-cyan-500/30 text-[#4cd7f6]',        dotClass: 'bg-[#4cd7f6]', label: 'Connecting' },
  OFFLINE:       { color: '#8ea0b5', bgClass: 'bg-slate-500/15 border-slate-500/30 text-[#8ea0b5]',      dotClass: 'bg-[#8ea0b5]', label: 'Offline' },
  DISCONNECTED:  { color: '#8ea0b5', bgClass: 'bg-slate-500/15 border-slate-500/30 text-[#8ea0b5]',      dotClass: 'bg-[#8ea0b5]', label: 'Disconnected' },
  ERROR:         { color: '#f43f5e', bgClass: 'bg-rose-500/15 border-rose-500/30 text-[#f43f5e]',        dotClass: 'bg-[#f43f5e]', label: 'Error' },
  NOT_CONNECTED: { color: '#64748b', bgClass: 'bg-slate-600/15 border-slate-600/30 text-slate-400',      dotClass: 'bg-slate-500', label: 'Not Connected' },
}

function DataStatusBadge({ status = 'OFFLINE', label, showDot = true, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.OFFLINE
  const displayLabel = label || config.label

  const sizeClasses = size === 'lg'
    ? 'px-3 py-1 text-xs'
    : 'px-2 py-0.5 text-[10px]'

  const isPulsing = ['HEALTHY', 'CONNECTED', 'LIVE', 'CONNECTING'].includes(status)

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-bold uppercase tracking-wider ${config.bgClass} ${sizeClasses}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} ${isPulsing ? 'animate-pulse' : ''}`} />
      )}
      {displayLabel}
    </span>
  )
}

export { STATUS_CONFIG }
export default DataStatusBadge
