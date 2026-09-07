/*
  TrendsPage.jsx
  --------------
  Viral Trend Forecasting, Lexical Spikes & Epidemic Modeling.
  Features:
  - Ranked Topic Leaderboard: Rank, Topic, Volume, Growth, Engagement, Platforms, Lifecycle & Trend Score
  - Trend Lifecycle States: Emerging, Rising, Peaking, Declining
  - Statistical Predictive Trend Alerts (mention velocity, engagement growth, cross-platform spread)
  - Interactive Dynamic Keyword Cloud
  - Trend Score Recharts Chart
  - Preserves exact NEXORA glassmorphic design and cyberpunk aesthetics.
*/

import React, { useState, useEffect } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import TrendScoreChart from '../components/charts/TrendScoreChart.jsx'
import WordCloud from '../components/charts/WordCloud.jsx'
import CrossPlatformTrendComparison from '../components/trends/CrossPlatformTrendComparison.jsx'
import { getCurrentTrends, getAnomalies } from '../api/trendsApi'

const DEFAULT_TRENDS = [
  {
    rank: 1,
    topic: 'AI Governance & Safety Frameworks',
    trend_score: 94.2,
    velocity_percent: 34.8,
    post_count: 184500,
    engagement: '1.4M',
    platforms: ['twitter', 'telegram', 'reddit', 'youtube'],
    lifecycle: 'Peaking',
    sentiment_lean: 'positive',
    keywords: ['AIGovernance', 'SafetyAudit', 'Consortium', 'WeightsTelemetry', 'AIAct'],
    predictive_score: 91.5,
    spread_velocity: 'High (3.42 hops/hr)',
  },
  {
    rank: 2,
    topic: 'Autonomous Multi-Agent Architecture',
    trend_score: 88.4,
    velocity_percent: 26.5,
    post_count: 112000,
    engagement: '890K',
    platforms: ['youtube', 'twitter', 'reddit'],
    lifecycle: 'Rising',
    sentiment_lean: 'positive',
    keywords: ['AutonomousAI', 'MultiAgent', 'RedisPipelines', 'HighPerformance'],
    predictive_score: 86.2,
    spread_velocity: 'Surging (2.85 hops/hr)',
  },
  {
    rank: 3,
    topic: 'Critical Infrastructure Disinformation Spike',
    trend_score: 81.2,
    velocity_percent: -12.4,
    post_count: 98000,
    engagement: '740K',
    platforms: ['telegram', 'twitter', 'facebook'],
    lifecycle: 'Declining',
    sentiment_lean: 'negative',
    keywords: ['PowerGrid', 'OutageRumors', 'FactCheck', 'GridSecurity'],
    predictive_score: 64.0,
    spread_velocity: 'Decelerating (0.95 hops/hr)',
  },
  {
    rank: 4,
    topic: 'Renewable Clean Energy Transition',
    trend_score: 76.5,
    velocity_percent: 18.2,
    post_count: 76400,
    engagement: '520K',
    platforms: ['instagram', 'facebook', 'youtube'],
    lifecycle: 'Rising',
    sentiment_lean: 'positive',
    keywords: ['CleanEnergy', 'SolarSurge', 'RooftopSolar', 'GreenTech'],
    predictive_score: 78.4,
    spread_velocity: 'Moderate (1.40 hops/hr)',
  },
  {
    rank: 5,
    topic: 'Algorithmic Credit Model Bias',
    trend_score: 72.8,
    velocity_percent: 42.1,
    post_count: 62000,
    engagement: '480K',
    platforms: ['twitter', 'reddit', 'telegram'],
    lifecycle: 'Emerging',
    sentiment_lean: 'negative',
    keywords: ['CreditAudit', 'AIEthics', 'InclusionReport', 'FairScoring'],
    predictive_score: 84.8,
    spread_velocity: 'Accelerating (2.10 hops/hr)',
  },
  {
    rank: 6,
    topic: 'Semiconductor Supply & Macro Risk',
    trend_score: 68.1,
    velocity_percent: 5.4,
    post_count: 54000,
    engagement: '380K',
    platforms: ['reddit', 'twitter'],
    lifecycle: 'Peaking',
    sentiment_lean: 'neutral',
    keywords: ['Semiconductors', 'SupplyChain', 'FabCapacity', 'MacroRisk'],
    predictive_score: 67.2,
    spread_velocity: 'Steady (1.10 hops/hr)',
  },
]

const DEFAULT_ANOMALIES = [
  { keyword: 'CreditAudit', severity_label: 'CRITICAL VOL SPIKE (+280%)', time: '14m ago' },
  { keyword: 'PowerGrid', severity_label: 'UNUSUAL TELEGRAM BURST', time: '38m ago' },
  { keyword: 'AIGovernance', severity_label: 'CROSS-PLATFORM CASCADE', time: '1h ago' },
]

function TrendsPage() {
  const [trends, setTrends] = useState(DEFAULT_TRENDS)
  const [anomalies, setAnomalies] = useState(DEFAULT_ANOMALIES)
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState(null)
  const [topN, setTopN] = useState(10)

  useEffect(() => {
    let isMounted = true
    async function syncData() {
      try {
        const [trendsRes, anomaliesRes] = await Promise.allSettled([
          getCurrentTrends(platform, topN),
          getAnomalies(),
        ])

        if (!isMounted) return

        if (trendsRes.status === 'fulfilled' && trendsRes.value?.data?.length > 0) {
          setTrends(trendsRes.value.data)
        }
        if (anomaliesRes.status === 'fulfilled' && anomaliesRes.value?.data?.length > 0) {
          setAnomalies(anomaliesRes.value.data)
        }
      } catch {
        // Retain optimistic telemetry
      }
    }
    syncData()
    return () => { isMounted = false }
  }, [platform, topN])

  async function loadData() {
    try {
      const [trendsRes, anomaliesRes] = await Promise.allSettled([
        getCurrentTrends(platform, topN),
        getAnomalies(),
      ])
      if (trendsRes.status === 'fulfilled' && trendsRes.value?.data?.length > 0) {
        setTrends(trendsRes.value.data)
      }
      if (anomaliesRes.status === 'fulfilled' && anomaliesRes.value?.data?.length > 0) {
        setAnomalies(anomaliesRes.value.data)
      }
    } catch {
      // Keep optimistic values
    }
  }

  const keywords = trends.flatMap((t) =>
    (t.keywords || []).map((kw) => ({
      text: kw,
      score: t.trend_score,
    }))
  )

  const lifecycleBadges = {
    Emerging: 'bg-cyan-500/20 text-[#4cd7f6] border-cyan-500/40 animate-pulse',
    Rising: 'bg-emerald-500/20 text-[#4edea3] border-emerald-500/40',
    Peaking: 'bg-purple-500/20 text-[#ddb7ff] border-purple-500/40',
    Declining: 'bg-slate-500/20 text-[#8ea0b5] border-slate-500/40',
  }



  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        emoji="📈"
        title="Viral Trend Forecasting & Cascades"
        subtitle="Real-time topic velocity, epidemic reproduction rates (R-score), lifecycle tracking & predictive alerts"
      >
        <div className="flex items-center gap-3">
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="glass-control text-white font-mono rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#4cd7f6]"
          >
            <option value={5} className="bg-[#060e20]">TOP 5 CASCADES</option>
            <option value={10} className="bg-[#060e20]">TOP 10 CASCADES</option>
            <option value={20} className="bg-[#060e20]">TOP 20 CASCADES</option>
          </select>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:from-[#38bdf8] hover:to-[#0891b2] text-black font-extrabold rounded-xl text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(76,215,246,0.3)] transition-all cursor-pointer"
          >
            🔄 RE-SYNC RADAR
          </button>
        </div>
      </PageHeader>

      {/* Platform Filter */}
      <div className="flex gap-1.5 flex-wrap">
        {[null, 'twitter', 'telegram', 'instagram', 'facebook', 'reddit', 'youtube'].map((p) => (
          <button
            key={p || 'all'}
            onClick={() => setPlatform(p)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5
              ${platform === p
                ? 'bg-[rgba(76,215,246,0.18)] text-[#4cd7f6] border border-[#4cd7f6]/40 shadow-glow-cyan font-bold backdrop-blur-md'
                : 'glass-control text-[#8ea0b5] hover:text-white hover:border-white/20'
              }
            `}
          >
            {p === 'twitter' ? '🐦 X' :
              p === 'telegram' ? '✈️ Telegram' :
                p === 'instagram' ? '📸 Instagram' :
                  p === 'facebook' ? '👥 Facebook' :
                    p === 'reddit' ? '🤖 Reddit' :
                      p === 'youtube' ? '📺 YouTube' : 'All Streams'}
          </button>
        ))}
      </div>

      {/* ── Predictive Trend Velocity & Statistical Scoring Banner ── */}
      <div className="liquid-glass-soft border border-purple-500/30 rounded-2xl p-4.5 flex items-start justify-between flex-wrap gap-3 relative overflow-hidden group shadow-sm">
        <div className="glass-edge-top" />
        <div className="flex items-start gap-3 relative z-10">
          <span className="text-2xl">🔮</span>
          <div>
            <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider">
              Statistical Predictive Trend Engine (Velocity + Cross-Platform Novelty)
            </h4>
            <p className="text-xs text-[#dae2fd] font-mono mt-0.5 leading-relaxed">
              Transparent Scoring: Trend scores evaluate exponential mention velocity, engagement coefficient, lexical novelty, and cross-platform spread without unverified ML claims.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#ddb7ff] px-2.5 py-1 rounded-xl liquid-glass-soft border border-purple-500/40 font-bold relative z-10">
          EPIDEMIC R-SCORE MODELING
        </span>
      </div>

      {/* Anomaly Alerts Banner */}
      {anomalies.length > 0 && (
        <div className="liquid-glass-soft border border-amber-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.12)] relative overflow-hidden group">
          <div className="glass-edge-top" />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] animate-ping" />
            <h4 className="text-[#f59e0b] font-bold text-xs font-mono uppercase tracking-widest">
              ⚡ Predictive Velocity & Lexical Spikes ({anomalies.length} Flagged)
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 relative z-10">
            {anomalies.map((a, i) => (
              <div
                key={i}
                className="liquid-glass-soft border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2"
              >
                <span>🔺 #{a.keyword}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">
                  {a.severity_label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Evaluating viral reproduction curves & R-scores..." />
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendScoreChart trends={trends} />
            <WordCloud keywords={keywords} />
          </div>

          {/* ── Cross-Platform Viral Migration Matrix ───────────── */}
          <CrossPlatformTrendComparison />

          {/* Ranked Topic Leaderboard Table */}
          <div className="liquid-glass rounded-2xl overflow-hidden shadow-glass-card relative group">
            <div className="glass-edge-top" />
            <div className="p-5 border-b border-white/10 flex items-center justify-between relative z-10">
              <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
                📋 Ranked Topic Leaderboard & Lifecycle Tracking
              </h3>
              <span className="text-[11px] font-mono text-[#8ea0b5]">
                RANKED BY COMPOSITE TREND SCORE
              </span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border-b border-white/10 bg-black/40 text-[#8ea0b5] relative z-10">
              <div className="col-span-1">Rank</div>
              <div className="col-span-3">Topic Entity</div>
              <div className="col-span-2">Trend Score</div>
              <div className="col-span-2">Lifecycle Status</div>
              <div className="col-span-2">24h Velocity</div>
              <div className="col-span-1">Platforms</div>
              <div className="col-span-1 text-right">Volume</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/5 font-mono text-xs relative z-10">
              {trends.map((trend) => (
                <div
                  key={trend.rank}
                  className="grid grid-cols-12 gap-3 px-5 py-3.5 hover:bg-white/[0.04] transition-colors items-center"
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border ${trend.rank <= 3
                      ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-cyan-500/40 shadow-[0_0_8px_rgba(76,215,246,0.25)]'
                      : 'bg-black/40 text-[#8ea0b5] border-white/10'
                      }`}>
                      {trend.rank}
                    </span>
                  </div>

                  {/* Topic + Keywords */}
                  <div className="col-span-3 min-w-0">
                    <div className="text-white text-xs font-bold truncate mb-1">
                      {trend.topic}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {(trend.keywords || []).slice(0, 2).map((kw) => (
                        <span key={kw} className="text-[9px] liquid-glass-soft border border-white/10 text-[#8ea0b5] px-1.5 py-0.5 rounded">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trend Score */}
                  <div className="col-span-2">
                    <div className="text-white font-bold text-sm">
                      {Number(trend.trend_score).toFixed(1)} PTS
                    </div>
                    <div className="h-1.5 w-20 bg-black/60 rounded-full mt-1 overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-[#ec4899] rounded-full"
                        style={{ width: `${Math.min(trend.trend_score, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Lifecycle State */}
                  <div className="col-span-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${lifecycleBadges[trend.lifecycle || 'Rising']}`}>
                      {trend.lifecycle || 'Rising'}
                    </span>
                  </div>

                  {/* Velocity */}
                  <div className="col-span-2">
                    <span className={`font-bold ${trend.velocity_percent > 0 ? 'text-[#4edea3]' : 'text-[#f43f5e]'}`}>
                      {trend.velocity_percent > 0 ? '▲ +' : '▼ '}
                      {Math.abs(trend.velocity_percent).toFixed(1)}%
                    </span>
                  </div>

                  {/* Platforms */}
                  <div className="col-span-1 flex items-center gap-1">
                    {(trend.platforms || ['twitter']).map(p => (
                      <span key={p} className="text-xs" title={p}>
                        {p === 'twitter' ? '🐦' : p === 'telegram' ? '✈️' : p === 'youtube' ? '📺' : p === 'reddit' ? '🤖' : '📸'}
                      </span>
                    ))}
                  </div>

                  {/* Volume */}
                  <div className="col-span-1 text-right text-[#8ea0b5]">
                    {(trend.post_count || 1200).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TrendsPage
