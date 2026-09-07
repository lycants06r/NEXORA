/*
  PolarityBarChart.jsx
  --------------------
  Horizontal bar chart showing positive / negative / neutral counts with NEXORA telemetry styling.
*/

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

function PolarityBarChart({ summary = {} }) {
  const data = [
    {
      label: 'Positive',
      count: summary.positive || 0,
      color: '#4edea3',
    },
    {
      label: 'Neutral',
      count: summary.neutral  || 0,
      color: '#f59e0b',
    },
    {
      label: 'Negative',
      count: summary.negative || 0,
      color: '#f43f5e',
    },
  ]

  return (
    <div className="liquid-glass rounded-2xl p-5 shadow-glass-card relative overflow-hidden group">
      <div className="glass-edge-top" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]" />
          📊 Polarity Volume Distribution
        </h3>
        <span className="text-[11px] font-mono text-[#8ea0b5]">
          3-TIER RADAR
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#8ea0b5', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'rgba(76, 215, 246, 0.2)' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: '#dae2fd', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600 }}
            axisLine={false}
            width={75}
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
            formatter={(val) => [`${val.toLocaleString()} signals`, 'Volume']}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PolarityBarChart
