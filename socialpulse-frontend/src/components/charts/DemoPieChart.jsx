/*
  DemoPieChart.jsx
  ----------------
  Pie / donut chart for demographic breakdowns with NEXORA cyberpunk palette.
*/

import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

// Color palette for pie slices (NEXORA cyberpunk accents)
const COLORS = [
  '#4cd7f6', '#ddb7ff', '#4edea3', '#06b6d4',
  '#f59e0b', '#ec4899', '#f43f5e', '#38bdf8',
]

function DemoPieChart({ title, data = [] }) {
  return (
    <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
          {title}
        </h3>
        <span className="text-[11px] font-mono text-[#4cd7f6] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
          PROFILING
        </span>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-10 text-[#8ea0b5] font-mono text-sm">
          No demographic telemetry available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="rgba(6, 14, 32, 0.8)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#060e20',
                border:          '1px solid rgba(76, 215, 246, 0.3)',
                borderRadius:    '12px',
                color:           '#ffffff',
                fontFamily:      'JetBrains Mono',
                boxShadow:       '0 8px 25px rgba(0,0,0,0.8)',
              }}
              formatter={(val) => [`${val}%`, 'Share']}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ color: '#8ea0b5', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default DemoPieChart
