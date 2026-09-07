import React from 'react'

/*
  Badge.jsx
  ---------
  Cyberpunk telemetry label badge with neon glow accents.
  Usage:
    <Badge label="positive" color="green" />
    <Badge label="trending" color="yellow" dot />
*/

const BADGE_COLORS = {
  green:  'bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_10px_rgba(78,222,163,0.18)]',
  red:    'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_10px_rgba(244,63,94,0.18)]',
  blue:   'bg-[#4cd7f6]/10 text-[#4cd7f6] border-[#4cd7f6]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_10px_rgba(76,215,246,0.18)]',
  cyan:   'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_10px_rgba(6,182,212,0.18)]',
  yellow: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_10px_rgba(245,158,11,0.18)]',
  purple: 'bg-[#ddb7ff]/10 text-[#ddb7ff] border-[#ddb7ff]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_10px_rgba(221,183,255,0.18)]',
  gray:   'bg-white/[0.04] text-[#8ea0b5] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]',
  pink:   'bg-[#ec4899]/10 text-[#ec4899] border-[#ec4899]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_0_10px_rgba(236,72,153,0.18)]',
}

const DOT_COLORS = {
  green:  'bg-[#4edea3] shadow-[0_0_6px_#4edea3]',
  red:    'bg-[#f43f5e] shadow-[0_0_6px_#f43f5e]',
  blue:   'bg-[#4cd7f6] shadow-[0_0_6px_#4cd7f6]',
  cyan:   'bg-[#06b6d4] shadow-[0_0_6px_#06b6d4]',
  yellow: 'bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]',
  purple: 'bg-[#ddb7ff] shadow-[0_0_6px_#ddb7ff]',
  pink:   'bg-[#ec4899] shadow-[0_0_6px_#ec4899]',
  gray:   'bg-[#8ea0b5]',
}

function Badge({ label, color = 'blue', dot = false }) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 backdrop-blur-md
      px-2.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider
      border ${BADGE_COLORS[color] || BADGE_COLORS.blue}
    `}>
      {dot && (
        <span className={`
          w-1.5 h-1.5 rounded-full ${DOT_COLORS[color] || DOT_COLORS.blue}
          animate-pulse
        `} />
      )}
      {label}
    </span>
  )
}

export default Badge
