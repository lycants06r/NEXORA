/*
  NetworkGraph.jsx
  ----------------
  Force-directed network graph showing user connections with NEXORA cyberpunk intelligence styling.
  Nodes = users (size = influence score)
  Edges = connections (mentions, retweets, replies)
*/

import React, { useEffect, useState } from 'react'

// Color by influence type (NEXORA cyberpunk accents)
const NODE_COLORS = {
  'Key Opinion Leader': '#ec4899',
  'Bridge':             '#f59e0b',
  'Broadcaster':        '#4cd7f6',
  'Regular':            '#8ea0b5',
}

// Simple physics simulation using requestAnimationFrame
function useForceSimulation(nodes, edges, width, height) {
  const [positions, setPositions] = useState(() => {
    return nodes.reduce((acc, node) => {
      acc[node.id] = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
      }
      return acc
    }, {})
  })

  useEffect(() => {
    if (nodes.length === 0) return

    let frame
    let ticks = 0
    const maxTicks = 150

    function tick() {
      if (ticks >= maxTicks) return

      setPositions((prev) => {
        const next = { ...prev }
        const nodeIds = nodes.map((n) => n.id)

        for (let i = 0; i < nodeIds.length; i++) {
          for (let j = i + 1; j < nodeIds.length; j++) {
            const a = next[nodeIds[i]]
            const b = next[nodeIds[j]]
            if (!a || !b) continue

            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const force = 1500 / (dist * dist)

            next[nodeIds[i]] = {
              ...a,
              vx: a.vx + (dx / dist) * force,
              vy: a.vy + (dy / dist) * force,
            }
            next[nodeIds[j]] = {
              ...b,
              vx: b.vx - (dx / dist) * force,
              vy: b.vy - (dy / dist) * force,
            }
          }
        }

        edges.forEach(({ source, target }) => {
          const a = next[source]
          const b = next[target]
          if (!a || !b) return

          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const ideal = 120
          const force  = (dist - ideal) * 0.05

          next[source] = {
            ...a,
            vx: a.vx + (dx / dist) * force,
            vy: a.vy + (dy / dist) * force,
          }
          next[target] = {
            ...b,
            vx: b.vx - (dx / dist) * force,
            vy: b.vy - (dy / dist) * force,
          }
        })

        nodeIds.forEach((id) => {
          const n = next[id]
          if (!n) return
          const damping = 0.7
          next[id] = {
            x:  Math.max(30, Math.min(width  - 30, n.x + n.vx)),
            y:  Math.max(30, Math.min(height - 30, n.y + n.vy)),
            vx: n.vx * damping,
            vy: n.vy * damping,
          }
        })

        return next
      })

      ticks++
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [nodes, edges, width, height])

  return positions
}

function NetworkGraph({ nodes = [], edges = [] }) {
  const WIDTH  = 700
  const HEIGHT = 450

  const positions = useForceSimulation(nodes, edges, WIDTH, HEIGHT)
  const [hovered, setHovered] = useState(null)

  const getRadius = (node) => {
    const base = 8
    const bonus = Math.min((node.composite_influence_score || 0) * 40, 20)
    return base + bonus
  }

  return (
    <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden group">
      {/* Specular Edge Sheen */}
      <div className="glass-edge-top" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2 relative z-10">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
          🕸️ Force-Directed Influence Topology
        </h3>

        {/* Legend */}
        <div className="flex items-center gap-3 liquid-glass-soft px-3 py-1.5 rounded-xl border border-white/10">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5 font-mono text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
              />
              <span className="text-[#8ea0b5]">
                {type.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="text-center py-16 text-[#8ea0b5] font-mono text-sm">
          No network telemetry data yet. Ingest platform data to map relationships.
        </div>
      ) : (
        <svg
          width="100%"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          style={{ background: 'rgba(2, 6, 18, 0.75)', borderRadius: '14px', border: '1px solid rgba(76, 215, 246, 0.2)' }}
        >
          {/* Draw edges first */}
          {edges.map((edge, i) => {
            const source = positions[edge.source]
            const target = positions[edge.target]
            if (!source || !target) return null

            return (
              <line
                key={i}
                x1={source.x} y1={source.y}
                x2={target.x} y2={target.y}
                stroke="rgba(76, 215, 246, 0.25)"
                strokeWidth={Math.min(edge.weight || 1, 3)}
              />
            )
          })}

          {/* Draw nodes on top of edges */}
          {nodes.map((node) => {
            const pos = positions[node.id]
            if (!pos) return null

            const radius = getRadius(node)
            const color  = NODE_COLORS[node.influence_type] || NODE_COLORS.Regular
            const isHovered = hovered === node.id

            return (
              <g
                key={node.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={radius + 8}
                    fill={color}
                    opacity={0.3}
                  />
                )}
                {/* Node circle */}
                <circle
                  cx={pos.x} cy={pos.y}
                  r={radius}
                  fill={color}
                  opacity={isHovered ? 1 : 0.85}
                  stroke={isHovered ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={2}
                  style={{ filter: isHovered ? `drop-shadow(0 0 10px ${color})` : 'none' }}
                />

                {/* Tooltip box on hover */}
                {isHovered && (
                  <foreignObject
                    x={pos.x + radius + 8}
                    y={pos.y - 45}
                    width={170}
                    height={85}
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        background:   'rgba(6, 14, 32, 0.95)',
                        border:       '1px solid rgba(76, 215, 246, 0.4)',
                        borderRadius: '10px',
                        padding:      '8px 10px',
                        fontSize:     '11px',
                        color:        '#fff',
                        fontFamily:   'JetBrains Mono, monospace',
                        boxShadow:    '0 8px 25px rgba(0,0,0,0.8)',
                      }}
                    >
                      <div style={{ color, fontWeight: 800, marginBottom: 2 }}>
                        {node.influence_type}
                      </div>
                      <div style={{ color: '#8ea0b5' }}>
                        PR: {Number(node.pagerank_score || 0).toFixed(4)}
                      </div>
                      <div style={{ color: '#8ea0b5' }}>
                        Cluster: #{node.community_id}
                      </div>
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}

export default NetworkGraph
