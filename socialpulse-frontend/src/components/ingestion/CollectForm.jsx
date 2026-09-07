/*
  CollectForm.jsx
  ---------------
  Form to trigger data collection with NEXORA command center glassmorphic styling.
*/

import React, { useState } from 'react'
import PlatformLogo from '../common/PlatformLogo.jsx'

const PLATFORMS = [
  { value: 'twitter',  label: 'X / Twitter',  placeholder: 'e.g., artificial intelligence' },
  { value: 'reddit',   label: 'Reddit',       placeholder: 'e.g., technology (subreddit name)' },
  { value: 'youtube',  label: 'YouTube',      placeholder: 'e.g., AI news 2024' },
  { value: 'telegram', label: 'Telegram',     placeholder: 'e.g., bbcnews (channel username)' },
]

function CollectForm({ onSubmit, isLoading = false }) {
  const [platform,   setPlatform]   = useState('reddit')
  const [query,      setQuery]      = useState('')
  const [maxResults, setMaxResults] = useState(50)

  const selectedPlatform = PLATFORMS.find((p) => p.value === platform)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    onSubmit({ platform, query: query.trim(), maxResults })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="liquid-glass glass-edge-top p-6 rounded-2xl"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-base tracking-wider uppercase flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6] animate-pulse" />
          <span>🎯 Ingestion Dispatch Controller</span>
        </h3>
        <span className="text-[11px] font-mono text-[#4cd7f6] px-2.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_8px_rgba(76,215,246,0.15)] font-bold">
          STREAM DISPATCHER
        </span>
      </div>

      {/* Platform Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPlatform(p.value)}
            className={`
              py-2.5 px-3 rounded-xl text-xs font-semibold
              transition-all duration-200 border flex items-center justify-center gap-2 cursor-pointer
              ${platform === p.value
                ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-cyan-500/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_12px_rgba(76,215,246,0.3)] font-bold'
                : 'glass-control text-[#8ea0b5] border-white/5 hover:border-white/20 hover:text-white'
              }
            `}
          >
            <PlatformLogo platform={p.value} className="w-4 h-4" colored={true} />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Query Input */}
      <div className="mb-4">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#8ea0b5] mb-2 font-semibold">
          Search Query / Channel Handle
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selectedPlatform?.placeholder}
          className="w-full glass-control font-mono text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500"
          required
        />
      </div>

      {/* Max Results Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-mono text-[#8ea0b5] mb-2">
          <span className="font-semibold">SAMPLE CAP</span>
          <span className="text-[#4cd7f6] font-bold text-sm bg-cyan-500/15 px-2.5 py-0.5 rounded-lg border border-cyan-500/30">
            {maxResults} POSTS
          </span>
        </div>
        <input
          type="range"
          min={10} max={200} step={10}
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="w-full accent-[#4cd7f6] bg-black/40 rounded-lg h-2 cursor-pointer border border-white/5"
        />
        <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
          <span>10 (fast)</span>
          <span>200 (deep scrape)</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className={`
          w-full py-3.5 rounded-xl font-mono text-xs font-black tracking-wider uppercase
          transition-all duration-200
          ${isLoading || !query.trim()
            ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
            : 'glass-btn-primary cursor-pointer'
          }
        `}
      >
        {isLoading ? (
          '⏳ Ingesting Signal Stream...'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🚀 Dispatch Stream</span>
            <span className="opacity-40">|</span>
            <PlatformLogo platform={selectedPlatform?.value} className="w-4 h-4" colored={false} />
            <span>{selectedPlatform?.label}</span>
          </span>
        )}
      </button>
    </form>
  )
}

export default CollectForm
