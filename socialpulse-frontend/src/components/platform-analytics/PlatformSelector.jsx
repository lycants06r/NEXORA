/*
  PlatformSelector.jsx
  --------------------
  Global platform filter bar for Platform Analytics.
  Renders platform buttons with vector logos.
  Accepts selectedPlatform and onSelect props.
*/

import React from 'react'
import { PLATFORMS_CONFIG } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo.jsx'

function PlatformSelector({ selectedPlatform = 'all', onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {PLATFORMS_CONFIG.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.id)}
          className={`h-9 px-3.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer inline-flex items-center gap-2 ${
            selectedPlatform === p.id
              ? 'glass-tab-active'
              : 'glass-control text-[#8ea0b5] hover:text-white hover:border-white/20'
          }`}
        >
          <PlatformLogo
            platform={p.id}
            className="w-3.5 h-3.5"
            colored={selectedPlatform === p.id}
          />
          <span>{p.label}</span>
          {p.isPriority && (
            <span className="ml-0.5 text-[9px] px-1 py-0.5 rounded bg-cyan-500/20 text-[#4cd7f6] font-mono">
              ★
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default PlatformSelector
