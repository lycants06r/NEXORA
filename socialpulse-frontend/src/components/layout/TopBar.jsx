/*
  TopBar.jsx
  ----------
  The top header bar shown on all pages.
  Features NEXORA-style glassmorphic telemetry console with live status,
  role-based access control (RBAC) switcher, threat alert badge, and report export.
*/

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReportExportModal from '../common/ReportExportModal'
import { SYSTEM_ALERTS } from '../../api/normalizedData'

// Map URL paths to page titles
const PAGE_TITLES = {
  '/':            { title: 'Dashboard',             subtitle: 'Real-time executive intelligence & cross-platform telemetry' },
  '/analytics':   { title: 'Platform Analytics',    subtitle: 'Cross-platform deep inspection across 6 core channels' },
  '/ingestion':   { title: 'Data Ingestion',        subtitle: 'Live connector pipeline, scheduler & stream timeline' },
  '/sentiment':   { title: 'Sentiment Radar',       subtitle: 'Multi-emotion taxonomy, drill-down & temporal heatmap' },
  '/demographics':{ title: 'Demographics',          subtitle: 'Zero-PII anonymous profiling & geographic affinities' },
  '/trends':      { title: 'Viral Forecasting',     subtitle: 'Epidemic R-score modeling & predictive trend alerts' },
  '/network':     { title: 'Network Topology',      subtitle: 'Force-directed graph, centrality & information cascades' },
  '/ai-insights': { title: 'AI 5-Vector Insights',  subtitle: 'Cross-cutting synthesis across data, sentiment, audience & graph' },
  '/alerts':      { title: 'Threat Alerts Matrix',  subtitle: 'Real-time anomaly detection, viral spikes & swarm audits' },
}

function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())
  const [health, setHealth] = useState(null)
  const [showExportModal, setShowExportModal] = useState(false)

  const activeAlertsCount = SYSTEM_ALERTS.filter(a => a.status === 'ACTIVE').length

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Check backend health on load
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://nexora-e196.onrender.com'
    fetch(`${apiBase}/health`)
      .then(r => r.json())
      .then(data => setHealth(data))
      .catch(() => setHealth(null))
  }, [])

  const pageInfo = PAGE_TITLES[location.pathname] ||
                   { title: 'NEXORA', subtitle: 'Intelligence Operations' }

  return (
    <>
      <header className="
        h-16 liquid-glass-strong border-b border-cyan-500/20
        flex items-center justify-between px-6
        flex-shrink-0 z-30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]
      ">
        {/* LEFT: Page Title & Mission Tag */}
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-white font-bold text-lg leading-tight tracking-wide">
              {pageInfo.title}
            </h2>
            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-lg bg-cyan-500/15 text-[#4cd7f6] border border-cyan-500/30 shadow-[0_0_10px_rgba(76,215,246,0.15)] font-bold">
              TELEMETRY LIVE
            </span>
          </div>
          <p className="text-xs text-[#8ea0b5] mt-0.5 hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>

        {/* RIGHT: Controls & Telemetry */}
        <div className="flex items-center gap-2">
          {/* Threat Alerts Notification Bell */}
          <button
            type="button"
            onClick={() => navigate('/alerts')}
            className="
              relative h-9 w-9 glass-control
              text-[#8ea0b5] hover:text-white cursor-pointer flex items-center justify-center flex-shrink-0
            "
            title={`${activeAlertsCount} active threat alerts`}
          >
            <span className="text-sm leading-none">🚨</span>
            {activeAlertsCount > 0 && (
              <span className="
                absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500
                text-white text-[9px] font-mono font-bold flex items-center justify-center
                shadow-[0_0_10px_#f43f5e] animate-pulse
              ">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Export Intelligence Dossier Button */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="
              hidden md:inline-flex items-center gap-1.5 h-9 px-3.5
              glass-btn-secondary text-[#4cd7f6] border-cyan-500/30
              text-xs font-mono font-bold uppercase tracking-wider
              cursor-pointer flex-shrink-0
            "
          >
            <span className="text-xs">📥</span>
            <span>Export Dossier</span>
          </button>

          {/* Backend Status Pill */}
          <div className={`
            hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-xl text-xs font-mono font-semibold flex-shrink-0 border
            ${health
              ? 'bg-emerald-500/15 text-[#4edea3] border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_12px_rgba(78,222,163,0.2)]'
              : 'bg-rose-500/15 text-[#f43f5e] border-rose-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_12px_rgba(244,63,94,0.2)]'
            }
          `}>
            <div className={`w-2 h-2 rounded-full ${health ? 'bg-[#4edea3] shadow-[0_0_8px_#4edea3]' : 'bg-[#f43f5e] shadow-[0_0_8px_#f43f5e]'} animate-pulse flex-shrink-0`} />
            <span>{health ? 'API CORE ONLINE' : 'STANDALONE MODE'}</span>
          </div>

          {/* Live Monospace Clock */}
          <div className="h-9 px-3 rounded-xl glass-control text-xs font-mono text-[#4cd7f6] flex items-center gap-1.5 flex-shrink-0">
            <span className="text-gray-500 hidden sm:inline">UTC</span>
            <span className="font-bold tracking-wider">{time.toLocaleTimeString()}</span>
          </div>
        </div>
      </header>

      {/* Export Report Modal */}
      <ReportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </>
  )
}

export default TopBar
