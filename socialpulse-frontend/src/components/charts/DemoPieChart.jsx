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
    <div className="bg-[#0a1329]/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
          {title}
        </h3>
        <span className="text-[10px] font-mono text-[#4cd7f6] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 uppercase">
          PROFILING
        </span>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-14 text-[#8ea0b5] font-mono text-xs bg-black/20 rounded-xl border border-white/5 my-2">
          No demographic telemetry available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="46%"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              stroke="rgba(6, 14, 32, 0.9)"
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
                fontSize:        '11px',
                boxShadow:       '0 8px 25px rgba(0,0,0,0.8)',
              }}
              itemStyle={{ color: '#4cd7f6' }}
              formatter={(val) => [`${val}%`, 'Share']}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ color: '#8ea0b5', fontSize: 11, fontFamily: 'JetBrains Mono', paddingTop: '8px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default DemoPieChart
