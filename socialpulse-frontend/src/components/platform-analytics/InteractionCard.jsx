/*
  InteractionCard.jsx
  -------------------
  Individual interaction/comment/reply card for ActivityFeed.
  Shows author, text, sentiment, timestamp, engagement, type.
*/

import React from 'react'
import PlatformLogo from '../common/PlatformLogo.jsx'

const SENTIMENT_STYLES = {
  positive: 'bg-emerald-500/10 text-[#4edea3] border-emerald-500/30',
  negative: 'bg-rose-500/10 text-[#f43f5e] border-rose-500/30',
  neutral:  'bg-cyan-500/10 text-[#4cd7f6] border-cyan-500/30',
}

const TYPE_LABELS = {
  post:        { icon: '📝', label: 'Post' },
  comment:     { icon: '💬', label: 'Comment' },
  reply:       { icon: '↩️', label: 'Reply' },
  interaction: { icon: '⚡', label: 'Interaction' },
}

function InteractionCard({ item, type = 'post' }) {
  const typeConfig = TYPE_LABELS[type] || TYPE_LABELS.post
  const sentimentClass = SENTIMENT_STYLES[item.sentiment] || SENTIMENT_STYLES.neutral

  return (
    <div className="p-3.5 liquid-glass-soft border border-white/10 hover:border-cyan-500/30 rounded-xl transition-all animate-slide-up">
      {/* Top row: platform, author, type, time */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
        <div className="flex items-center gap-2">
          {item.platform && (
            <PlatformLogo platform={item.platform} className="w-3.5 h-3.5" colored={true} />
          )}
          <span className="text-xs font-bold text-white font-mono">
            {item.author_name || item.author_id || 'Unknown'}
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#8ea0b5] uppercase font-bold">
            {typeConfig.icon} {typeConfig.label}
          </span>
          {item.sentiment && (
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase ${sentimentClass}`}>
              {item.emotion || item.sentiment}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-[#8ea0b5]">
          {item.timestamp
            ? new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : '—'}
        </span>
      </div>

      {/* Content preview */}
      <p className="text-xs text-[#dae2fd] leading-relaxed mb-2 line-clamp-2 font-sans">
        {item.text || item.content || '—'}
      </p>

      {/* Engagement row */}
      {item.engagement && (
        <div className="flex items-center gap-3 text-[10px] font-mono text-[#8ea0b5] border-t border-white/5 pt-2">
          {item.engagement.likes > 0 && (
            <span>❤️ {item.engagement.likes.toLocaleString()}</span>
          )}
          {(item.engagement.shares > 0 || item.engagement.retweets > 0) && (
            <span>🔁 {(item.engagement.shares || item.engagement.retweets || 0).toLocaleString()}</span>
          )}
          {item.engagement.replies > 0 && (
            <span>💬 {item.engagement.replies.toLocaleString()}</span>
          )}
          {item.engagement.views > 0 && (
            <span>👁️ {item.engagement.views.toLocaleString()}</span>
          )}
          {item.topic && (
            <span className="ml-auto text-cyan-400 truncate max-w-[140px]">{item.topic}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default InteractionCard
