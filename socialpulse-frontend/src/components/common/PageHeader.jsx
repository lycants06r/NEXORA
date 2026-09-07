import React from 'react'

function PageHeader({ emoji, title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cyan-500/15 mb-6">
      <div className="flex items-center gap-3.5">
        <div className="
          w-12 h-12 rounded-2xl liquid-glass-soft border border-cyan-500/30
          flex items-center justify-center text-2xl
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_16px_rgba(76,215,246,0.15)] flex-shrink-0
        ">
          {emoji}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#8ea0b5] font-mono tracking-wide mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {/* Optional right-side content (buttons, filters) */}
      {children && <div className="flex items-center gap-2.5 flex-wrap">{children}</div>}
    </div>
  )
}

export default PageHeader
