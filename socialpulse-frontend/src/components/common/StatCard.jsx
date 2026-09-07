/*
  StatCard.jsx
  ------------
  A simple KPI (Key Performance Indicator) card.
  Shows a number, label, and optional trend arrow with NEXORA glassmorphic styling.
*/

import React from 'react'

const COLOR_MAP = {
  blue:   'from-[#4cd7f6]/15 via-[#06b6d4]/5 to-black/40 border-[#4cd7f6]/35 shadow-[0_8px_25px_rgba(76,215,246,0.12)]',
  purple: 'from-[#ddb7ff]/15 via-[#8b5cf6]/5 to-black/40 border-[#ddb7ff]/35 shadow-[0_8px_25px_rgba(221,183,255,0.12)]',
  green:  'from-[#4edea3]/15 via-[#10b981]/5 to-black/40 border-[#4edea3]/35 shadow-[0_8px_25px_rgba(78,222,163,0.12)]',
  red:    'from-[#f43f5e]/15 via-[#ef4444]/5 to-black/40 border-[#f43f5e]/35 shadow-[0_8px_25px_rgba(244,63,94,0.12)]',
  yellow: 'from-[#f59e0b]/15 via-[#d97706]/5 to-black/40 border-[#f59e0b]/35 shadow-[0_8px_25px_rgba(245,158,11,0.12)]',
  cyan:   'from-[#06b6d4]/15 via-[#4cd7f6]/5 to-black/40 border-[#06b6d4]/35 shadow-[0_8px_25px_rgba(6,182,212,0.12)]',
  pink:   'from-[#ec4899]/15 via-[#db2777]/5 to-black/40 border-[#ec4899]/35 shadow-[0_8px_25px_rgba(236,72,153,0.12)]',
}

function StatCard({
  label,
  value,
  emoji      = '📊',
  icon       = null,
  trend      = null,
  trendUp    = true,
  color      = 'blue',
  isLoading  = false,
}) {
  const gradientClass = COLOR_MAP[color] || COLOR_MAP.blue

  return (
    <div className={`
      bg-gradient-to-br ${gradientClass}
      backdrop-blur-xl border rounded-2xl p-5
      hover:scale-[1.02] hover:border-cyan-400/50 transition-all duration-300
      cursor-default animate-slide-up relative overflow-hidden group
    `}>
      {/* Ambient background glow line */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

      {/* Top row: emoji icon + trend badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl shadow-inner">
          {icon || emoji}
        </div>
        {trend && (
          <span className={`
            text-xs font-mono font-bold px-2.5 py-1 rounded-full border
            ${trendUp
              ? 'bg-emerald-500/15 text-[#4edea3] border-emerald-500/30 shadow-[0_0_8px_rgba(78,222,163,0.2)]'
              : 'bg-rose-500/15 text-[#f43f5e] border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
            }
          `}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
      </div>

      {/* Main value (JetBrains Mono style) */}
      {isLoading ? (
        <div className="h-8 bg-dark-600 rounded animate-pulse mb-2" />
      ) : (
        <div className="text-3xl font-extrabold font-mono text-white mb-1 tracking-tight">
          {value}
        </div>
      )}

      {/* Label */}
      <div className="text-xs font-semibold uppercase tracking-wider text-[#8ea0b5]">
        {label}
      </div>
    </div>
  )
}

export default StatCard
