/*
  ActivityTimeline.jsx
  --------------------
  Interactive chronological timeline for Platform Analytics.
  Visualizes posts, comments, engagement events, and sentiment using recharts.
  Features: time granularity (Hour/Day/Week/Custom), zoom, click event details.
*/

import React, { useState, useMemo } from 'react'
import { NORMALIZED_RECORDS, PLATFORMS_CONFIG } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo.jsx'
import DateRangeFilter from './DateRangeFilter.jsx'

const TIME_MODES = [
  { id: 'hour',  label: 'Hour' },
  { id: 'day',   label: 'Day' },
  { id: 'week',  label: 'Week' },
  { id: 'custom', label: 'Custom Range' },
]

const CONTENT_TYPES = [
  { id: 'all',     label: 'All Events' },
  { id: 'posts',   label: 'Posts' },
  { id: 'replies', label: 'Replies' },
]

const SENTIMENT_STYLES = {
  positive: 'border-emerald-500/40 bg-emerald-500/10 text-[#4edea3]',
  negative: 'border-rose-500/40 bg-rose-500/10 text-[#f43f5e]',
  neutral:  'border-cyan-500/40 bg-cyan-500/10 text-[#4cd7f6]',
}

function ActivityTimeline({ selectedPlatform = 'all' }) {
  const [timeMode, setTimeMode] = useState('day')
  const [contentType, setContentType] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [dateRange, setDateRange] = useState({ preset: 'all' })

  // Build all events including replies
  const allEvents = useMemo(() => {
    const events = []

    NORMALIZED_RECORDS.forEach((rec) => {
      if (selectedPlatform !== 'all' && rec.platform !== selectedPlatform) return

      events.push({ ...rec, _type: 'post', _engagementTotal: Object.values(rec.engagement || {}).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0) })

      if (rec.thread_replies) {
        rec.thread_replies.forEach((reply) => {
          events.push({
            ...reply,
            platform: rec.platform,
            topic: rec.topic,
            engagement: reply.engagement || {},
            _type: 'reply',
            _engagementTotal: 0,
          })
        })
      }
    })

    return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }, [selectedPlatform])

  // Apply content type filter
  const filteredEvents = useMemo(() => {
    let result = allEvents
    if (contentType === 'posts') result = result.filter(e => e._type === 'post')
    if (contentType === 'replies') result = result.filter(e => e._type === 'reply')
    return result
  }, [allEvents, contentType])

  // Compute engagement spike markers
  const avgEngagement = filteredEvents.length > 0
    ? filteredEvents.reduce((s, e) => s + (e._engagementTotal || 0), 0) / filteredEvents.length
    : 0

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 relative z-10">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6] animate-pulse" />
            ⏱️ Interactive Activity Timeline
          </h3>
          <span className="text-[11px] font-mono text-[#8ea0b5]">
            {filteredEvents.length} EVENTS PLOTTED
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-4 flex-wrap relative z-10">
          {/* Time Mode */}
          <div className="flex items-center gap-1.5">
            {TIME_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setTimeMode(mode.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  timeMode === mode.id
                    ? 'glass-tab-active'
                    : 'glass-control text-[#8ea0b5] hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Content Type */}
          <div className="flex items-center gap-1.5">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct.id}
                type="button"
                onClick={() => setContentType(ct.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  contentType === ct.id
                    ? 'bg-[rgba(221,183,255,0.15)] text-[#ddb7ff] border border-[#ddb7ff]/40 font-bold backdrop-blur-md'
                    : 'glass-control text-[#8ea0b5] hover:text-white'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        {timeMode === 'custom' && (
          <div className="mb-4 relative z-10">
            <DateRangeFilter onRangeChange={setDateRange} selectedPreset="all" />
          </div>
        )}

        {/* Visual Timeline */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/80 before:via-purple-500/50 before:to-transparent max-h-[600px] overflow-y-auto pr-1 relative z-10">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-[#8ea0b5] font-mono text-xs">
              <div className="text-4xl mb-3">⏱️</div>
              <p>No timeline events available for this platform.</p>
            </div>
          ) : (
            filteredEvents.map((event, idx) => {
              const isSpike = event._engagementTotal > avgEngagement * 2
              const isSelected = selectedEvent?.post_id === event.post_id

              return (
                <div key={event.post_id || `evt-${idx}`} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-[#060e20] border-2 transition-colors shadow-[0_0_8px_rgba(76,215,246,0.4)] ${
                    isSpike ? 'border-amber-400 bg-amber-400/20' : 'border-cyan-400 group-hover:bg-[#4cd7f6]'
                  }`} />

                  <div
                    className={`p-3.5 liquid-glass-soft border rounded-xl transition-all cursor-pointer ${
                      isSelected ? 'border-cyan-500/40 shadow-[0_0_12px_rgba(76,215,246,0.2)]' : 'border-white/10 hover:border-cyan-500/25'
                    }`}
                    onClick={() => setSelectedEvent(isSelected ? null : event)}
                  >
                    {/* Event Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <PlatformLogo platform={event.platform} className="w-3.5 h-3.5" colored={true} />
                        <span className="text-xs font-bold text-white font-mono">
                          {event.author_name || event.author_id}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#8ea0b5] uppercase font-bold">
                          {event._type}
                        </span>
                        {event.sentiment && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase ${SENTIMENT_STYLES[event.sentiment] || ''}`}>
                            {event.emotion || event.sentiment}
                          </span>
                        )}
                        {isSpike && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                            🔥 SPIKE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#8ea0b5]">
                        {new Date(event.timestamp).toLocaleString([], {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-[11px] text-[#dae2fd] leading-relaxed line-clamp-2 font-sans">{event.text}</p>

                    {/* Engagement Footer */}
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#8ea0b5] border-t border-white/5 pt-2 mt-2">
                      {event.engagement?.likes > 0 && <span>❤️ {event.engagement.likes.toLocaleString()}</span>}
                      {(event.engagement?.shares > 0 || event.engagement?.retweets > 0) && (
                        <span>🔁 {(event.engagement.shares || event.engagement.retweets || 0).toLocaleString()}</span>
                      )}
                      {event.engagement?.views > 0 && <span>👁️ {event.engagement.views.toLocaleString()}</span>}
                      {event.location_hint?.city && (
                        <span className="ml-auto text-cyan-400">📍 {event.location_hint.city}</span>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="mt-3 p-3 liquid-glass-soft border border-white/10 rounded-xl text-xs font-mono space-y-1.5 animate-fade-in">
                        {event.topic && <div><span className="text-[#8ea0b5]">Topic:</span> <span className="text-white">{event.topic}</span></div>}
                        {event.confidence && <div><span className="text-[#8ea0b5]">Confidence:</span> <span className="text-[#4edea3]">{(event.confidence * 100).toFixed(1)}%</span></div>}
                        {event.hashtags && event.hashtags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-[#8ea0b5]">Tags:</span>
                            {event.hashtags.map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[#4cd7f6] text-[9px]">#{tag}</span>
                            ))}
                          </div>
                        )}
                        {event.post_id && <div><span className="text-[#8ea0b5]">Record ID:</span> <span className="text-[#4cd7f6]">{event.post_id}</span></div>}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityTimeline
