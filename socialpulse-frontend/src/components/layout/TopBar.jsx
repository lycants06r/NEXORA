/*
  TopBar.jsx
  ----------
  The top header bar shown on all pages.
  Features NEXORA-style glassmorphic telemetry HUD with live status and clock.
*/

import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Map URL paths to page titles
const PAGE_TITLES = {
  '/':            { title: 'Command Center',    subtitle: 'Autonomous social media intelligence & sentiment telemetry' },
  '/ingestion':   { title: 'Data Ingestion',    subtitle: 'Cross-platform ingestion pipeline & stream monitor' },
  '/sentiment':   { title: 'Sentiment Radar',   subtitle: 'Cognitive polarity shifts & emotion taxonomy' },
  '/demographics':{ title: 'Demographics',      subtitle: 'AI-inferred audience profiling & geographic matrices' },
  '/trends':      { title: 'Viral Forecasting', subtitle: 'Time-series cascade modeling & anomaly detection' },
  '/network':     { title: 'Network Topology',  subtitle: 'Force-directed graph, astroturfing & influence mapping' },
}

function TopBar() {
  const location = useLocation()
  const [time, setTime]     = useState(new Date())
  const [health, setHealth] = useState(null)

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Check backend health on load
  useEffect(() => {
    fetch('http://127.0.0.1:8000/health')
      .then(r => r.json())
      .then(data => setHealth(data))
      .catch(() => setHealth(null))
  }, [])

  const pageInfo = PAGE_TITLES[location.pathname] ||
                   { title: 'SocialPulse', subtitle: 'Intelligence Operations' }

  return (
    <header className="
      h-16 bg-[#060e20]/80 backdrop-blur-2xl border-b border-cyan-500/20
      flex items-center justify-between px-6
      flex-shrink-0 z-10 shadow-sm
    ">
      {/* LEFT: Page Title & Mission Tag */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-white font-bold text-lg leading-tight tracking-wide">
            {pageInfo.title}
          </h2>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-[#4cd7f6] border border-cyan-500/30">
            LIVE FEED
          </span>
        </div>
        <p className="text-xs text-[#8ea0b5] mt-0.5">
          {pageInfo.subtitle}
        </p>
      </div>

      {/* RIGHT: Status + Telemetry Clock */}
      <div className="flex items-center gap-3">
        {/* Backend Status Pill */}
        <div className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold
          ${health
            ? 'bg-emerald-500/15 text-[#4edea3] border border-emerald-500/30 shadow-[0_0_12px_rgba(78,222,163,0.2)]'
            : 'bg-rose-500/15 text-[#f43f5e] border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
          }
        `}>
          <div className={`w-2 h-2 rounded-full ${health ? 'bg-[#4edea3] shadow-[0_0_8px_#4edea3]' : 'bg-[#f43f5e] shadow-[0_0_8px_#f43f5e]'} animate-pulse`} />
          {health ? 'API CORE ONLINE' : 'API CORE OFFLINE'}
        </div>

        {/* Live Monospace Clock */}
        <div className="px-3.5 py-1.5 rounded-xl bg-black/50 border border-cyan-500/20 text-xs font-mono text-[#4cd7f6] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] flex items-center gap-2">
          <span className="text-gray-500">UTC</span>
          <span className="font-bold tracking-wider">{time.toLocaleTimeString()}</span>
        </div>
      </div>
    </header>
  )
}

export default TopBar
