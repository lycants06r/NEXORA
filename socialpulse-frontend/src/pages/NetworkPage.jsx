/*
  NetworkPage.jsx
  ---------------
  Shows:
  - Force-directed network graph
  - Top influencers table
  - Community breakdown
  - Propagation simulation result
  With NEXORA glassmorphic intelligence operations theme.
*/

import React, { useState, useEffect } from 'react'
import PageHeader    from '../components/common/PageHeader.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import EmptyState    from '../components/common/EmptyState.jsx'
import NetworkGraph  from '../components/charts/NetworkGraph.jsx'
import StatCard      from '../components/common/StatCard.jsx'
import Badge         from '../components/common/Badge.jsx'
import {
  getInfluencers,
  getCommunities,
  getGraphData,
} from '../api/networkApi'

function NetworkPage() {
  const [graphData,    setGraphData]    = useState({ nodes: [], edges: [] })
  const [influencers,  setInfluencers]  = useState([])
  const [communities,  setCommunities]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [platform,     setPlatform]     = useState(null)

  useEffect(() => { loadData() }, [platform])

  async function loadData() {
    setLoading(true)
    try {
      const [graphRes, influRes, commRes] = await Promise.allSettled([
        getGraphData(platform, 80),
        getInfluencers(10, platform),
        getCommunities(platform),
      ])

      if (graphRes.status  === 'fulfilled') setGraphData(graphRes.value?.data || { nodes: [], edges: [] })
      if (influRes.status  === 'fulfilled') setInfluencers(influRes.value?.data || [])
      if (commRes.status   === 'fulfilled') setCommunities(commRes.value?.data  || [])
    } finally {
      setLoading(false)
    }
  }

  const influenceTypeColor = {
    'Key Opinion Leader': 'pink',
    'Bridge':             'yellow',
    'Broadcaster':        'blue',
    'Regular':            'gray',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🕸️"
        title="Network Topology & Astroturfing Radar"
        subtitle="Force-directed community detection, PageRank node centrality & bot swarm clusters"
      >
        <button
          onClick={loadData}
          className="px-4 py-2 bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:from-[#38bdf8] hover:to-[#0891b2]
                     text-black font-extrabold rounded-xl text-xs font-mono tracking-wider uppercase
                     shadow-[0_0_15px_rgba(76,215,246,0.3)] transition-all cursor-pointer"
        >
          🔄 Re-Calculate Centrality
        </button>
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

      {loading ? (
        <LoadingSpinner message="Constructing network adjacency matrix & computing PageRank..." />
      ) : graphData.nodes.length === 0 ? (
        <EmptyState
          emoji="🕸️"
          title="No topology graph data yet"
          message="Ingest platform interactions (mentions, replies, shares) to map the social influence graph."
        />
      ) : (
        <>
          {/* ── Stats ──────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard emoji="👤" label="Active Graph Nodes"   value={graphData.nodes?.length || '0'} color="blue"   />
            <StatCard emoji="🔗" label="Interaction Edges"    value={graphData.edges?.length || '0'} color="purple" />
            <StatCard emoji="⭐" label="Centrality Leaders"   value={influencers.length || '0'}      color="pink"   />
            <StatCard emoji="🏘️" label="Isolated Clusters"    value={communities.length || '0'}      color="cyan"   />
          </div>

          {/* ── Network Graph ──────────────────────────────── */}
          <NetworkGraph
            nodes={graphData.nodes}
            edges={graphData.edges}
          />

          {/* ── Two Columns: Influencers + Communities ─────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* TOP INFLUENCERS TABLE */}
            <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="p-5 border-b border-cyan-500/15 flex items-center justify-between">
                <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ec4899] shadow-[0_0_8px_#ec4899]" />
                  ⭐ Key Opinion Leaders (KOLs)
                </h3>
                <span className="text-[11px] font-mono text-[#8ea0b5]">
                  PAGERANK CENTRALITY
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {influencers.length === 0 ? (
                  <p className="p-6 text-[#8ea0b5] font-mono text-sm text-center">
                    No central opinion nodes identified yet
                  </p>
                ) : (
                  influencers.map((inf, i) => (
                    <div
                      key={inf.user_id_hashed}
                      className="flex items-center gap-4 p-4
                                 hover:bg-[#101d3b]/40 transition-colors"
                    >
                      {/* Rank badge */}
                      <div className={`
                        w-7 h-7 rounded-lg flex items-center
                        justify-center text-xs font-mono font-bold flex-shrink-0 border
                        ${i === 0 ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.4)]' :
                          i === 1 ? 'bg-slate-300 text-black border-slate-200'   :
                          i === 2 ? 'bg-amber-700 text-white border-amber-600'  :
                                    'bg-black/40 text-[#8ea0b5] border-white/5'
                        }
                      `}>
                        {i + 1}
                      </div>

                      {/* User info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-mono truncate font-semibold">
                          NODE_{inf.user_id_hashed.slice(0, 16)}...
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            label={inf.influence_type}
                            color={influenceTypeColor[inf.influence_type] || 'gray'}
                          />
                          <span className="text-[10px] font-mono text-[#8ea0b5] uppercase">
                            {inf.platform}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0 font-mono">
                        <div className="text-[#4cd7f6] text-sm font-bold">
                          {Number(inf.composite_influence_score).toFixed(3)}
                        </div>
                        <div className="text-[10px] text-[#8ea0b5]">
                          PR: {Number(inf.pagerank_score).toFixed(4)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* COMMUNITIES */}
            <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="p-5 border-b border-cyan-500/15 flex items-center justify-between">
                <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
                  🏘️ Astroturfing & Community Swarms
                </h3>
                <span className="text-[11px] font-mono text-[#8ea0b5]">
                  MODULARITY CLUSTERS
                </span>
              </div>

              {communities.length === 0 ? (
                <p className="p-6 text-[#8ea0b5] font-mono text-sm text-center">
                  No distinct community clusters isolated yet
                </p>
              ) : (
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {communities.map((comm, i) => {
                    const communityColors = [
                      'border-cyan-500/30 bg-cyan-500/5',
                      'border-purple-500/30 bg-purple-500/5',
                      'border-pink-500/30 bg-pink-500/5',
                      'border-emerald-500/30 bg-emerald-500/5',
                      'border-amber-500/30 bg-amber-500/5',
                    ]
                    return (
                      <div
                        key={comm.community_id}
                        className={`
                          border rounded-xl p-4 transition-all hover:bg-white/5
                          ${communityColors[i % communityColors.length]}
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold text-sm font-mono">
                            CLUSTER #{comm.community_id}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 bg-black/50 text-[#4cd7f6] border border-cyan-500/20 rounded-md">
                            {comm.size} NODES
                          </span>
                        </div>

                        {comm.top_keywords?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {comm.top_keywords.slice(0, 4).map((kw) => (
                              <span
                                key={kw}
                                className="text-[10px] font-mono bg-black/40 text-[#8ea0b5] px-1.5 py-0.5 rounded border border-white/5"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between text-xs font-mono mb-1 text-[#8ea0b5]">
                            <span>COHESION INDEX</span>
                            <span className="text-white font-bold">
                              {(comm.cohesion_score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-[#4cd7f6] to-[#ddb7ff] rounded-full shadow-[0_0_8px_#4cd7f6]"
                              style={{
                                width: `${comm.cohesion_score * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        {comm.dominant_sentiment && (
                          <div className="mt-2.5">
                            <Badge
                              label={`Polarity: ${comm.dominant_sentiment}`}
                              color={
                                comm.dominant_sentiment === 'positive'
                                  ? 'green'
                                  : comm.dominant_sentiment === 'negative'
                                  ? 'red'
                                  : 'yellow'
                              }
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NetworkPage
