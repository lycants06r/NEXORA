/*
  AlertsPage.jsx
  --------------
  Threat & Anomaly Alerts Matrix.
  Alerts generated for:
  - Sudden sentiment changes
  - Rapid trend growth & viral spikes
  - Cross-platform topic spread
  - Key opinion leader activity
  - Data connector status & ingestion delays
  Severity levels: INFO · WARNING · CRITICAL
  Maintains NEXORA cyberpunk glassmorphic visual language.
*/

import React, { useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import PlatformLogo from '../components/common/PlatformLogo.jsx'
import { SYSTEM_ALERTS } from '../api/normalizedData'
import { useAuthRole } from '../context/AuthRoleContext'

function AlertsPage() {
  const { role } = useAuthRole()
  const [alerts, setAlerts]       = useState(SYSTEM_ALERTS)
  const [severityFilter, setSeverity] = useState('ALL')
  const [statusFilter, setStatus]     = useState('ALL')

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false
    return true
  })

  const handleAcknowledge = (id) => {
    if (!role.canResolveAlerts) {
      alert(`Access Restricted: Your current role (${role.badge}) is read-only. Switch to ADMIN or ANALYST in the TopBar to resolve alerts.`)
      return
    }
    setAlerts(prev => prev.map(a => a.alert_id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
  }

  const handleResolve = (id) => {
    if (!role.canResolveAlerts) {
      alert(`Access Restricted: Your current role (${role.badge}) is read-only. Switch to ADMIN or ANALYST in the TopBar to resolve alerts.`)
      return
    }
    setAlerts(prev => prev.map(a => a.alert_id === id ? { ...a, status: 'RESOLVED' } : a))
  }

  const severityStyles = {
    CRITICAL: 'bg-rose-500/20 text-[#f43f5e] border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    WARNING:  'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    INFO:     'bg-cyan-500/20 text-[#4cd7f6] border-cyan-500/50 shadow-[0_0_12px_rgba(76,215,246,0.2)]',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        emoji="🚨"
        title="Cognitive Threat & Anomaly Alerts Matrix"
        subtitle="Autonomous threshold triggers: sentiment shocks, astroturfing swarms, viral spikes & connector telemetry"
      >
        <div className="flex items-center gap-2">
          <span className="h-9 px-3.5 inline-flex items-center text-xs font-mono text-[#f43f5e] rounded-xl bg-rose-500/10 border border-rose-500/30 font-bold shadow-[0_0_10px_rgba(244,63,94,0.15)]">
            {alerts.filter(a => a.status === 'ACTIVE').length} ACTIVE THREATS
          </span>
        </div>
      </PageHeader>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="liquid-glass-interactive glass-specular-edge border border-rose-500/35 rounded-2xl p-5 flex items-center justify-between hover:border-rose-400/60 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(244,63,94,0.15)] relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/20 transition-all" />
          <div className="relative z-10">
            <span className="text-[10px] text-[#8ea0b5] uppercase tracking-wider font-semibold">Critical Threats</span>
            <div className="text-3xl font-black text-[#f43f5e] mt-1 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
              {alerts.filter(a => a.severity === 'CRITICAL').length}
            </div>
          </div>
          <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform">🔴</span>
        </div>

        <div className="liquid-glass-interactive glass-specular-edge border border-amber-500/35 rounded-2xl p-5 flex items-center justify-between hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(245,158,11,0.15)] relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
          <div className="relative z-10">
            <span className="text-[10px] text-[#8ea0b5] uppercase tracking-wider font-semibold">Warning Spikes</span>
            <div className="text-3xl font-black text-amber-300 mt-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
              {alerts.filter(a => a.severity === 'WARNING').length}
            </div>
          </div>
          <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform">⚠️</span>
        </div>

        <div className="liquid-glass-interactive glass-specular-edge border border-cyan-500/35 rounded-2xl p-5 flex items-center justify-between hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(76,215,246,0.15)] relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />
          <div className="relative z-10">
            <span className="text-[10px] text-[#8ea0b5] uppercase tracking-wider font-semibold">Informational Telemetry</span>
            <div className="text-3xl font-black text-[#4cd7f6] mt-1 drop-shadow-[0_0_8px_rgba(76,215,246,0.4)]">
              {alerts.filter(a => a.severity === 'INFO').length}
            </div>
          </div>
          <span className="text-3xl relative z-10 group-hover:scale-110 transition-transform">ℹ️</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[#8ea0b5] text-[11px] font-bold mr-1">SEVERITY:</span>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverity(sev)}
              className={`h-8 px-3.5 rounded-xl uppercase tracking-wider transition-all border cursor-pointer font-semibold hover:scale-102 active:scale-95 ${
                severityFilter === sev
                  ? 'liquid-glass text-[#4cd7f6] border-cyan-400/50 font-bold shadow-[0_0_15px_rgba(76,215,246,0.3)]'
                  : 'liquid-glass-subtle text-[#8ea0b5] border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#8ea0b5] text-[11px] font-bold mr-1">STATUS:</span>
          {['ALL', 'ACTIVE', 'INVESTIGATING', 'ACKNOWLEDGED', 'RESOLVED'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatus(st)}
              className={`h-8 px-3.5 rounded-xl uppercase tracking-wider transition-all border cursor-pointer font-semibold hover:scale-102 active:scale-95 ${
                statusFilter === st
                  ? 'liquid-glass text-[#ddb7ff] border-purple-500/50 font-bold shadow-[0_0_15px_rgba(221,183,255,0.3)]'
                  : 'liquid-glass-subtle text-[#8ea0b5] border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center liquid-glass-subtle rounded-2xl border border-white/10 text-[#8ea0b5] font-mono">
            No alerts match current filter parameters.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.alert_id}
              className="liquid-glass-strong glass-specular-edge border border-cyan-500/25 rounded-2xl p-6 shadow-[0_15px_45px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative overflow-hidden"
            >
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3 relative z-10">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold uppercase border liquid-glass ${severityStyles[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-[#8ea0b5] uppercase liquid-glass-subtle border border-white/10 px-2.5 py-0.5 rounded-lg">
                    {alert.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg liquid-glass border border-cyan-400/30 text-[#4cd7f6] text-xs font-mono font-semibold uppercase">
                    <PlatformLogo platform={alert.platform} className="w-3.5 h-3.5" colored={true} />
                    <span>{alert.platform}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[#8ea0b5]">{alert.timestamp}</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase liquid-glass border ${
                    alert.status === 'ACTIVE'
                      ? 'text-[#f43f5e] border-rose-500/40 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                      : alert.status === 'RESOLVED'
                      ? 'text-[#4edea3] border-emerald-500/40 shadow-[0_0_8px_rgba(78,222,163,0.3)]'
                      : 'text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-2 font-sans relative z-10 tracking-wide">
                {alert.title}
              </h3>
              <p className="text-xs text-[#dae2fd] leading-relaxed mb-4 font-sans relative z-10">
                {alert.description}
              </p>

              {/* Action Plan & Remediation */}
              <div className="p-3.5 liquid-glass-subtle rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-3 text-xs font-mono relative z-10">
                <div className="flex items-center gap-2 text-[#8ea0b5]">
                  <span className="text-cyan-400 font-bold">Suggested Remediation:</span>
                  <span className="text-white font-medium">{alert.suggested_action}</span>
                </div>

                {alert.status === 'ACTIVE' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAcknowledge(alert.alert_id)}
                      className="h-8 px-3.5 rounded-xl liquid-glass border border-white/15 hover:border-cyan-400/50 text-[#4cd7f6] hover:text-white font-semibold transition-all cursor-pointer flex items-center hover:scale-102 active:scale-95"
                    >
                      Acknowledge
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolve(alert.alert_id)}
                      className="h-8 px-4 rounded-xl liquid-glass border border-emerald-500/40 text-[#4edea3] font-bold transition-all cursor-pointer flex items-center shadow-[0_0_12px_rgba(78,222,163,0.25)] hover:scale-102 active:scale-95 hover:border-emerald-400"
                    >
                      Resolve Alert
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AlertsPage
