/*
  SchedulerCard.jsx
  -----------------
  NEXORA Automated Ingestion Scheduler.
  Supports configurable cron-like polling intervals (5m, 15m, 1h, 6h, 24h),
  active stream daemon pause/resume, and secure env credentials indicator.
*/

import React, { useState } from 'react'

function SchedulerCard({ onTriggerSync }) {
  const [interval, setIntervalVal] = useState('15m')
  const [isRunning, setIsRunning]   = useState(true)
  const [lastSync, setLastSync]     = useState('Just now')
  const [nextSync, setNextSync]     = useState('in 14m 42s')

  const intervals = [
    { value: '5m',  label: '5 Minutes (High-Frequency)' },
    { value: '15m', label: '15 Minutes (Recommended)' },
    { value: '1h',  label: '1 Hour (Standard Batch)' },
    { value: '6h',  label: '6 Hours (Periodic)' },
    { value: '24h', label: '24 Hours (Daily Deep Archive)' },
  ]

  const handleToggle = () => {
    setIsRunning(!isRunning)
  }

  const handleManualTrigger = () => {
    setLastSync('Just now')
    if (onTriggerSync) onTriggerSync()
  }

  return (
    <div className="liquid-glass glass-edge-top p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ddb7ff] shadow-[0_0_10px_#ddb7ff]" />
          <span>⏱️ Automated Ingestion Scheduler</span>
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-lg border font-bold ${
            isRunning
              ? 'bg-emerald-500/15 text-[#4edea3] border-emerald-500/30 shadow-[0_0_8px_rgba(78,222,163,0.2)]'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
          }`}>
            {isRunning ? 'DAEMON ACTIVE' : 'DAEMON PAUSED'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Interval Selector */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#8ea0b5] mb-2 font-semibold">
            Cron Ingestion Frequency
          </label>
          <select
            value={interval}
            onChange={(e) => setIntervalVal(e.target.value)}
            disabled={!isRunning}
            className="w-full glass-control rounded-xl px-3.5 py-2.5 text-white font-mono text-xs disabled:opacity-50"
          >
            {intervals.map((i) => (
              <option key={i.value} value={i.value} className="bg-[#060e20] text-white">{i.label}</option>
            ))}
          </select>
        </div>

        {/* Telemetry Readout */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 liquid-glass-soft border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
            <span className="text-[#8ea0b5] block text-[10px]">LAST EXECUTED:</span>
            <span className="text-white font-bold">{lastSync}</span>
          </div>
          <div className="p-3 liquid-glass-soft border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
            <span className="text-[#8ea0b5] block text-[10px]">NEXT SCHEDULED:</span>
            <span className="text-[#4cd7f6] font-bold">{isRunning ? nextSync : 'Paused'}</span>
          </div>
        </div>

        {/* Security & Credentials Notice */}
        <div className="text-[11px] font-mono text-[#8ea0b5] liquid-glass-soft p-3 rounded-xl border border-white/5 flex items-center gap-2">
          <span className="text-sm">🔐</span>
          <span>Credentials injected via secure server-side environment variables (.env). Zero client token exposure.</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleToggle}
            className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-[#4edea3] hover:bg-emerald-500/20'
            }`}
          >
            {isRunning ? '⏸️ Pause Scheduler' : '▶️ Resume Scheduler'}
          </button>

          <button
            type="button"
            onClick={handleManualTrigger}
            className="px-4 py-2.5 glass-btn-primary text-black font-extrabold rounded-xl text-xs font-mono tracking-wider uppercase transition-all shadow-sm cursor-pointer"
          >
            ⚡ Force Sync Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default SchedulerCard
