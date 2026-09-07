/*
  ActivityFeed.jsx
  ----------------
  Unified platform activity viewer with tabs: ALL | POSTS | COMMENTS | REPLIES | INTERACTIONS.
  Displays posts, comments, replies from NORMALIZED_RECORDS including thread_replies.
*/

import React, { useState, useMemo } from 'react'
import { NORMALIZED_RECORDS } from '../../api/normalizedData'
import InteractionCard from './InteractionCard.jsx'

const TABS = [
  { id: 'all',          label: 'All' },
  { id: 'posts',        label: 'Posts' },
  { id: 'comments',     label: 'Comments' },
  { id: 'replies',      label: 'Replies' },
  { id: 'interactions', label: 'Interactions' },
]

function ActivityFeed({ selectedPlatform = 'all' }) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Build unified activity list from NORMALIZED_RECORDS + thread_replies
  const allItems = useMemo(() => {
    const items = []

    NORMALIZED_RECORDS.forEach((rec) => {
      // Platform filter
      if (selectedPlatform !== 'all' && rec.platform !== selectedPlatform) return

      // Main posts
      items.push({ ...rec, _type: 'post' })

      // Thread replies become comments/replies
      if (rec.thread_replies && rec.thread_replies.length > 0) {
        rec.thread_replies.forEach((reply) => {
          items.push({
            ...reply,
            platform: rec.platform,
            topic: rec.topic,
            engagement: reply.engagement || { likes: 0, shares: 0, replies: 0, views: 0 },
            _type: rec.reply_to ? 'reply' : 'comment',
            _parentId: rec.post_id,
          })
        })
      }
    })

    return items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [selectedPlatform])

  // Filter by tab
  const filteredItems = useMemo(() => {
    let result = allItems

    switch (activeTab) {
      case 'posts':
        result = result.filter(i => i._type === 'post')
        break
      case 'comments':
        result = result.filter(i => i._type === 'comment')
        break
      case 'replies':
        result = result.filter(i => i._type === 'reply' || i._type === 'comment')
        break
      case 'interactions':
        result = result.filter(i => i._type !== 'post')
        break
      default:
        break
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(i =>
        (i.text || '').toLowerCase().includes(q) ||
        (i.author_name || '').toLowerCase().includes(q) ||
        (i.topic || '').toLowerCase().includes(q)
      )
    }

    return result
  }, [allItems, activeTab, searchTerm])

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header with search */}
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 relative z-10">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6] animate-pulse" />
            Platform Activity Feed
          </h3>
          <span className="text-[11px] font-mono text-[#4cd7f6] px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 font-bold">
            {filteredItems.length} ITEMS
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap relative z-10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'glass-tab-active'
                  : 'glass-control text-[#8ea0b5] hover:text-white hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex-1 min-w-[160px]">
            <input
              type="text"
              placeholder="🔍 Search activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-control rounded-lg px-3 py-1.5 text-white font-mono text-[10px]"
            />
          </div>
        </div>

        {/* Activity Items */}
        <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1 relative z-10">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-[#8ea0b5] font-mono text-xs">
              <div className="text-4xl mb-3">📭</div>
              <p>No activity data available for this platform and filter.</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <InteractionCard
                key={item.post_id || `item-${idx}`}
                item={item}
                type={item._type}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityFeed
