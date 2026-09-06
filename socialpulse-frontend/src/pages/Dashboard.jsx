/*
  Dashboard.jsx
  -------------
  The home/overview page.
  Features NEXORA-inspired military-grade glassmorphic intelligence operations HUD.
*/

import React, { useEffect, useState } from 'react'
import StatCard      from '../components/common/StatCard.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import ErrorMessage  from '../components/common/ErrorMessage.jsx'
import { getCollectionStats } from '../api/ingestionApi'
import { getSentimentSummary } from '../api/sentimentApi'
import { getCurrentTrends }   from '../api/trendsApi'
import { getInfluencers }     from '../api/networkApi'
import { useNavigate }        from 'react-router-dom'

function Dashboard() {
  const [stats,      setStats]      = useState(null)
  const [sentiment,  setSentiment]  = useState(null)
  const [trends,     setTrends]     = useState([])
  const [influencers,setInfluencers] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true)
        const [statsRes, sentRes, trendsRes, influRes] = await Promise.allSettled([
          getCollectionStats(),
          getSentimentSummary(),
          getCurrentTrends(null, 5),
          getInfluencers(5),
        ])

        if (statsRes.status === 'fulfilled') setStats(statsRes.value?.data)
        if (sentRes.status  === 'fulfilled') setSentiment(sentRes.value?.data)
        if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value?.data || [])
        if (influRes.status  === 'fulfilled') setInfluencers(influRes.value?.data || [])

      } catch (err) {
        setError('Could not connect to backend. Is python run.py running?')
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  if (loading) return <LoadingSpinner message="Ingesting telemetry feeds & calibrating models..." />
  if (error)   return <ErrorMessage message={error} onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── NEXORA Intelligence Operations Banner ─────────────── */}
      <div className="
        bg-gradient-to-r from-[#4cd7f6]/15 via-[#ddb7ff]/10 to-[#06b6d4]/15
        border border-cyan-500/30 rounded-2xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.6)]
        backdrop-blur-2xl relative overflow-hidden
      ">
        <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none text-7xl font-mono select-none">
          NEXORA
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] animate-pulse shadow-[0_0_10px_#4cd7f6]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#4cd7f6] font-bold">
            MILITARY-GRADE COGNITIVE THREAT HUD
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
          SocialPulse Autonomous Intelligence Command Center
        </h2>
        <p className="text-sm text-[#8ea0b5] max-w-3xl leading-relaxed">
          Aggregating, parsing, and correlating real-time social signals across X, Reddit, YouTube & Telegram.
          Autonomous NLP threat scoring and viral trajectory forecasting.{' '}
          <button
            onClick={() => navigate('/ingestion')}
            className="text-[#4cd7f6] hover:underline font-mono font-semibold"
          >
            Dispatch Ingestion Pipeline →
          </button>
        </p>
      </div>

      {/* ── KPI Stats Row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          emoji="📝"
          label="Ingested Signal Stream"
          value={stats?.total_posts?.toLocaleString() || '0'}
          color="blue"
        />
        <StatCard
          emoji="😊"
          label="Positive Polarity Lean"
          value={`${sentiment?.positive_pct?.toFixed(1) || '0'}%`}
          color="green"
          trend={sentiment?.positive_trend}
          trendUp={true}
        />
        <StatCard
          emoji="🔥"
          label="Active Viral Cascades"
          value={trends?.length || '0'}
          color="pink"
        />
        <StatCard
          emoji="⭐"
          label="Key Opinion Nodes"
          value={influencers?.length || '0'}
          color="purple"
        />
      </div>

      {/* ── Ingested Stream by Platform ──────────────────────── */}
      <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
            📡 Ingested Feeds Across 4 Core Platforms
          </h3>
          <span className="text-[11px] font-mono text-[#8ea0b5]">
            FIREHOSE LATENCY: &lt;50MS
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'twitter',  emoji: '🐦', color: 'text-[#4cd7f6]', label: 'Twitter / X' },
            { key: 'reddit',   emoji: '🤖', color: 'text-[#f59e0b]', label: 'Reddit Swarm' },
            { key: 'youtube',  emoji: '📺', color: 'text-[#f43f5e]', label: 'YouTube Telemetry' },
            { key: 'telegram', emoji: '✈️', color: 'text-[#38bdf8]', label: 'Telegram Broadcast' },
          ].map(({ key, emoji, color, label }) => (
            <div
              key={key}
              className="bg-black/40 border border-white/5 hover:border-cyan-500/30 rounded-xl p-4 text-center transition-all duration-200"
            >
              <div className="text-3xl mb-1">{emoji}</div>
              <div className={`text-2xl font-black font-mono tracking-tight ${color}`}>
                {stats?.by_platform?.[key]?.toLocaleString() || '0'}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#8ea0b5] mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Tactical Actions ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { emoji: '📥', label: 'Trigger Ingestion', path: '/ingestion',    color: 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(76,215,246,0.2)]'   },
          { emoji: '💬', label: 'Sentiment Radar',   path: '/sentiment',    color: 'border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(221,183,255,0.2)]'},
          { emoji: '📈', label: 'Viral Trajectory',  path: '/trends',       color: 'border-pink-500/30 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]'   },
          { emoji: '🕸️', label: 'Topology Graph',    path: '/network',      color: 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(78,222,163,0.2)]'   },
        ].map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={`
              bg-[#0a1329]/80 backdrop-blur-xl border ${action.color}
              rounded-2xl p-5 text-center
              transition-all duration-300
              hover:scale-[1.03] cursor-pointer
            `}
          >
            <div className="text-3xl mb-2">{action.emoji}</div>
            <div className="text-white font-bold text-sm tracking-wide">
              {action.label}
            </div>
          </button>
        ))}
      </div>

      {/* ── Top Viral Signals Preview ─────────────────────────── */}
      {trends.length > 0 && (
        <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ec4899] shadow-[0_0_8px_#ec4899]" />
              🔥 High-Velocity Viral Propagation Signals
            </h3>
            <span className="text-[11px] font-mono text-[#ec4899]">
              REAL-TIME CLUSTER DETECTED
            </span>
          </div>
          <div className="space-y-2">
            {trends.slice(0, 5).map((trend, i) => (
              <div
                key={trend.topic}
                className="flex items-center gap-3 p-3 bg-black/40 border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all"
              >
                <span className="
                  text-xs font-mono font-bold w-6 h-6 rounded-full
                  bg-[#4cd7f6]/20 text-[#4cd7f6] border border-cyan-500/30 flex items-center
                  justify-center flex-shrink-0
                ">
                  {i + 1}
                </span>
                <span className="text-[#dae2fd] text-sm font-semibold flex-1 truncate">
                  {trend.topic}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/25 text-[#ec4899]">
                  {Number(trend.trend_score).toFixed(0)} PTS
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
