/*
  ChronologicalTimeline.jsx
  --------------------------
  NEXORA Interactive Chronological Event Timeline.
  Enables intelligence analysts to trace incoming signals in chronological sequence.
  Supports:
  - Date range filtering
  - Multi-platform filtering
  - Topic filtering
  - Sentiment / Emotion filtering
  - Thread expansion
*/

import React, { useState, useMemo } from 'react'
import { NORMALIZED_RECORDS, PLATFORMS_CONFIG } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo'

function ChronologicalTimeline({ onSelectThread }) {
  const [platform, setPlatform]   = useState('all')
  const [sentiment, setSentiment] = useState('all')
  const [topic, setTopic]         = useState('all')

  const uniqueTopics = ['all', ...new Set(NORMALIZED_RECORDS.map(r => r.topic))]

  const filtered = NORMALIZED_RECORDS.filter(r => {
    if (platform !== 'all' && r.platform !== platform) return false
    if (sentiment !== 'all' && r.sentiment !== sentiment) return false
    if (topic !== 'all' && r.topic !== topic) return false
    return true
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const sentimentStyles = {
    positive: 'border-emerald-500/40 bg-emerald-500/10 text-[#4edea3]',
    negative: 'border-rose-500/40 bg-rose-500/10 text-[#f43f5e]',
    neutral:  'border-cyan-500/40 bg-cyan-500/10 text-[#4cd7f6]',
  }

  return (
    <div className="liquid-glass glass-edge-top p-5 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6] animate-pulse" />
          <span>⏱️ Chronological Event & Signal Timeline</span>
        </h3>
        <span className="text-[11px] font-mono text-[#8ea0b5]">
          CHRONO-SEQUENCED TELEMETRY
        </span>
      </div>

      {/* Filter Row */}
      <div className="flex gap-2 flex-wrap mb-5">
        {/* Platform Selector */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="glass-control text-white font-mono rounded-xl px-2.5 py-1.5 text-xs"
        >
          {PLATFORMS_CONFIG.map(p => (
            <option key={p.id} value={p.id} className="bg-[#060e20] text-white">{p.icon} {p.label}</option>
          ))}
        </select>

        {/* Sentiment Selector */}
        <select
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          className="glass-control text-white font-mono rounded-xl px-2.5 py-1.5 text-xs"
        >
          <option value="all" className="bg-[#060e20] text-white">All Sentiments</option>
          <option value="positive" className="bg-[#060e20] text-white">Positive Only</option>
          <option value="negative" className="bg-[#060e20] text-white">Negative Only</option>
          <option value="neutral" className="bg-[#060e20] text-white">Neutral Only</option>
        </select>

        {/* Topic Selector */}
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="glass-control text-white font-mono rounded-xl px-2.5 py-1.5 text-xs max-w-xs truncate"
        >
          {uniqueTopics.map(t => (
            <option key={t} value={t} className="bg-[#060e20] text-white">{t === 'all' ? 'All Topics' : t}</option>
          ))}
        </select>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/80 before:via-purple-500/50 before:to-transparent">
        {filtered.map((item) => {
          const hasReplies = item.thread_replies && item.thread_replies.length > 0
          return (
            <div key={item.post_id} className="relative group">
              {/* Dot marker */}
              <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-[#060e20] border-2 border-cyan-400 group-hover:bg-[#4cd7f6] transition-colors shadow-[0_0_8px_rgba(76,215,246,0.5)]" />

              <div className="p-4 liquid-glass-soft border border-white/10 hover:border-cyan-500/30 rounded-xl transition-all">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                      <PlatformLogo platform={item.platform} className="w-3.5 h-3.5" colored={true} />
                      {item.platform === 'twitter' ? 'X / Twitter' :
                       item.platform === 'telegram' ? 'Telegram' :
                       item.platform === 'youtube' ? 'YouTube' :
                       item.platform === 'reddit' ? 'Reddit' :
                       item.platform === 'instagram' ? 'Instagram' : 'Facebook'}
                    </span>
                    <span className="text-[11px] font-mono text-[#4cd7f6]">
                      {item.author_name || item.author_id}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase ${sentimentStyles[item.sentiment] || ''}`}>
                      {item.emotion || item.sentiment}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#8ea0b5]">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-[#dae2fd] leading-relaxed mb-2 font-sans">
                  {item.text}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#8ea0b5] border-t border-white/5 pt-2">
                  <div className="flex items-center gap-3">
                    <span>❤️ {(item.engagement?.likes || 0).toLocaleString()}</span>
                    <span>🔁 {(item.engagement?.shares || item.engagement?.retweets || 0).toLocaleString()}</span>
                    <span className="text-cyan-400">📍 {item.location_hint?.city || 'Global'}</span>
                  </div>

                  {hasReplies && onSelectThread && (
                    <button
                      type="button"
                      onClick={() => onSelectThread(item)}
                      className="text-[#4cd7f6] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      💬 Inspect Thread ({item.thread_replies.length} replies) →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChronologicalTimeline
