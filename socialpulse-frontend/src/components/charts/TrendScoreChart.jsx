/*
  TrendScoreChart.jsx
  -------------------
  Horizontal bar chart ranking top trending topics with NEXORA cyberpunk neon gradients.
*/

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

// Color gradient by rank (NEXORA cyberpunk colors)
const getRankColor = (index) => {
  const colors = [
    '#4cd7f6', '#ddb7ff', '#ec4899',
    '#4edea3', '#06b6d4', '#f59e0b',
  ]
  return colors[index % colors.length]
}

function TrendScoreChart({ trends = [] }) {
  const data = trends.slice(0, 10).map((t) => ({
    topic: t.topic?.length > 20
      ? t.topic.slice(0, 20) + '…'
      : t.topic,
    score: Number(t.trend_score).toFixed(1),
    full_topic: t.topic,
  }))

  return (
    <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden group">
      <div className="glass-edge-top" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ec4899] shadow-[0_0_8px_#ec4899]" />
          🔥 Viral Cascade Trajectory Rank
        </h3>
        <span className="text-[11px] font-mono text-[#ec4899] px-2.5 py-1 rounded-xl liquid-glass-soft border border-pink-500/30 font-bold">
          R-SCORE INDEX
        </span>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-14 text-[#8ea0b5] font-mono text-xs bg-black/20 rounded-xl border border-white/5 my-2">
          No viral trend signals detected yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 115, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#8ea0b5', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(76, 215, 246, 0.2)' }}
            />
            <YAxis
              type="category"
              dataKey="topic"
              tick={{ fill: '#dae2fd', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              width={115}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#060e20',
                border:          '1px solid rgba(76, 215, 246, 0.3)',
                borderRadius:    '12px',
                color:           '#ffffff',
                fontFamily:      'JetBrains Mono',
                fontSize:        '11px',
                boxShadow:       '0 8px 25px rgba(0,0,0,0.8)',
              }}
              formatter={(val) => [`${val} pts`, 'Viral Score']}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.full_topic || ''
              }
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
              {data.map((_, index) => (
                <Cell key={index} fill={getRankColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default TrendScoreChart
