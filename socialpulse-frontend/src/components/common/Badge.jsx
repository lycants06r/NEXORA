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
  green:  'bg-[#4edea3]/15 text-[#4edea3] border-[#4edea3]/35 shadow-[0_0_10px_rgba(78,222,163,0.2)]',
  red:    'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/35 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
  blue:   'bg-[#4cd7f6]/15 text-[#4cd7f6] border-[#4cd7f6]/35 shadow-[0_0_10px_rgba(76,215,246,0.2)]',
  cyan:   'bg-[#06b6d4]/15 text-[#06b6d4] border-[#06b6d4]/35 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
  yellow: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/35 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
  purple: 'bg-[#ddb7ff]/15 text-[#ddb7ff] border-[#ddb7ff]/35 shadow-[0_0_10px_rgba(221,183,255,0.2)]',
  gray:   'bg-white/5      text-[#8ea0b5] border-white/10',
  pink:   'bg-[#ec4899]/15 text-[#ec4899] border-[#ec4899]/35 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
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
      inline-flex items-center gap-1.5
      px-2.5 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider
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
