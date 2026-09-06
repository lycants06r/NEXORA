/*
  TrendsPage.jsx
  --------------
  Shows:
  - Top trending topics (bar chart)
  - Keyword word cloud
  - Anomaly alerts
  - Trend details table
  With NEXORA glassmorphic intelligence operations theme.
*/

import React, { useState, useEffect } from 'react'
import PageHeader     from '../components/common/PageHeader.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import EmptyState     from '../components/common/EmptyState.jsx'
import TrendScoreChart from '../components/charts/TrendScoreChart.jsx'
import WordCloud      from '../components/charts/WordCloud.jsx'
import Badge          from '../components/common/Badge.jsx'
import { getCurrentTrends, getAnomalies } from '../api/trendsApi'

function TrendsPage() {
  const [trends,    setTrends]    = useState([])
  const [anomalies, setAnomalies] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [platform,  setPlatform]  = useState(null)
  const [topN,      setTopN]      = useState(20)

  useEffect(() => { loadData() }, [platform, topN])

  async function loadData() {
    setLoading(true)
    try {
      const [trendsRes, anomaliesRes] = await Promise.allSettled([
        getCurrentTrends(platform, topN),
        getAnomalies(),
      ])
      if (trendsRes.status    === 'fulfilled') setTrends(trendsRes.value?.data || [])
      if (anomaliesRes.status === 'fulfilled') setAnomalies(anomaliesRes.value?.data || [])
    } finally {
      setLoading(false)
    }
  }

  const keywords = trends.flatMap((t) =>
    (t.keywords || []).map((kw) => ({
      text:  kw,
      score: t.trend_score,
    }))
  )

  const sentimentColor = {
    positive: 'green',
    negative: 'red',
    neutral:  'yellow',
    anxious:  'purple',
    excited:  'blue',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="📈"
        title="Viral Trend Forecasting & Cascades"
        subtitle="Real-time topic velocity, epidemic reproduction rates (R-score) & lexical spikes"
      >
        {/* Controls */}
        <div className="flex items-center gap-3">
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="bg-black/50 border border-cyan-500/30 text-white font-mono
                       rounded-xl px-3 py-2 text-xs focus:outline-none
                       focus:border-[#4cd7f6]"
          >
            <option value={10}>TOP 10 CASCADES</option>
            <option value={20}>TOP 20 CASCADES</option>
            <option value={50}>TOP 50 CASCADES</option>
          </select>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:from-[#38bdf8] hover:to-[#0891b2]
                       text-black font-extrabold rounded-xl text-xs font-mono tracking-wider
                       shadow-[0_0_15px_rgba(76,215,246,0.3)] transition-all cursor-pointer"
          >
            🔄 RE-SYNC RADAR
          </button>
        </div>
      </PageHeader>

      {/* Platform Filter */}
      <div className="flex gap-2 flex-wrap">
        {[null, 'twitter', 'reddit', 'youtube', 'telegram'].map((p) => (
          <button
            key={p || 'all'}
            onClick={() => setPlatform(p)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all
              ${platform === p
                ? 'bg-[#4cd7f6]/15 text-[#4cd7f6] border border-cyan-500/40 shadow-[0_0_12px_rgba(76,215,246,0.25)]'
                : 'bg-black/30 text-[#8ea0b5] border border-white/5 hover:border-white/15 hover:text-white'
              }
            `}
          >
            {p || 'All Streams'}
          </button>
        ))}
      </div>

      {/* Anomaly Alerts Banner */}
      {anomalies.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30
                        rounded-2xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] animate-ping" />
            <h4 className="text-[#f59e0b] font-bold text-xs font-mono uppercase tracking-widest">
              ⚡ Astroturfing & Volume Anomalies Flagged ({anomalies.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {anomalies.slice(0, 5).map((a, i) => (
              <div
                key={i}
                className="bg-black/40 border border-amber-500/30 text-amber-300
                           px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-2"
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
      ) : trends.length === 0 ? (
        <EmptyState
          emoji="📈"
          title="No viral cascade signals detected"
          message="Ingest more platform telemetry to build time-series cascade models."
        />
      ) : (
        <>
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendScoreChart trends={trends} />
            <WordCloud keywords={keywords} />
          </div>

          {/* Trends Table */}
          <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="p-5 border-b border-cyan-500/15 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
                📋 Active Viral Trajectory Index
              </h3>
              <span className="text-[11px] font-mono text-[#8ea0b5]">
                EPIDEMIC R-SCORE TELEMETRY
              </span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3
                            text-[11px] font-mono font-bold uppercase tracking-wider
                            border-b border-cyan-500/15 bg-black/30 text-[#8ea0b5]">
              <div className="col-span-1">RANK</div>
              <div className="col-span-4">TOPIC ENTITY</div>
              <div className="col-span-2">R-SCORE</div>
              <div className="col-span-2">VELOCITY (24H)</div>
              <div className="col-span-2">STANCE LEAN</div>
              <div className="col-span-1 text-right">VOLUME</div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-white/5">
              {trends.map((trend) => (
                <div
                  key={trend.rank}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5
                             hover:bg-[#101d3b]/40 transition-colors items-center"
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    <span className={`
                      w-6 h-6 rounded-lg flex items-center
                      justify-center text-xs font-mono font-bold border
                      ${trend.rank <= 3
                        ? 'bg-[#4cd7f6]/15 text-[#4cd7f6] border-cyan-500/40 shadow-[0_0_8px_rgba(76,215,246,0.25)]'
                        : 'bg-black/40 text-[#8ea0b5] border-white/5'
                      }
                    `}>
                      {trend.rank}
                    </span>
                  </div>

                  {/* Topic + keywords */}
                  <div className="col-span-4 min-w-0">
                    <div className="text-white text-sm font-semibold truncate mb-1">
                      {trend.topic}
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {(trend.keywords || []).slice(0, 2).map((kw) => (
                        <span
                          key={kw}
                          className="text-[10px] font-mono bg-black/40 border border-white/5
                                     text-[#8ea0b5] px-1.5 py-0.5 rounded"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 flex items-center">
                    <div>
                      <div className="text-white font-mono text-sm font-bold tracking-tight">
                        {Number(trend.trend_score).toFixed(1)}
                      </div>
                      <div className="h-1 w-16 bg-black/60 rounded-full mt-1 overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-[#ec4899] rounded-full shadow-[0_0_6px_#ec4899]"
                          style={{
                            width: `${Math.min(
                              (trend.trend_score / 100) * 100, 100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Velocity */}
                  <div className="col-span-2 flex items-center font-mono">
                    <span className={`text-xs font-bold ${
                      trend.velocity_percent > 0
                        ? 'text-[#4edea3]'
                        : 'text-[#f43f5e]'
                    }`}>
                      {trend.velocity_percent > 0 ? '▲ +' : '▼ '}
                      {Math.abs(trend.velocity_percent).toFixed(1)}%
                    </span>
                  </div>

                  {/* Sentiment */}
                  <div className="col-span-2 flex items-center">
                    <Badge
                      label={trend.sentiment_lean || 'neutral'}
                      color={sentimentColor[trend.sentiment_lean] || 'gray'}
                    />
                  </div>

                  {/* Post count */}
                  <div className="col-span-1 flex items-center justify-end font-mono text-xs text-[#8ea0b5]">
                    {trend.post_count?.toLocaleString() || '—'}
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
