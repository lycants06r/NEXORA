/*
  RawDataExplorer.jsx
  -------------------
  Raw data explorer with advanced search, filtering, and JSON preview.
  Enhanced version of RawDataViewer for Platform Analytics.
*/

import React, { useState, useMemo } from 'react'
import { NORMALIZED_RECORDS, PLATFORMS_CONFIG } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo.jsx'

function RawDataExplorer({ selectedPlatform = 'all' }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState('all') // 'all' | 'author' | 'content' | 'id'
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  const filtered = useMemo(() => {
    let result = [...NORMALIZED_RECORDS]

    // Platform filter
    if (selectedPlatform !== 'all') {
      result = result.filter(r => r.platform === selectedPlatform)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(r => r.processing_status === statusFilter)
    }

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(r => {
        switch (searchField) {
          case 'author':
            return (r.author_name || '').toLowerCase().includes(q) ||
                   (r.author_id || '').toLowerCase().includes(q)
          case 'content':
            return (r.text || '').toLowerCase().includes(q)
          case 'id':
            return (r.post_id || '').toLowerCase().includes(q)
          default:
            return (r.text || '').toLowerCase().includes(q) ||
                   (r.author_name || '').toLowerCase().includes(q) ||
                   (r.post_id || '').toLowerCase().includes(q) ||
                   (r.topic || '').toLowerCase().includes(q)
        }
      })
    }

    // Sort
    result.sort((a, b) => {
      const diff = new Date(b.timestamp) - new Date(a.timestamp)
      return sortOrder === 'newest' ? diff : -diff
    })

    return result
  }, [selectedPlatform, statusFilter, searchTerm, searchField, sortOrder])

  const handleCopy = (rec) => {
    const jsonStr = JSON.stringify(rec, null, 2)
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopiedId(rec.post_id)
      setTimeout(() => setCopiedId(null), 2000)
    }).catch(() => {})
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden">
        <div className="glass-edge-top" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 relative z-10">
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6] animate-pulse" />
              🔬 Raw Data Explorer
            </h3>
            <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
              Full normalized schema inspection with JSON payload viewer
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#4cd7f6] px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 font-bold">
            {filtered.length} OF {NORMALIZED_RECORDS.length} RECORDS
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 relative z-10">
          <div className="sm:col-span-2 flex gap-2">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="glass-control rounded-xl px-2.5 py-2 text-white font-mono text-xs w-28 flex-shrink-0"
            >
              <option value="all" className="bg-[#060e20]">All Fields</option>
              <option value="author" className="bg-[#060e20]">Author</option>
              <option value="content" className="bg-[#060e20]">Content</option>
              <option value="id" className="bg-[#060e20]">Source ID</option>
            </select>
            <input
              type="text"
              placeholder="🔍 Search raw data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-control rounded-xl px-3 py-2 text-white font-mono text-xs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-control rounded-xl px-3 py-2 text-white font-mono text-xs"
          >
            <option value="all" className="bg-[#060e20]">All Statuses</option>
            <option value="PROCESSED" className="bg-[#060e20]">PROCESSED</option>
            <option value="FLAGGED" className="bg-[#060e20]">FLAGGED</option>
            <option value="INDEXED" className="bg-[#060e20]">INDEXED</option>
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

        {/* Records List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 relative z-10">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#8ea0b5] font-mono text-xs">
              <div className="text-4xl mb-3">🔍</div>
              <p>No raw records match current search and filter criteria.</p>
            </div>
          ) : (
            filtered.map((rec) => (
              <div
                key={rec.post_id}
                className="p-3.5 liquid-glass-soft border border-white/10 hover:border-cyan-500/25 rounded-xl transition-all"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <PlatformLogo platform={rec.platform} className="w-3.5 h-3.5" colored={true} />
                    <span className="text-[#4cd7f6] font-mono text-[11px] font-bold">{rec.post_id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      rec.processing_status === 'PROCESSED'
                        ? 'bg-emerald-500/15 text-[#4edea3] border-emerald-500/30'
                        : rec.processing_status === 'FLAGGED'
                        ? 'bg-rose-500/15 text-[#f43f5e] border-rose-500/30'
                        : 'bg-cyan-500/15 text-[#4cd7f6] border-cyan-500/30'
                    }`}>
                      {rec.processing_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#8ea0b5]">
                      {new Date(rec.timestamp).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(rec)}
                      className="px-2 py-0.5 rounded glass-control text-[9px] font-mono text-[#4cd7f6] hover:text-white cursor-pointer font-bold"
                    >
                      {copiedId === rec.post_id ? '✅ Copied' : '📋 Copy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(selectedRecord?.post_id === rec.post_id ? null : rec)}
                      className="px-2 py-0.5 rounded glass-control text-[9px] font-mono text-[#4cd7f6] hover:text-white cursor-pointer font-bold"
                    >
                      {selectedRecord?.post_id === rec.post_id ? '▲ Close' : '{ } JSON'}
                    </button>
                  </div>
                </div>

                {/* Author + Content */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-white">{rec.author_name || rec.author_id}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold uppercase ${
                    rec.sentiment === 'positive' ? 'bg-emerald-500/10 text-[#4edea3] border-emerald-500/30'
                    : rec.sentiment === 'negative' ? 'bg-rose-500/10 text-[#f43f5e] border-rose-500/30'
                    : 'bg-cyan-500/10 text-[#4cd7f6] border-cyan-500/30'
                  }`}>
                    {rec.emotion || rec.sentiment}
                  </span>
                </div>
                <p className="text-[11px] text-[#dae2fd] line-clamp-2 font-sans">{rec.text}</p>

                {/* Expanded JSON */}
                {selectedRecord?.post_id === rec.post_id && (
                  <div className="mt-3 animate-fade-in">
                    <pre className="liquid-glass-soft p-3 rounded-xl border border-white/5 font-mono text-[10px] text-[#4cd7f6] leading-relaxed overflow-auto max-h-64">
                      {JSON.stringify(rec, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default RawDataExplorer
