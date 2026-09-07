/*
  RawDataViewer.jsx
  -----------------
  NEXORA Raw Data Stream Viewer.
  Features:
  - Text search
  - Multi-platform filter
  - Keyword / Hashtag filter
  - Date filter
  - Detailed table showing: Timestamp, Post/Message ID, Platform, Content, Engagement, Processing Status
  - Expandable row with full JSON normalized payload inspection
*/

import React, { useState, useMemo } from 'react'
import { NORMALIZED_RECORDS, PLATFORMS_CONFIG } from '../../api/normalizedData'
import PlatformLogo from '../common/PlatformLogo'

function RawDataViewer() {
  const [searchTerm, setSearchTerm]       = useState('')
  const [selectedPlatform, setPlatform]   = useState('all')
  const [selectedStatus, setStatus]       = useState('all')
  const [selectedRecord, setSelectedRecord] = useState(null)

  const filtered = NORMALIZED_RECORDS.filter((rec) => {
    if (selectedPlatform !== 'all' && rec.platform !== selectedPlatform) return false
    if (selectedStatus !== 'all' && rec.processing_status !== selectedStatus) return false
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      const matchText = rec.text.toLowerCase().includes(q)
      const matchTopic = rec.topic.toLowerCase().includes(q)
      const matchId = rec.post_id.toLowerCase().includes(q)
      const matchAuthor = (rec.author_name || '').toLowerCase().includes(q)
      if (!matchText && !matchTopic && !matchId && !matchAuthor) return false
    }
    return true
  })

  return (
    <div className="liquid-glass glass-edge-top p-5 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6] animate-pulse" />
            <span>📡 Normalized Raw Signal Stream Viewer</span>
          </h3>
          <p className="text-xs text-[#8ea0b5] font-mono mt-0.5">
            Real-time multi-platform message ingestion stream with timestamped schema
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#4cd7f6] px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_8px_rgba(76,215,246,0.15)] font-bold">
          SHOWING {filtered.length} OF {NORMALIZED_RECORDS.length} SIGNALS
        </span>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="🔍 Search content, IDs, topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-control rounded-xl px-3.5 py-2 text-white font-mono text-xs"
          />
        </div>

        {/* Platform Filter */}
        <div>
          <select
            value={selectedPlatform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full glass-control rounded-xl px-3 py-2 text-white font-mono text-xs"
          >
            {PLATFORMS_CONFIG.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#060e20] text-white">{p.icon} {p.label}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full glass-control rounded-xl px-3 py-2 text-white font-mono text-xs"
          >
            <option value="all" className="bg-[#060e20] text-white">Status: All Records</option>
            <option value="PROCESSED" className="bg-[#060e20] text-white">PROCESSED (Normalized)</option>
            <option value="FLAGGED" className="bg-[#060e20] text-white">FLAGGED (Threat Review)</option>
            <option value="INDEXED" className="bg-[#060e20] text-white">INDEXED (Database)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-table-container overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#030814]/90 text-[#8ea0b5] border-b border-cyan-500/20 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3">Platform</th>
              <th className="p-3">Message ID</th>
              <th className="p-3">Timestamp (UTC)</th>
              <th className="p-3">Normalized Content</th>
              <th className="p-3 text-right">Engagement</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[#dae2fd]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#8ea0b5]">
                  No signals match current filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((rec) => (
                <tr key={rec.post_id} className="hover:bg-cyan-500/[0.06] transition-colors">
                  {/* Platform */}
                  <td className="p-3 whitespace-nowrap">
                    <span className="capitalize font-bold text-white flex items-center gap-1.5">
                      <PlatformLogo platform={rec.platform} className="w-3.5 h-3.5" colored={true} />
                      {rec.platform === 'twitter' ? 'X / Twitter' :
                       rec.platform === 'telegram' ? 'Telegram' :
                       rec.platform === 'youtube' ? 'YouTube' :
                       rec.platform === 'reddit' ? 'Reddit' :
                       rec.platform === 'instagram' ? 'Instagram' : 'Facebook'}
                    </span>
                  </td>

                  {/* ID */}
                  <td className="p-3 whitespace-nowrap text-[#4cd7f6] font-bold">
                    {rec.post_id}
                  </td>

                  {/* Timestamp */}
                  <td className="p-3 whitespace-nowrap text-[#8ea0b5]">
                    {new Date(rec.timestamp).toLocaleTimeString()}
                  </td>

                  {/* Text */}
                  <td className="p-3 min-w-[280px] max-w-[360px]">
                    <div className="truncate text-white font-sans text-xs">
                      {rec.text}
                    </div>
                    <div className="text-[10px] text-[#8ea0b5] truncate mt-0.5">
                      Topic: {rec.topic}
                    </div>
                  </td>

                  {/* Engagement */}
                  <td className="p-3 whitespace-nowrap text-right text-[#4edea3] font-bold">
                    {(rec.engagement?.likes || 0).toLocaleString()} 💙
                  </td>

                  {/* Status */}
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.processing_status === 'PROCESSED'
                        ? 'bg-emerald-500/15 text-[#4edea3] border border-emerald-500/30 shadow-[0_0_8px_rgba(78,222,163,0.15)]'
                        : rec.processing_status === 'FLAGGED'
                        ? 'bg-rose-500/15 text-[#f43f5e] border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.15)]'
                        : 'bg-cyan-500/15 text-[#4cd7f6] border border-cyan-500/30 shadow-[0_0_8px_rgba(76,215,246,0.15)]'
                    }`}>
                      {rec.processing_status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedRecord(rec)}
                      className="px-2.5 py-1 rounded-lg glass-control text-[#4cd7f6] hover:text-white text-[10px] cursor-pointer"
                    >
                      JSON
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* JSON Payload Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="glass-modal p-6 w-full max-w-2xl max-h-[85vh] flex flex-col glass-edge-top">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
              <h4 className="text-white font-bold font-mono text-sm">
                Normalized Schema Payload: {selectedRecord.post_id}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-[#8ea0b5] hover:text-white font-mono text-base px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <pre className="flex-1 overflow-auto liquid-glass-soft p-4 rounded-xl border border-white/5 font-mono text-xs text-[#4cd7f6] leading-relaxed">
              {JSON.stringify(selectedRecord, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default RawDataViewer
