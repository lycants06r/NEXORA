/*
  CrossPlatformTrendComparison.jsx
  --------------------------------
  Cross-Platform Trend Velocity & Dominance Comparison Matrix.
  Displays top trending topics across X, Telegram, Instagram, Facebook, Reddit, and YouTube
  to identify platform-specific conversation leaders and cross-network viral migration.
*/

import React, { useState } from 'react'
import PlatformLogo from '../common/PlatformLogo'

const CROSS_PLATFORM_TRENDS = [
  {
    topic: 'AI Governance & Safety Frameworks',
    dominantPlatform: 'twitter',
    secondaryPlatform: 'telegram',
    crossPlatformVelocity: '+34.8%',
    migrationPath: 'X → Telegram → YouTube',
    postVolume: 184500,
    rScore: 3.42,
    platformShare: { twitter: 45, telegram: 25, reddit: 15, youtube: 15 },
  },
  {
    topic: 'Autonomous Multi-Agent Architecture',
    dominantPlatform: 'youtube',
    secondaryPlatform: 'twitter',
    crossPlatformVelocity: '+26.5%',
    migrationPath: 'YouTube → X → Reddit',
    postVolume: 112000,
    rScore: 2.85,
    platformShare: { youtube: 40, twitter: 35, reddit: 25 },
  },
  {
    topic: 'Critical Infrastructure Disinformation Spike',
    dominantPlatform: 'telegram',
    secondaryPlatform: 'facebook',
    crossPlatformVelocity: '-12.4%',
    migrationPath: 'Telegram → X → Facebook',
    postVolume: 98000,
    rScore: 0.95,
    platformShare: { telegram: 55, facebook: 25, twitter: 20 },
  },
  {
    topic: 'Renewable Clean Energy Transition',
    dominantPlatform: 'instagram',
    secondaryPlatform: 'facebook',
    crossPlatformVelocity: '+18.2%',
    migrationPath: 'Instagram → Facebook → YouTube',
    postVolume: 76400,
    rScore: 1.40,
    platformShare: { instagram: 42, facebook: 38, youtube: 20 },
  },
  {
    topic: 'Algorithmic Credit Model Bias',
    dominantPlatform: 'reddit',
    secondaryPlatform: 'twitter',
    crossPlatformVelocity: '+42.1%',
    migrationPath: 'Reddit → X → Telegram',
    postVolume: 62000,
    rScore: 2.10,
    platformShare: { reddit: 50, twitter: 32, telegram: 18 },
  },
]

function CrossPlatformTrendComparison() {
  const [selectedTopic, setSelectedTopic] = useState(CROSS_PLATFORM_TRENDS[0].topic)

  const activeTrend = CROSS_PLATFORM_TRENDS.find((t) => t.topic === selectedTopic) || CROSS_PLATFORM_TRENDS[0]

  return (
    <div className="liquid-glass rounded-2xl p-6 shadow-glass-card relative overflow-hidden group">
      <div className="glass-edge-top" />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 relative z-10">
        <div>
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ddb7ff] shadow-[0_0_8px_#ddb7ff]" />
            🌐 Cross-Platform Viral Migration & Platform Dominance Matrix
          </h3>
          <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
            Identify which social channel originates a trend and how it propagates across platforms
          </p>
        </div>

        <span className="text-[11px] font-mono text-[#ddb7ff] px-2.5 py-1 rounded-xl liquid-glass-soft border border-purple-500/30 font-bold">
          EPIDEMIC NOVELTY ENGINE
        </span>
      </div>

      {/* Topic Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 relative z-10">
        {CROSS_PLATFORM_TRENDS.map((t) => (
          <button
            key={t.topic}
            onClick={() => setSelectedTopic(t.topic)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              selectedTopic === t.topic
                ? 'bg-purple-500/25 text-[#ddb7ff] border border-purple-500/50 font-bold shadow-[0_0_12px_rgba(221,183,255,0.25)]'
                : 'glass-control text-[#8ea0b5] hover:text-white'
            }`}
          >
            <PlatformLogo platform={t.dominantPlatform} className="w-3.5 h-3.5" colored={true} />
            <span className="truncate max-w-[180px]">{t.topic}</span>
          </button>
        ))}
      </div>

      {/* Selected Trend Detailed Breakdown Card */}
      <div className="liquid-glass-soft border border-white/10 rounded-xl p-5 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Migration & Stats */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#8ea0b5] font-bold block mb-1">
              Active Focus Entity:
            </span>
            <h4 className="text-white font-bold text-base font-sans">{activeTrend.topic}</h4>
          </div>

          <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#8ea0b5]">Volume:</span>
              <span className="text-white font-bold">{activeTrend.postVolume.toLocaleString()} posts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8ea0b5]">24h Velocity:</span>
              <span className={`font-bold ${activeTrend.crossPlatformVelocity.startsWith('+') ? 'text-[#4edea3]' : 'text-rose-400'}`}>
                {activeTrend.crossPlatformVelocity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8ea0b5]">Epidemic R-Score:</span>
              <span className="text-[#4cd7f6] font-bold">{activeTrend.rScore}</span>
            </div>
          </div>

          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-xs font-mono">
            <span className="text-[#ddb7ff] font-bold block mb-1">Observed Migration Path:</span>
            <span className="text-white font-bold">{activeTrend.migrationPath}</span>
          </div>
        </div>

        {/* Center & Right Column: Platform Share Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-mono uppercase text-[#8ea0b5] font-bold block">
            Platform Signal Share Distribution:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(activeTrend.platformShare).map(([plat, share]) => (
              <div key={plat} className="p-3.5 liquid-glass border border-white/10 rounded-xl text-center">
                <div className="flex justify-center mb-1.5">
                  <PlatformLogo platform={plat} className="w-5 h-5" colored={true} />
                </div>
                <div className="text-xs font-mono uppercase text-white font-bold mb-1">{plat}</div>
                <div className="text-lg font-black font-mono text-[#4cd7f6]">{share}%</div>
                <div className="text-[9px] font-mono text-[#8ea0b5] mt-1">
                  {plat === activeTrend.dominantPlatform ? '⭐ Primary Origin' : 'Sub-stream'}
                </div>
              </div>
            ))}
          </div>

          {/* Migration Timeline visual bar */}
          <div className="p-3.5 bg-black/40 rounded-xl border border-white/5">
            <div className="flex justify-between text-xs font-mono text-[#8ea0b5] mb-2">
              <span>Origin Platform</span>
              <span>Migration Cascade Window</span>
              <span>Secondary Amplification</span>
            </div>
            <div className="h-3 bg-black/80 rounded-full overflow-hidden flex border border-white/10">
              <div className="bg-[#4cd7f6] h-full" style={{ width: '45%' }} title="Primary Origin" />
              <div className="bg-[#ddb7ff] h-full" style={{ width: '30%' }} title="Cascade Phase" />
              <div className="bg-[#4edea3] h-full" style={{ width: '25%' }} title="Amplification" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrossPlatformTrendComparison
