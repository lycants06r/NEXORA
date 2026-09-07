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
      w-64 liquid-glass-strong border-r border-cyan-500/20
      flex flex-col h-full flex-shrink-0 relative z-20 shadow-[12px_0_40px_rgba(0,0,0,0.65)]
    ">
      {/* ── Logo / Brand (NEXORA Style) ────────────────────── */}
      <div className="p-5 border-b border-cyan-500/15 relative">
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10 bg-gradient-to-br from-[#4cd7f6] via-[#06b6d4] to-[#ddb7ff]
            rounded-xl flex items-center justify-center
            text-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_18px_rgba(76,215,246,0.4)]
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
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}   // Exact match for home
            className={({ isActive }) => `
              relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl
              text-xs font-medium transition-all duration-200 border
              ${isActive
                ? 'bg-[#4cd7f6]/15 text-[#4cd7f6] border-cyan-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(76,215,246,0.22)] font-semibold'
                : 'text-[#8ea0b5] border-transparent hover:bg-white/[0.05] hover:text-white hover:border-white/10 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
              }
            `}
          >
            <span className="text-base w-6 h-6 rounded-lg bg-black/30 border border-white/5 flex items-center justify-center flex-shrink-0 text-center">
              {item.emoji}
            </span>
            <span className="tracking-wide truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom: System Telemetry Status ───────────────── */}
      <div className="p-3.5 border-t border-cyan-500/15 bg-black/30">
        <div className="
          liquid-glass-soft p-3
          flex items-center gap-2.5 shadow-sm border border-cyan-500/20
        ">
          <div className="w-2.5 h-2.5 bg-[#4edea3] rounded-full animate-pulse shadow-[0_0_10px_#4edea3] flex-shrink-0" />
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
