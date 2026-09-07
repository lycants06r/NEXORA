/*
  StatCard.jsx
  ------------
  A simple KPI (Key Performance Indicator) card.
  Shows a number, label, and optional trend arrow with NEXORA glassmorphic styling.
*/

import React from 'react'

const COLOR_MAP = {
  blue:   'from-[#4cd7f6]/10 via-[#06b6d4]/5 to-black/50 border-cyan-500/25 shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
  purple: 'from-[#ddb7ff]/10 via-[#8b5cf6]/5 to-black/50 border-purple-500/25 shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
  green:  'from-[#4edea3]/10 via-[#10b981]/5 to-black/50 border-emerald-500/25 shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
  red:    'from-[#f43f5e]/10 via-[#ef4444]/5 to-black/50 border-rose-500/25 shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
  yellow: 'from-[#f59e0b]/10 via-[#d97706]/5 to-black/50 border-amber-500/25 shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
  cyan:   'from-[#06b6d4]/10 via-[#4cd7f6]/5 to-black/50 border-cyan-500/25 shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
  pink:   'from-[#ec4899]/10 via-[#db2777]/5 to-black/50 border-pink-500/25 shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
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
      hover:scale-[1.01] hover:border-cyan-400/40 transition-all duration-200
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
