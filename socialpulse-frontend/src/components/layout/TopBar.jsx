/*
  TopBar.jsx
  ----------
  The top header bar shown on all pages.
  Features NEXORA-style glassmorphic telemetry console with live status,
  role-based access control (RBAC) switcher, threat alert badge, and report export.
*/

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthRole } from '../../context/AuthRoleContext'
import ReportExportModal from '../common/ReportExportModal'
import { SYSTEM_ALERTS } from '../../api/normalizedData'

// Map URL paths to page titles
const PAGE_TITLES = {
  '/':            { title: 'Command Center',        subtitle: 'Autonomous social media intelligence & threat telemetry' },
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
  const { role, setRole } = useAuthRole()
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
    fetch('http://127.0.0.1:8000/health')
      .then(r => r.json())
      .then(data => setHealth(data))
      .catch(() => setHealth(null))
  }, [])

  const pageInfo = PAGE_TITLES[location.pathname] ||
                   { title: 'NEXORA', subtitle: 'Intelligence Operations' }

  return (
    <>
      <header className="
        h-16 bg-[#060e20]/80 backdrop-blur-2xl border-b border-cyan-500/20
        flex items-center justify-between px-6
        flex-shrink-0 z-30 shadow-sm
      ">
        {/* LEFT: Page Title & Mission Tag */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-lg leading-tight tracking-wide">
              {pageInfo.title}
            </h2>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-[#4cd7f6] border border-cyan-500/30">
              TELEMETRY LIVE
            </span>
          </div>
          <p className="text-xs text-[#8ea0b5] mt-0.5 hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>

        {/* RIGHT: Controls & Telemetry */}
        <div className="flex items-center gap-2.5">
          {/* RBAC Role Selector Dropdown */}
          <div className="relative flex items-center">
            <select
              value={role.id}
              onChange={(e) => setRole(e.target.value)}
              className="
                bg-black/60 border border-cyan-500/30 text-xs font-mono font-bold
                rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#4cd7f6]
                cursor-pointer shadow-inner
              "
              title={role.description}
            >
              <option value="ADMIN">Role: ADMIN</option>
              <option value="ANALYST">Role: ANALYST</option>
              <option value="VIEWER">Role: VIEWER</option>
            </select>
          </div>

          {/* Threat Alerts Notification Bell */}
          <button
            type="button"
            onClick={() => navigate('/alerts')}
            className="
              relative p-2 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-500/40
              text-[#8ea0b5] hover:text-white transition-all cursor-pointer flex items-center justify-center
            "
            title={`${activeAlertsCount} active threat alerts`}
          >
            <span className="text-sm">🚨</span>
            {activeAlertsCount > 0 && (
              <span className="
                absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500
                text-white text-[9px] font-mono font-bold flex items-center justify-center
                shadow-[0_0_8px_#f43f5e] animate-pulse
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
              hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl
              bg-[#4cd7f6]/10 border border-cyan-500/30 hover:border-cyan-400 text-[#4cd7f6]
              text-xs font-mono font-bold uppercase tracking-wider transition-all
              shadow-sm hover:shadow-[0_0_12px_rgba(76,215,246,0.25)] cursor-pointer
            "
          >
            <span>📥</span>
            <span>Export Dossier</span>
          </button>

          {/* Backend Status Pill */}
          <div className={`
            hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold
            ${health
              ? 'bg-emerald-500/15 text-[#4edea3] border border-emerald-500/30 shadow-[0_0_12px_rgba(78,222,163,0.2)]'
              : 'bg-rose-500/15 text-[#f43f5e] border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
            }
          `}>
            <div className={`w-2 h-2 rounded-full ${health ? 'bg-[#4edea3] shadow-[0_0_8px_#4edea3]' : 'bg-[#f43f5e] shadow-[0_0_8px_#f43f5e]'} animate-pulse`} />
            <span>{health ? 'API CORE ONLINE' : 'STANDALONE MODE'}</span>
          </div>

          {/* Live Monospace Clock */}
          <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-cyan-500/20 text-xs font-mono text-[#4cd7f6] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] flex items-center gap-1.5">
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
