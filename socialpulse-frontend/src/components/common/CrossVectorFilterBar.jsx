/*
  CrossVectorFilterBar.jsx
  ------------------------
  NEXORA Cross-Vector Correlation Controller.
  Allows analysts to correlate:
  Platform + Date Range + Sentiment + Emotion + Topic + Demographic Segment + Community Cluster.
  Uses NEXORA cyberpunk glassmorphic styling with quick preset pills.
*/

import React, { useState } from 'react'
import { PLATFORMS_CONFIG, EMOTIONS_CONFIG, PROFESSIONAL_DOMAINS } from '../../api/normalizedData'
import PlatformLogo from './PlatformLogo'

function CrossVectorFilterBar({ filters, onFilterChange, className = '' }) {
  const [expanded, setExpanded] = useState(false)

  const topics = [
    'All Topics',
    'AI Governance & Safety Frameworks',
    'Critical Infrastructure Disinformation',
    'Autonomous Multi-Agent Architecture',
    'Semiconductor Supply & Macro Risk',
    'Renewable Clean Energy Transition',
    'Algorithmic Credit Model Bias'
  ]

  const dateRanges = [
    { id: '1h',  label: 'Last 1H' },
    { id: '24h', label: 'Last 24H' },
    { id: '7d',  label: 'Last 7D' },
    { id: '30d', label: 'Last 30D' },
    { id: 'custom', label: 'Custom Range' },
  ]

  const ageBrackets = ['All Ages', '18-24', '25-34', '35-44', '45+']
  const communities = ['All Clusters', 'Cluster #1 (Tech)', 'Cluster #2 (Finance)', 'Cluster #3 (Risk Swarm)', 'Cluster #4 (Academia)']

  const update = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  const resetFilters = () => {
    onFilterChange({
      platform: 'all',
      dateRange: '24h',
      sentiment: 'all',
      emotion: 'all',
      topic: 'All Topics',
      ageBracket: 'All Ages',
      professionalDomain: 'All Domains',
      community: 'All Clusters',
    })
  }

  const isFiltered = filters.platform !== 'all' ||
                     filters.dateRange !== '24h' ||
                     filters.sentiment !== 'all' ||
                     filters.emotion !== 'all' ||
                     filters.topic !== 'All Topics' ||
                     filters.ageBracket !== 'All Ages' ||
                     (filters.professionalDomain && filters.professionalDomain !== 'All Domains') ||
                     filters.community !== 'All Clusters'

  return (
    <div className={`liquid-glass glass-edge-top p-4 rounded-2xl ${className}`}>
      {/* Header with status */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] animate-pulse shadow-[0_0_10px_#4cd7f6]" />
          <h4 className="text-white font-extrabold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
            <span>⚡ Cross-Vector Correlation Engine</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-500/15 text-[#4cd7f6] border border-cyan-500/30 font-bold shadow-[0_0_8px_rgba(76,215,246,0.2)]">
              7-D MATRIX
            </span>
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-mono text-[#f43f5e] hover:underline cursor-pointer flex items-center gap-1"
            >
              ✕ Clear Filters
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="px-2.5 py-1 glass-control text-xs font-mono text-[#4cd7f6] cursor-pointer"
          >
            {expanded ? '▲ Collapse Vectors' : '▼ Deep Dimensional Drill'}
          </button>
        </div>
      </div>

      {/* Primary Row: Platform & Date Range */}
      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-white/5">
        {/* Platform Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {PLATFORMS_CONFIG.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => update('platform', p.id)}
              className={`
                px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap border cursor-pointer
                ${filters.platform === p.id
                  ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border-cyan-500/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_12px_rgba(76,215,246,0.3)]'
                  : 'glass-control text-[#8ea0b5] border-white/5 hover:border-white/20 hover:text-white'
                }
              `}
            >
              <span className="flex items-center gap-1.5">
                <PlatformLogo platform={p.id} className="w-3.5 h-3.5" colored={filters.platform === p.id} />
                <span>{p.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 ml-auto">
          {dateRanges.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => update('dateRange', d.id)}
              className={`
                px-2 py-1 rounded-lg text-[11px] font-mono transition-all border cursor-pointer
                ${filters.dateRange === d.id
                  ? 'bg-purple-500/25 text-[#ddb7ff] border-purple-500/50 font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_10px_rgba(221,183,255,0.25)]'
                  : 'glass-control text-[#8ea0b5] border-transparent hover:text-white'
                }
              `}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Multi-Vector Dimensional Controls */}
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-xs font-mono animate-slide-up">
          {/* 1. Topic Vector */}
          <div>
            <label className="block text-[10px] uppercase text-[#8ea0b5] mb-1 font-bold">
              Topic Entity
            </label>
            <select
              value={filters.topic}
              onChange={(e) => update('topic', e.target.value)}
              className="w-full glass-control rounded-xl px-2.5 py-1.5 text-white font-mono text-xs"
            >
              {topics.map((t) => (
                <option key={t} value={t} className="bg-[#060e20] text-white">{t}</option>
              ))}
            </select>
          </div>

          {/* 2. Sentiment / Emotion Vector */}
          <div>
            <label className="block text-[10px] uppercase text-[#8ea0b5] mb-1 font-bold">
              Emotion Taxonomy
            </label>
            <select
              value={filters.emotion}
              onChange={(e) => update('emotion', e.target.value)}
              className="w-full glass-control rounded-xl px-2.5 py-1.5 text-white font-mono text-xs"
            >
              <option value="all" className="bg-[#060e20] text-white">All Emotion Vectors</option>
              {EMOTIONS_CONFIG.map((em) => (
                <option key={em.id} value={em.id} className="bg-[#060e20] text-white">{em.label}</option>
              ))}
            </select>
          </div>

          {/* 3. Demographic Age Bracket Vector */}
          <div>
            <label className="block text-[10px] uppercase text-[#8ea0b5] mb-1 font-bold">
              Age Cohort (Aggregated)
            </label>
            <select
              value={filters.ageBracket}
              onChange={(e) => update('ageBracket', e.target.value)}
              className="w-full glass-control rounded-xl px-2.5 py-1.5 text-white font-mono text-xs"
            >
              {ageBrackets.map((age) => (
                <option key={age} value={age} className="bg-[#060e20] text-white">{age}</option>
              ))}
            </select>
          </div>

          {/* 4. Professional Domain Cluster */}
          <div>
            <label className="block text-[10px] uppercase text-[#8ea0b5] mb-1 font-bold">
              Inferred Industry Domain
            </label>
            <select
              value={filters.professionalDomain || 'All Domains'}
              onChange={(e) => update('professionalDomain', e.target.value)}
              className="w-full glass-control rounded-xl px-2.5 py-1.5 text-white font-mono text-xs"
            >
              <option value="All Domains" className="bg-[#060e20] text-white">All Industry Domains</option>
              {PROFESSIONAL_DOMAINS.map((domain) => (
                <option key={domain} value={domain} className="bg-[#060e20] text-white">{domain}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Correlation Formula readout */}
      <div className="mt-2.5 p-2.5 liquid-glass-soft border border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8ea0b5] rounded-xl">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#4cd7f6] font-bold">Active Correlation:</span>
          <span>Platform[{filters.platform.toUpperCase()}]</span>
          <span>×</span>
          <span>Window[{filters.dateRange.toUpperCase()}]</span>
          <span>×</span>
          <span>Topic[{filters.topic === 'All Topics' ? '*' : filters.topic}]</span>
          <span>×</span>
          <span>Emotion[{filters.emotion.toUpperCase()}]</span>
          <span>×</span>
          <span>Demo[{filters.ageBracket}]</span>
        </div>
        <span className="text-emerald-400 font-bold hidden sm:inline">
          ✓ REAL-TIME CORRELATION ACTIVE
        </span>
      </div>
    </div>
  )
}

export default CrossVectorFilterBar
