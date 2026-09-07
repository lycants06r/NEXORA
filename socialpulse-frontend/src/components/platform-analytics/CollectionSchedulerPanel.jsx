/*
  CollectionSchedulerPanel.jsx
  ----------------------------
  Collection scheduler for Platform Analytics.
  Displays collection status, schedule, and controls.
  Uses existing triggerCollection API. Shows unavailable state if backend is offline.
*/

import React, { useState, useEffect, useMemo } from 'react'
import { CONNECTOR_HEALTH, PLATFORMS_CONFIG } from '../../api/normalizedData'
import { triggerCollection, checkHealth } from '../../api/ingestionApi'
import PlatformLogo from '../common/PlatformLogo.jsx'
import DataStatusBadge from './DataStatusBadge.jsx'

const FREQUENCIES = [
  { value: '5m',  label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '1h',  label: '1 Hour' },
  { value: '6h',  label: '6 Hours' },
  { value: '24h', label: '24 Hours' },
]

function CollectionSchedulerPanel({ selectedPlatform = 'all' }) {
  const [backendAvailable, setBackendAvailable] = useState(null) // null=checking, true, false
  const [isCollecting, setIsCollecting] = useState(false)
  const [schedulerEnabled, setSchedulerEnabled] = useState(true)
  const [frequency, setFrequency] = useState('15m')
  const [lastCollectResult, setLastCollectResult] = useState(null)

  useEffect(() => {
    checkBackend()
  }, [])

  async function checkBackend() {
    try {
      await checkHealth()
      setBackendAvailable(true)
    } catch {
      setBackendAvailable(false)
    }
  }

  async function handleCollectNow(platform) {
    setIsCollecting(true)
    setLastCollectResult(null)
    try {
      const res = await triggerCollection(platform, 'analytics_collect', 50)
      setLastCollectResult({ success: true, data: res.data })
    } catch {
      setLastCollectResult({ success: false, error: 'Backend unavailable or collection failed.' })
    } finally {
      setIsCollecting(false)
    }
  }

  // Filter connectors
  const connectors = useMemo(() => {
    if (selectedPlatform === 'all') return CONNECTOR_HEALTH
    return CONNECTOR_HEALTH.filter(c => c.platform === selectedPlatform)
  }, [selectedPlatform])

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Backend Status Banner */}
      {backendAvailable === false && (
        <div className="liquid-glass-soft border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-amber-300 text-xs font-mono font-bold uppercase">Scheduler Backend Not Connected</p>
            <p className="text-[#8ea0b5] text-[11px] font-mono mt-0.5">
              Collection controls are visible but scheduler functionality requires a running backend. Start the API server to enable.
            </p>
          </div>
          <button onClick={checkBackend} className="ml-auto px-3 py-1.5 glass-btn-secondary rounded-lg text-[10px] font-mono font-bold uppercase cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Scheduler Control Card */}
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 relative z-10">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ddb7ff] shadow-[0_0_10px_#ddb7ff]" />
            ⏱️ Collection Scheduler
          </h3>
          <DataStatusBadge
            status={backendAvailable === null ? 'CONNECTING' : backendAvailable ? (schedulerEnabled ? 'HEALTHY' : 'WARNING') : 'NOT_CONNECTED'}
            label={backendAvailable === null ? 'Checking...' : backendAvailable ? (schedulerEnabled ? 'Active' : 'Paused') : 'Unavailable'}
            size="sm"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
          {/* Left: Controls */}
          <div className="space-y-3">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-3 liquid-glass-soft border border-white/10 rounded-xl">
              <span className="text-xs font-mono text-[#8ea0b5] uppercase font-semibold">Scheduler Enabled</span>
              <button
                type="button"
                onClick={() => setSchedulerEnabled(!schedulerEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                  schedulerEnabled
                    ? 'bg-[#4edea3]/30 border border-[#4edea3]/50'
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full transition-all absolute top-0.5 ${
                  schedulerEnabled
                    ? 'bg-[#4edea3] left-6 shadow-[0_0_8px_rgba(78,222,163,0.5)]'
                    : 'bg-[#8ea0b5] left-0.5'
                }`} />
              </button>
            </div>

            {/* Frequency Selector */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8ea0b5] mb-1.5 font-semibold">
                Collection Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                disabled={!schedulerEnabled}
                className="w-full glass-control rounded-xl px-3 py-2.5 text-white font-mono text-xs disabled:opacity-50"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value} className="bg-[#060e20] text-white">{f.label}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleCollectNow(selectedPlatform === 'all' ? 'twitter' : selectedPlatform)}
                disabled={isCollecting}
                className="flex-1 py-2.5 glass-btn-primary rounded-xl text-xs font-mono font-bold tracking-wider uppercase cursor-pointer disabled:opacity-50"
              >
                {isCollecting ? '⏳ Collecting...' : '⚡ Collect Now'}
              </button>
              <button
                type="button"
                onClick={checkBackend}
                className="px-4 py-2.5 glass-btn-secondary rounded-xl text-xs font-mono font-bold tracking-wider uppercase cursor-pointer"
              >
                🔄 Refresh
              </button>
            </div>

            {/* Last Result */}
            {lastCollectResult && (
              <div className={`p-3 rounded-xl border text-xs font-mono ${
                lastCollectResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-[#4edea3]'
                  : 'bg-rose-500/10 border-rose-500/30 text-[#f43f5e]'
              }`}>
                {lastCollectResult.success
                  ? '✅ Collection triggered successfully.'
                  : `❌ ${lastCollectResult.error}`}
              </div>
            )}
          </div>

          {/* Right: Per-Platform Status Grid */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {connectors.map((conn) => (
              <div
                key={conn.platform}
                className="p-3 liquid-glass-soft border border-white/10 hover:border-cyan-500/20 rounded-xl transition-all flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PlatformLogo platform={conn.platform} className="w-4 h-4" colored={true} />
                  <div className="min-w-0">
                    <div className="text-white text-[11px] font-bold truncate">{conn.name}</div>
                    <div className="text-[10px] font-mono text-[#8ea0b5]">
                      Last: {conn.lastSync} · {conn.recordsProcessed.toLocaleString()} records
                    </div>
                  </div>
                </div>
                <DataStatusBadge status="CONNECTED" label={schedulerEnabled ? 'Scheduled' : 'Paused'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionSchedulerPanel
