/*
  AnalyticsPage.jsx
  -----------------
  Social Media Analytics Workstation.
  Full 6-Platform Intelligence Suite:
  - X / Twitter (PRIORITY)
  - Telegram (PRIORITY)
  - Instagram
  - Facebook
  - Reddit
  - YouTube (Deep-dive stream telemetry)

  Preserves the exact NEXORA glassmorphic design, sparklines, polarity bars,
  telemetry metrics, and real-time feed updates.
*/

import React, { useState, useEffect } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import PlatformLogo from '../components/common/PlatformLogo.jsx'


function AnalyticsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [ytFilter, setYtFilter]                 = useState('all')
  const [ytLiveCount, setYtLiveCount]           = useState(142)

  // Live indicator ticker for YouTube section
  useEffect(() => {
    const timer = setInterval(() => {
      setYtLiveCount(prev => prev + (Math.random() > 0.5 ? 1 : -1))
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const platformsData = [
    {
      id: 'x',
      name: 'X / Twitter',
      handle: '@feed_stream_x',
      accentColor: '#4cd7f6',
      gradient: 'from-[#4cd7f6] via-cyan-400 to-[#4cd7f6]/40',
      totalUsers: '334.85M',
      growth: '+12.8%',
      activeUsers: '18.4M',
      posts24h: '2.8M',
      engagement: '7.4M',
      sentimentPos: '68% Pos',
      polarity: { pos: 68, neu: 20, neg: 12 },
      sparkGradientId: 'sparkX',
      sparkColor: '#4cd7f6',
      sparkD: 'M0,20 L15,14 L30,12 L45,15 L60,8 L75,10 L90,5 L100,2',
      sparkArea: 'M0,20 L15,14 L30,12 L45,15 L60,8 L75,10 L90,5 L100,2 L100,20 L0,20 Z',
      latestSignal: '[X Live] Consensual policy paper trending on #AIGovernance; retweet velocity +28%.',
      statusText: 'Pipeline Ingesting',
    },
    {
      id: 'tg',
      name: 'Telegram Broadcast',
      handle: '@intel_feed_telegram',
      accentColor: '#0088cc',
      gradient: 'from-[#0088cc] via-cyan-400 to-[#0088cc]/40',
      totalUsers: '189.40M',
      growth: '+21.6%',
      activeUsers: '12.8M',
      posts24h: '1.9M',
      engagement: '5.2M',
      sentimentPos: '70% Pos',
      polarity: { pos: 70, neu: 18, neg: 12 },
      sparkGradientId: 'sparkTG',
      sparkColor: '#0088cc',
      sparkD: 'M0,20 L15,16 L30,13 L45,14 L60,9 L75,11 L90,6 L100,3',
      sparkArea: 'M0,20 L15,16 L30,13 L45,14 L60,9 L75,11 L90,6 L100,3 L100,20 L0,20 Z',
      latestSignal: '[Telegram Live] High-authority channels broadcast official grid stability verification.',
      statusText: 'MTProto Feeds Synced',
    },
    {
      id: 'ig',
      name: 'Instagram',
      handle: '@feed_visual_ig',
      accentColor: '#E1306C',
      gradient: 'from-[#E1306C] via-[#FD1D1D] to-[#F56040]',
      totalUsers: '263.65M',
      growth: '+18.4%',
      activeUsers: '21.7M',
      posts24h: '4.2M',
      engagement: '9.8M',
      sentimentPos: '72% Pos',
      polarity: { pos: 72, neu: 19, neg: 9 },
      sparkGradientId: 'sparkIG',
      sparkColor: '#E1306C',
      sparkD: 'M0,20 L15,15 L30,11 L45,13 L60,7 L75,9 L90,4 L100,1',
      sparkArea: 'M0,20 L15,15 L30,11 L45,13 L60,7 L75,9 L90,4 L100,1 L100,20 L0,20 Z',
      latestSignal: '[IG Live] Infographics on solar adoption across manufacturing hubs receive 32K likes.',
      statusText: 'Visual Graph Streaming',
    },
    {
      id: 'fb',
      name: 'Facebook',
      handle: '@feed_public_fb',
      accentColor: '#1877F2',
      gradient: 'from-[#1877F2] via-blue-400 to-[#1877F2]/40',
      totalUsers: '412.60M',
      growth: '+9.7%',
      activeUsers: '16.9M',
      posts24h: '3.6M',
      engagement: '6.8M',
      sentimentPos: '64% Pos',
      polarity: { pos: 64, neu: 22, neg: 14 },
      sparkGradientId: 'sparkFB',
      sparkColor: '#1877F2',
      sparkD: 'M0,20 L15,17 L30,15 L45,16 L60,13 L75,10 L90,11 L100,7',
      sparkArea: 'M0,20 L15,17 L30,15 L45,16 L60,13 L75,10 L90,11 L100,7 L100,20 L0,20 Z',
      latestSignal: '[FB Live] Community discussion clusters stabilized; verified news sharing ratio +14%.',
      statusText: 'Group Clusters Stable',
    },
    {
      id: 'reddit',
      name: 'Reddit Swarm',
      handle: '@subreddits_stream',
      accentColor: '#FF4500',
      gradient: 'from-[#FF4500] via-amber-500 to-[#FF4500]/40',
      totalUsers: '142.10M',
      growth: '+15.2%',
      activeUsers: '9.6M',
      posts24h: '1.4M',
      engagement: '4.8M',
      sentimentPos: '58% Pos',
      polarity: { pos: 58, neu: 24, neg: 18 },
      sparkGradientId: 'sparkRD',
      sparkColor: '#FF4500',
      sparkD: 'M0,20 L15,15 L30,18 L45,11 L60,14 L75,8 L90,12 L100,5',
      sparkArea: 'M0,20 L15,15 L30,18 L45,11 L60,14 L75,8 L90,12 L100,5 L100,20 L0,20 Z',
      latestSignal: '[Reddit Live] Megathread on autonomous multi-agent cluster alignment trending in r/technology.',
      statusText: 'Viral Threads Monitored',
    },
    {
      id: 'yt',
      name: 'YouTube Telemetry',
      handle: '@video_telemetry_yt',
      accentColor: '#EF4444',
      gradient: 'from-[#EF4444] via-rose-400 to-[#EF4444]/40',
      totalUsers: '512.30M',
      growth: '+14.1%',
      activeUsers: '34.2M',
      posts24h: '5.8M',
      engagement: '18.2M',
      sentimentPos: '76% Pos',
      polarity: { pos: 76, neu: 16, neg: 8 },
      sparkGradientId: 'sparkYT',
      sparkColor: '#EF4444',
      sparkD: 'M0,20 L15,12 L30,16 L45,8 L60,11 L75,5 L90,8 L100,2',
      sparkArea: 'M0,20 L15,12 L30,16 L45,8 L60,11 L75,5 L90,8 L100,2 L100,20 L0,20 Z',
      latestSignal: '[YT Live] Live chat NLP routing & token benchmark streaming across 142 channels.',
      statusText: `${ytLiveCount} Concurrent Streams`,
    }
  ]

  const ytIncomingSignals = [
    {
      author: 'YT/@AIGovForum',
      title: 'Global Summit on AI Policy Enforcement & Compute Caps',
      text: 'Live parliamentary panel debating sovereign audit rights on weights and continuous telemetry feeds.',
      category: 'stream',
      isStream: true,
      reach: '1.8M Reach',
      views: '1.8M',
      comments: '19.3K',
      eng: '22.1% Eng',
      emotion: 'Excitement',
      topic: '#AIGovernance'
    },
    {
      author: 'YT/@PolicyWatch',
      title: 'Regulatory Compliance Audit for High-Velocity Feeds',
      text: 'Automated compliance scanner flagged potential data boundary crossover in multi-cloud pipeline.',
      category: 'risk',
      isRisk: true,
      reach: '310K Reach',
      views: '310K',
      comments: '3.2K',
      eng: 'Risk: Moderate',
      emotion: 'Caution',
      topic: '#Compliance'
    },
    {
      author: 'YT/@NeuralCraft',
      title: 'Scaling 100K Concurrent Agent Threads in Production',
      text: 'Stress benchmark showing thread scheduling efficiency and low-memory state synchronization.',
      category: 'viral',
      reach: '2.7M Reach',
      views: '2.7M',
      comments: '24.5K',
      eng: '26.4% Eng',
      emotion: 'Supportive',
      topic: '#AutonomousAI'
    }
  ]

  const visibleCards = platformsData.filter(card => {
    if (selectedPlatform === 'all') return true
    return card.id === selectedPlatform
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        emoji="📱"
        title="Social Media Analytics Workstation"
        subtitle="Full 6-platform live telemetry: X (Twitter), Telegram, Instagram, Facebook, Reddit & YouTube"
      >
        <span className="h-9 px-3.5 inline-flex items-center text-xs font-mono text-[#4cd7f6] rounded-xl bg-cyan-500/10 border border-cyan-500/30 font-bold shadow-[0_0_10px_rgba(76,215,246,0.15)]">
          ⚡ 6 CHANNELS MONITORED
        </span>
      </PageHeader>

      {/* Platform Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedPlatform('all')}
          className={`h-9 px-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap border cursor-pointer inline-flex items-center gap-2 ${
            selectedPlatform === 'all'
              ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-cyan-500/50 shadow-[0_0_15px_rgba(76,215,246,0.3)]'
              : 'bg-black/30 text-[#8ea0b5] border-white/5 hover:text-white hover:border-white/20'
          }`}
        >
          <PlatformLogo platform="all" className="w-3.5 h-3.5" colored={selectedPlatform === 'all'} />
          <span>All Platforms (6)</span>
        </button>

        {platformsData.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedPlatform(p.id)}
            className={`h-9 px-3.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all whitespace-nowrap border cursor-pointer inline-flex items-center gap-2 ${
              selectedPlatform === p.id
                ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-cyan-500/50 shadow-[0_0_15px_rgba(76,215,246,0.3)]'
                : 'bg-black/30 text-[#8ea0b5] border-white/5 hover:text-white hover:border-white/20'
            }`}
          >
            <PlatformLogo platform={p.id} className="w-3.5 h-3.5" colored={selectedPlatform === p.id} />
            <span>{p.name}</span>
            {(p.id === 'x' || p.id === 'tg') && (
              <span className="ml-0.5 text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-[#4cd7f6] font-mono">
                ★
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Priority Banner for X and Telegram */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider">
              High-Priority Core Channels: X / Twitter & Telegram
            </h4>
            <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
              High-velocity firehose connectors actively routing real-time unstructured signals into normalized cognitive schema.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[#4edea3] text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            FIREHOSE ONLINE
          </span>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#0b1326]/85 backdrop-blur-xl rounded-2xl p-5 border border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.1)] hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Top Accent Strip */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient}`} />

            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-black/40 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.25)] p-2">
                    <PlatformLogo platform={card.id} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide group-hover:text-[#4cd7f6] transition-colors">
                      {card.name}
                    </h3>
                    <span className="text-[10px] text-[#4cd7f6]/80 font-mono">
                      {card.handle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[#4edea3] border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>

              {/* Main Metric & Growth */}
              <div className="flex items-baseline justify-between mb-3 bg-black/40 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-[10px] text-[#8ea0b5] uppercase tracking-wider block font-mono">
                    Total Tracked Reach
                  </span>
                  <span className="text-2xl font-black font-mono text-white">
                    {card.totalUsers}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#8ea0b5] uppercase tracking-wider block font-mono">
                    24h Growth
                  </span>
                  <span className="text-sm font-bold text-[#4edea3] font-mono flex items-center gap-0.5 justify-end">
                    ▲ {card.growth}
                  </span>
                </div>
              </div>

              {/* 4-Grid Secondary Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-mono">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8ea0b5] block uppercase">Active Nodes</span>
                  <span className="font-bold text-white text-sm">{card.activeUsers}</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8ea0b5] block uppercase">Posts (24h)</span>
                  <span className="font-bold text-white text-sm">{card.posts24h}</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8ea0b5] block uppercase">Engagement</span>
                  <span className="font-bold text-white text-sm">{card.engagement}</span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#8ea0b5] block uppercase">Sentiment Lean</span>
                  <span className="font-bold text-[#4edea3] text-sm">{card.sentimentPos}</span>
                </div>
              </div>

              {/* Polarity Breakdown Bar */}
              <div className="mb-3 space-y-1 font-mono">
                <div className="flex justify-between text-[10px] text-[#8ea0b5]">
                  <span>Sentiment Polarity</span>
                  <span className="text-white/80">
                    {card.polarity.pos}% Pos • {card.polarity.neu}% Neu • {card.polarity.neg}% Neg
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                  <div className="bg-[#4edea3] h-full shadow-[0_0_6px_#4edea3]" style={{ width: `${card.polarity.pos}%` }} />
                  <div className="bg-slate-400 h-full" style={{ width: `${card.polarity.neu}%` }} />
                  <div className="bg-rose-500 h-full" style={{ width: `${card.polarity.neg}%` }} />
                </div>
              </div>

              {/* Sparkline Trend Curve */}
              <div className="h-10 w-full mb-3 relative bg-black/30 rounded-xl p-1 border border-white/5">
                <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 20" width="100%">
                  <defs>
                    <linearGradient id={card.sparkGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={card.sparkColor} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={card.sparkColor} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={card.sparkArea} fill={`url(#${card.sparkGradientId})`} />
                  <path
                    d={card.sparkD}
                    fill="none"
                    stroke={card.sparkColor}
                    strokeWidth="1.8"
                    vectorEffect="non-scaling-stroke"
                    style={{ filter: `drop-shadow(0 0 4px ${card.sparkColor})` }}
                  />
                </svg>
              </div>

              {/* Latest Signal Intercept */}
              <div className="text-[11px] p-2.5 rounded-xl bg-black/40 border border-white/5 text-white/80 font-sans italic line-clamp-2 mb-3">
                {card.latestSignal}
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-auto font-mono">
              <span className="text-[10px] text-[#4edea3] flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                {card.statusText}
              </span>
              <span className="text-[10px] text-[#4cd7f6] uppercase font-bold">
                TELEMETRY ACTIVE →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* YouTube Intelligence Deep-Dive Section */}
      {(selectedPlatform === 'all' || selectedPlatform === 'yt') && (
        <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-6 shadow-[0_10px_35px_rgba(239,68,68,0.15)] space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.3)] p-2">
                <PlatformLogo platform="youtube" className="w-5 h-5" colored={true} />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base tracking-wide uppercase flex items-center gap-2">
                  <span>YouTube Video Stream Intelligence & NLP Telemetry</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold animate-pulse">
                    {ytLiveCount} LIVE BROADCASTS
                  </span>
                </h3>
                <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
                  Audio-to-text transcript mining, live chat NLP token sentiment, and 4K stream audience telemetry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              {['all', 'stream', 'risk', 'viral'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setYtFilter(cat)}
                  className={`h-8 px-3 rounded-xl uppercase tracking-wider transition-all border cursor-pointer font-semibold ${
                    ytFilter === cat
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                      : 'bg-black/40 text-[#8ea0b5] border-white/5 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* YouTube Signals Stream */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ytIncomingSignals
              .filter(s => ytFilter === 'all' || s.category === ytFilter)
              .map((signal, idx) => (
                <div key={idx} className="bg-black/50 border border-white/5 hover:border-rose-500/40 rounded-xl p-4 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      {signal.isStream && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                      {signal.author}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                      {signal.reach}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1.5 line-clamp-1">
                    {signal.title}
                  </h4>
                  <p className="text-[11px] text-[#dae2fd] leading-relaxed line-clamp-2 mb-3">
                    {signal.text}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8ea0b5] border-t border-white/5 pt-2">
                    <span>👁️ {signal.views}</span>
                    <span>💬 {signal.comments}</span>
                    <span className="text-[#4edea3] font-bold">{signal.eng}</span>
                    <span className="text-cyan-400">{signal.topic}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsPage
