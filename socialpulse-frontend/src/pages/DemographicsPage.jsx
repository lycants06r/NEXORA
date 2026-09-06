/*
  DemographicsPage.jsx
  --------------------
  Shows AI-inferred audience demographics:
  - Age distribution (pie chart)
  - Gender split (pie chart)
  - Top countries (bar chart)
  - Interest clusters (list)
  With NEXORA glassmorphic intelligence operations theme.
*/

import React, { useState, useEffect } from 'react'
import PageHeader    from '../components/common/PageHeader.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import EmptyState    from '../components/common/EmptyState.jsx'
import DemoPieChart  from '../components/charts/DemoPieChart.jsx'
import CountryBarChart from '../components/charts/CountryBarChart.jsx'
import StatCard      from '../components/common/StatCard.jsx'
import { getAudienceStats } from '../api/demographicsApi'

function DemographicsPage() {
  const [data,     setData]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [platform, setPlatform] = useState(null)

  useEffect(() => { loadData() }, [platform])

  async function loadData() {
    setLoading(true)
    try {
      const res = await getAudienceStats(platform)
      setData(res?.data)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const toPieData = (obj) =>
    Object.entries(obj || {}).map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }))

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="👥"
        title="Audience Intelligence & Demographics"
        subtitle="AI-inferred anonymous audience profiling, age distribution & geographic affinity"
      >
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
      </PageHeader>

      {/* Privacy Notice (NEXORA Emerald Telemetry Box) */}
      <div className="
        bg-emerald-500/10 border border-emerald-500/30
        rounded-2xl p-4 flex items-start gap-3.5 shadow-[0_0_15px_rgba(78,222,163,0.1)]
      ">
        <span className="text-2xl">🔒</span>
        <div>
          <p className="text-[#4edea3] font-bold text-xs font-mono uppercase tracking-wider">
            Zero-PII Privacy-First Intelligence Architecture
          </p>
          <p className="text-xs text-[#8ea0b5] font-mono mt-0.5 leading-relaxed">
            All audience telemetry profiles are AI-inferred aggregates. No individual identifiable credentials or raw user handles are persisted in cloud state. Identifiers are salted and hashed via SHA-256 prior to graph ingestion.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Aggregating demographic tensors & geographic matrices..." />
      ) : !data ? (
        <EmptyState
          emoji="👥"
          title="No demographic telemetry available"
          message="Dispatch data collection from the Ingestion workstation to populate audience profiling matrices."
        />
      ) : (
        <>
          {/* ── Summary Stats ──────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard emoji="👤" label="Audience Nodes Sampled" value={data.total_analyzed?.toLocaleString() || '0'} color="blue" />
            <StatCard emoji="🌍" label="Geographic Clusters"   value={data.top_countries?.length || '0'}             color="green"  />
            <StatCard emoji="🗣️" label="Language Vectors"      value={data.top_languages?.length || '0'}             color="purple" />
            <StatCard emoji="🎯" label="Semantic Affinity Hubs"value={data.interest_clusters?.length || '0'}          color="cyan"   />
          </div>

          {/* ── Age + Gender Charts ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DemoPieChart
              title="🎂 Age Group Distribution"
              data={toPieData(data.age_distribution)}
            />
            <DemoPieChart
              title="⚧ Gender Affiliation Matrix"
              data={toPieData(data.gender_distribution)}
            />
          </div>

          {/* ── Country Chart ──────────────────────────────── */}
          <CountryBarChart countries={data.top_countries || []} />

          {/* ── Interest Clusters ──────────────────────────── */}
          {data.interest_clusters?.length > 0 && (
            <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
                  🎯 Topic & Affinity Semantic Clusters
                </h3>
                <span className="text-[11px] font-mono text-[#8ea0b5]">
                  COMMUNITY WEIGHTS
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.interest_clusters.map((cluster, i) => (
                  <div
                    key={i}
                    className="bg-black/40 border border-white/5 hover:border-cyan-500/30 rounded-xl p-4 transition-all"
                  >
                    <div className="text-2xl mb-1.5">
                      {['💻', '🌍', '📱', '🎮', '💰', '🏋️',
                        '🎨', '🔬', '🏛️', '🎵'][i % 10]}
                    </div>
                    <div className="text-white font-bold text-sm">
                      {cluster.label || `Cluster ${i + 1}`}
                    </div>
                    <div className="text-xs font-mono text-[#4cd7f6] mt-1">
                      {cluster.count || 0} active users
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Active Hours Histogram ─────────────────────── */}
          {data.active_hours_utc?.length > 0 && (
            <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
                  🕐 Temporal Activity Histogram (UTC Diurnal Curve)
                </h3>
                <span className="text-[11px] font-mono text-[#4cd7f6]">
                  24-HOUR RADAR
                </span>
              </div>
              <div className="flex gap-1.5 items-end h-24 p-3 bg-black/40 rounded-xl border border-white/5">
                {Array.from({ length: 24 }, (_, hour) => {
                  const isActive = data.active_hours_utc.includes(hour)
                  return (
                    <div
                      key={hour}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                    >
                      <div
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-t from-[#06b6d4] to-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]'
                            : 'bg-dark-600/40 hover:bg-dark-500'
                        }`}
                        style={{
                          height: isActive ? '90%' : '18%',
                        }}
                      />
                      {hour % 6 === 0 && (
                        <span className="text-[10px] font-mono text-[#8ea0b5]">
                          {hour}h
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DemographicsPage
