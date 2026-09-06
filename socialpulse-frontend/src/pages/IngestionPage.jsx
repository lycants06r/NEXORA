/*
  IngestionPage.jsx
  -----------------
  Allows users to:
  1. Trigger data collection from any platform
  2. See task status in real-time
  3. Browse recently collected posts
  With NEXORA glassmorphic telemetry theme.
*/

import React, { useState, useEffect } from 'react'
import PageHeader     from '../components/common/PageHeader.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import CollectForm    from '../components/ingestion/CollectForm.jsx'
import TaskStatusCard from '../components/ingestion/TaskStatusCard.jsx'
import PostCard       from '../components/ingestion/PostCard.jsx'
import StatCard       from '../components/common/StatCard.jsx'
import {
  triggerCollection,
  getRecentPosts,
  getCollectionStats,
  collectAllPlatforms,
} from '../api/ingestionApi'

function IngestionPage() {
  const [tasks,     setTasks]     = useState([])
  const [posts,     setPosts]     = useState([])
  const [stats,     setStats]     = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [postsLoading, setPostsLoading] = useState(true)
  const [platform,  setPlatform]  = useState(null)

  useEffect(() => {
    loadPosts()
    loadStats()
  }, [])

  async function loadPosts() {
    setPostsLoading(true)
    try {
      const res = await getRecentPosts(platform, 30)
      setPosts(res?.data?.posts || [])
    } catch {
      setPosts([])
    } finally {
      setPostsLoading(false)
    }
  }

  async function loadStats() {
    try {
      const res = await getCollectionStats()
      setStats(res?.data)
    } catch {}
  }

  async function handleCollect({ platform, query, maxResults }) {
    setLoading(true)
    try {
      const res = await triggerCollection(platform, query, maxResults)
      setTasks((prev) => [res.data, ...prev])
    } catch (err) {
      alert('Failed to start collection: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCollectAll() {
    try {
      await collectAllPlatforms()
      alert('✅ Global ingestion triggered across all platforms!')
    } catch {
      alert('Failed to trigger all platforms.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="📥"
        title="Real-Time Data Ingestion Pipeline"
        subtitle="Autonomous signal streaming, AT Protocol Firehose & social network ingestion"
      >
        <button
          onClick={handleCollectAll}
          className="
            px-4 py-2 bg-gradient-to-r from-purple-500 to-[#ddb7ff] hover:from-purple-400 hover:to-[#ecd4ff]
            text-black rounded-xl text-xs font-mono font-extrabold tracking-wider uppercase
            shadow-[0_0_15px_rgba(221,183,255,0.3)] transition-all cursor-pointer
          "
        >
          🌐 Collect All Platforms
        </button>
      </PageHeader>

      {/* ── Stats Row ──────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard emoji="📝" label="Total Ingested Signals" value={stats.total_posts?.toLocaleString() || '0'} color="blue"   />
          <StatCard emoji="🐦" label="Twitter / X Stream"     value={stats.by_platform?.twitter  || '0'} color="cyan"   />
          <StatCard emoji="🤖" label="Reddit Submissions"     value={stats.by_platform?.reddit   || '0'} color="yellow" />
          <StatCard emoji="📺" label="YouTube Telemetry"      value={stats.by_platform?.youtube  || '0'} color="red"    />
        </div>
      )}

      {/* ── Two Column Layout ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Collection Form + Tasks */}
        <div className="space-y-4">
          <CollectForm onSubmit={handleCollect} isLoading={loading} />

          {/* Active/Recent Tasks */}
          {tasks.length > 0 && (
            <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
                  📋 Dispatch Task Telemetry
                </h3>
                <span className="text-[11px] font-mono text-[#4cd7f6]">
                  {tasks.length} JOBS
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <TaskStatusCard key={task.task_id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Recent Posts Feed */}
        <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
              📰 Live Ingested Feed
            </h3>
            <button
              onClick={loadPosts}
              className="text-xs font-mono text-[#4cd7f6] hover:underline flex items-center gap-1"
            >
              🔄 SYNC STREAM
            </button>
          </div>

          {/* Platform Filter Tabs */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {[null, 'twitter', 'reddit', 'youtube', 'telegram'].map((p) => (
              <button
                key={p || 'all'}
                onClick={() => { setPlatform(p); loadPosts() }}
                className={`
                  px-3 py-1 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider
                  transition-all
                  ${platform === p
                    ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-cyan-500/40 shadow-[0_0_10px_rgba(76,215,246,0.2)]'
                    : 'bg-black/30 text-[#8ea0b5] border border-white/5 hover:text-white'
                  }
                `}
              >
                {p || 'All'}
              </button>
            ))}
          </div>

          {/* Posts list */}
          {postsLoading ? (
            <LoadingSpinner message="Ingesting raw firehose messages..." />
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-[#8ea0b5] font-mono text-sm">
              <div className="text-4xl mb-3">📭</div>
              <p>No posts in memory store yet. Dispatch a collection query!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {posts.map((post) => (
                <PostCard key={post.record_id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IngestionPage
