/*
  WordCloud.jsx
  -------------
  Displays trending keywords as a visual word cloud with NEXORA neon glow accents.
*/

import React from 'react'

// Cyberpunk neon colors for words
const WORD_COLORS = [
  'text-[#4cd7f6] hover:drop-shadow-[0_0_10px_rgba(76,215,246,0.8)]',
  'text-[#ddb7ff] hover:drop-shadow-[0_0_10px_rgba(221,183,255,0.8)]',
  'text-[#4edea3] hover:drop-shadow-[0_0_10px_rgba(78,222,163,0.8)]',
  'text-[#06b6d4] hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]',
  'text-[#f59e0b] hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]',
  'text-[#ec4899] hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]',
  'text-[#38bdf8] hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]',
]

// Size classes based on score rank
const getSizeClass = (index, total) => {
  const ratio = 1 - (index / total)
  if (ratio > 0.8) return 'text-3xl font-black font-mono'
  if (ratio > 0.6) return 'text-2xl font-extrabold font-mono'
  if (ratio > 0.4) return 'text-xl font-bold'
  if (ratio > 0.2) return 'text-base font-semibold'
  return 'text-xs font-medium'
}

function WordCloud({ keywords = [] }) {
  const sorted = [...keywords].sort((a, b) => b.score - a.score)

  return (
    <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
          💬 Keyword Semantic Entity Matrix
        </h3>
        <span className="text-[11px] font-mono text-[#4cd7f6]">
          LEXICAL DENSITY
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-14 text-[#8ea0b5] font-mono text-xs bg-black/20 rounded-xl border border-white/5 my-2">
          No keyword entities detected yet
        </div>
      ) : (
        <div className="
          flex flex-wrap gap-2.5 justify-center
          items-center min-h-[220px] p-4 bg-black/40 rounded-xl border border-white/5
        ">
          {sorted.slice(0, 30).map((kw, index) => (
            <span
              key={kw.text}
              className={`
                ${getSizeClass(index, sorted.length)}
                ${WORD_COLORS[index % WORD_COLORS.length]}
                cursor-default transition-all duration-200
                hover:scale-105 px-2 py-0.5 rounded-lg hover:bg-white/5
              `}
              title={`Frequency & R-Score: ${kw.score}`}
            >
              #{kw.text}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default WordCloud
