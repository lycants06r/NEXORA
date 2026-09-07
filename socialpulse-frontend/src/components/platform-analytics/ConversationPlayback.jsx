/*
  ConversationPlayback.jsx
  -------------------------
  Historical conversation playback feature for Platform Analytics.
  Allows users to replay available conversation/activity sequentially.
  Controls: Play, Pause, Previous, Next, Timeline Scrubber, Speed, Timestamp.
  Operates on NORMALIZED_RECORDS + thread_replies sorted chronologically.
*/

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { NORMALIZED_RECORDS } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo.jsx'

const SPEEDS = [
  { value: 0.5, label: '0.5x' },
  { value: 1,   label: '1x' },
  { value: 2,   label: '2x' },
  { value: 4,   label: '4x' },
]

const SENTIMENT_STYLES = {
  positive: 'border-emerald-500/40 bg-emerald-500/10 text-[#4edea3]',
  negative: 'border-rose-500/40 bg-rose-500/10 text-[#f43f5e]',
  neutral:  'border-cyan-500/40 bg-cyan-500/10 text-[#4cd7f6]',
}

function ConversationPlayback({ selectedPlatform = 'all' }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speed, setSpeed] = useState(1)
  const intervalRef = useRef(null)

  // Build chronological event list
  const events = useMemo(() => {
    const items = []

    NORMALIZED_RECORDS.forEach((rec) => {
      if (selectedPlatform !== 'all' && rec.platform !== selectedPlatform) return

      items.push({
        id: rec.post_id,
        platform: rec.platform,
        author: rec.author_name || rec.author_id,
        text: rec.text,
        timestamp: rec.timestamp,
        sentiment: rec.sentiment,
        emotion: rec.emotion,
        engagement: rec.engagement,
        topic: rec.topic,
        type: 'post',
        hashtags: rec.hashtags,
        confidence: rec.confidence,
        location: rec.location_hint,
      })

      if (rec.thread_replies) {
        rec.thread_replies.forEach((reply) => {
          items.push({
            id: reply.post_id,
            platform: rec.platform,
            author: reply.author_name || reply.author_id,
            text: reply.text,
            timestamp: reply.timestamp,
            sentiment: reply.sentiment,
            emotion: reply.emotion,
            engagement: reply.engagement || {},
            topic: rec.topic,
            type: 'reply',
            parentId: rec.post_id,
          })
        })
      }
    })

    return items.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }, [selectedPlatform])

  const currentEvent = events[currentIndex] || null
  const hasEnoughData = events.length >= 2

  // Playback logic
  const stopPlayback = useCallback(() => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startPlayback = useCallback(() => {
    if (!hasEnoughData) return
    setIsPlaying(true)
  }, [hasEnoughData])

  useEffect(() => {
    if (isPlaying && hasEnoughData) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= events.length - 1) {
            stopPlayback()
            return prev
          }
          return prev + 1
        })
      }, 2000 / speed) // Base 2s interval, modified by speed

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, speed, events.length, hasEnoughData, stopPlayback])

  // Reset index when platform changes
  useEffect(() => {
    setCurrentIndex(0)
    stopPlayback()
  }, [selectedPlatform, stopPlayback])

  const handlePrevious = () => {
    stopPlayback()
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const handleNext = () => {
    stopPlayback()
    setCurrentIndex(Math.min(events.length - 1, currentIndex + 1))
  }

  const handleScrub = (e) => {
    stopPlayback()
    setCurrentIndex(parseInt(e.target.value))
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      stopPlayback()
    } else {
      if (currentIndex >= events.length - 1) setCurrentIndex(0)
      startPlayback()
    }
  }

  // Not enough data state
  if (!hasEnoughData) {
    return (
      <div className="animate-fade-in">
        <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
          <div className="glass-edge-top" />
          <div className="text-center py-16 relative z-10">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-white font-bold text-sm mb-2">Not enough historical data for playback.</h3>
            <p className="text-[#8ea0b5] text-xs font-mono max-w-md mx-auto">
              Conversation playback requires at least 2 chronological events.
              {selectedPlatform !== 'all' && ' Try selecting "All Platforms" or a platform with more data.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Playback Controls */}
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ddb7ff] shadow-[0_0_10px_#ddb7ff] animate-pulse" />
              🎬 Conversation Playback
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#8ea0b5]">
                Event {currentIndex + 1} of {events.length}
              </span>
              {isPlaying && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[#4edea3] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                  PLAYING
                </span>
              )}
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {/* Previous */}
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="playback-btn px-3 py-2 text-sm disabled:opacity-40"
              title="Previous"
            >
              ⏮
            </button>

            {/* Play/Pause */}
            <button
              type="button"
              onClick={togglePlayPause}
              className={`playback-btn px-4 py-2 text-base ${isPlaying ? 'active' : ''}`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= events.length - 1}
              className="playback-btn px-3 py-2 text-sm disabled:opacity-40"
              title="Next"
            >
              ⏭
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-[10px] font-mono text-[#8ea0b5] uppercase">Speed:</span>
              {SPEEDS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSpeed(s.value)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    speed === s.value
                      ? 'glass-tab-active'
                      : 'glass-control text-[#8ea0b5] hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Current Timestamp */}
            {currentEvent && (
              <span className="ml-auto text-[11px] font-mono text-[#4cd7f6] px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 font-bold">
                {new Date(currentEvent.timestamp).toLocaleString([], {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                })}
              </span>
            )}
          </div>

          {/* Timeline Scrubber */}
          <div className="mb-2">
            <input
              type="range"
              min={0}
              max={events.length - 1}
              value={currentIndex}
              onChange={handleScrub}
              className="timeline-scrubber"
            />
            <div className="flex justify-between text-[9px] font-mono text-[#8ea0b5] mt-1">
              <span>{events.length > 0 ? new Date(events[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
              <span>{events.length > 0 ? new Date(events[events.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Event Display */}
      {currentEvent && (
        <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden animate-fade-in">
          <div className="glass-edge-top" />
          <div className="relative z-10">
            {/* Event Header */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl liquid-glass-soft border border-white/15 flex items-center justify-center p-2">
                  <PlatformLogo platform={currentEvent.platform} className="w-5 h-5" colored={true} />
                </div>
                <div>
                  <div className="text-white text-sm font-bold">{currentEvent.author}</div>
                  <div className="text-[10px] font-mono text-[#8ea0b5] flex items-center gap-2">
                    <span className="uppercase">{currentEvent.type}</span>
                    <span>·</span>
                    <span>{new Date(currentEvent.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentEvent.sentiment && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${SENTIMENT_STYLES[currentEvent.sentiment] || ''}`}>
                    {currentEvent.emotion || currentEvent.sentiment}
                  </span>
                )}
                {currentEvent.confidence && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#8ea0b5]">
                    Conf: {(currentEvent.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>

            {/* Event Content */}
            <div className="p-4 liquid-glass-soft border border-white/10 rounded-xl mb-3">
              <p className="text-sm text-[#dae2fd] leading-relaxed font-sans">{currentEvent.text}</p>
            </div>

            {/* Tags */}
            {currentEvent.hashtags && currentEvent.hashtags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {currentEvent.hashtags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-[#4cd7f6] text-[10px] font-mono">#{tag}</span>
                ))}
              </div>
            )}

            {/* Engagement + Metadata */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-[#8ea0b5] border-t border-white/10 pt-3">
              {currentEvent.engagement?.likes > 0 && <span>❤️ {currentEvent.engagement.likes.toLocaleString()}</span>}
              {(currentEvent.engagement?.shares > 0 || currentEvent.engagement?.retweets > 0) && (
                <span>🔁 {(currentEvent.engagement.shares || currentEvent.engagement.retweets || 0).toLocaleString()}</span>
              )}
              {currentEvent.engagement?.replies > 0 && <span>💬 {currentEvent.engagement.replies.toLocaleString()}</span>}
              {currentEvent.engagement?.views > 0 && <span>👁️ {currentEvent.engagement.views.toLocaleString()}</span>}
              {currentEvent.topic && <span className="ml-auto text-cyan-400">{currentEvent.topic}</span>}
              {currentEvent.location?.city && <span className="text-[#ddb7ff]">📍 {currentEvent.location.city}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Playback Event List (Mini Timeline) */}
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />
        <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3 relative z-10">
          📋 Event Sequence ({events.length} events)
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 relative z-10">
          {events.map((event, idx) => (
            <button
              key={event.id || `pb-${idx}`}
              type="button"
              onClick={() => { stopPlayback(); setCurrentIndex(idx) }}
              className={`w-full text-left p-2 rounded-lg text-[10px] font-mono transition-all cursor-pointer flex items-center gap-2 ${
                idx === currentIndex
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-[#4cd7f6]'
                  : idx < currentIndex
                  ? 'text-[#8ea0b5] hover:bg-white/5'
                  : 'text-[#8ea0b5]/60 hover:bg-white/5'
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                idx === currentIndex ? 'bg-[#4cd7f6] shadow-[0_0_6px_#4cd7f6]' : idx < currentIndex ? 'bg-[#8ea0b5]' : 'bg-white/20'
              }`} />
              <PlatformLogo platform={event.platform} className="w-3 h-3 flex-shrink-0" colored={idx === currentIndex} />
              <span className="truncate flex-1">{event.author}: {event.text.slice(0, 50)}...</span>
              <span className="flex-shrink-0 text-[9px]">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConversationPlayback
