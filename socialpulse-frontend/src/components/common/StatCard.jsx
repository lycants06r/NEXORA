/*
  StatCard.jsx
  ------------
  A simple KPI (Key Performance Indicator) card.
  Shows a number, label, and optional trend arrow with NEXORA glassmorphic styling.
*/

import React from 'react'

const COLOR_MAP = {
  blue:   'border-cyan-500/25 group-hover:border-cyan-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_15px_rgba(76,215,246,0.15)]',
  purple: 'border-purple-500/25 group-hover:border-purple-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_15px_rgba(221,183,255,0.15)]',
  green:  'border-emerald-500/25 group-hover:border-emerald-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_15px_rgba(78,222,163,0.15)]',
  red:    'border-rose-500/25 group-hover:border-rose-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_15px_rgba(244,63,94,0.15)]',
  yellow: 'border-amber-500/25 group-hover:border-amber-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_15px_rgba(245,158,11,0.15)]',
  cyan:   'border-cyan-500/25 group-hover:border-cyan-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_15px_rgba(6,182,212,0.15)]',
  pink:   'border-pink-500/25 group-hover:border-pink-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.55),0_0_15px_rgba(236,72,153,0.15)]',
}

const TINT_MAP = {
  blue:   'bg-cyan-500/[0.04]',
  purple: 'bg-purple-500/[0.04]',
  green:  'bg-emerald-500/[0.04]',
  red:    'bg-rose-500/[0.04]',
  yellow: 'bg-amber-500/[0.04]',
  cyan:   'bg-cyan-500/[0.04]',
  pink:   'bg-pink-500/[0.04]',
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
  const borderAndShadow = COLOR_MAP[color] || COLOR_MAP.blue
  const tint = TINT_MAP[color] || TINT_MAP.blue

  return (
    <div className={`
      liquid-glass ${tint} ${borderAndShadow}
      p-5 rounded-2xl hover:scale-[1.01] transition-all duration-200
      cursor-default animate-slide-up relative overflow-hidden group glass-edge-top
    `}>
      {/* Ambient background glass orb */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/[0.03] rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

      {/* Top row: emoji icon + trend badge */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          {icon || emoji}
        </div>
        {trend && (
          <span className={`
            text-xs font-mono font-bold px-2.5 py-1 rounded-full border
            ${trendUp
              ? 'bg-emerald-500/15 text-[#4edea3] border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_8px_rgba(78,222,163,0.2)]'
              : 'bg-rose-500/15 text-[#f43f5e] border-rose-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_8px_rgba(244,63,94,0.2)]'
            }
          `}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
      </div>

      {/* Main value (JetBrains Mono style) */}
      {isLoading ? (
        <div className="h-8 bg-white/5 rounded animate-pulse mb-2" />
      ) : (
        <div className="text-3xl font-extrabold font-mono text-white mb-1 tracking-tight relative z-10">
          {value}
        </div>
      )}

      {/* Label */}
      <div className="text-xs font-semibold uppercase tracking-wider text-[#8ea0b5] relative z-10">
        {label}
      </div>
    </div>
  )
}

export default StatCard
