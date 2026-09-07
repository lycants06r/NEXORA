/*
  Sidebar.jsx
  -----------
  Left navigation sidebar with NEXORA-inspired cyberpunk glassmorphism.
  Active page is highlighted with neon cyan glow.
*/

import React from 'react'
import { NavLink } from 'react-router-dom'

// Navigation items config
// emoji = icon | path = URL | label = menu text
const NAV_ITEMS = [
  { emoji: '⚡', label: 'Dashboard',           path: '/'            },
  { emoji: '📱', label: 'Platform Analytics',  path: '/analytics'   },
  { emoji: '📥', label: 'Data Ingestion',      path: '/ingestion'   },
  { emoji: '💬', label: 'Sentiment Radar',     path: '/sentiment'   },
  { emoji: '👥', label: 'Demographics',        path: '/demographics'},
  { emoji: '📈', label: 'Viral Trends',        path: '/trends'      },
  { emoji: '🕸️', label: 'Network Topology',    path: '/network'     },
  { emoji: '🧠', label: 'AI 5-Vector Insights',path: '/ai-insights' },
  { emoji: '🚨', label: 'Threat Alerts',       path: '/alerts'      },
]

function Sidebar() {
  return (
    <aside className="
      w-64 bg-[#060e20]/85 backdrop-blur-2xl border-r border-cyan-500/20
      flex flex-col h-full flex-shrink-0 relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]
    ">
      {/* ── Logo / Brand (NEXORA Style) ────────────────────── */}
      <div className="p-5 border-b border-cyan-500/15">
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10 bg-gradient-to-br from-[#4cd7f6] via-[#06b6d4] to-[#ddb7ff]
            rounded-xl flex items-center justify-center
            text-xl shadow-[0_0_15px_rgba(76,215,246,0.35)]
            text-black font-black flex-shrink-0
          ">
            ⚡
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-black text-xl tracking-wider uppercase leading-none">
              NEXORA
            </h1>
          </div>
        </div>
      </div>

      {/* ── Navigation Links ─────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}   // Exact match for home
            className={({ isActive }) => `
              relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl
              text-xs font-medium transition-all duration-150 border
              ${isActive
                ? 'bg-[#4cd7f6]/15 text-[#4cd7f6] border-cyan-500/40 shadow-[0_0_15px_rgba(76,215,246,0.2)] font-semibold'
                : 'text-[#8ea0b5] border-transparent hover:bg-white/[0.04] hover:text-white hover:border-white/5'
              }
            `}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{item.emoji}</span>
            <span className="tracking-wide truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: System Telemetry Status ───────────────── */}
      <div className="p-3.5 border-t border-cyan-500/15 bg-black/25">
        <div className="
          bg-[#0b1428]/90 border border-cyan-500/20 rounded-xl p-3
          flex items-center gap-2.5 shadow-sm
        ">
          <div className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse shadow-[0_0_8px_#4edea3] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold tracking-wide">
              Telemetry Active
            </p>
            <p className="text-[10px] text-[#8ea0b5] font-mono truncate mt-0.5">
              Cloud Engine · Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
