/*
  HistoricalDataTable.jsx
  -----------------------
  Historical data viewer with real records from NORMALIZED_RECORDS.
  Features: date-range filter, platform filter, content-type filter,
  search, sorting, pagination, expand record details.
*/

import React, { useState, useMemo } from 'react'
import { NORMALIZED_RECORDS, PLATFORMS_CONFIG } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo.jsx'
import DateRangeFilter from './DateRangeFilter.jsx'

const PAGE_SIZE = 10

function HistoricalDataTable({ selectedPlatform = 'all' }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest') // 'newest' | 'oldest'
  const [contentType, setContentType] = useState('all') // 'all' | 'post' | 'comment'
  const [dateRange, setDateRange] = useState({ preset: 'all', startDate: null, endDate: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedId, setExpandedId] = useState(null)

  // Build complete records list (posts + replies)
  const allRecords = useMemo(() => {
    const records = []
    NORMALIZED_RECORDS.forEach((rec) => {
      records.push({ ...rec, _type: 'post' })
      if (rec.thread_replies) {
        rec.thread_replies.forEach((reply) => {
          records.push({
            ...reply,
            platform: rec.platform,
            topic: rec.topic,
            engagement: reply.engagement || { likes: 0, shares: 0, replies: 0, views: 0 },
            _type: 'comment',
          })
        })
      }
    })
    return records
  }, [])

  // Apply filters
  const filteredRecords = useMemo(() => {
    let result = [...allRecords]

    // Platform filter
    if (selectedPlatform !== 'all') {
      result = result.filter(r => r.platform === selectedPlatform)
    }

    // Content type filter
    if (contentType !== 'all') {
      result = result.filter(r => r._type === contentType)
    }

    // Date range filter
    if (dateRange.startDate) {
      result = result.filter(r => new Date(r.timestamp) >= dateRange.startDate)
    }
    if (dateRange.endDate && dateRange.preset !== 'all') {
      result = result.filter(r => new Date(r.timestamp) <= dateRange.endDate)
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(r =>
        (r.text || '').toLowerCase().includes(q) ||
        (r.author_name || '').toLowerCase().includes(q) ||
        (r.post_id || '').toLowerCase().includes(q) ||
        (r.topic || '').toLowerCase().includes(q)
      )
    }

    // Sort
    result.sort((a, b) => {
      const diff = new Date(b.timestamp) - new Date(a.timestamp)
      return sortOrder === 'newest' ? diff : -diff
    })

    return result
  }, [allRecords, selectedPlatform, contentType, dateRange, searchTerm, sortOrder])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE))
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const platformLabel = (platform) => {
    const config = PLATFORMS_CONFIG.find(p => p.id === platform)
    return config ? config.label : platform
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 relative z-10">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ddb7ff] shadow-[0_0_10px_#ddb7ff] animate-pulse" />
            📚 Historical Data Archive
          </h3>
          <span className="text-[11px] font-mono text-[#4cd7f6] px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 font-bold">
            {filteredRecords.length} RECORDS
          </span>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3 mb-4 relative z-10">
          <input
            type="text"
            placeholder="🔍 Search records..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="glass-control rounded-xl px-3 py-2 text-white font-mono text-xs flex-1 min-w-[180px]"
          />
          <select
            value={contentType}
            onChange={(e) => { setContentType(e.target.value); setCurrentPage(1) }}
            className="glass-control rounded-xl px-3 py-2 text-white font-mono text-xs"
          >
            <option value="all" className="bg-[#060e20]">All Types</option>
            <option value="post" className="bg-[#060e20]">Posts Only</option>
            <option value="comment" className="bg-[#060e20]">Comments / Replies</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="glass-control rounded-xl px-3 py-2 text-white font-mono text-xs"
          >
            <option value="newest" className="bg-[#060e20]">Newest First</option>
            <option value="oldest" className="bg-[#060e20]">Oldest First</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="mb-4 relative z-10">
          <DateRangeFilter
            selectedPreset={dateRange.preset}
            onRangeChange={(range) => { setDateRange(range); setCurrentPage(1) }}
          />
        </div>

        {/* Data Table */}
        <div className="glass-table-container overflow-x-auto relative z-10">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#030814]/90 text-[#8ea0b5] border-b border-cyan-500/20 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Date / Time</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Author</th>
                <th className="p-3">Content</th>
                <th className="p-3">Type</th>
                <th className="p-3">Sentiment</th>
                <th className="p-3 text-right">Engagement</th>
                <th className="p-3 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#dae2fd]">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#8ea0b5]">
                    <div className="text-3xl mb-2">📭</div>
                    No historical records match current filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec) => (
                  <React.Fragment key={rec.post_id}>
                    <tr className="hover:bg-cyan-500/[0.06] transition-colors">
                      <td className="p-3 whitespace-nowrap text-[#8ea0b5]">
                        <div>{new Date(rec.timestamp).toLocaleDateString()}</div>
                        <div className="text-[10px]">{new Date(rec.timestamp).toLocaleTimeString()}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 font-bold text-white">
                          <PlatformLogo platform={rec.platform} className="w-3.5 h-3.5" colored={true} />
                          {platformLabel(rec.platform)}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-[#4cd7f6] font-bold">
                        {rec.author_name || rec.author_id || '—'}
                      </td>
                      <td className="p-3 min-w-[220px] max-w-[320px]">
                        <div className="truncate text-white font-sans text-xs">{rec.text}</div>
                        {rec.topic && <div className="text-[10px] text-[#8ea0b5] truncate mt-0.5">Topic: {rec.topic}</div>}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/5 border border-white/10 text-[#8ea0b5]">
                          {rec._type}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          rec.sentiment === 'positive' ? 'bg-emerald-500/10 text-[#4edea3] border-emerald-500/30'
                          : rec.sentiment === 'negative' ? 'bg-rose-500/10 text-[#f43f5e] border-rose-500/30'
                          : 'bg-cyan-500/10 text-[#4cd7f6] border-cyan-500/30'
                        }`}>
                          {rec.sentiment || '—'}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-right text-[#4edea3] font-bold">
                        {(rec.engagement?.likes || 0).toLocaleString()} ❤️
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === rec.post_id ? null : rec.post_id)}
                          className="px-2.5 py-1 rounded-lg glass-control text-[#4cd7f6] hover:text-white text-[10px] cursor-pointer font-bold"
                        >
                          {expandedId === rec.post_id ? '▲ Close' : '▼ Expand'}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {expandedId === rec.post_id && (
                      <tr>
                        <td colSpan={8} className="p-4 bg-black/30">
                          <div className="liquid-glass-soft border border-white/10 rounded-xl p-4 text-xs font-mono space-y-2">
                            <div><span className="text-[#8ea0b5]">Record ID:</span> <span className="text-[#4cd7f6] font-bold">{rec.post_id}</span></div>
                            <div><span className="text-[#8ea0b5]">Full Text:</span> <span className="text-white">{rec.text}</span></div>
                            {rec.emotion && <div><span className="text-[#8ea0b5]">Emotion:</span> <span className="text-[#ddb7ff]">{rec.emotion}</span></div>}
                            {rec.confidence && <div><span className="text-[#8ea0b5]">Confidence:</span> <span className="text-[#4edea3]">{(rec.confidence * 100).toFixed(1)}%</span></div>}
                            {rec.hashtags && rec.hashtags.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[#8ea0b5]">Tags:</span>
                                {rec.hashtags.map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[#4cd7f6] text-[9px]">#{tag}</span>
                                ))}
                              </div>
                            )}
                            {rec.location_hint && (
                              <div><span className="text-[#8ea0b5]">Location:</span> <span className="text-white">{rec.location_hint.city}, {rec.location_hint.region}, {rec.location_hint.country}</span></div>
                            )}
                            {rec.engagement && (
                              <div className="flex items-center gap-4 text-[#8ea0b5]">
                                <span>❤️ {(rec.engagement.likes || 0).toLocaleString()}</span>
                                <span>🔁 {(rec.engagement.shares || rec.engagement.retweets || 0).toLocaleString()}</span>
                                <span>💬 {(rec.engagement.replies || 0).toLocaleString()}</span>
                                <span>👁️ {(rec.engagement.views || 0).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 relative z-10">
            <span className="text-[10px] font-mono text-[#8ea0b5]">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg glass-control text-xs font-mono cursor-pointer disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                    currentPage === page ? 'glass-tab-active' : 'glass-control text-[#8ea0b5]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg glass-control text-xs font-mono cursor-pointer disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoricalDataTable
