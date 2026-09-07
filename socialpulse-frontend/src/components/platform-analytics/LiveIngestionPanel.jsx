/*
  LiveIngestionPanel.jsx
  ----------------------
  Live data ingestion area for Platform Analytics.
  Shows connection status, live indicator, last data timestamp,
  ingestion activity, counters, reconnect control, and activity feed.
  Uses real data from CONNECTOR_HEALTH and NORMALIZED_RECORDS.
*/

import React, { useState, useEffect, useMemo } from 'react'
import { CONNECTOR_HEALTH, NORMALIZED_RECORDS, PLATFORMS_CONFIG } from '../../api/normalizedData'
import { checkHealth } from '../../api/ingestionApi'
import PlatformLogo from '../common/PlatformLogo.jsx'
import DataStatusBadge from './DataStatusBadge.jsx'

function LiveIngestionPanel({ selectedPlatform = 'all' }) {
  const [backendStatus, setBackendStatus] = useState('CHECKING') // CHECKING, ONLINE, OFFLINE
  const [isReconnecting, setIsReconnecting] = useState(false)

  // Check backend health on mount
  useEffect(() => {
    checkBackend()
  }, [])

  async function checkBackend() {
    setIsReconnecting(true)
    try {
      await checkHealth()
      setBackendStatus('ONLINE')
    } catch {
      setBackendStatus('OFFLINE')
    } finally {
      setIsReconnecting(false)
    }
  }

  // Filter connectors by selected platform
  const filteredConnectors = useMemo(() => {
    if (selectedPlatform === 'all') return CONNECTOR_HEALTH
    return CONNECTOR_HEALTH.filter(c => c.platform === selectedPlatform)
  }, [selectedPlatform])

  // Filter recent activity from NORMALIZED_RECORDS
  const recentActivity = useMemo(() => {
    let records = [...NORMALIZED_RECORDS]
    if (selectedPlatform !== 'all') {
      records = records.filter(r => r.platform === selectedPlatform)
    }
    return records
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
  }, [selectedPlatform])

  // Aggregate totals
  const totalReceived = filteredConnectors.reduce((acc, c) => acc + c.recordsReceived, 0)
  const totalProcessed = filteredConnectors.reduce((acc, c) => acc + c.recordsProcessed, 0)
  const totalErrors = filteredConnectors.reduce((acc, c) => acc + c.errorsCount, 0)

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Status Banner */}
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden group">
        <div className="glass-edge-top" />
        <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl liquid-glass-soft border border-emerald-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(78,222,163,0.2)]">
              <span className="text-xl">📡</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                Live Data Ingestion Monitor
                <DataStatusBadge
                  status={backendStatus === 'ONLINE' ? 'LIVE' : backendStatus === 'CHECKING' ? 'CONNECTING' : 'DISCONNECTED'}
                  size="sm"
                />
              </h3>
              <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
                {selectedPlatform === 'all'
                  ? 'Monitoring all 6 platform connectors'
                  : `Monitoring ${PLATFORMS_CONFIG.find(p => p.id === selectedPlatform)?.label || selectedPlatform}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={checkBackend}
            disabled={isReconnecting}
            className="h-9 px-4 glass-btn-secondary rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isReconnecting ? '⏳ Checking...' : '🔄 Reconnect'}
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Connectors Active</div>
          <div className="text-lg font-extrabold font-mono text-[#4edea3] mt-0.5">
            {filteredConnectors.length}
          </div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Signals Received</div>
          <div className="text-lg font-extrabold font-mono text-[#4cd7f6] mt-0.5">
            {totalReceived.toLocaleString()}
          </div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Signals Processed</div>
          <div className="text-lg font-extrabold font-mono text-[#4edea3] mt-0.5">
            {totalProcessed.toLocaleString()}
          </div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Errors / Dropped</div>
          <div className="text-lg font-extrabold font-mono text-amber-400 mt-0.5">
            {totalErrors}
          </div>
        </div>
      </div>

      {/* Connector Status Grid */}
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />
        <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3 flex items-center gap-2 relative z-10">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] cyan-pulse" />
          Platform Connector Status
        </h4>
        <div className="space-y-2 relative z-10">
          {filteredConnectors.length === 0 ? (
            <div className="text-center py-8 text-[#8ea0b5] font-mono text-xs">
              <div className="text-3xl mb-2">📭</div>
              <p>No connectors match the selected platform.</p>
            </div>
          ) : (
            filteredConnectors.map((conn) => (
              <div
                key={conn.platform}
                className="p-3 liquid-glass-soft border border-white/10 hover:border-cyan-500/30 rounded-xl transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0">
                    <PlatformLogo platform={conn.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-xs font-bold truncate">{conn.name}</div>
                    <div className="text-[10px] font-mono text-[#8ea0b5] truncate mt-0.5">
                      Last sync: {conn.lastSync} · Latency: {conn.latencyMs}ms
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-white font-bold text-[11px] font-mono">
                      {conn.recordsReceived.toLocaleString()} signals
                    </div>
                    <div className="text-[10px] text-[#8ea0b5] font-mono">
                      Rate limit: {conn.rateLimitRemaining}
                    </div>
                  </div>
                  <DataStatusBadge status="CONNECTED" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Real-Time Activity Feed */}
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />
        <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-3 flex items-center gap-2 relative z-10">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] live-pulse" />
          Recent Ingested Activity
        </h4>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 relative z-10">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-[#8ea0b5] font-mono text-xs">
              <div className="text-3xl mb-2">📭</div>
              <p>No live data available for this platform.</p>
            </div>
          ) : (
            recentActivity.map((item) => (
              <div
                key={item.post_id}
                className="p-3 liquid-glass-soft border border-white/10 hover:border-cyan-500/20 rounded-xl transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <PlatformLogo platform={item.platform} className="w-3 h-3" colored={true} />
                    <span className="text-[11px] font-mono font-bold text-white">{item.author_name}</span>
                    <span className={`text-[9px] font-mono px-1 py-0.5 rounded border font-bold uppercase ${
                      item.sentiment === 'positive' ? 'bg-emerald-500/10 text-[#4edea3] border-emerald-500/30'
                      : item.sentiment === 'negative' ? 'bg-rose-500/10 text-[#f43f5e] border-rose-500/30'
                      : 'bg-cyan-500/10 text-[#4cd7f6] border-cyan-500/30'
                    }`}>
                      {item.emotion || item.sentiment}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8ea0b5]">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-[#dae2fd] line-clamp-1 font-sans">{item.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveIngestionPanel
