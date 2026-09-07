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
      w-64 bg-[#060e20]/80 backdrop-blur-2xl border-r border-cyan-500/20
      flex flex-col h-full flex-shrink-0 relative z-20 shadow-[10px_0_35px_rgba(0,0,0,0.65)]
      glass-specular-edge
    ">
      {/* ── Logo / Brand (NEXORA Style) ────────────────────── */}
      <div className="p-5 border-b border-cyan-500/15 relative overflow-hidden">
        {/* Subtle radial sheen behind logo */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="
            w-9 h-9 bg-gradient-to-br from-[#4cd7f6] via-[#06b6d4] to-[#ddb7ff]
            rounded-xl flex items-center justify-center
            text-lg shadow-[0_0_20px_rgba(76,215,246,0.4)]
            text-black font-black flex-shrink-0
          ">
            ⚡
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-extrabold text-sm tracking-wider uppercase leading-none">
              NEXORA
            </h1>
            <p className="text-[10px] text-[#8ea0b5] font-mono tracking-widest uppercase mt-1">
              INTEL PLATFORM
            </p>
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
              text-xs font-medium transition-all duration-200 border
              ${isActive
                ? 'bg-gradient-to-r from-cyan-500/20 via-[#4cd7f6]/10 to-transparent text-[#4cd7f6] border-cyan-500/50 shadow-[0_4px_20px_rgba(76,215,246,0.25)] font-bold translate-x-1'
                : 'text-[#8ea0b5] border-transparent hover:bg-white/[0.04] hover:text-white hover:border-white/10 hover:translate-x-0.5'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#4cd7f6] shadow-[0_0_10px_#4cd7f6]" />
                )}
                <span className="text-base w-5 text-center flex-shrink-0">{item.emoji}</span>
                <span className="tracking-wide truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: System Telemetry Status ───────────────── */}
      <div className="p-3.5 border-t border-cyan-500/15 bg-black/30">
        <div className="
          bg-gradient-to-r from-[#0b1428]/95 to-[#081122]/90 border border-cyan-500/25 rounded-xl p-3
          flex items-center gap-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.4)] relative overflow-hidden
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
