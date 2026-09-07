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
    <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
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
              className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                activeCascadeId === casc.cascade_id
                  ? 'bg-cyan-500/20 text-[#4cd7f6] border-cyan-500/50 font-bold shadow-[0_0_10px_rgba(76,215,246,0.25)]'
                  : 'bg-black/30 text-[#8ea0b5] border-white/5 hover:text-white'
              }`}
            >
              {casc.topic.slice(0, 24)}...
            </button>
          ))}
        </div>
      </div>

      {/* Overview Strip */}
      <div className="bg-black/50 border border-white/5 rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
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
          <span className="text-[#4edea3] font-bold text-sm">{selectedCascade.totalReach}</span>
          <span className="text-[10px] text-[#8ea0b5] block mt-0.5">5 Cross-Platform Hops</span>
        </div>
        <div>
          <span className="text-[10px] text-[#8ea0b5] uppercase block">Reproduction R-Score</span>
          <span className="text-purple-300 font-bold text-sm">{selectedCascade.viralVelocityRScore} R</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">Status: {selectedCascade.status}</span>
        </div>
      </div>

      {/* Cascade Hop Path Steps */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#4cd7f6] via-[#ddb7ff] to-cyan-500/10">
        {selectedCascade.crossPlatformHops.map((hop) => (
          <div key={hop.step} className="relative group">
            {/* Step dot */}
            <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-[#060e20] border-2 border-cyan-400 flex items-center justify-center text-[8px] font-mono font-bold text-white shadow-[0_0_8px_rgba(76,215,246,0.6)]">
              {hop.step}
            </div>

            <div className="p-3.5 bg-black/40 border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0">
                  <PlatformLogo platform={hop.platform} className="w-5 h-5" colored={true} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-bold font-mono">
                      Hop {hop.step} · {hop.platform.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-[#4cd7f6]">
                      {hop.time}
                    </span>
                  </div>
                  <div className="text-xs text-[#dae2fd] mt-0.5 font-sans">
                    {hop.action}
                  </div>
                  <div className="text-[10px] font-mono text-[#8ea0b5] mt-0.5">
                    Amplifier Node: {hop.node}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center font-mono text-[10px]">
                <span className={`px-2 py-0.5 rounded border uppercase font-bold ${
                  hop.sentiment === 'positive'
                    ? 'bg-emerald-500/15 text-[#4edea3] border-emerald-500/30'
                    : hop.sentiment === 'negative'
                    ? 'bg-rose-500/15 text-[#f43f5e] border-rose-500/30'
                    : 'bg-cyan-500/15 text-[#4cd7f6] border-cyan-500/30'
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
