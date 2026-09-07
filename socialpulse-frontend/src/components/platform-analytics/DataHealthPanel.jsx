/*
  DataHealthPanel.jsx
  -------------------
  Per-platform data health monitor for Platform Analytics.
  Shows connection status, API/connector status, sync info, errors,
  records, latency, and data freshness from CONNECTOR_HEALTH.
*/

import React, { useMemo } from 'react'
import { CONNECTOR_HEALTH, PLATFORMS_CONFIG } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo.jsx'
import DataStatusBadge from './DataStatusBadge.jsx'

function getHealthStatus(conn) {
  if (conn.errorsCount > 5) return 'ERROR'
  if (conn.errorsCount > 2) return 'WARNING'
  if (conn.status === 'Connected') return 'HEALTHY'
  return 'OFFLINE'
}

function getDataFreshness(lastSync) {
  if (lastSync.includes('second')) return { label: 'Fresh', color: 'text-[#4edea3]' }
  if (lastSync.includes('minute') && parseInt(lastSync) <= 5) return { label: 'Recent', color: 'text-[#4edea3]' }
  if (lastSync.includes('minute')) return { label: 'Moderate', color: 'text-amber-300' }
  return { label: 'Stale', color: 'text-[#f43f5e]' }
}

function DataHealthPanel({ selectedPlatform = 'all' }) {
  const filteredConnectors = useMemo(() => {
    if (selectedPlatform === 'all') return CONNECTOR_HEALTH
    return CONNECTOR_HEALTH.filter(c => c.platform === selectedPlatform)
  }, [selectedPlatform])

  const totalReceived = filteredConnectors.reduce((acc, c) => acc + c.recordsReceived, 0)
  const totalProcessed = filteredConnectors.reduce((acc, c) => acc + c.recordsProcessed, 0)
  const totalErrors = filteredConnectors.reduce((acc, c) => acc + c.errorsCount, 0)
  const avgLatency = filteredConnectors.length > 0
    ? Math.round(filteredConnectors.reduce((acc, c) => acc + c.latencyMs, 0) / filteredConnectors.length)
    : 0
  const healthyCount = filteredConnectors.filter(c => getHealthStatus(c) === 'HEALTHY').length

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Health Status</div>
          <div className="text-lg font-extrabold font-mono text-[#4edea3] mt-0.5">
            {healthyCount}/{filteredConnectors.length}
          </div>
          <div className="text-[9px] font-mono text-[#8ea0b5]">HEALTHY</div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Records Received</div>
          <div className="text-lg font-extrabold font-mono text-[#4cd7f6] mt-0.5">
            {totalReceived.toLocaleString()}
          </div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Processed</div>
          <div className="text-lg font-extrabold font-mono text-[#4edea3] mt-0.5">
            {totalProcessed.toLocaleString()}
          </div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Errors</div>
          <div className={`text-lg font-extrabold font-mono mt-0.5 ${totalErrors > 0 ? 'text-amber-400' : 'text-[#4edea3]'}`}>
            {totalErrors}
          </div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3.5 text-center">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Avg Latency</div>
          <div className={`text-lg font-extrabold font-mono mt-0.5 ${avgLatency > 100 ? 'text-amber-400' : 'text-[#4edea3]'}`}>
            {avgLatency}ms
          </div>
        </div>
      </div>

      {/* Detailed Connector Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredConnectors.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-[#8ea0b5] font-mono text-xs liquid-glass rounded-2xl p-5">
            <div className="text-4xl mb-3">🔌</div>
            <p>No connector data available for the selected platform.</p>
          </div>
        ) : (
          filteredConnectors.map((conn) => {
            const health = getHealthStatus(conn)
            const freshness = getDataFreshness(conn.lastSync)

            return (
              <div
                key={conn.platform}
                className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden group"
              >
                <div className="glass-edge-top" />
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl liquid-glass-soft border border-white/15 flex items-center justify-center p-2">
                        <PlatformLogo platform={conn.platform} className="w-5 h-5" colored={true} />
                      </div>
                      <div>
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider">{conn.name}</h4>
                        <p className="text-[10px] font-mono text-[#8ea0b5] mt-0.5 truncate max-w-[240px]">{conn.endpoint}</p>
                      </div>
                    </div>
                    <DataStatusBadge status={health} size="lg" />
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 liquid-glass-soft border border-white/10 rounded-xl">
                      <span className="text-[10px] text-[#8ea0b5] block uppercase">Connection</span>
                      <span className="font-bold text-white text-sm">{conn.status}</span>
                    </div>
                    <div className="p-2.5 liquid-glass-soft border border-white/10 rounded-xl">
                      <span className="text-[10px] text-[#8ea0b5] block uppercase">Data Freshness</span>
                      <span className={`font-bold text-sm ${freshness.color}`}>{freshness.label}</span>
                    </div>
                    <div className="p-2.5 liquid-glass-soft border border-white/10 rounded-xl">
                      <span className="text-[10px] text-[#8ea0b5] block uppercase">Last Sync</span>
                      <span className="font-bold text-white text-sm">{conn.lastSync}</span>
                    </div>
                    <div className="p-2.5 liquid-glass-soft border border-white/10 rounded-xl">
                      <span className="text-[10px] text-[#8ea0b5] block uppercase">Latency</span>
                      <span className={`font-bold text-sm ${conn.latencyMs > 100 ? 'text-amber-400' : 'text-[#4edea3]'}`}>
                        {conn.latencyMs}ms
                      </span>
                    </div>
                    <div className="p-2.5 liquid-glass-soft border border-white/10 rounded-xl">
                      <span className="text-[10px] text-[#8ea0b5] block uppercase">Records Received</span>
                      <span className="font-bold text-[#4cd7f6] text-sm">{conn.recordsReceived.toLocaleString()}</span>
                    </div>
                    <div className="p-2.5 liquid-glass-soft border border-white/10 rounded-xl">
                      <span className="text-[10px] text-[#8ea0b5] block uppercase">Errors</span>
                      <span className={`font-bold text-sm ${conn.errorsCount > 0 ? 'text-amber-400' : 'text-[#4edea3]'}`}>
                        {conn.errorsCount}
                      </span>
                    </div>
                    <div className="p-2.5 liquid-glass-soft border border-white/10 rounded-xl">
                      <span className="text-[10px] text-[#8ea0b5] block uppercase">Rate Limit</span>
                      <span className="font-bold text-white text-sm">{conn.rateLimitRemaining}</span>
                    </div>
                    <div className="p-2.5 liquid-glass-soft border border-white/10 rounded-xl">
                      <span className="text-[10px] text-[#8ea0b5] block uppercase">Auth Mode</span>
                      <span className="font-bold text-white text-[10px] truncate block">{conn.authMode}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default DataHealthPanel
