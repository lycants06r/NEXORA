/*
  NetworkPage.jsx
  ---------------
  Link & Network Analysis Station.
  Features:
  - Interactive Force-Directed Topology Graph
  - Influencer Centrality Leaderboard (PageRank, Betweenness Centrality, Degree Centrality, Reach & Topics)
  - Community Swarm Detection (Community ID, Size, Dominant Topic, Dominant Sentiment, Cohesion)
  - Information Cascade & Cross-Platform Spread Timeline
  - Preserves exact NEXORA glassmorphic design and cyberpunk aesthetics.
*/

import React, { useState, useEffect } from 'react'
import PageHeader        from '../components/common/PageHeader.jsx'
import LoadingSpinner    from '../components/common/LoadingSpinner.jsx'
import NetworkGraph      from '../components/charts/NetworkGraph.jsx'
import StatCard          from '../components/common/StatCard.jsx'
import Badge             from '../components/common/Badge.jsx'
import CascadeTimeline   from '../components/network/CascadeTimeline.jsx'
import PlatformLogo      from '../components/common/PlatformLogo.jsx'
import NodeDetailModal    from '../components/network/NodeDetailModal.jsx'
import {
  getInfluencers,
  getCommunities,
  getGraphData,
} from '../api/networkApi'


const DEFAULT_GRAPH_DATA = {
  nodes: [
    { id: 'node_1', label: 'TechObserver_AI', platform: 'twitter', influence_type: 'Key Opinion Leader', composite_influence_score: 0.942, pagerank_score: 0.084, degree_centrality: 48, betweenness: 0.142, community_id: 1, reach: '185K', topic: 'AI Governance' },
    { id: 'node_2', label: 'CyberThreat_Direct', platform: 'telegram', influence_type: 'Broadcaster', composite_influence_score: 0.884, pagerank_score: 0.071, degree_centrality: 36, betweenness: 0.098, community_id: 3, reach: '98K', topic: 'Grid Security' },
    { id: 'node_3', label: 'NeuralCraft', platform: 'youtube', influence_type: 'Key Opinion Leader', composite_influence_score: 0.852, pagerank_score: 0.065, degree_centrality: 32, betweenness: 0.088, community_id: 1, reach: '240K', topic: 'Autonomous AI' },
    { id: 'node_4', label: 'MacroEconomist', platform: 'reddit', influence_type: 'Bridge', composite_influence_score: 0.791, pagerank_score: 0.052, degree_centrality: 29, betweenness: 0.174, community_id: 2, reach: '110K', topic: 'Macro Risk' },
    { id: 'node_5', label: 'EcoResilience', platform: 'instagram', influence_type: 'Broadcaster', composite_influence_score: 0.744, pagerank_score: 0.048, degree_centrality: 24, betweenness: 0.062, community_id: 4, reach: '320K', topic: 'Solar Surge' },
    { id: 'node_6', label: 'CivicDialogue', platform: 'facebook', influence_type: 'Bridge', composite_influence_score: 0.710, pagerank_score: 0.041, degree_centrality: 22, betweenness: 0.115, community_id: 2, reach: '140K', topic: 'Transit Policy' },
    { id: 'node_7', label: 'AuditWhistle', platform: 'twitter', influence_type: 'Key Opinion Leader', composite_influence_score: 0.690, pagerank_score: 0.038, degree_centrality: 20, betweenness: 0.075, community_id: 3, reach: '390K', topic: 'Model Bias' },
    { id: 'node_8', label: 'FinTechRadar', platform: 'twitter', influence_type: 'Regular', composite_influence_score: 0.640, pagerank_score: 0.032, degree_centrality: 18, betweenness: 0.045, community_id: 2, reach: '210K', topic: 'CBDC Interop' },
    { id: 'node_9', label: 'STEM_Ed', platform: 'telegram', influence_type: 'Regular', composite_influence_score: 0.610, pagerank_score: 0.029, degree_centrality: 15, betweenness: 0.031, community_id: 4, reach: '84K', topic: 'Higher Ed' },
    { id: 'node_10', label: 'GovAnalyst_01', platform: 'twitter', influence_type: 'Bridge', composite_influence_score: 0.580, pagerank_score: 0.026, degree_centrality: 14, betweenness: 0.082, community_id: 1, reach: '45K', topic: 'Policy Safety' },
  ],
  edges: [
    { source: 'node_1', target: 'node_3', weight: 3 },
    { source: 'node_1', target: 'node_10', weight: 2 },
    { source: 'node_1', target: 'node_4', weight: 2 },
    { source: 'node_2', target: 'node_7', weight: 3 },
    { source: 'node_2', target: 'node_1', weight: 1 },
    { source: 'node_3', target: 'node_10', weight: 2 },
    { source: 'node_4', target: 'node_6', weight: 3 },
    { source: 'node_4', target: 'node_8', weight: 2 },
    { source: 'node_5', target: 'node_9', weight: 2 },
    { source: 'node_6', target: 'node_8', weight: 2 },
    { source: 'node_7', target: 'node_4', weight: 2 },
    { source: 'node_9', target: 'node_1', weight: 1 },
  ],
}

const DEFAULT_INFLUENCERS = [
  { user_id_hashed: 'usr_8a9f2c10b7', handle: 'TechObserver_AI', platform: 'twitter', influence_type: 'Key Opinion Leader', composite_influence_score: 0.942, pagerank_score: 0.0842, betweenness_centrality: 0.142, degree_centrality: 48, reach: '185K', community_id: 1, topic: 'AI Governance' },
  { user_id_hashed: 'usr_tg_channel_intel', handle: 'CyberThreat_Direct', platform: 'telegram', influence_type: 'Broadcaster', composite_influence_score: 0.884, pagerank_score: 0.0712, betweenness_centrality: 0.098, degree_centrality: 36, reach: '98K', community_id: 3, topic: 'Critical Infra' },
  { user_id_hashed: 'usr_yt_neurocode', handle: 'NeuralCraft Studio', platform: 'youtube', influence_type: 'Key Opinion Leader', composite_influence_score: 0.852, pagerank_score: 0.0651, betweenness_centrality: 0.088, degree_centrality: 32, reach: '240K', community_id: 1, topic: 'Autonomous AI' },
  { user_id_hashed: 'usr_rd_macrohawk', handle: 'u/MacroEconomist', platform: 'reddit', influence_type: 'Bridge', composite_influence_score: 0.791, pagerank_score: 0.0520, betweenness_centrality: 0.174, degree_centrality: 29, reach: '110K', community_id: 2, topic: 'Macro Risk' },
  { user_id_hashed: 'usr_ig_ecowatch', handle: 'EcoResilience', platform: 'instagram', influence_type: 'Broadcaster', composite_influence_score: 0.744, pagerank_score: 0.0482, betweenness_centrality: 0.062, degree_centrality: 24, reach: '320K', community_id: 4, topic: 'Clean Energy' },
]

const DEFAULT_COMMUNITIES = [
  { community_id: 1, size: 48, dominant_topic: 'AI Governance & Autonomous Multi-Agent Systems', dominant_sentiment: 'positive', cohesion_score: 0.88, top_keywords: ['AIGovernance', 'AutonomousAI', 'ComputeAudit'] },
  { community_id: 2, size: 34, dominant_topic: 'Financial Inclusion & Macroeconomic Supply Chains', dominant_sentiment: 'neutral', cohesion_score: 0.82, top_keywords: ['CBDC', 'FinTech', 'SupplyChain'] },
  { community_id: 3, size: 28, dominant_topic: 'Infrastructure Disinformation & Algorithmic Bias', dominant_sentiment: 'negative', cohesion_score: 0.74, top_keywords: ['PowerGrid', 'CreditBias', 'Rumors'] },
  { community_id: 4, size: 22, dominant_topic: 'Renewable Clean Energy & Open STEM Higher Ed', dominant_sentiment: 'positive', cohesion_score: 0.91, top_keywords: ['SolarSurge', 'STEMEducation', 'GreenTech'] },
]

function NetworkPage() {
  const [graphData,    setGraphData]    = useState(DEFAULT_GRAPH_DATA)
  const [influencers,  setInfluencers]  = useState(DEFAULT_INFLUENCERS)
  const [communities,  setCommunities]  = useState(DEFAULT_COMMUNITIES)
  const [loading,      setLoading]      = useState(false)
  const [platform,     setPlatform]     = useState(null)
  const [topic,        setTopic]        = useState('all')
  const [timeRange,    setTimeRange]    = useState('24h')
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function syncData() {
      try {
        const [graphRes, influRes, commRes] = await Promise.allSettled([
          getGraphData(platform, 80),
          getInfluencers(10, platform),
          getCommunities(platform),
        ])

        if (!isMounted) return

        if (graphRes.status === 'fulfilled' && graphRes.value?.data?.nodes?.length > 0) {
          setGraphData(graphRes.value.data)
        }
        if (influRes.status === 'fulfilled' && influRes.value?.data?.length > 0) {
          setInfluencers(influRes.value.data)
        }
        if (commRes.status === 'fulfilled' && commRes.value?.data?.length > 0) {
          setCommunities(commRes.value.data)
        }
      } catch {
        // Retain optimistic graph telemetry
      }
    }
    syncData()
    return () => { isMounted = false }
  }, [platform, topic, timeRange])

  const influenceTypeColor = {
    'Key Opinion Leader': 'pink',
    'Bridge':             'yellow',
    'Broadcaster':        'blue',
    'Regular':            'gray',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        emoji="🕸️"
        title="Network Topology & Astroturfing Radar"
        subtitle="Force-directed graph, centrality metrics (PageRank/Betweenness/Degree), community detection & information cascades"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="
            h-9 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0
            bg-gradient-to-r from-[#4cd7f6] to-[#06b6d4] hover:from-[#38bdf8] hover:to-[#0891b2]
            text-black font-extrabold rounded-xl text-xs font-mono tracking-wider uppercase
            shadow-[0_0_15px_rgba(76,215,246,0.3)] hover:shadow-[0_0_20px_rgba(76,215,246,0.5)]
            active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          <span className={`text-xs ${loading ? 'animate-spin' : ''}`}>🔄</span>
          <span>{loading ? 'COMPUTING...' : 'RE-CALCULATE CENTRALITY'}</span>
        </button>
      </PageHeader>

      {/* Platform, Topic & Time Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: null, label: 'All Streams' },
            { id: 'twitter', label: 'X / Twitter' },
            { id: 'telegram', label: 'Telegram' },
            { id: 'instagram', label: 'Instagram' },
            { id: 'facebook', label: 'Facebook' },
            { id: 'reddit', label: 'Reddit' },
            { id: 'youtube', label: 'YouTube' },
          ].map(({ id: p, label }) => (
            <button
              key={p || 'all'}
              onClick={() => setPlatform(p)}
              className={`
                px-3 py-1 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5
                ${platform === p
                  ? 'bg-[rgba(76,215,246,0.18)] text-[#4cd7f6] border border-[#4cd7f6]/40 shadow-glow-cyan font-bold backdrop-blur-md'
                  : 'glass-control text-[#8ea0b5] hover:text-white hover:border-white/20'
                }
              `}
            >
              <PlatformLogo platform={p || 'all'} className="w-3.5 h-3.5" colored={true} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Topic & Time Filter Dropdowns */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="glass-control text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#4cd7f6]"
          >
            <option value="all" className="bg-[#060e20]">ALL NETWORK TOPICS</option>
            <option value="AI Governance" className="bg-[#060e20]">AI Governance</option>
            <option value="Grid Security" className="bg-[#060e20]">Grid Security</option>
            <option value="Autonomous AI" className="bg-[#060e20]">Autonomous AI</option>
            <option value="Macro Risk" className="bg-[#060e20]">Macro Risk</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="glass-control text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#4cd7f6]"
          >
            <option value="1h" className="bg-[#060e20]">LAST 1H</option>
            <option value="24h" className="bg-[#060e20]">LAST 24H</option>
            <option value="7d" className="bg-[#060e20]">LAST 7D</option>
            <option value="30d" className="bg-[#060e20]">LAST 30D</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Constructing network adjacency matrix & computing PageRank..." />
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard emoji="👤" label="Active Graph Nodes"   value={graphData.nodes?.length || '10'}  color="blue"   />
            <StatCard emoji="🔗" label="Interaction Edges"    value={graphData.edges?.length || '12'}  color="purple" />
            <StatCard emoji="⭐" label="Centrality Leaders"   value={influencers.length || '5'}        color="pink"   />
            <StatCard emoji="🏘️" label="Isolated Clusters"    value={communities.length || '4'}        color="cyan"   />
          </div>

          {/* Force-Directed Network Graph */}
          <NetworkGraph
            nodes={graphData.nodes}
            edges={graphData.edges}
            onNodeClick={setSelectedNode}
          />

          {/* Information Cascade & Spread Timeline */}
          <CascadeTimeline />

          {/* Two Columns: Influencer Leaderboard + Communities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* TOP INFLUENCERS LEADERBOARD */}
            <div className="liquid-glass rounded-2xl overflow-hidden shadow-glass-card relative group">
              <div className="glass-edge-top" />
              <div className="p-5 border-b border-white/10 flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ec4899] shadow-[0_0_8px_#ec4899]" />
                    ⭐ Key Opinion Leaders (KOLs) & Centrality
                  </h3>
                  <p className="text-[10px] text-[#8ea0b5] font-mono mt-0.5">
                    Measurable metrics: PageRank, Betweenness & Degree Centrality (Click to inspect node)
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#ec4899] font-bold">
                  RANKED BY INFLUENCE
                </span>
              </div>

              <div className="divide-y divide-white/5 max-h-[460px] overflow-y-auto relative z-10">
                {influencers.map((inf, i) => (
                  <div
                    key={inf.user_id_hashed}
                    onClick={() => setSelectedNode(inf)}
                    className="p-4 hover:bg-white/[0.06] transition-colors flex items-center gap-3.5 cursor-pointer group"
                  >
                    {/* Rank badge */}
                    <div className={`
                      w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 border
                      ${i === 0 ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.4)]' :
                        i === 1 ? 'bg-slate-300 text-black border-slate-200'   :
                        i === 2 ? 'bg-amber-700 text-white border-amber-600'  :
                                  'bg-black/40 text-[#8ea0b5] border-white/10'
                      }
                    `}>
                      {i + 1}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-xs font-mono font-bold truncate">
                          {inf.handle || `NODE_${inf.user_id_hashed.slice(0, 12)}...`}
                        </span>
                        <Badge
                          label={inf.influence_type}
                          color={influenceTypeColor[inf.influence_type] || 'gray'}
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#8ea0b5] mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-white font-semibold">
                          <PlatformLogo platform={inf.platform} className="w-3 h-3" colored={true} />
                          {inf.platform?.toUpperCase()}
                        </span>
                        <span>Reach: {inf.reach || '120K'}</span>
                        <span>Cluster: #{inf.community_id}</span>
                        <span className="text-cyan-400">Topic: {inf.topic}</span>
                      </div>
                    </div>

                    {/* Centrality Metrics Column */}
                    <div className="text-right flex-shrink-0 font-mono">
                      <div className="text-[#4cd7f6] text-sm font-bold">
                        {Number(inf.composite_influence_score).toFixed(3)}
                      </div>
                      <div className="text-[10px] text-[#8ea0b5]">
                        PR: {Number(inf.pagerank_score).toFixed(4)}
                      </div>
                      <div className="text-[9px] text-[#ddb7ff]">
                        Between: {Number(inf.betweenness_centrality || 0.08).toFixed(3)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMMUNITIES */}
            <div className="liquid-glass rounded-2xl overflow-hidden shadow-glass-card relative group">
              <div className="glass-edge-top" />
              <div className="p-5 border-b border-white/10 flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
                    🏘️ Community Swarm Detection
                  </h3>
                  <p className="text-[10px] text-[#8ea0b5] font-mono mt-0.5">
                    Modularity clusters with dominant topic and sentiment
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#4cd7f6] font-bold">
                  {communities.length} SWARMS DETECTED
                </span>
              </div>

              <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto relative z-10">
                {communities.map((comm, i) => {
                  const communityBorders = [
                    'border-cyan-500/30 shadow-[inset_0_1px_0_rgba(76,215,246,0.2)]',
                    'border-purple-500/30 shadow-[inset_0_1px_0_rgba(168,85,247,0.2)]',
                    'border-pink-500/30 shadow-[inset_0_1px_0_rgba(236,72,153,0.2)]',
                    'border-emerald-500/30 shadow-[inset_0_1px_0_rgba(16,185,129,0.2)]',
                  ]
                  return (
                    <div
                      key={comm.community_id}
                      className={`liquid-glass-soft border rounded-xl p-4 transition-all hover:bg-white/[0.06] ${communityBorders[i % communityBorders.length]}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-sm font-mono">
                          COMMUNITY CLUSTER #{comm.community_id}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 liquid-glass text-[#4cd7f6] border border-cyan-500/30 rounded-md font-bold">
                          {comm.size} NODES
                        </span>
                      </div>

                      {/* Dominant Topic */}
                      <div className="text-xs text-[#dae2fd] font-sans mb-2 font-medium">
                        Dominant Topic: <span className="text-white font-bold">{comm.dominant_topic}</span>
                      </div>

                      {/* Keywords */}
                      {comm.top_keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {comm.top_keywords.map((kw) => (
                            <span key={kw} className="text-[10px] font-mono liquid-glass-soft text-[#8ea0b5] px-1.5 py-0.5 rounded border border-white/10">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Cohesion Score */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-1 text-[#8ea0b5]">
                          <span>COHESION COEFFICIENT</span>
                          <span className="text-white font-bold">
                            {(comm.cohesion_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-[#4cd7f6] to-[#ddb7ff] rounded-full shadow-[0_0_8px_#4cd7f6]"
                            style={{ width: `${comm.cohesion_score * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Dominant Sentiment */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <Badge
                          label={`Polarity: ${comm.dominant_sentiment}`}
                          color={comm.dominant_sentiment === 'positive' ? 'green' : comm.dominant_sentiment === 'negative' ? 'red' : 'yellow'}
                        />
                        <span className="text-[10px] font-mono text-[#8ea0b5]">
                          Entropy: Nominal
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Node Detail Inspector Modal */}
      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}

export default NetworkPage
