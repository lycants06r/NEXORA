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
          <span className="text-xs font-mono text-[#f43f5e] px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 font-bold">
            {alerts.filter(a => a.status === 'ACTIVE').length} ACTIVE THREATS
          </span>
        </div>
      </PageHeader>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8ea0b5] uppercase">Critical Threats</span>
            <div className="text-2xl font-black text-[#f43f5e] mt-0.5">
              {alerts.filter(a => a.severity === 'CRITICAL').length}
            </div>
          </div>
          <span className="text-3xl">🔴</span>
        </div>

        <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8ea0b5] uppercase">Warning Spikes</span>
            <div className="text-2xl font-black text-amber-300 mt-0.5">
              {alerts.filter(a => a.severity === 'WARNING').length}
            </div>
          </div>
          <span className="text-3xl">⚠️</span>
        </div>

        <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8ea0b5] uppercase">Informational Telemetry</span>
            <div className="text-2xl font-black text-[#4cd7f6] mt-0.5">
              {alerts.filter(a => a.severity === 'INFO').length}
            </div>
          </div>
          <span className="text-3xl">ℹ️</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[#8ea0b5] text-[11px] mr-1">SEVERITY:</span>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverity(sev)}
              className={`px-3 py-1 rounded-xl uppercase transition-all border cursor-pointer ${
                severityFilter === sev
                  ? 'bg-cyan-500/20 text-[#4cd7f6] border-cyan-500/50 font-bold'
                  : 'bg-black/40 text-[#8ea0b5] border-white/5 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#8ea0b5] text-[11px] mr-1">STATUS:</span>
          {['ALL', 'ACTIVE', 'INVESTIGATING', 'ACKNOWLEDGED', 'RESOLVED'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatus(st)}
              className={`px-3 py-1 rounded-xl uppercase transition-all border cursor-pointer ${
                statusFilter === st
                  ? 'bg-purple-500/20 text-[#ddb7ff] border-purple-500/50 font-bold'
                  : 'bg-black/40 text-[#8ea0b5] border-white/5 hover:text-white'
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
          <div className="p-12 text-center bg-[#0a1329]/80 rounded-2xl border border-white/5 text-[#8ea0b5] font-mono">
            No alerts match current filter parameters.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.alert_id}
              className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-cyan-400/40 relative overflow-hidden"
            >
              <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold uppercase border ${severityStyles[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-[#8ea0b5] uppercase">
                    {alert.category}
                  </span>
                  <span className="text-xs font-mono text-[#4cd7f6] uppercase">
                    [{alert.platform}]
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[#8ea0b5]">{alert.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alert.status === 'ACTIVE'
                      ? 'bg-rose-500/15 text-[#f43f5e] border border-rose-500/30 animate-pulse'
                      : alert.status === 'RESOLVED'
                      ? 'bg-emerald-500/15 text-[#4edea3] border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5 font-sans">
                {alert.title}
              </h3>
              <p className="text-xs text-[#dae2fd] leading-relaxed mb-3 font-sans">
                {alert.description}
              </p>

              {/* Action Plan & Remediation */}
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between flex-wrap gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#8ea0b5]">
                  <span className="text-cyan-400 font-bold">Suggested Remediation:</span>
                  <span>{alert.suggested_action}</span>
                </div>

                {alert.status === 'ACTIVE' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAcknowledge(alert.alert_id)}
                      className="px-3 py-1 rounded-lg bg-black/60 border border-white/10 hover:border-cyan-400 text-[#4cd7f6] hover:text-white transition-all cursor-pointer"
                    >
                      Acknowledge
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolve(alert.alert_id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-[#4edea3] font-bold transition-all cursor-pointer"
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
