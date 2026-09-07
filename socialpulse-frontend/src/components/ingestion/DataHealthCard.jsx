/*
  DataHealthCard.jsx
  ------------------
  Data Health & Live Connector Status Monitor.
  Displays live connector status for:
  - X / Twitter v2 Streaming Connector (PRIORITY)
  - Telegram MTProto Channel Broadcast Ingester (PRIORITY)
  - Reddit PRAW Subreddit Poller
  - YouTube Data API v3 Ingester
  - Instagram Graph API Webhook
  - Meta Facebook Public Pages Feed
*/

import React from 'react'
import { CONNECTOR_HEALTH } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo'

function DataHealthCard() {
  const totalReceived = CONNECTOR_HEALTH.reduce((acc, c) => acc + c.recordsReceived, 0)
  const totalProcessed = CONNECTOR_HEALTH.reduce((acc, c) => acc + c.recordsProcessed, 0)
  const totalErrors = CONNECTOR_HEALTH.reduce((acc, c) => acc + c.errorsCount, 0)

  return (
    <div className="liquid-glass glass-edge-top p-5 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] shadow-[0_0_10px_#4edea3] animate-pulse" />
          <h3 className="text-white font-bold text-sm tracking-wider uppercase">
            🩺 Live Connector Telemetry & Health Monitor
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-[#8ea0b5]">TOTAL HEALTHY:</span>
          <span className="text-[#4edea3] font-bold">6 / 6 ONLINE</span>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Signals Ingested</div>
          <div className="text-base font-extrabold font-mono text-[#4cd7f6] mt-0.5">
            {totalReceived.toLocaleString()}
          </div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Signals Processed</div>
          <div className="text-base font-extrabold font-mono text-[#4edea3] mt-0.5">
            {totalProcessed.toLocaleString()}
          </div>
        </div>
        <div className="liquid-glass-soft border border-white/10 rounded-xl p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="text-[10px] font-mono text-[#8ea0b5] uppercase font-semibold">Dropped / Errored</div>
          <div className="text-base font-extrabold font-mono text-amber-400 mt-0.5">
            {totalErrors}
          </div>
        </div>
      </div>

      {/* Connectors List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {CONNECTOR_HEALTH.map((conn) => (
          <div
            key={conn.platform}
            className="p-3 liquid-glass-soft border border-white/10 hover:border-cyan-500/30 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
          >
            {/* Left Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <PlatformLogo platform={conn.platform} className="w-5 h-5" colored={true} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-bold truncate">
                    {conn.name}
                  </span>
                  {(conn.platform === 'twitter' || conn.platform === 'telegram') && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-[#4cd7f6] border border-cyan-500/30 font-bold">
                      CORE PRIORITY
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-[#8ea0b5] truncate mt-0.5">
                  {conn.endpoint} · {conn.authMode}
                </div>
              </div>
            </div>

            {/* Right Telemetry */}
            <div className="flex items-center gap-3 justify-between sm:justify-end text-[11px] font-mono">
              <div className="text-right">
                <div className="text-white font-bold">
                  {conn.recordsProcessed.toLocaleString()} recs
                </div>
                <div className="text-[10px] text-[#8ea0b5]">
                  sync {conn.lastSync}
                </div>
              </div>

              <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[#4edea3] text-[10px] font-bold flex items-center gap-1.5 shadow-[0_0_8px_rgba(78,222,163,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                {conn.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DataHealthCard
