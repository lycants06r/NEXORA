/*
  ThreadDrilldownModal.jsx
  ------------------------
  Thread-Level Sentiment & Emotion Drill-Down Inspector.
  Allows analysts to select any post or conversation thread and see:
  - Original root message
  - All branch replies and responses
  - Individual sentiment & emotion classifications with confidence
  - Aggregate conversational polarity drift
*/

import React from 'react'

function ThreadDrilldownModal({ thread, onClose }) {
  if (!thread) return null

  const replies = thread.thread_replies || []
  const totalItems = replies.length + 1

  // Compute aggregate thread sentiment
  const allEmotions = [thread.emotion, ...replies.map(r => r.emotion)].filter(Boolean)
  const posCount = [thread.sentiment, ...replies.map(r => r.sentiment)].filter(s => s === 'positive').length
  const aggregateScore = Math.round((posCount / totalItems) * 100)

  const emotionBadges = {
    supportive: 'bg-emerald-500/15 text-[#4edea3] border-emerald-500/30',
    excitement: 'bg-cyan-500/15 text-[#4cd7f6] border-cyan-500/30',
    positive:   'bg-green-500/15 text-green-400 border-green-500/30',
    neutral:    'bg-slate-500/15 text-slate-300 border-slate-500/30',
    anxiety:    'bg-purple-500/15 text-purple-300 border-purple-500/30',
    sarcasm:    'bg-amber-500/15 text-amber-300 border-amber-500/30',
    opposition: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    negative:   'bg-red-500/15 text-red-400 border-red-500/30',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#060e20] border border-cyan-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(76,215,246,0.3)] overflow-hidden">
        {/* Top Accent */}
        <div className="w-full h-1 bg-gradient-to-r from-[#4cd7f6] via-[#ddb7ff] to-[#4edea3]" />

        {/* Modal Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧵</span>
            <div>
              <h3 className="text-white font-bold text-sm uppercase font-mono tracking-wide flex items-center gap-2">
                <span>Thread-Level Sentiment Drill-Down</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-[#4cd7f6] border border-cyan-500/30 font-mono font-bold">
                  {thread.post_id}
                </span>
              </h3>
              <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
                Topic: {thread.topic}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8ea0b5] hover:text-white font-mono text-base px-2 py-1 rounded hover:bg-white/5 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Aggregate Thread Sentiment KPI Banner */}
        <div className="bg-black/50 p-4 border-b border-white/5 grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2 bg-black/40 border border-white/5 rounded-xl">
            <span className="text-[10px] text-[#8ea0b5] block">AGGREGATE POLARITY</span>
            <span className={`text-base font-extrabold ${aggregateScore > 50 ? 'text-[#4edea3]' : 'text-[#f43f5e]'}`}>
              {aggregateScore}% Pos
            </span>
          </div>
          <div className="p-2 bg-black/40 border border-white/5 rounded-xl">
            <span className="text-[10px] text-[#8ea0b5] block">THREAD DEPTH</span>
            <span className="text-base font-extrabold text-white">
              {totalItems} Posts
            </span>
          </div>
          <div className="p-2 bg-black/40 border border-white/5 rounded-xl">
            <span className="text-[10px] text-[#8ea0b5] block">CONVERSATION DRIFT</span>
            <span className="text-base font-extrabold text-[#4cd7f6]">
              {allEmotions.includes('sarcasm') || allEmotions.includes('opposition') ? 'Contested' : 'Consensual'}
            </span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Root Message */}
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono">
                  {thread.author_name || thread.author_id}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-[#4cd7f6] uppercase font-bold">
                  ORIGINAL POST
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${emotionBadges[thread.emotion] || emotionBadges.positive}`}>
                {thread.emotion || thread.sentiment} ({(thread.confidence * 100 || 94).toFixed(0)}%)
              </span>
            </div>
            <p className="text-xs text-[#dae2fd] leading-relaxed">
              {thread.text}
            </p>
          </div>

          {/* Branch Replies */}
          {replies.length === 0 ? (
            <div className="text-center py-6 text-[#8ea0b5] font-mono text-xs">
              No replies ingested for this specific message ID.
            </div>
          ) : (
            <div className="space-y-3 pl-4 border-l-2 border-cyan-500/20 ml-2">
              {replies.map((rep) => (
                <div
                  key={rep.post_id}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-[#8ea0b5] font-bold">
                      {rep.author_name || rep.author_id}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${emotionBadges[rep.emotion] || emotionBadges.neutral}`}>
                      {rep.emotion || rep.sentiment} ({(rep.confidence * 100 || 88).toFixed(0)}%)
                    </span>
                  </div>
                  <p className="text-xs text-[#dae2fd]">
                    {rep.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-black/60 border border-cyan-500/30 text-white hover:border-cyan-400 text-xs font-mono rounded-xl cursor-pointer"
          >
            Close Drill-Down
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThreadDrilldownModal
