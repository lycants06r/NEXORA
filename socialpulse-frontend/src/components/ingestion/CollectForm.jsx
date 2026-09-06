/*
  CollectForm.jsx
  ---------------
  Form to trigger data collection with NEXORA command center glassmorphic styling.
*/

import React, { useState } from 'react'

const PLATFORMS = [
  { value: 'twitter',  label: '🐦 Twitter / X',  placeholder: 'e.g., artificial intelligence' },
  { value: 'reddit',   label: '🤖 Reddit',         placeholder: 'e.g., technology (subreddit name)' },
  { value: 'youtube',  label: '📺 YouTube',         placeholder: 'e.g., AI news 2024' },
  { value: 'telegram', label: '✈️ Telegram',        placeholder: 'e.g., bbcnews (channel username)' },
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
      className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-base tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
          🎯 Ingestion Dispatch Controller
        </h3>
        <span className="text-[11px] font-mono text-[#4cd7f6] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
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
              transition-all duration-200 border
              ${platform === p.value
                ? 'bg-[#4cd7f6]/15 text-[#4cd7f6] border-cyan-500/50 shadow-[0_0_15px_rgba(76,215,246,0.3)]'
                : 'bg-black/30 text-[#8ea0b5] border-white/5 hover:border-white/15 hover:text-white'
              }
            `}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Query Input */}
      <div className="mb-4">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#8ea0b5] mb-2">
          Search Query / Channel Handle
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selectedPlatform?.placeholder}
          className="
            w-full bg-black/40 border border-cyan-500/25
            text-white placeholder-gray-500 font-mono text-sm
            rounded-xl px-4 py-3
            focus:outline-none focus:border-[#4cd7f6] focus:shadow-[0_0_15px_rgba(76,215,246,0.25)]
            transition-all
          "
          required
        />
      </div>

      {/* Max Results Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-mono text-[#8ea0b5] mb-2">
          <span>SAMPLE CAP</span>
          <span className="text-[#4cd7f6] font-bold text-sm bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            {maxResults} POSTS
          </span>
        </div>
        <input
          type="range"
          min={10} max={200} step={10}
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="w-full accent-[#4cd7f6] bg-dark-600 rounded-lg h-1.5 cursor-pointer"
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
          w-full py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase
          transition-all duration-300
          ${isLoading || !query.trim()
            ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
            : 'bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:from-[#38bdf8] hover:to-[#0891b2] text-black font-black shadow-[0_0_20px_rgba(76,215,246,0.35)] cursor-pointer'
          }
        `}
      >
        {isLoading
          ? '⏳ Ingesting Signal Stream...'
          : `🚀 Dispatch Stream (${selectedPlatform?.label})`
        }
      </button>
    </form>
  )
}

export default CollectForm
