import React from 'react'
import useTilt3D from '../../hooks/useTilt3D'

const COLOR_MAP = {
  blue:   {
    gradient: 'from-[#4cd7f6]/15 via-[#06b6d4]/5 to-[#040a18]/70',
    border:   'border-cyan-500/30 hover:border-cyan-400/60',
    glow:     'rgba(76, 215, 246, 0.25)',
    accent:   '#4cd7f6',
  },
  purple: {
    gradient: 'from-[#ddb7ff]/15 via-[#8b5cf6]/5 to-[#040a18]/70',
    border:   'border-purple-500/30 hover:border-purple-400/60',
    glow:     'rgba(221, 183, 255, 0.25)',
    accent:   '#ddb7ff',
  },
  green:  {
    gradient: 'from-[#4edea3]/15 via-[#10b981]/5 to-[#040a18]/70',
    border:   'border-emerald-500/30 hover:border-emerald-400/60',
    glow:     'rgba(78, 222, 163, 0.25)',
    accent:   '#4edea3',
  },
  red:    {
    gradient: 'from-[#f43f5e]/15 via-[#ef4444]/5 to-[#040a18]/70',
    border:   'border-rose-500/30 hover:border-rose-400/60',
    glow:     'rgba(244, 63, 94, 0.25)',
    accent:   '#f43f5e',
  },
  yellow: {
    gradient: 'from-[#f59e0b]/15 via-[#d97706]/5 to-[#040a18]/70',
    border:   'border-amber-500/30 hover:border-amber-400/60',
    glow:     'rgba(245, 158, 11, 0.25)',
    accent:   '#f59e0b',
  },
  cyan:   {
    gradient: 'from-[#06b6d4]/15 via-[#4cd7f6]/5 to-[#040a18]/70',
    border:   'border-cyan-500/30 hover:border-cyan-400/60',
    glow:     'rgba(6, 182, 212, 0.25)',
    accent:   '#06b6d4',
  },
  pink:   {
    gradient: 'from-[#ec4899]/15 via-[#db2777]/5 to-[#040a18]/70',
    border:   'border-pink-500/30 hover:border-pink-400/60',
    glow:     'rgba(236, 72, 153, 0.25)',
    accent:   '#ec4899',
  },
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
  enableTilt = true,
}) {
  const tiltRef = useTilt3D({ maxTilt: 8.5, scale: 1.025, glare: true })
  const conf = COLOR_MAP[color] || COLOR_MAP.blue

  return (
    <div
      ref={enableTilt ? tiltRef : null}
      className={`
        bg-gradient-to-br ${conf.gradient}
        backdrop-blur-xl border ${conf.border} rounded-2xl p-5
        shadow-[0_16px_36px_-8px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.14)]
        hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.85),0_0_25px_var(--card-glow)]
        cursor-pointer transition-all duration-300 relative overflow-hidden group
        glass-specular-edge preserve-3d
      `}
      style={{ '--card-glow': conf.glow }}
    >
      {/* Ambient background glow orb */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-25 group-hover:opacity-50 transition-opacity duration-300"
        style={{ backgroundColor: conf.accent }}
      />

      {/* Top row: emoji icon + trend badge (elevated in 3D) */}
      <div className="flex items-center justify-between mb-3 relative z-10" style={{ transform: 'translateZ(26px)' }}>
        <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/15 flex items-center justify-center text-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform">
          {icon || emoji}
        </div>
        {trend && (
          <span className={`
            text-xs font-mono font-bold px-2.5 py-1 rounded-full border shadow-sm
            ${trendUp
              ? 'bg-emerald-500/20 text-[#4edea3] border-emerald-500/40 shadow-[0_0_12px_rgba(78,222,163,0.3)]'
              : 'bg-rose-500/20 text-[#f43f5e] border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
            }
          `}>
            {trendUp ? '▲' : '▼'} {trend}
          </span>
        )}
      </div>

      {/* Main value (JetBrains Mono style elevated in 3D) */}
      <div className="relative z-10" style={{ transform: 'translateZ(18px)' }}>
        {isLoading ? (
          <div className="h-8 bg-dark-600 rounded animate-pulse mb-2" />
        ) : (
          <div className="text-3xl font-extrabold font-mono text-white mb-1 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {value}
          </div>
        )}

        {/* Label */}
        <div className="text-xs font-semibold uppercase tracking-wider text-[#8ea0b5]">
          {label}
        </div>
      </div>
    </div>
  )
}

export default StatCard
