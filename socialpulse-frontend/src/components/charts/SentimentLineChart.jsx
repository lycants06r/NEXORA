/*
  SentimentLineChart.jsx
  ----------------------
  Shows how sentiment changes over time with NEXORA cyberpunk neon telemetry lines.
  Positive = emerald line, Negative = rose line, Polarity = neon cyan line.
*/

import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

// Custom tooltip popup shown when hovering chart (NEXORA glassmorphism)
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-[#060e20]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <p className="text-white font-mono text-xs font-semibold mb-2 tracking-wide border-b border-white/10 pb-1">
        TIME: {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs py-0.5 font-mono">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color, boxShadow: `0 0 6px ${entry.color}` }}
          />
          <span className="text-[#8ea0b5]">{entry.name}:</span>
          <span className="text-white font-bold ml-auto">
            {Number(entry.value).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}

function SentimentLineChart({ data = [] }) {
  const formatted = data.map((point) => ({
    ...point,
    time: point.bucket
      ? new Date(point.bucket).toLocaleTimeString([], {
          hour:   '2-digit',
          minute: '2-digit',
        })
      : '',
  }))

  return (
    <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6] animate-pulse" />
          📈 Sentiment Telemetry Over Time
        </h3>
        <span className="text-[11px] font-mono text-[#4cd7f6] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
          HOURLY SAMPLING
        </span>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-[#8ea0b5] font-mono text-sm">
          No timeline telemetry data available yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#8ea0b5', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(76, 215, 246, 0.2)' }}
            />
            <YAxis
              tick={{ fill: '#8ea0b5', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(76, 215, 246, 0.2)' }}
              domain={[-1, 1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: '#8ea0b5', fontSize: 12, fontFamily: 'JetBrains Mono', paddingTop: '8px' }}
            />

            {/* Average polarity line (-1 to +1) */}
            <Line
              type="monotone"
              dataKey="avg_polarity"
              name="Avg Polarity"
              stroke="#4cd7f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#4cd7f6', stroke: '#fff', strokeWidth: 2 }}
            />
            {/* Positive percentage */}
            <Line
              type="monotone"
              dataKey="positive_pct"
              name="Positive %"
              stroke="#4edea3"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            {/* Negative percentage */}
            <Line
              type="monotone"
              dataKey="negative_pct"
              name="Negative %"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default SentimentLineChart
