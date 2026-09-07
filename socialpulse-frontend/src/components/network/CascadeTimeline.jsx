/*
  CascadeTimeline.jsx
  -------------------
  NEXORA Information Cascade & Propagation Spread Visualization.
  Shows how a viral topic propagates between nodes and platforms over time.
  Features:
  - Origin node, detection time, and reach
  - Sequential cross-platform propagation hops (Step, Time delta, Node, Action, Sentiment)
  - Epidemic reproduction rate (R-Score)
  - Community cluster transitions
*/

import React, { useState } from 'react'
import { INFORMATION_CASCADES } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo.jsx'

function CascadeTimeline() {
  const [activeCascadeId, setActiveCascadeId] = useState(INFORMATION_CASCADES[0]?.cascade_id)

  const selectedCascade = INFORMATION_CASCADES.find(c => c.cascade_id === activeCascadeId) || INFORMATION_CASCADES[0]

  return (
    <div className="liquid-glass-strong glass-specular-edge border border-cyan-500/25 rounded-2xl p-6 shadow-[0_15px_45px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3 relative z-10">
        <div>
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6]" />
            🌊 Information Cascade & Cross-Platform Spread Timeline
          </h3>
          <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
            Tracing chronological propagation hops, key opinion amplifiers & community transitions
          </p>
        </div>

        {/* Cascade Selector */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {INFORMATION_CASCADES.map((casc) => (
            <button
              key={casc.cascade_id}
              onClick={() => setActiveCascadeId(casc.cascade_id)}
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer hover:scale-102 active:scale-95 ${
                activeCascadeId === casc.cascade_id
                  ? 'liquid-glass text-[#4cd7f6] border-cyan-400/50 font-bold shadow-[0_0_15px_rgba(76,215,246,0.3)]'
                  : 'liquid-glass-subtle text-[#8ea0b5] border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              {casc.topic.slice(0, 24)}...
            </button>
          ))}
        </div>
      </div>

      {/* Overview Strip */}
      <div className="liquid-glass-subtle border border-white/10 rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono shadow-inner relative z-10">
        <div>
          <span className="text-[10px] text-[#8ea0b5] uppercase block">Topic Origin</span>
          <span className="text-white font-bold">{selectedCascade.origin.platform.toUpperCase()}</span>
          <span className="text-[10px] text-[#8ea0b5] block truncate mt-0.5">{selectedCascade.origin.node}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#8ea0b5] uppercase block">First Ingestion</span>
          <span className="text-[#4cd7f6] font-bold">
            {new Date(selectedCascade.origin.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
          </span>
          <span className="text-[10px] text-[#8ea0b5] block mt-0.5">Initial Reach: {selectedCascade.origin.reach}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#8ea0b5] uppercase block">Total Cascade Reach</span>
          <span className="text-[#4edea3] font-bold text-sm drop-shadow-[0_0_4px_rgba(78,222,163,0.3)]">{selectedCascade.totalReach}</span>
          <span className="text-[10px] text-[#8ea0b5] block mt-0.5">5 Cross-Platform Hops</span>
        </div>
        <div>
          <span className="text-[10px] text-[#8ea0b5] uppercase block">Reproduction R-Score</span>
          <span className="text-purple-300 font-bold text-sm drop-shadow-[0_0_4px_rgba(221,183,255,0.3)]">{selectedCascade.viralVelocityRScore} R</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Status: {selectedCascade.status}</span>
        </div>
      </div>

      {/* Cascade Hop Path Steps */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#4cd7f6] via-[#ddb7ff] to-cyan-500/10 relative z-10">
        {selectedCascade.crossPlatformHops.map((hop) => (
          <div key={hop.step} className="relative group">
            {/* Step dot */}
            <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-[#060e20] border-2 border-cyan-400 flex items-center justify-center text-[8px] font-mono font-bold text-white shadow-[0_0_10px_rgba(76,215,246,0.8)]">
              {hop.step}
            </div>

            <div className="p-4 liquid-glass-subtle border border-white/10 hover:border-cyan-400/50 rounded-xl transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl liquid-glass border border-white/10 flex items-center justify-center p-2 shrink-0 group-hover:border-cyan-400/40 transition-colors">
                  <PlatformLogo platform={hop.platform} className="w-5 h-5" colored={true} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-bold font-mono">
                      Hop {hop.step} · {hop.platform.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-[#4cd7f6] font-semibold">
                      {hop.time}
                    </span>
                  </div>
                  <div className="text-xs text-[#dae2fd] mt-0.5 font-sans">
                    {hop.action}
                  </div>
                  <div className="text-[10px] font-mono text-[#8ea0b5] mt-0.5">
                    Amplifier Node: <strong className="text-white">{hop.node}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center font-mono text-[10px]">
                <span className={`px-2.5 py-1 rounded-lg border uppercase font-bold liquid-glass ${
                  hop.sentiment === 'positive'
                    ? 'text-[#4edea3] border-emerald-500/35 shadow-[0_0_8px_rgba(78,222,163,0.2)]'
                    : hop.sentiment === 'negative'
                    ? 'text-[#f43f5e] border-rose-500/35 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                    : 'text-[#4cd7f6] border-cyan-500/35 shadow-[0_0_8px_rgba(76,215,246,0.2)]'
                }`}>
                  {hop.emotion || hop.sentiment}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CascadeTimeline
